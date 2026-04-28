// 1. Patch for modern Node.js versions on Render
const util = require('util');
util.isDate = util.types.isDate; 

// 2. Standard database setup
const nedb = require('nedb');
const path = require('path');

const usersDbPath = path.join(__dirname, 'db', 'users.db');
const productsDbPath = path.join(__dirname, 'db', 'products.db');

const users = new nedb({ filename: usersDbPath, autoload: true });
const products = new nedb({ filename: productsDbPath, autoload: true });

module.exports.users = users;
module.exports.products = products;