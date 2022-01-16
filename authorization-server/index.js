/**
 * Agrirouter onboarding Authorization Analyser
 * Copyright 2018; 
 * Author: Frank Wiebeler, dev4Agriculture 
 *                  in behalf of DKE Data GmbH & Co KG
 */

 /**
  * Installation: 
  * 1.) Install nodejs
  * 2.) Install NPM
  * 3.) Open Shell in Folder of this file
  * 4.) Call npm install
  */

/**
 * Usage:
 * Call node index.js in shell
 * Create a URL using https://agrirouter-qa.cfapps.eu1.hana.ondemand.com/application/{{application}}/authorize 
 * with {{application}} being the application ID from your agrirouter UI
 */



 //Include required Libraries
let express = require("express");
let bodyParser = require("body-parser");
let uuid = require("uuid");
let readline = require('readline');


//Create Express Server
let app = express();

//Using this, we can use req.body. ... for all Parameters we input from Postman request body as JSON
app.use(bodyParser.json());

//The main Procedure; Redirecting the call of Postman to this function and signing the body
app.get("*", function(req,res)
    {
        /**
         * Example REQ: http://fuf.me:8080/?state=fd37996d-67b8-4e7d-9d47-ba9f2f7bb231&token=eyJhY2NvdW50IjoiZTE1ZjUzYzEtMjUyZS00ZThkLWFlODItMDUwMzAwZjEzMmNlIn0%3D&signature=LMEySvdBSzwi4gkh0Sz5OWyrNmg1ywiowTYAviLE49y%2BF9LiD69Q%2F6Nmt9F3qWj8xxId9g8MmCQguQNN97FxYeo3xHJqb5Q5ElWHMWeksrPIK74rAh0H95hAlR5z0s6G1w7CQ8u7EscbuSC8p7y28P03Sg%2FeeA%2FPDaAv%2FVpHbyJRe3T4w0FIze4mLxTVoWBTRi4MUUctbPXslgLRF1EH2nuUOP%2BB0cyrglqVks%2FNTJfao3DHHLH4kjwP4cfnCKlT9xvlVabgqmrgXA93K8ZeFLz0RGJ0ik0evF1okMMNE%2FUfKTaQ0redmY6aR4XkbpLdTngJa2DLAIjnF4B6EP42Sg%3D%3D
         *  URL: http://fuf.me:8080/
         * GET Parameters: 
         *      state=fd37996d-67b8-4e7d-9d47-ba9f2f7bb231
         *      token=eyJhY2NvdW50IjoiZTE1ZjUzYzEtMjUyZS00ZThkLWFlODItMDUwMzAwZjEzMmNlIn0=
         *      signature=LMEySvdBSzwi4gkh0Sz5OWyrNmg1ywiowTYAviLE49y%2BF9LiD69Q%2F6Nmt9F3qWj8xxId9g8MmCQguQNN97FxYeo3xHJqb5Q5ElWHMWeksrPIK74rAh0H95hAlR5z0s6G1w7CQ8u7EscbuSC8p7y28P03Sg%2FeeA%2FPDaAv%2FVpHbyJRe3T4w0FIze4mLxTVoWBTRi4MUUctbPXslgLRF1EH2nuUOP%2BB0cyrglqVks%2FNTJfao3DHHLH4kjwP4cfnCKlT9xvlVabgqmrgXA93K8ZeFLz0RGJ0ik0evF1okMMNE%2FUfKTaQ0redmY6aR4XkbpLdTngJa2DLAIjnF4B6EP42Sg==
         * */
        console.log("Authorization result received");
         let state = req.query.state;
         let token = req.query.token;
         let signature = req.query.signature;

         console.log("State: "+state);

         console.log("We are currently not checking the Signature, you however should do so!");

         let sToken = Buffer.from(token,'base64').toString();
         let data = JSON.parse(sToken);
         console.log(sToken);
         console.log(JSON.stringify(data));
         res.send(state + "   " + JSON.stringify(data));
    }
);


console.log("Starting Server");
//Listening to Port 8080; feel free to change this
app.listen(8080);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your application ID? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Here is your URL:  https://agrirouter-qa.cfapps.eu10.hana.ondemand.com/application/${answer}/authorize?response_type=onboard&state=${uuid.v4()}`);

  rl.close();
});

