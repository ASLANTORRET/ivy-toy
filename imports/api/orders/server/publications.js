import { Meteor } from 'meteor/meteor';
import { Orders } from '../';
import { check } from 'meteor/check';

Meteor.publish('orders', function () {
  const userId = this.userId;
  return Orders.find({userId});
});
Meteor.publish('order', function (_id) {
  check(_id, String);
  const userId = this.userId;
  if (userId) {
    return Orders.find({ _id, userId });
  } else {
    return Orders.find({ _id });
  }
});
