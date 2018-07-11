import { Meteor } from 'meteor/meteor';
import { UserAddresses } from '../';
import { check } from 'meteor/check';

Meteor.publish('userAddresses', function() {
  return UserAddresses.find({userId: this.userId});
});
Meteor.publish('userAddress', function(_id) {
  check(_id, String);
  return UserAddresses.find({ _id, userId: this.userId });
});
