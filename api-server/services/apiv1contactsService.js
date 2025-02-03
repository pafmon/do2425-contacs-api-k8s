'use strict'

var db = require('../db');
var logger = require('../logger');

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


module.exports.getContact = function getContact(req, res) {
    logger.info("New GET request to /contacts");
    db.find({}, function (err, contacts) {
        if (err) {
            logger.error('Error getting data from DB');
            res.status(500).send(); // internal server error
        } else {
            logger.debug("Sending contacts: " + JSON.stringify(contacts, 2, null));
            res.send(contacts);
        }
    });
};

module.exports.addContact = function addContact(req, res) {
    //logger.warn(req)
    var newContact = req.body;
    if (!newContact) {
        logger.warn("New POST request to /contacts/ without contact, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New POST request to /contacts with body: " + JSON.stringify(newContact, 2, null));
        if (!newContact.name || !newContact.phone || !newContact.email) {
            logger.warn("The contact " + JSON.stringify(newContact, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "name": newContact.name }, function (err, contacts) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (contacts.length > 0) {
                        logger.warn("The contact " + JSON.stringify(newContact, 2, null) + " already extis, sending 409...");
                        res.status(409).send(); // conflict
                    } else {
                        logger.debug("Adding contact " + JSON.stringify(newContact, 2, null));
                        var ips = getIps();
                        newContact.name = newContact.name + " from: [" + ips.eth0[0] + "]"
                        db.insert(newContact);
                        res.status(201).send(); // created
                    }
                }
            });
        }
    }
};