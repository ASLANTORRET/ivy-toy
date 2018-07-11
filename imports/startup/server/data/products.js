import { Products } from "/imports/api/products";
if (Products.find().count() === 0) {
  console.log("Importing private/data/products.json to db")

  let data = JSON.parse(Assets.getText("data/products.json"));

  data.forEach(function (product, index, array) {
    Products.insert(product);
  })
}
