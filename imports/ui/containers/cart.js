import { compose } from 'react-komposer'
import getTrackerLoader from '/imports/modules/getTrackerLoader'
import { Meteor } from 'meteor/meteor'
import { Loading } from '/imports/ui/components/loading'
import { Cart } from '/imports/ui/components/cart'
import { To } from '/imports/ui/components/cart/tocart'
import { Products } from '/imports/api/products'
import { getCart, addToCart, removeFromCart } from '/imports/modules/cart'

const perPackage = 300

const packaging = {
  enabled: false,
  price: 0,
  quantity: 1
}
Session.set('packaging', packaging)

const setPackage = (enabled, quantity) => {
  const packaging = Session.get('packaging')
  packaging.enabled = enabled
  packaging.quantity = quantity
  packaging.price = packaging.enabled ? perPackage * quantity : 0
  Session.set('packaging', packaging)

}

const reactiveMapper = (props, onData) => {
  const subscriptions = {}
  const packaging = Session.get('packaging')
  let cart = getCart()
  let subTotal = 0
  subscriptions.Products = Meteor.subscribe('cartProducts', cart.map(item => item.productId))
  if(subscriptions.Products.ready()) {
    cart.forEach(item => {
      item.product = Products.findOne( {_id: item.productId })
      if( item.product && item.product.stock ) {
        item.quantity = Math.min(item.quantity,item.product.stock)
        if ( item.product.parentId ) {
          item.parent = Products.findOne( {_id: item.product.parentId } )
          // console.log(item.parent)
          item.product.name = `${ item.parent.name } ${ item.parent.color || '' } (${ item.product.size })`
          item.product.price = item.parent.price
        } else {
          item.product.name += ` ${ item.product.color || '' }`
        }
        subTotal += item.quantity * item.product.price
      }
    })
    cart = cart.filter((item) => (item.product))
    onData(null, {addToCart, cart, removeFromCart, subTotal, setPackage, packaging})
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Cart)
export const ToCart = compose(getTrackerLoader(reactiveMapper))(To)
