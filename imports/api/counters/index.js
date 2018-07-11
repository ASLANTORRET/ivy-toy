import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Counters = new Mongo.Collection('counters');

Counters.attachBehaviour('softRemovable');
Counters.attachBehaviour('timestampable');

Counters.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Counters.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Counters.schema = new SimpleSchema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
  },
});
Counters.attachSchema(Counters.schema);

export const getNextSequence = (name) => {
  const ret = Counters.findAndModify({
    query: { _id: name },
    update: { $inc: { 'seq': 1 } },
    new: true
  });
  console.log(ret);
  return ret.seq;
}
