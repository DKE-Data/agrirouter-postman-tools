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

const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

let createdState = "";
let appId = "";

//Create Express Server
let app = express();

//Using this, we can use req.body. ... for all Parameters we input from Postman request body as JSON
app.use(bodyParser.json());

app.use(express.static('img'));
//The main Procedure; Redirecting the call of Postman to this function and signing the body
app.get("/auth", function(req,res)
    {

        /**
         * Example REQ: http://fuf.me:8080/auth?state=fd37996d-67b8-4e7d-9d47-ba9f2f7bb231&token=eyJhY2NvdW50IjoiZTE1ZjUzYzEtMjUyZS00ZThkLWFlODItMDUwMzAwZjEzMmNlIn0%3D&signature=LMEySvdBSzwi4gkh0Sz5OWyrNmg1ywiowTYAviLE49y%2BF9LiD69Q%2F6Nmt9F3qWj8xxId9g8MmCQguQNN97FxYeo3xHJqb5Q5ElWHMWeksrPIK74rAh0H95hAlR5z0s6G1w7CQ8u7EscbuSC8p7y28P03Sg%2FeeA%2FPDaAv%2FVpHbyJRe3T4w0FIze4mLxTVoWBTRi4MUUctbPXslgLRF1EH2nuUOP%2BB0cyrglqVks%2FNTJfao3DHHLH4kjwP4cfnCKlT9xvlVabgqmrgXA93K8ZeFLz0RGJ0ik0evF1okMMNE%2FUfKTaQ0redmY6aR4XkbpLdTngJa2DLAIjnF4B6EP42Sg%3D%3D
         *  URL: http://fuf.me:8080/auth
         * GET Parameters: 
         *      state=fd37996d-67b8-4e7d-9d47-ba9f2f7bb231
         *      token=eyJhY2NvdW50IjoiZTE1ZjUzYzEtMjUyZS00ZThkLWFlODItMDUwMzAwZjEzMmNlIn0=
         *      signature=LMEySvdBSzwi4gkh0Sz5OWyrNmg1ywiowTYAviLE49y%2BF9LiD69Q%2F6Nmt9F3qWj8xxId9g8MmCQguQNN97FxYeo3xHJqb5Q5ElWHMWeksrPIK74rAh0H95hAlR5z0s6G1w7CQ8u7EscbuSC8p7y28P03Sg%2FeeA%2FPDaAv%2FVpHbyJRe3T4w0FIze4mLxTVoWBTRi4MUUctbPXslgLRF1EH2nuUOP%2BB0cyrglqVks%2FNTJfao3DHHLH4kjwP4cfnCKlT9xvlVabgqmrgXA93K8ZeFLz0RGJ0ik0evF1okMMNE%2FUfKTaQ0redmY6aR4XkbpLdTngJa2DLAIjnF4B6EP42Sg==
         * */
        console.log("Authorization result received");
         let state = req.query.state;
         let token = req.query.token;
         let signature = req.query.signature;

         let warning_State = "";
         console.log("State: "+state);
         if(createdState !== state){
           console.log("WARNING: The state returned is different from the one in the URL above ⇧ : "+ state);
           warning_State= "<b>WARNING</b>: The state returned is different from the one in the URL : "+ state;
         }

         console.log("We are currently not checking the Signature, you however should do so!");

         let warning_Data = "";
         let sToken = "";
         let data = {};
         try{ 
          sToken = Buffer.from(token,'base64').toString();
          data = JSON.parse(sToken);
          console.log(JSON.stringify(data));
         } catch (e){
           warning_Data = "<b>ERROR:</b> Could not read Token. Error: "+ e;
         }
         res.send(`
         <html>
          <head>
            <title>
              Authorization Result
            </title>
          </head>
          <body>
          <table border="1">
            <tr><td>State</td><td>${state}${warning_State}</td></tr>
            <tr><td>Result</td><td>${JSON.stringify(data)}${warning_Data}</td></tr>
            <tr><td>Signature</td><td>${signature}</td></tr>
          </table>
          
          </body>
        </html>`);
    }
);


console.log("Starting Server");
//Listening to Port 8080; feel free to change this
let server = app.listen(8080);
console.log("Listening on Port 8080 in /auth. Set your Apps Redirect to http://fuf.me:8080/auth");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your application ID? ', (answer) => {
  appId = answer;
  if( regexExp.test(appId) == false){
    console.log("This is not a valid AppId, please try again. You need a uuid, something like this: cab2f25f-c957-4d9d-82e5-999489888310");
    rl.close();
    server.close();
    return;
  } else {
    createdState = uuid.v4();
    console.log(`Here is your URL:  https://agrirouter-qa.cfapps.eu10.hana.ondemand.com/application/${answer}/authorize?response_type=onboard&state=${createdState}`);  
    rl.close();
  }
});

