import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Settings = new Mongo.Collection('settings');

Settings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Settings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Settings.schema = new SimpleSchema({
  _id: {
    type: String,
  },
  value: {
    type: String,
  }
});

Settings.attachSchema(Settings.schema);
