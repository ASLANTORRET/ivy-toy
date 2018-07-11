import { Counters } from '/imports/api/counters';
if(! Counters.findOne({_id:'orderId' })) {
  Counters.insert({
    _id: 'orderId',
    seq: 0
  });
}
