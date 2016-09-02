var parse = require('csv-parse');
var fs = require('fs');
var path = require('path');
var low = require('lowdb');
var _ = require('lodash');
var myAirtable = require('./airtable');
var Transaction = require('../buddy-app/transaction');
var moment = require('moment');

function loadMintTransactions(year) {
  myAirtable.getAllTransactions(year + ' Transactions',compareMintAirtableTransactions);
  
}

function compareMintAirtableTransactions(airtableTransactions) {

  // console.log(Transaction);

  var currentTransactions = airtableTransactions.map(t => {
    var temp = new Transaction('Airtable', t);
    return {name: temp.name, mintAmount: temp.mintAmount, date: temp.date};
  })

  // console.log(currentTransactions);

  var filePath = path.join(__dirname, '../../tmp/seed-8-19-2016.csv');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    parse(data, {}, function(err, output){
      output.shift();

      var priorYearCount = 0;
      var duplicateCount = 0;
      var newTransactionCount = 0;

      output.forEach(o => {
        var mintTransaction = new Transaction('Mint', o);

        if(moment(mintTransaction.date,'YYYY-MM-DD').format('YYYY') !== '2016') {
          priorYearCount++;
          console.log('Prior year transaction: ' + mintTransaction.date);
        } else if(mintTransaction.isDuplicate(currentTransactions))  {
          duplicateCount++;
          console.log("Duplicate Found: " + mintTransaction.name + " " + mintTransaction.date);
        } else {
          myAirtable.writeTransaction(mintTransaction);
          newTransactionCount++;
          console.log("Wrote new Transaction: " + mintTransaction.name + ' ' + mintTransaction.mintAmount + ' ' + mintTransaction.date);
        // writeToAirtable(o);
      }
    })
      console.log("Prior year count: " + priorYearCount);
      console.log("Duplicate count: " + duplicateCount);
      console.log("New Transactions count: " + newTransactionCount);

    });
  });

}

loadMintTransactions(2016);





