import { Meteor } from 'meteor/meteor';
import { Orders } from './';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Products } from '/imports/api/products';
import { UserAddresses } from '/imports/api/useraddresses';
import { Files } from '/imports/api/files';

import _ from 'lodash';

export const insertOrder = new ValidatedMethod({
  name: 'orders.insert',
  validate: Orders.simpleSchema().validator(),
  run(order) {
    const productIds = order.cart.map(item => item.productId);
    order.products = [];
    if (! order.cart || !order.cart.length) {
      throw new Meteor.Error(500, 'Корзина пуста!', 'Корзина пуста!');
    }
    if (Meteor.isServer) {

      if (Meteor.userId()) {
        order.userId = Meteor.userId();
        const user = Meteor.user();
        order.name = user.profile.name.first + ' ' + user.profile.name.last ;
        order.email = user.emails[0].address;
        order.phone = user.profile.phone;
      }

      order.subTotal = 0;
      order.cart.forEach(item => {
        const product = Products.findOne({ _id: item.productId }, {price: true, name: true, size: true});
        if (product) {
          if (product.parentId) {
            const parent = Products.findOne({ _id: product.parentId }, {price: true, name: true});
            product.price = parent.price;
            product.name = `${parent.name} ${parent.color || ''} (${product.size})`;
          } else {
            product.name = `${product.name} ${product.color}`;
          }
          if (product && product.price && product.stock) {
            product.quantity = item.quantity || 1;
            product.sum = item.quantity * product.price;
            order.products.push(product);
            order.subTotal += product.sum;
            // if(process.env.NODE_ENV!=='development') {
            //   Products.update({ _id: product._id }, {$inc: {stock: - product.quantity}});
            //   product.parentId ? Products.update({ _id: product.parentId }, {$inc: {stock: - product.quantity}}) : null;
            // }
          }
        }
      });


      if (order.addressId) {
        const address = UserAddresses.findOne({_id:order.addressId, userId: order.userId});
        order.zone = address.zone;
        order.address = address.address
      }

      if (order.exline && order.exline.service ) {
        if (order.subTotal >= 20000
          && order.exline.service.name && order.exline.service.name === 'standard'
        ) {
          order.shipping = 0;
        } else {
          order.shipping = order.exline.service.price + order.exline.service.fuel_surplus;
        }
      } else if (order.yandex) {
        if (order.subTotal >= 15000 && order.yandex.zone.shipping <= 500) {
          order.shipping = 0;
        } else {
          order.shipping = order.yandex.zone.shipping
        }
      } else if (order.delivery === 'pickup') {
        delete order.address;
      }

      order.total = order.subTotal + (order.shipping || 0)
      if (order.packaging && order.packaging.enabled && order.packaging.price) {
        order.total += order.packaging.price
      }

      const result = Orders.insert(order);

      SSR.compileTemplate('htmlEmail', Assets.getText('emailtemplates/order.html'));

      order.products.forEach(p => {
        const product = Products.findOne({_id: p._id});
        if (product) {
          if (product.parentId) {
            const parent = Products.findOne({_id:product.parentId});
            if (parent && parent.fileIds) {
              const fileCursor = Files.findOne({_id: parent.fileIds[0]});
              if ( fileCursor && fileCursor.fetch()[0] ){
                const file = fileCursor.fetch()[0];
                p.link = Files.link(file);
              }
            }
          } else if (product.fileIds){
            const fileCursor = Files.findOne({_id: product.fileIds[0]});
            if ( fileCursor && fileCursor.fetch()[0] ){
              const file = fileCursor.fetch()[0];
              p.link = Files.link(file);
            }
          }

          Products.update({ _id: product._id }, {$inc: {stock: - p.quantity}});
          product.parentId ? Products.update({ _id: product.parentId }, {$inc: {stock: - p.quantity}}) : null;

        }
      });
      const newOrder = Orders.findOne(result);
      order.id = newOrder.id;
      order.createdAt = newOrder.createdAt;
      const packaging = order.packaging
      if (packaging) {
        order.packaging = packaging.enabled
        order.packagingPrice = packaging.price
        order.packagingQuantity = packaging.quantity
      }
      Meteor.defer(function() {
        Email.send({
          to: 'mimimishki.kz@yandex.com',
          from: 'mimimishki.kz@yandex.com',
          subject: `[Mimimishki.kz] Новый заказ ${ order.id }`,
          html: SSR.render('htmlEmail', order),
        });
        Email.send({
          to: order.email,
          from: 'mimimishki.kz@yandex.com',
          subject: `[Mimimishki.kz] Ваш заказ ${ order.id }`,
          html: SSR.render('htmlEmail', order),
        });
      });
      return result
    }
  },
});

export const updateOrder = new ValidatedMethod({
  name: 'orders.update',
  validate: new SimpleSchema({
    _id: { type: String},
    modifier : { type: Object, blackbox: true },
  }).validator(),
  run({ _id, modifier }) {
    Orders.simpleSchema().clean(modifier, {isModifier:true} );
    Orders.simpleSchema().validate(modifier, {modifier:true} );
    Orders.update(_id, modifier);
  },
});

export const removeOrder = new ValidatedMethod({
  name: 'orders.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Orders.softRemove(_id);
  },
});
