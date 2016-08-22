var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: ''
});
var base = Airtable.base('appl4sMLlQp13Je1K');
var count = 1;

base('Transactions').select({
    // Selecting the first 3 records in Main View:
    // maxRecords: 3,
    view: "Main View"
}).eachPage(function page(records, fetchNextPage) {

    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved ', count, ': ', record.get('Description'), record.get('Bucket'), record.get('Amount'));
        count++;
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(error) {
    if (error) {
        console.log(error);
    }
});

    {
      "_account": "TBD",
      "account": "Regular Checking",
      "_id": "f13ad567-544f-48db-886e-b69d13e155c5",
      "amount": 284.05,
      "date": "8/19/2016",
      "year-month": "2016-8",
      "name": "Transfer to 8572",
      "originalName": "ACH HOLD CITI AUTOPAY PAYMENT ON 08/19",
      "pending": false,
      "type": {
        "primary": "TBD",
        "mint": "debit"
      },
      "category": [
        "Credit Card Payment"
      ],
      "labels": [],
      "notes": ""
    },