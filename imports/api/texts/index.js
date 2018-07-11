import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Texts = new Mongo.Collection('texts');

Texts.friendlySlugs('name');
Texts.attachBehaviour('softRemovable');
Texts.attachBehaviour('timestampable');

Texts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Texts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Texts.schema = new SimpleSchema({
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  }
});

Texts.attachSchema(Texts.schema);
