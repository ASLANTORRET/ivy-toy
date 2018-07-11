import { Categories } from "/imports/api/categories";
if (Categories.find().count() === 0) {
  console.log("Importing private/data/categories.json to db")

  let data = JSON.parse(Assets.getText("data/categories.json"));

  data.forEach(function (category, index, array) {
    Categories.insert(category);
  })
}
