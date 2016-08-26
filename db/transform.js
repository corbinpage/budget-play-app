var fs = require('fs');
var low = require('lowdb');
var _ = require('lodash');

const db = low('tmp/db.json');
const parsedDb = low('tmp/parsedDb.json');
const categoriesTemplate = require('./categories/categories.json');

var data = {};

data.categories = categorizeTransactions(db,categoriesTemplate);
data.expensesByMonth = queryexpensesByMonth(db,'2016');

fs.writeFile("tmp/parsedDb.json", JSON.stringify(data));

// Read in all transactions from airtable
// Parse categories
// Parse expenses by month
// Highcharts.chart('container', { /*Highcharts options*/ });
// months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


function queryexpensesByMonth(db, year) {
  var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  
  var yearMonthAmount = months.map(m => {
    yearMonth =  year + '-' + m;

    var amounts = db.get('transactions')
    .filter({
      "bucket": ["Expense"],
      'year-month': yearMonth
    })
    .map('amount')
    .value();

    var totalAmount = _.round(_.sum(amounts));

    return {
      "year-month": yearMonth,
      "amount": totalAmount > 0 ? totalAmount : 0
    }
  });

  return yearMonthAmount;

}

function categorizeTransactions(db,categories) {
  return categorizeNode(categories, db);
}

function queryCategoryAmount(category, db) {
  var amounts = db.get('transactions')
  .filter({
    "bucket": ["Expense"],
    'category': category
  })
  .map('amount')
  .value();

  var totalAmount = _.round(_.sum(amounts));

  return totalAmount > 0 ? totalAmount : 0;
}

function categorizeNode(node, db) {
  if(_.isEmpty(node.children)) {
    node.value = queryCategoryAmount(node.name, db);
    return node;
  } else {
    var children = node.children.map(c => {
      return categorizeNode(c, db);
    })
    children.push({
      "name": "Miscellaneous",
      "value": queryCategoryAmount(node.name, db)
    });
    node.children = children;
    return node;
  }
}
