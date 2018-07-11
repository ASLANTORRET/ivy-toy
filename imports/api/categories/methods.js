import { Categories } from './';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';

export const insertCategory = new ValidatedMethod({
  name: 'categories.insert',
  validate: Categories.simpleSchema().validator(),
  run(category) {
    Categories.insert(category);
  },
});

export const updateCategory = new ValidatedMethod({
  name: 'categories.update',
  validate: new SimpleSchema({
    _id: { type: String },
    modifier: { type: Object, blackbox: true },
  }).validator(),
  run({ _id, modifier }) {
    Categories.simpleSchema().clean(modifier, {isModifier:true} );
    Categories.simpleSchema().validate(modifier, {modifier:true} );
    Categories.update(_id, modifier);
  },
});

export const setParent = new ValidatedMethod({
  name: 'categories.parent',
  validate: new SimpleSchema({
    _id: { type: String },
    'parentId': { type: String },
    'position': { type: Number },
    'isNeighbour': { type: Boolean },
  }).validator(),
  run({ _id, parentId, position, isNeighbour }) {
    let parent = Categories.findOne({_id: parentId});
    if (isNeighbour) {
      parent = Categories.findOne({_id: parent.parentId});
    }
    position = position < 0 ? 0 : position;

    let categories;

    if (parent) {
      categories = Categories.find({
        parentId: parent._id
      }, {
        $sort: { position: 1 }
      }).fetch();
      Categories.update(_id, { $set: {parentId: parent._id, position } });
    } else {
      categories = Categories.find({
        parentId: { $exists: false }
      }, {
        $sort: { position: 1 }
      }).fetch();
      Categories.update(_id, { $unset: {parentId: 1}, $set: { position } });
    }

    let index = 0;
    categories = _.sortBy(categories, 'position');
    categories.map((category) => {
      if (category._id !== _id ){
        if (index === position) {
          index++;
        }
        Categories.update({
          _id: category._id
        }, {
          $set: {position: index}
        });
        index++;
      }
    });
  },
});

export const removeCategory = new ValidatedMethod({
  name: 'categories.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Categories.softRemove(_id);
  },
});
