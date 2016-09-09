$(function() {
  $.getJSON('./tmp/parsedDb.json', function(data) {
    const monthlyExpenses = data.expensesByMonth;

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
        data: monthlyExpenses.map(e => e.expenseTotal)
      },{
        name: 'Recurring Expenses',
        data: monthlyExpenses.map(e => e.recurringExpenseTotal)
      }]
    });

    var transactionsTable = data.transactions.map(t => {
      return [t.date, t.name, t.category, t.amount]
    });

    $('#transactionsTable').DataTable( {
      data: transactionsTable,
      columns: [
      { title: "Date" },
      { title: "Name" },
      { title: "Category" },
      { title: "Amount" }
      ]
    } );;

  });

})