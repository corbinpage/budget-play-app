const fs = require('fs');
const _ = require('lodash');
const myAirtable = require('../services/airtable/airtable');
const Transaction = require('../services/buddy-app/transaction');

var data = {};
const year = 2016;
const yearMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => {
  return year + '-' + m
});


myAirtable.loadAllTransactions('2016 Transactions',function(transactions) {
  data.categories = categorizeExpenses(transactions);
  data.expensesByMonth = queryExpensesByMonth(transactions);
  data.buckets = querybucketTotals(transactions);
  data.transactions = _.filter(transactions, 
  {
    "bucket": ["Expense"]
  });;

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
  var expenses = _.filter(transactions, {"flow": "Outflow"});
  var groupMonthlyExpenses = _.groupBy(expenses, e => e.yearMonth);
  var expenseTotals = [];

  _.forOwn(groupMonthlyExpenses, (value, key, object) => {
    var monthlyExpenseTotals = value.map(t => t.amount);
    var monthlyRecurringExpenseTotals = 0; 
    var monthlyRecurringExpenseTotals = _.filter(value, 
    {
      "flow": "Outflow",
      "bucket": ["Expense", "Recurring"]
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

function categorizeExpenses(transactions) {
  const categoriesTemplate = require('./categories/categories-flat.json');

  var expenses = _.filter(transactions, 
  {
    "bucket": ["Expense"]
  });

  var expensesByCategory = _.groupBy(expenses, e => e.category);

  return categoriesTemplate.map(c => {
    var key = c.className === 'Miscellaneous' ? c.packageName : c.className;
    var totalAmount = 0;
    var monthlyTotals = Array(yearMonths.length).fill(0);

    if(expensesByCategory[key]) {
      totalAmount = -1 * _.round(_.sum(expensesByCategory[key].map(e => e.amount)));
      var monthlyExpenses = _.groupBy(expensesByCategory[key], e => e.yearMonth);

      monthlyTotals = yearMonths.map(ym => {
        return monthlyExpenses[ym] ?
        -1 * _.round(_.sum(monthlyExpenses[ym].map(e => e.amount))) : 0;
      })
    }

    return {
      "packageName": c.packageName,
      "className": c.className,
      "value": totalAmount >= 0 ? totalAmount : 0,
      "valueByMonth": monthlyTotals
    }

  })
}

function queryCategoryAmount(category, transactions) {
  var amounts = _.filter(transactions, 
    {'category': category}
    );
  var totalAmount = -1 * _.round(_.sum(amounts.map(t => {return t.amount})));

  return totalAmount > 0 ? totalAmount : 0;
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
