var fs = require('fs');
var low = require('lowdb');
var _ = require('lodash');

const categories = require('./categories/categories.json');
const db = low('tmp/db.json');

console.log(categories);


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
  node.value = queryCategoryAmount(node.name);

  if(_.isEmpty(node.children)) {
    return node;
  } else {
    var children = node.children.map(c => {
      return transformNode(c);
    })
    node.children = children;
    return node;
  }
}

var data = transformNode(categories);

fs.writeFile("tmp/data.json", JSON.stringify(data));
