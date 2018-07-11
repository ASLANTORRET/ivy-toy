import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
export const UserAddresses = new Mongo.Collection('useraddresses');

UserAddresses.attachBehaviour('softRemovable');
UserAddresses.attachBehaviour('timestampable');

UserAddresses.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

UserAddresses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

UserAddresses.schema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  address: {
    type: String,
  },
  zone: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  zoneId: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  geocode: {
    type: String,
    optional: true,
  },
  geocoder: {
    type: String,
    optional: true,
  },
  coords: {
    type: [ Number ],
    optional: true,
    decimal: true,
  },
  region: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  type: {
    type: String,
    optional: true,
  }

});

UserAddresses.attachSchema(UserAddresses.schema);
