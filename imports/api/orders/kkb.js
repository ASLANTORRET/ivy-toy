// import 'babel-polyfill'
// global.regeneratorRuntime = require('babel-runtime/regenerator')
// var kkbEpay = require('kkb-epay')

import Crypto from 'crypto'
import fs from 'fs'
import xml2js from 'xml2js'
import Buffer  from 'buffer'
import { Orders } from './'
import Fiber from 'fibers'
// import { Buffer } from 'buffer'
var bodyParser = require('body-parser')
// Функции для работы с цифровой подписью

import { KkbEpay } from '/imports/api/kkbepay';

const configObj = JSON.parse(Assets.getText('kkb/config.json'))
const {
  MERCHANT_CERTIFICATE_ID,
  MERCHANT_ID,
  MERCHANT_NAME,
  PRIVATE_KEY_PASS,
  PRIVATE_KEY_FN,
  PUBLIC_KEY_FN,
  INVERT_SIGN,
} = configObj
const config = {
  cert_id: MERCHANT_CERTIFICATE_ID,
  merchant_id: MERCHANT_ID,
  merchant_name: MERCHANT_NAME,
  privateKeyPass: PRIVATE_KEY_PASS,
  privateKeyFile: Assets.absoluteFilePath(PRIVATE_KEY_FN),
  publicKeyFile: Assets.absoluteFilePath(PUBLIC_KEY_FN),
  invertSign: INVERT_SIGN,
}

function sign(data, privateKeyFile, privateKeyPass, cb) {
    fs.readFile(privateKeyFile, (err, pkData) => {
        if(err) return cb(err, "Error reading private key file");
        var pk = {
            key: pkData.toString('ascii'),
            passphrase: privateKeyPass
        };

        var sign = Crypto.createSign('RSA-SHA1');
        sign.update(data);

        // После подписания требуется инвертировать строку

        var revsign = sign.sign(pk);
        revsign.reverse();

        // Затем кодируем в base64

        var revstr = revsign.toString('base64');

        try {
            return cb(false, revstr);
        } catch (e) {
            return cb(true, e.message);
        }
    })
}

function verify(data, sign, publicKeyFile, cb) {
    fs.readFile(publicKeyFile, (err, pubData) => {
        if(err) return cb(err, "Error reading public key file");
        var pub = pubData.toString('ascii');
        var verify = Crypto.createVerify('RSA-SHA1');
        verify.update(data);

        const signBuffer = Buffer.Buffer.from(sign, 'base64')

        // if (invertSign) {
          signBuffer.reverse()
        // }
        // console.log(signBuffer.toString('ascii'))
        const result = verify.verify(pub, signBuffer)
        return cb(false, result);
    });
}

// Функции для работы с xml

function merchantObj(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency) {
  while (order_id.length < 6) {
    order_id = '0' + order_id
  }
    return {
        '$': {
            cert_id: cert_id,
            name: merchant_name
        },
        order: [{
            '$': {
                order_id: order_id,
                amount: order_amount,
                currency: order_currency || 398
            },
            department: [{
                '$': {
                    merchant_id: merchant_id,
                    amount: order_amount
                }
            }]
        }]
    };
}

function merchantXml(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency) {
    var merObj = merchantObj(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency);
    var builder = new xml2js.Builder({rootName: 'merchant', headless: true, renderOpts: {'pretty': false}});
    return builder.buildObject(merObj);
}

function documentObj(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency, signBase64) {
    return {
        merchant: merchantObj(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency),
        merchant_sign: {
            '$': {
                type: 'RSA'
            },
            '_': signBase64
        }
    };
}

function documentXml(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency, signBase64) {
    var docObj = documentObj(cert_id, merchant_id, merchant_name, order_id, order_amount, order_currency, signBase64);
    var builder = new xml2js.Builder({rootName: 'document', headless: true, renderOpts: {'pretty': false}});
    return builder.buildObject(docObj);
}

function getSignedOrderXml(config, order_id, order_amount, order_currency, cb) {
    try {
        var merXml = merchantXml(config.cert_id, config.merchant_id, config.merchant_name, order_id, order_amount, order_currency);
        sign(merXml, config.privateKeyFile, config.privateKeyPass, (err, data) => {
            if(err) return cb(err, data);
            return cb(false, documentXml(config.cert_id, config.merchant_id, config.merchant_name, order_id, order_amount, order_currency, data));
        });
    } catch (e) {
        return cb(true, e.message);
    }
}

function getSignedOrderBase64(config, order_id, order_amount, order_currency, cb) {
    getSignedOrderXml(config, order_id, order_amount, order_currency, (err, data) => {
        if(err) return cb(err, data);
        return cb(false, data);
        // console.log(data)
        // var buf = new Buffer(data);
        // return cb(false, buf.toString('base64'));
    });
}

// Создание xml товара


function itemXml(item_number, item_name, item_quantity, item_amount) {
    var itObj = itemObj(item_number, item_name, item_quantity, item_amount);
    var builder = new xml2js.Builder({rootName: 'document', headless: true, renderOpts: {'pretty': false}});
    return builder.buildObject(itObj);
}

function itemObj(item_number, item_name, item_quantity, item_amount) {
    return {
        item: [{
            '$': {
                number: item_number,
                name: item_name,
                quantity: item_quantity,
                amount: item_amount
            }
        }]
    }
}

function itemObjBase64(item_number, item_name, item_quantity, item_amount) {
    var itex = itemXml(item_number, item_name, item_quantity, item_amount);
    var itexbase = new Buffer(itex);
    var itexstring = itexbase.toString('base64');
    return itexstring;
}


function splitBankAnswer(xmlString, cb) {
    var parser = new xml2js.Parser();
    parser.parseString(xmlString, (err, data) => {
        if(err) return cb(err, data);
        var builder = new xml2js.Builder({rootName: 'bank', headless: true, renderOpts: {'pretty': false}});
        var xmlBank = builder.buildObject(data['document']['bank'][0]);
        var res = {
            xml: xmlBank,
            sign: data['document']['bank_sign'][0]['_']
        }
        return cb(false, res);
    });
}

function parseBankAnswer(config, xmlString, cb) {
    splitBankAnswer(xmlString, (err, data) => {
        if(err) return cb(err, data);
        verify(data.xml, data.sign, config.publicKeyFile, (err, result) => {
            if(err) return cb(err, result);
            var parser = new xml2js.Parser();
            parser.parseString(data.xml, (err, answer) => {
                if(err) return cb(err, answer);
                var res = {
                    customer: {
                        name: answer.bank.customer[0]['$'].name,
                        mail: answer.bank.customer[0]['$'].mail,
                        phone: answer.bank.customer[0]['$'].phone
                    },
                    merchant: {
                        name: answer.bank.customer[0].merchant[0]['$'].name
                    },
                    order: {
                        id: answer.bank.customer[0].merchant[0].order[0]['$'].order_id,
                        amount: answer.bank.customer[0].merchant[0].order[0]['$'].amount,
                        currency: answer.bank.customer[0].merchant[0].order[0]['$'].currency,
                    },
                    department: {
                        amount: answer.bank.customer[0].merchant[0].order[0].department[0]['$'].amount
                    },
                    payment: {
                        timestamp: answer.bank.results[0]['$'].timestamp,
                        merchant_id: answer.bank.results[0].payment[0]['$'].merchant_id,
                        amount: answer.bank.results[0].payment[0]['$'].amount,
                        reference: answer.bank.results[0].payment[0]['$'].reference,
                        approval_code: answer.bank.results[0].payment[0]['$'].approval_code,
                        response_code: answer.bank.results[0].payment[0]['$'].response_code
                    },
                    check_result: result?'SIGN_GOOD':'SIGN_BAD'
                }
                return cb(false, res);
            });
        });
    });
}

// function appendixXml(products) {
//   console.log(products)
//     // const appendixObj = products.map(
//     //   (product, index) => ({ number:index+1, name: encodeURI(product.name), quantity: product.quantity, amount: product.sum})
//     // )
//
//     // var builder = new xml2js.Builder({rootName: 'document', headless: true, renderOpts: {'pretty': true}});
//     // return builder.buildObject(appendixObj);
// }

// export const kkbEpay = new ValidatedMethod({
//   name: 'order.kkb',
//   validate: new SimpleSchema({
//     _id: { type: String },
//   }).validator(),
//   run({_id}) {
//     if (Meteor.isServer) {
Meteor.methods({
  'order.kkb': function(_id) {
    check(_id, String)
      const order = Orders.findOne({_id})
      if (order) {
        // console.log(appendixXml(order.products))
        const syncFunc = Meteor.wrapAsync(getSignedOrderBase64)
        const result = syncFunc(config, order.id || order._id, order.total, 398)
        return(result)
      }
  }
    // return
})
// })
WebApp.connectHandlers.use('/kkb', (req, res, next) => {
  res.writeHead(200);
  res.end(`0`);
  Fiber(function () {
    var body = req.body
    if (body.response){
      // KkbEpay.insert({response: body.response})

      // const configObj = JSON.parse(Assets.getText('kkb/config.json'))
      // const {
      //   MERCHANT_CERTIFICATE_ID,
      //   MERCHANT_ID,
      //   MERCHANT_NAME,
      //   PRIVATE_KEY_PASS,
      //   PRIVATE_KEY_FN,
      //   PUBLIC_KEY_FN,
      //   INVERT_SIGN,
      // } = configObj
      // const config = {
      //   cert_id: MERCHANT_CERTIFICATE_ID,
      //   merchant_id: MERCHANT_ID,
      //   merchant_name: MERCHANT_NAME,
      //   privateKeyPass: PRIVATE_KEY_PASS,
      //   privateKeyFile: Assets.absoluteFilePath(PRIVATE_KEY_FN),
      //   publicKeyFile: Assets.absoluteFilePath(PUBLIC_KEY_FN),
      //   invertSign: INVERT_SIGN,
      // }
      // sign('123', config.privateKeyFile, config.privateKeyPass, (e, r) => {
        // console.log(r)
        // verify('<bank name="Kazkommertsbank JSC"><customer name="Ucaf Test Maest" mail="SeFrolov@kkb.kz" phone=""><merchant cert_id="00C182B189" name="test merch"><order order_id="0706172110" amount="1000" currency="398"><department merchant_id="92056001" amount="1000"/></order></merchant><merchant_sign type="RSA"/></customer><customer_sign type="RSA"/><results timestamp="2006-07-06 17:21:50"><payment merchant_id="92056001" amount="1000" reference="618704198173" approval_code="447753" response_code="00"/></results></bank>', 'xjJwgeLAyWssZr3/gS7TI/xaajoF3USk0B/ZfLv6SYyY/3H8tDHUiyGcV7zDO5+rINwBoTn7b9BrnO/kvQfebIhHbDlCSogz2cB6Qa2ELKAGqs8aDZDekSJ5dJrgmFT6aTfgFgnZRmadybxTMHGR6cn8ve4m0TpQuaPMQmKpxTI=', Assets.absoluteFilePath('kkb/kkbca_test.pub'), (e,r)=>{
        //   console.log(r)
        // })
      // })
      parseBankAnswer(config, body.response, (error, result) => {
        if (error) {
          SSR.compileTemplate('errorEmail', Assets.getText('emailtemplates/error.html'));
          Meteor.defer(function() {
            Email.send({
              to: 'mimimishki.kz@yandex.com',
              from: 'na@alternate.kz',
              subject: `[Mimimishki.kz] Epay KKB Error`,
              html: SSR.render('errorEmail', {error: JSON.stringify(error)}),
            });
          })
        } else if (result && result.check_result && result.check_result === 'SIGN_GOOD') {
          if (result.merchant && result.merchant.name && result.merchant.name === MERCHANT_NAME
            && result.payment && result.payment.merchant_id && result.payment.merchant_id === MERCHANT_ID
          ) {
            Fiber(function () {
              const order = Orders.findOne({id: parseInt(result.order.id)})
              const { payment } = result
              if (order && (!order.status || order.status !== 'paid')) {
                Orders.update({_id: order._id}, {$set:{status: 'paid'}})

                SSR.compileTemplate('paymentEmail', Assets.getText('emailtemplates/payment.html'));
                Meteor.defer(function() {
                  Email.send({
                    to: 'mimimishki.kz@yandex.com',
                    from: 'mimimishki.kz@yandex.com',
                    subject: `[Mimimishki.kz] Заказ ${ order.id } оплачен`,
                    html: SSR.render('paymentEmail', { order, payment }),
                  });
                  Email.send({
                    to: order.email,
                    from: 'mimimishki.kz@yandex.com',
                    subject: `[Mimimishki.kz] Ваш заказ ${ order.id } оплачен`,
                    html: SSR.render('paymentEmail', { order, payment }),
                  });
                });
              }
            }).run()
          }
        }
      })
    }
  }).run()

});
