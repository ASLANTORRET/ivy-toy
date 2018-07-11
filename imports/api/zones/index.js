import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Zones = new Mongo.Collection('zones');

Zones.friendlySlugs('name');
Zones.attachBehaviour('softRemovable');
Zones.attachBehaviour('timestampable');

Zones.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Zones.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Zones.schema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  position: {
    type: Number,
    optional: true,
  },
  coordinates: {
    type: String,
    optional: true,
  },
  shipping: {
    type: Number,
    optional: true,
  }
});

Zones.attachSchema(Zones.schema);
