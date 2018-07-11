import { compose } from 'react-komposer'
import getTrackerLoader from '/imports/modules/getTrackerLoader'
import { Meteor } from 'meteor/meteor'
import { Loading } from '/imports/ui/components/loading'
import { OrderUnauth } from '/imports/ui/components/orders/unauth'
import { Products } from '/imports/api/products'
import { insertOrder, getZones } from '/imports/api/orders/methods'
import { getCart, resetCart } from '/imports/modules/cart'
import { Zones } from '/imports/api/zones'
import { browserHistory } from 'react-router'


const onSubmit = (order) => {
  order.cart = getCart()
  order.packaging = Session.get('packaging')
  insertOrder.call(order, (error, result) => {
    if (error) {
      console.log(error)
      Materialize.toast(error.reason, 4000)
    } else {
      Materialize.toast('Заказ успешно отправлен!', 4000)
      resetCart()
      browserHistory.push('/order/' + result)
    }
  })
}

const reactiveMapper = (props, onData) => {
  let cart = getCart()

  const subscriptions = {}
  // const delivery = Session.get('delivery')
  // const zone = Session.get('zone')
  // const name = Session.get('name')
  // const address = Session.get('address')
  // const phone = Session.get('phone')
  // const order = { delivery, zone, name, address, phone }
  subscriptions.Products = Meteor.subscribe('cartProducts', cart.map(item => item.productId))
  subscriptions.Zones = Meteor.subscribe('zones')
  if (subscriptions.Zones.ready()
    && subscriptions.Products.ready()
  ) {
    const zones = Zones.find({}, { $sort: { name:1 } }).fetch()
    zones.forEach(zone => {
      zone.coords = JSON.parse(zone.coordinates).map(coords => {
        return coords.map(coord => coord.reverse())
      })
    })
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

    onData(null, { onSubmit, zones, cart, packaging, subTotal })
  }

}

export default compose(getTrackerLoader(reactiveMapper))(OrderUnauth)
