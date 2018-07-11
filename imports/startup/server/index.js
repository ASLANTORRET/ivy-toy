import './accounts/email-templates';
import './browser-policy';
import './fixtures';
import './api';

import { Orders } from '/imports/api/orders';
import { Products } from '/imports/api/products';
import { Files } from '/imports/api/files';

// console.log(process.env.NODE_ENV);

// SSR.compileTemplate('htmlEmail', Assets.getText('emailtemplates/order.html'));
//
// const order = Orders.findOne();
//
// order.products.forEach(p => {
//   const product = Products.findOne({_id: p._id});
//   if (product) {
//     if (product.parentId) {
//       const parent = Products.findOne({_id:product.parentId});
//       if (parent && parent.fileIds) {
//         const fileCursor = Files.findOne({_id: parent.fileIds[0]});
//         if ( fileCursor && fileCursor.fetch()[0] ){
//           const file = fileCursor.fetch()[0];
//           p.link = Files.link(file);
//         }
//       }
//     } else if (product.fileIds){
//       const fileCursor = Files.findOne({_id: product.fileIds[0]});
//       if ( fileCursor && fileCursor.fetch()[0] ){
//         const file = fileCursor.fetch()[0];
//         p.link = Files.link(file);
//       }
//     }
//   }
// })
// console.log(order);
// Email.send({
//   to: 'na@alternate.kz',
//   from: 'mimimishki.kz@yandex.com',
//   // bcc: 'mimimishki.kz@yandex.com',
//   subject: "Example Email",
//   html: SSR.render('htmlEmail', order),
// });
