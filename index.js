var bluebird = require('bluebird');
var plaid = require('plaid');

// Promisify the plaid module
bluebird.promisifyAll(plaid);

// plaid.getCategory(category_id, plaid_env, callback);
// plaid.getCategories(plaid_env, callback);

// plaid.getInstitution(institution_id, plaid_env, callback);
// plaid.getInstitutions(plaid_env, callback);

// plaid.searchInstitutions({id: institutionId}, env, function(data){
//   console.log(data);
// });

var c = plaid.getInstitutionsAsync(plaid.environments.tartan);

c.then(function(data){
  console.log(data);
});