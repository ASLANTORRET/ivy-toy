import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Counters, getNextSequence } from '/imports/api/counters';

export const Orders = new Mongo.Collection('orders');

Orders.attachBehaviour('softRemovable');
Orders.attachBehaviour('timestampable');

Orders.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Orders.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Orders.schema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  phone: {
    type: String,
    optional: true
  },
  delivery: {
    type: String,
    optional: true
  },
  yandex: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  exline: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  address: {
    type: String,
    optional: true
  },
  addressId: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  subTotal: {
    type: Number,
    optional: true
  },
  shipping: {
    type: Number,
    optional: true
  },
  total: {
    type: Number,
    optional: true
  },
  cart: {
    type: Array
  },
  'cart.$': {
    type: Object
  },
  'cart.$.productId': {
    type: String,
  },
  'cart.$.quantity': {
    type: Number,
  },
  products: {
    type: Array,
    optional: true
  },
  'products.$': {
    type: Object
  },
  'products.$._id': {
    type: String,
  },
  'products.$.name': {
    type: String,
  },
  'products.$.fileUrl': {
    type: String,
    optional: true,
  },
  'products.$.parentId': {
    type: String,
    optional: true,
  },
  'products.$.quantity': {
    type: Number,
    optional: true,
  },
  'products.$.price': {
    type: Number,
    optional: true
  },
  'products.$.sum': {
    type: Number,
    optional: true
  },
  packaging: {
    type: Object,
    blackbox: true
  },
  status: {
    type: String,
    optional: true,
  }
});

Orders.attachSchema(Orders.schema);

Orders.before.insert(function (userId, doc) {
  if (Meteor.isServer) {
    doc.id = getNextSequence('orderId');
  }
});
