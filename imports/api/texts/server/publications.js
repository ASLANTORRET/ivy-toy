import { Meteor } from 'meteor/meteor';
import { Texts } from '../';
import { check } from 'meteor/check';

Meteor.publish('texts', () => Texts.find());
Meteor.publish('text', (slug) => {
  check(slug, String);
  return Texts.find({ $or: [{ _id: slug }, { slug }] });
});
