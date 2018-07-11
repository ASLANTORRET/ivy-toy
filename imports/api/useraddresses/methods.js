import { Meteor } from 'meteor/meteor';
import { UserAddresses } from './';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';

export const insertUserAddress = new ValidatedMethod({
  name: 'useraddress.insert',
  validate: UserAddresses.simpleSchema().validator(),
  run(address) {
    address.userId = Meteor.userId();
    return UserAddresses.insert(address);
  },
});

// export const updateUserAddress = new ValidatedMethod({
//   name: 'useraddress.update',
//   validate: new SimpleSchema({
//     _id: { type: String},
//     modifier : { type: Object, blackbox: true },
//   }).validator(),
//   run({ _id, modifier }) {
//     UserAddresses.simpleSchema().clean(modifier, {isModifier:true} );
//     UserAddresses.simpleSchema().validate(modifier, {modifier:true} );
//
//     //delete userid from modifier here
//
//     UserAddresses.update({_id, userId: Meteor.userId()}, modifier);
//   },
// });

export const removeUserAddress = new ValidatedMethod({
  name: 'useraddress.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    UserAddresses.softRemove({_id, userId: Meteor.userId()});
  },
});
