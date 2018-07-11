import { Products } from './';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertProduct = new ValidatedMethod({
  name: 'products.insert',
  validate: Products.simpleSchema().validator(),
  run(product) {
    return Products.insert(product);
  },
});

export const updateProduct = new ValidatedMethod({
  name: 'products.update',
  validate: new SimpleSchema({
    _id: { type: String},
    modifier : { type: Object, blackbox: true },
  }).validator(),
  run({ _id, modifier }) {
    Products.simpleSchema().clean(modifier, {isModifier:true} );
    Products.simpleSchema().validate(modifier, {modifier:true} );
    Products.update(_id, modifier);
  },
});

export const removeProduct = new ValidatedMethod({
  name: 'products.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Products.softRemove(_id);
  },
});
