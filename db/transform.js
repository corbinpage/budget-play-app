const fs = require('fs');
const _ = require('lodash');
const myAirtable = require('../services/airtable/airtable');
const Transaction = require('../services/buddy-app/transaction');
const categoriesTemplate = require('./categories/categories.json');

var data = {};
const year = 2016;
const yearMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => {
  return year + '-' + m
});


myAirtable.loadAllTransactions('2016 Transactions',function(transactions) {
  data.categories = categorizeTransactions(transactions,categoriesTemplate);
  data.expensesByMonth = queryExpensesByMonth(transactions);
  data.buckets = querybucketTotals(transactions);
  data.transactions = transactions;

  fs.unlinkSync('tmp/parsedDb.json')
  fs.writeFile('tmp/parsedDb.json', JSON.stringify(data));
})

function querybucketTotals(transactions) {
  var buckets = [];
  var bucketNames = _.uniq(
    _.flattenDeep(
      transactions.map(t => {
        return t.bucket
      })
      )
    );

  if(!_.isEmpty(bucketNames)) {
    bucketNames.forEach(b => {
      var amounts = _.filter(transactions, 
      {
        "bucket": [b]
      });

      var totalAmount = _.round(_.sum(amounts.map(t => {return t.amount})));

      buckets.push({
        "name": b,
        "value": totalAmount
      });
    })
  }

  return buckets;
}

function queryExpensesByMonth(transactions) {
  var expenses = _.filter(transactions, 
  {
    "bucket": ["Expense"]
  });

  var groupMonthlyExpenses = _.groupBy(expenses, e => e.yearMonth);
  var expenseTotals = [];

  _.forOwn(groupMonthlyExpenses, (value, key, object) => {
    var monthlyExpenseTotals = value.map(t => t.amount);
    var monthlyRecurringExpenseTotals = _.filter(value, 
      {
        "bucket": ["Recurring"]
      })
      .map(t => t.amount)

    expenseTotals.push({
      month: key,
      expenseTotal: _.round(_.sum(monthlyExpenseTotals)),
      recurringExpenseTotal: _.round(_.sum(monthlyRecurringExpenseTotals))
    })
  });

  return _.sortBy(expenseTotals,'month');
}

function categorizeTransactions(transactions,categories) {
  return categorizeNode(categories, transactions);
}

function queryCategoryAmount(category, transactions) {
  var amounts = _.filter(transactions, 
    {'category': category});

  return _.round(_.sum(amounts.map(t => {return t.amount})));
}

function categorizeNode(node, transactions) {
  if(_.isEmpty(node.children)) {
    node.value = queryCategoryAmount(node.name, transactions);
    return node;
  } else {
    var children = node.children.map(c => {
      return categorizeNode(c, transactions);
    })
    children.push({
      "name": "Miscellaneous",
      "value": queryCategoryAmount(node.name, transactions)
    });
    node.children = children;
    return node;
  }
}
