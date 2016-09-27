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
      this.account = data.get('Account');    
    } else if (type === 'Mint') {
      // this.id
      this.date = moment(data[0]).format('YYYY-MM-DD');
      this.yearMonth = _.join([_.split(data[0], '/')[2],_.split(data[0], '/')[0]],'-');
      this.name = data[1];
      this.amount = Number(data[3]);
      this.mintAmount = Number(data[3]);
      // this.flow
      this.bucket = [];
      this.category = data[5];
      this.account = data[6];        
      this.mintOriginalDescription = data[2];
      this.mintTransactionType = data[4];
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

  runRules() {
    
    // ---------- Flow ----------
    const MINT_CATEGORIES_TRANSFER = ['Transfer', 'Credit Card Payment'];
    const MINT_TRANSACTION_TYPE_TEXT_CREDIT = 'credit';
    const MINT_TRANSACTION_TYPE_TEXT_DEBIT = 'debit';

    if(_.includes(MINT_CATEGORIES_TRANSFER, this.category)) {
      this.flow = 'Transfer';
    }
    else if(this.mintTransactionType === MINT_TRANSACTION_TYPE_TEXT_CREDIT) {
      this.flow = 'Inflow';
    } else if(this.mintTransactionType === MINT_TRANSACTION_TYPE_TEXT_DEBIT) {
      this.flow = 'Outflow';
    }    
    
    // ---------- CJ ----------
    const MINT_ACCOUNT_TEXT_CITI_CJ_CREDIT_CARD = 'Citi Double Cash Card';

    if(this.account === MINT_ACCOUNT_TEXT_CITI_CJ_CREDIT_CARD) {
      this.bucket.push('CJ');
    }
  }



}



module.exports = Transaction;