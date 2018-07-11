import { Meteor } from 'meteor/meteor';
import { Products } from '../';
import { check } from 'meteor/check';
import { Files } from '/imports/api/files';

// const productIds = () => {
//   const ids = [];
//   const products = Products.find({ stock: {$gt: 0} });
//   products.forEach(product => {
//     ids.push(product._id);
//     if (product.parentId){
//       ids.push(product.parentId);
//     }
//   });
//   return ids;
// }

const files = (products) => {
  const fileIds = [];
  products.forEach(product => {
    if (product.fileIds && product.fileIds.length) {
      fileIds.push(product.fileIds[0]);
    }
  })
  return Files.collection.find({_id: { $in: fileIds }});
}

Meteor.publish('categoryProducts', function (categoryIds, limit, skip, sort) {
  check(categoryIds, String);
  check(limit, Number);
  check(skip, Number);
  check(sort, Object);
  // const query = {_id: { $in: productIds() }, categoryIds };
  const query = { categoryIds, stock: { $gt: 0 } };
  Counts.publish(this, 'categoryProductsCount', Products.find({categoryIds}));
  // return Products.find(query, {sort, limit, skip });
  // return Products.find(query, {sort, limit, skip});

  Products.find(query, {sort, limit, skip}).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()

  // const products = Products.find(query, {sort });
  // return [ products, files(products) ];
});

Meteor.publish('latestProducts', function () {
  // const query = { _id: { $in: productIds() }, parentId: { $exists: false } };
  let weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const query = { createdAt: {$gt: weekAgo}, parentId: { $exists: false }, stock: { $gt: 0 }  };
  // return Products.find(query, {sort: { createdAt: -1 } });
  Products.find(query, {sort: { createdAt: -1 } }).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
  // const products = Products.find(query, {sort: { createdAt: -1 }, limit: 20 });
  // return [ products, files(products) ];
});

Meteor.publish('discountProducts', function () {
  // const query = { _id: { $in: productIds() }, parentId: { $exists: false } };
  const query = { parentId: { $exists: false }, stock: { $gt: 0 }, oldPrice: { $exists: true } };
  // return Products.find(query, {sort: { name: 1 } });
  Products.find(query, {sort: { name: 1 } }).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
  // const products = Products.find(query, {sort: { createdAt: -1 }, limit: 20 });
  // return [ products, files(products) ];
});

Meteor.publish('productChildren', function (parentId) {
  check(parentId, String);
  // const query = {_id: { $in: productIds() }, parentId}
  const query = { parentId }
  // return Products.find(query);
  Products.find(query).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
});

Meteor.publish('cartProducts', function (ids) {
  check(ids, [String]);
  const productCursor = Products.find({ _id: { $in: ids }, removed: { $exists: false } });
  const parentIds = [];
  productCursor.fetch().forEach(product => {
    if (product.parentId) {
      parentIds.push(product.parentId);
    }
  });
  // const query = { $and: [{ _id: { $in: ids.concat(parentIds) } }, { _id: { $in: productIds() } }] }
  const query = { _id: { $in: ids.concat(parentIds) }, stock: { $gt:0 }, removed: { $exists: false } }
  Counts.publish(this, 'cartProductsCount', Products.find(query));

  // return Products.find(query);
  Products.find(query).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
  // const products =  Products.find(query);
  // return [ products, files(products) ];
});

Meteor.publish('product', function (slug) {
  check(slug, String);
  // const query = { _id: { $in: productIds() }, $or: [{ _id: slug }, { slug: slug }] };
  // const query = { $and: [{ _id: { $in: productIds() } }, { $or: [{ _id: slug }, { slug: slug }] }]  };
  const query = { $or: [{ _id: slug }, { slug: slug }], stock: { $gt: 0 }  };
  // const query = { $or: [{ _id: slug }, { slug: slug }] };
  // console.log(Products.find( query ).fetch())
  // return Products.find( query );
  Products.find( query ).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
  // const products = Products.find( query );
  // return [ products, files(products) ];
});

Meteor.publish('products', function (ids) {
  check(ids, [String]);
  // Counts.publish(this, 'categoryProductsCount', Products.find({categoryIds}));
  // const query = { $and: [{ _id: { $in: ids} }, { _id: { $in: productIds() } }] };
  const query = { _id: { $in: ids}, stock: { $gt: 0 }  };
  // return Products.find( query );
  Products.find( query ).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()
  // const products = Products.find( query );
  // return [ products, files(products) ];
});

Meteor.publish('productsSearch', function (search, limit, skip, sort) {
  check(search, String);
  check(limit, Number);
  check(skip, Number);
  check(sort, Object);
  // const query = { _id: { $in: productIds() }, $text: { $search: search } }
  const query = { $text: { $search: search }, stock: { $gt: 0 }  }
  Counts.publish(this, 'searchProductCount', Products.find( query ));

  // return Products.find(query,
  // // const products = Products.find(query,
  //   {
  //     // limit,
  //     skip,
  //     fields: {
  //       score: { $meta: "textScore" }
  //     },
  //     sort,
  //     // sort: {
  //     //   score: { $meta: "textScore" }
  //     // }
  //   }
  // );
  Products.find(query,
  // const products = Products.find(query,
    {
      // limit,
      skip,
      fields: {
        score: { $meta: "textScore" }
      },
      sort,
      // sort: {
      //   score: { $meta: "textScore" }
      // }
    }
  ).fetch().forEach(product => this.added('products', product._id, product))
  this.ready()

  // return [ products, files(products) ];
});
