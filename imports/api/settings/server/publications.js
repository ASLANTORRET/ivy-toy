import { Meteor } from 'meteor/meteor';
import { Settings } from '../';
import { check } from 'meteor/check';

Meteor.publish('settings', () => {
  return Settings.find({ isShown: true });
});
Meteor.publish('setting', (_id) => {
  check(_id, String);
  return Settings.find({ _id });
});
