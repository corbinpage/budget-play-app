var fs = require('fs');
var low = require('lowdb');
var _ = require('lodash');
var Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ''
});
var base = Airtable.base('appl4sMLlQp13Je1K');

fs.unlinkSync('tmp/db.json')
var db = low('tmp/db.json');
var count = 1;
var transactions = [];

base('2016 Transactions').select({
    // Selecting the first 3 records in Main View:
    // maxRecords: 3,
    view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    var transactionPage = records.map(record => {
      console.log('Retrieved ', count, ': ', record.get('Description'), record.get('Bucket'), record.get('Amount'));
      count++;
      return {
        "id": Number(record.get('ID')),
        "date": record.get('Date'),
        "year-month": record.get('Year-Month'),
        "name": record.get('Description'),
        "category": record.get('Category'),
        "amount": Number(record.get('Amount')),
        "bucket": record.get('Bucket'),
        "cj": record.get('CJ?'),
        "account": record.get('Account')
      };
    });

    transactions = transactions.concat(transactionPage);

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(error) {
    if (error) {
      console.log(error);
    } else {
      db.defaults({ transactions: transactions }).value();
    }
  });
