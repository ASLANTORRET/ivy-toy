import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Categories = new Meteor.Collection('categories');

Categories.friendlySlugs('name');
Categories.attachBehaviour('softRemovable');
Categories.attachBehaviour('timestampable');

Categories.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Categories.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const schema = {
  name: {
    type: String,
    label: 'The name of the category.',
  },
  brief: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    label: 'description',
    optional: true,
    // autoform: {
    //   type: 'trumbowyg'
    // },
  },
  parentId: {
    type: String,
    label: "parent",
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  position: {
    type: Number,
    optional: true,
    min: 0,
  }
};

Categories.schema = new SimpleSchema(schema);

Categories.attachSchema(schema);
