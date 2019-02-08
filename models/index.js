'use strict';

// this is a bit of sequelize boilerplate. 
// TODO: get intellisense working for these models

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var db = {};

const sequelize = new Sequelize({
    // "username": "sqladmin",
    "username": process.env.dbusername,
    // "password": "123Password!",
    "password": process.env.dbpassword,
    // "database" : "demodb", 
    "database": process.env.db,
    //"host": "sqlsrv.database.windows.net",
    "host": process.env.host,
    "dialect": "mssql",
    "dialectOptions": {
        "encrypt": true
    }
})

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);

    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;