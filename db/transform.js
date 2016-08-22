var fs = require('fs');
var low = require('lowdb');
var _ = require('lodash');

const categories = require('./categories/categories.json');
const db = low('tmp/db.json');

function queryCategoryAmount(category) {
  var amounts = db.get('transactions')
  .filter({'category': [
    category
    ]})
  .map('amount')
  .value();

  var totalAmount = _.round(_.sum(amounts));

  return totalAmount > 0 ? totalAmount : 0;
}

function transformNode(node) {
  if(_.isEmpty(node.children)) {
    node.value = queryCategoryAmount(node.name);
    return node;
  } else {
    var children = node.children.map(c => {
      return transformNode(c);
    })
    children.push({
      "name": "Miscellaneous",
      "value": queryCategoryAmount(node.name)
    });
    node.children = children;
    return node;
  }
}

var data = transformNode(categories);

fs.writeFile("tmp/data.json", JSON.stringify(data));
