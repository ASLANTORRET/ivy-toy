import { Meteor } from 'meteor/meteor';
import { Categories } from '../';
import { check } from 'meteor/check';

Meteor.publish('categories', function() {
  // return Categories.find()
  Categories.find().fetch().forEach(category => this.added('categories', category._id, category))
  this.ready()
});
Meteor.publish('category', function (slug) {
  check(slug, String);
  // return Categories.find({ $or: [{_id: slug}, {slug: slug}] });
  Categories.find({ $or: [{_id: slug}, {slug: slug}] }).fetch().forEach(category => this.added('categories', category._id, category))
  this.ready()
});
