import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Files } from '/imports/api/files';

const transform = (product) => {
  if (product.fileIds && product.fileIds.length) {
    // console.log(Files.findOne(product.fileIds[0]));
    const file = Files.findOne(product.fileIds[0]);
    if (file) {
      product.fileUrl = file.link('thumbnail');
    }
  }
  return product;
}

export const Products = new Mongo.Collection('products', { transform });
// Ground.Collection(Products);
Products.friendlySlugs('name');
Products.attachBehaviour('softRemovable');
Products.attachBehaviour('timestampable');

Products.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Products.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Products.schema = new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  sku: {
    type: String,
  },
  stock: {
    type: Number
  },
  price: {
    type: Number
  },
  fileIds: {
    type: [String],
    optional: true
  },
  categoryIds: {
    type: [String],
    optional: true,
  }
});

Products.attachSchema(Products.schema);

if (Meteor.isServer) {
  Products._ensureIndex({
    "name": "text",
    "description": "text",
    "sku": "text",
    "brief": "text",
    "color": "text"
  });
}
