import { Meteor } from 'meteor/meteor';
import { Slides } from '../';
import { check } from 'meteor/check';

Meteor.publish('slides', () => {
  return Slides.find({ isShown: true });
});
Meteor.publish('slide', (slug) => {
  check(slug, String);
  return Slides.find({ $or: [{ _id: slug }, { slug: slug }] });
});
