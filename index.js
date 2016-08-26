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
        data: monthlyExpenses.map(e => {return e.amount})
      }]
    });
  });
})