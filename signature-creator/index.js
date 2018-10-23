/**
 * Agrirouter onboarding Signature Creator
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
 * Open Postman collection and configure Variables in Prerequest Script of "Onboarding FMIS&Telemetry/01_GetSignature"
 * Send Requests from Postman using "Onboarding FMIS&Telemetry/01_GetSignature"
 */


 //Include required Libraries
let express = require("express");
let forge = require("node-forge");
let bodyParser = require("body-parser");


//Create Express Server
let app = express();

//Using this, we can use req.body. ... for all Parameters we input from Postman request body as JSON
app.use(bodyParser.json());

//The main Procedure; Redirecting the call of Postman to this function and signing the body
app.post("/getSignature", function(req,res)
    {
        console.log("Calling getSignature");
        
        //Read Parameters
        let requestBody = JSON.stringify( req.body.input );
        let privatePEM = req.body.private_key;
        console.log("Input: "+requestBody);
        console.log("PrivateKey: " + privatePEM);

        //Setup Signing
        const keyEncoding = 'utf8';
        const privateKey = forge.pki.privateKeyFromPem( privatePEM );
    
        const md = forge.md.sha256.create();
        md.update( requestBody, keyEncoding );
    
        const onboardVerifySignature = privateKey.sign( md );
        const onboardVerifySignatureHex = forge.util.bytesToHex( onboardVerifySignature );

        console.log("Signature: " + onboardVerifySignatureHex);

        //Return JSON to Postman
        res.send('{"signature": "'+onboardVerifySignatureHex+'"}');
    }
);


console.log("Starting Server");
//Listening to Port 1234; feel free to change this, here and in Postman.
app.listen(1234);