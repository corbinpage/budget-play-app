var bluebird = require('bluebird');
var plaid = require('plaid');
var fs = require('fs');

// Promisify the plaid module
bluebird.promisifyAll(plaid);

var client = new plaid.Client(
  '',
  '',
  plaid.environments.tartan
  );

var addAuthUserAsync = bluebird.promisify(client.addAuthUser, {context: client, multiArgs: true});
var stepAuthUserAsync = bluebird.promisify(client.stepAuthUser, {context: client, multiArgs: true});
var addConnectUserAsync = bluebird.promisify(client.addConnectUser, {context: client, multiArgs: true});
var stepConnectUserAsync = bluebird.promisify(client.stepConnectUser, {context: client, multiArgs: true});
var getConnectUserAsync = bluebird.promisify(client.getConnectUser, {context: client, multiArgs: true});


// ---------------------------------------------------------------


// addConnectUserAsync('chase', {
//   username: '',
//   password: ''
// }).then(responses => {
//   var mfaResponse = responses[0];
//   var response = responses[1];
//   console.log(mfaResponse);
//   console.log(response);


//   fs.writeFile("tmp/text.json", JSON.stringify(response), function(err) {
//     if(err) {
//       return console.log(err);
//     }

//     console.log("The file was saved!");
//   }); 

// });


// ---------------------------------------------------------------


// var access_token = '8c1a3ea14f768c659c682b6da5cbed14a438e2ee2a24e55498a7f6cc55a4f5dcdede9e19d82695c42c50352909eec3dae1106f986d652c2d60b97fc79b06853977c505654585a0c8be9a998635ad8e43';
// var mfa = '';

// stepConnectUserAsync(access_token, {
//   mfa: mfa
// }).then(responses => {
//   var mfaResponse = responses[0];
//   var response = responses[1];
//   console.log(mfaResponse);
//   console.log(response);


//   fs.writeFile("tmp/text.json", JSON.stringify(response), function(err) {
//     if(err) {
//       return console.log(err);
//     }

//     console.log("The file was saved!");
//   }); 

// });



// ---------------------------------------------------------------


var access_token = '8c1a3ea14f768c659c682b6da5cbed143152316a78357270de6afeab111a2c2b66975918488140d1af39da8c18f0937fee101b5df3b7a4bbbeb3ada5754e28af544ddcec61d862b4f39892ed60a1f132';

getConnectUserAsync(access_token).then(responses => {
  var mfaResponse = responses[0];
  var response = responses[1];
  console.log(mfaResponse);
  console.log(response);


  fs.writeFile("tmp/text.json", JSON.stringify(response), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  }); 

});





