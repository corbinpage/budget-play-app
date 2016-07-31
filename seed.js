var parse = require('csv-parse');
var fs = require('fs');
var path = require('path');
var low = require('lowdb');
var _ = require('lodash');
var uuid = require('uuid');


const db = low('tmp/db.json');
// db._.mixin(require('uuid'));


function saveSeedTransaction(transaction) {

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
    "name": transaction[1],
    "originalName": transaction[2],
    "meta": {
      "location": {
        "zip": "TBD"
      }
    },
    "pending": false,
    "type": {
      "primary": "TBD",
      "mint": transaction[4]
    },
    "category": [
    transaction[5]
    ],
    "category_id": "TBD",
    "score": {},
    "labels": labels,
    "notes": transaction[8]
  };

  db.defaults({ transactions: [] }).value();
  db.get('transactions')
  .push(t)
  .value();

}


var filePath = path.join(__dirname, 'tmp/seed-7-31-2016-v2.csv');
fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    // console.log(data);
    if (!err){
      parse(data, {}, function(err, output){
        output.forEach( t => {
          saveSeedTransaction(t);
        })

        var query = db.get('transactions')
        .value()

        console.log(query)
        console.log('Size: ' + _.size(query))

      });

    } else{
      console.log(err);
    }

  });



