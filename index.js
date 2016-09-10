var yearMonth = '';
$.fn.dataTable.ext.search.push(function(settings, data, index) {
  if(yearMonth === '') {
    return true;
  } else if(data[1] === yearMonth) {
    return true
  } else {
    return false;
  }
});


$(function() {
  $.getJSON('./tmp/parsedDb.json', function(data) {
    const monthlyExpenses = data.expensesByMonth;
    const yearMonths = monthlyExpenses.map(e => e.month);

    var transactionsTable = data.transactions.map(t => {
      return [t.date, t.yearMonth, t.name, t.category, t.amount]
    });

    var table = $('#transactionsTable').DataTable( {
      data: transactionsTable,
      columns: [
      { title: "Date" },
      { title: "YearMonth" },
      { title: "Name" },
      { title: "Category" },
      { title: "Amount" }
      ]
    });

        // function updateTransactions(yearMonth) {
        //   transactionsTable = transactionsTable[1];
        // }

        $('#expensesByMonth').highcharts({
          title: {
            text: 'Monthly Expenses',
            x: -20
          },
          xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          yAxis: {
            title: {
              text: 'Amount (USD)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          series: [{
            name: 'Expenses',
            data: monthlyExpenses.map(e => e.expenseTotal),
            point: {
              events: {
                click: function (e) {
                  yearMonth = yearMonths[this.index];
                  table.draw(); 
                }
              }
            }
          },{
            name: 'Recurring Expenses',
            data: monthlyExpenses.map(e => e.recurringExpenseTotal),
            point: {
              events: {
                click: function (e) {
                  yearMonth = yearMonths[this.index];
                  table.draw(); 
                }
              }
            }
          }]
        });

drawBubbleChart(data.categories);

});

})