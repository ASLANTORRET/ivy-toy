import { compose } from 'react-komposer'
import getTrackerLoader from '/imports/modules/getTrackerLoader'
import { Meteor } from 'meteor/meteor'
import { Loading } from '/imports/ui/components/loading'
import { OrderAuth } from '/imports/ui/components/orders/auth'
import { Products } from '/imports/api/products'
import { insertOrder, getZones } from '/imports/api/orders/methods'
import { getCart, resetCart } from '/imports/modules/cart'

import { browserHistory } from 'react-router'
import { UserAddresses } from '/imports/api/useraddresses'

// Session.set('delivery', null)
// Session.set('zone', null)
// Session.set('name', '')
// Session.set('address', '')
// Session.set('phone', '')

// const setDelivery = ( type ) => {
//   if (['pickup', 'delivery'].indexOf(type) !== -1) {
//     Session.set('delivery', type)
//     Session.set('zone', null)
//   }
// }
const onSubmit = (order) => {
  order.cart = getCart()
  // const order = { cart, delivery, addressId }

  order.packaging = Session.get('packaging')
  insertOrder.call(order, (error, result) => {
    if (error) {
      console.log(error)
      Materialize.toast(error.reason, 4000)
    } else {
      Materialize.toast('Ваш заказ отправлен на обработку!', 4000)
      resetCart()
      Session.set('afterAddress',false)
      browserHistory.push('/order/' + result)
    }
  })
}
// const onSubmit = (event) => {
//   event.preventDefault()
//
//   const [ delivery, addressId ] = [
//     event.target.delivery.value,
//     event.target.addressId ? event.target.addressId.value : null,
//   ]
//   const cart = getCart()
//   const order = { cart, delivery, addressId }
//
//   insertOrder.call(order, (error, result) => {
//     if (error) {
//       console.log(error)
//       Materialize.toast(error.reason, 4000)
//     } else {
//       Materialize.toast('Ваш заказ отправлен на обработку!', 4000)
//       resetCart()
//       Session.set('afterAddress',false)
//       browserHistory.push('/order/' + result)
//     }
//   })
// }

const reactiveMapper = (props, onData) => {
  let cart = getCart()

  const subscriptions = {}
  subscriptions.Products = Meteor.subscribe('cartProducts', cart.map(item => item.productId))
  subscriptions.Addresses = Meteor.subscribe('userAddresses')
  if (subscriptions.Addresses.ready()
    && subscriptions.Products.ready()
  ) {
    const addresses = UserAddresses.find({}, { sort: { name:1 } }).fetch()
    Session.set('afterAddress','/order')
    if (!addresses.length) {
      browserHistory.push('/profile/address')
    }

    const delivery = Session.get('delivery')
    const user = Meteor.user()
    let subTotal = 0
    cart.forEach(item => {
      item.product = Products.findOne( {_id: item.productId })
      if( item.product ) {
        if ( item.product.parentId ) {
          item.parent = Products.findOne( {_id: item.product.parentId } )
          item.product.name = `${ item.parent.name } ${ item.parent.color || '' } (${ item.product.size })`
          item.product.price = item.parent.price
        } else {
          item.product.name += ` ${ item.product.color || '' }`
        }
        subTotal += item.quantity * item.product.price
      }
    })
    cart = cart.filter((item) => (item.product))
    const packaging = Session.get('packaging')
    onData(null, { onSubmit, addresses, cart, subTotal, packaging })
  }
}

export default compose(getTrackerLoader(reactiveMapper))(OrderAuth)
