'use strict';
var _ = require('lodash');
var moment = require('moment');

class Transaction {
  constructor(type, data) {
    if(type === 'Airtable') {
      this.id = Number(data.get('ID'));
      this.date = data.get('Date');
      this.yearMonth = data.get('Year-Month');
      this.name = data.get('Description');
      this.amount = Number(data.get('Amount'));
      this.mintAmount = Number(data.get('Mint Amount'));
      this.flow = data.get('Flow');
      this.bucket = data.get('Bucket');
      this.category = data.get('Category');
      this.cj = data.get('CJ?');    
      this.account = data.get('Account');    
    } else if (type === 'Mint') {
      // this.id = ;
      this.date = moment(data[0]).format('YYYY-MM-DD');
      this.yearMonth = _.join([_.split(data[0], '/')[2],_.split(data[0], '/')[0]],'-');
      this.name = data[1];
      this.mintOriginalDescription = data[2];
      this.category = data[5];
      this.amount = Number(data[3]);
      this.mintAmount = Number(data[3]);
      this.mintTransactionType = data[4];
      this.bucket = ['New'];
      // this.cj = ;    
      this.account = data[6];      
    }
  }

  isDuplicate(existingTransactions) {
    var match = _.filter(existingTransactions, 
      { name: this.name,
        mintAmount: this.mintAmount,
        date: this.date
      });
    // console.log("Comparing: " + this.name + ' ' + this.mintAmount + ' ' + this.date);
    // console.log('Match: ' + !_.isEmpty(match));

    return !_.isEmpty(match);
  }

}



module.exports = Transaction;