const http = require('http');
const express = require("express");
const { initialize } = require('@oas-tools/core');

const { networkInterfaces } = require('os');

function getIps(){
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results;
}


const serverPort = 8080;
const app = express();
app.use(express.json({limit: '50mb'}));

const config = {
    oasFile: "./api/oas-doc.yaml",
    middleware: {
        security: {
            auth: {
            }
        }
    }
}
var logger = require('./logger');
// Initialize database before running the app
var db = require('./db');
db.connect(function (err, _db) {
  logger.info('Initializing DB...');
  if(err) {
    logger.error('Error connecting to DB!', err);
    setTimeout(function () {process.exit(1); },1000);
  } else {
    db.find({}, function (err, contacts) {
      if(err) {
        logger.error('Error while getting initial data from DB!', err);
      } else {
        if (contacts.length === 0) {
          logger.info('Empty DB, loading initial data...');
          db.init();
      } else {
          logger.info('DB already has ' + contacts.length + ' contacts.');
      }
      }
    });
  }
});

initialize(app, config).then(() => {
    
    app.get('/crash', (req,res) => {
        setTimeout(()=>{console.log("KBOOM!!!");process.exit(1)}, 3000);
        res.send("crashing in 3 seconds...");
    });

    app.get('/ip', (req,res) => {
      var ips = getIps();
      res.send("api-server on IP [" + ips.eth0[0] + "]");
  });

    http.createServer(app).listen(serverPort, () => {
    console.log("\nApp running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (config.middleware.swagger?.disable !== false) {
        console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
        console.log("________________________________________________________________");
    }
    });
});
