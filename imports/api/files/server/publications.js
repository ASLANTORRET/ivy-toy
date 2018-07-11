import { Meteor } from 'meteor/meteor';
import { Files } from '../';
import { check } from 'meteor/check';

Files.denyClient();
Meteor.publish('file', function (ids) {
  check(ids, [String]);
  return Files.collection.find({_id: { $in: ids }});
});
// Meteor.publish('files', function (...args) {
//   console.log(args);
//   return Files.collection.find({});
// });

// Meteor.publish('files', function () {
//   return Files.find().cursor;
// });
