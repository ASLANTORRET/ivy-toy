import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Slides = new Mongo.Collection('slides');

Slides.friendlySlugs('name');
Slides.attachBehaviour('softRemovable');
Slides.attachBehaviour('timestampable');

Slides.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Slides.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Slides.schema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  link: {
    type: String,
    optional: true,
  },
  content: {
    type: String,
    optional: true,
  },
  fileId: {
    type: String,
    optional: true,
  },
  position: {
    type: Number,
    optional: true,
  }
});

Slides.attachSchema(Slides.schema);
