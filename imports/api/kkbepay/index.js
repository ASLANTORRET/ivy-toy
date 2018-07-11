import { Mongo } from 'meteor/mongo';

export const KkbEpay = new Mongo.Collection('kkb.epay');

KkbEpay.attachBehaviour('softRemovable');
KkbEpay.attachBehaviour('timestampable');

KkbEpay.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

KkbEpay.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});


KkbEpay.schema = new SimpleSchema({
  response: {
    type: String,
  },
});

KkbEpay.attachSchema(KkbEpay.schema);
