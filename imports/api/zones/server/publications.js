import { Meteor } from 'meteor/meteor';
import { Zones } from '../';
import { check } from 'meteor/check';

Meteor.publish('zones', () => Zones.find());
Meteor.publish('zone', (slug) => {
  check(slug, String);
  return Zones.find({ $or: [{_id: slug}, {slug: slug}] });
});
