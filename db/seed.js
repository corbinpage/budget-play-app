var parse = require('csv-parse');
var fs = require('fs');
var path = require('path');
var low = require('lowdb');
var _ = require('lodash');
var uuid = require('uuid');


const db = low('tmp/db.json');
// db._.mixin(require('uuid'));


function convertMintCsvToDb(transaction) {

  var labels = [];
  if(!_.isEmpty(transaction[7])) {
    labels.push(transaction[7]);
  }

  if(!_.isEmpty(transaction[9])) {
    labels.push(transaction[9].split('; '));
    labels = _.flattenDeep(labels);
  }

  const t = {
    "_account": "TBD",
    "account": transaction[6],
    "_id": uuid(),
    "amount": Number(transaction[3]),
    "date": transaction[0],
    "year-month": _.join(_.split(transaction[0], '-', 2),'-'),
    "name": transaction[1],
    "originalName": transaction[2],
    "pending": false,
    "type": {
      "primary": "TBD",
      "mint": transaction[4]
    },
    "category": [
    transaction[5]
    ],
    "labels": labels,
    "notes": transaction[8]
  };

  return t;

}


var filePath = path.join(__dirname, '../tmp/seed-8-19-2016.csv');
fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
  parse(data, {}, function(err, output){
    var transactions = output.map(convertMintCsvToDb);

    db.defaults({ transactions: [] }).value();
    db.get('transactions')
    .push(transactions)
    .value();

    var query = db.get('transactions')
    .value()

    console.log('Size: ' + _.size(query))

  });
});



