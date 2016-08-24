var low = require('lowdb');
var _ = require('lodash');
var Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: ''
});
var base = Airtable.base('appl4sMLlQp13Je1K');
var db = low('tmp/db2.json');
var count = 1;
var transactions;

base('Transactions').select({
    // Selecting the first 3 records in Main View:
    // maxRecords: 3,
    view: "Main View"
  }).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    // records.forEach(function(record) {
    //     console.log('Retrieved ', count, ': ', record.get('Description'), record.get('Bucket'), record.get('Amount'));
    //     count++;
    // });

transactions = records.map(record => {
  console.log('Retrieved ', count, ': ', record.get('Description'), record.get('Bucket'), record.get('Amount'));
  count++;
  return {
    "amount": Number(record.get('Amount')),
    "date": record.get('Date'),
    "year-month": _.join([_.split(record.get('Date'), '/')[2],_.split(record.get('Date'), '/')[0]],'-'),
    "name": record.get('Description'),
    "originalName": record.get('Original Description'),
    "category": record.get('Category'),
    "bucket": record.get('Bucket'),
    "labels": record.get('Labels'),
    "notes": record.get('Notes')
  };
});


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
