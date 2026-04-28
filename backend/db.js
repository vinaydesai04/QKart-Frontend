const nedb = require('nedb');
const path = require('path');

// Use path.join to create absolute paths based on the current directory
const usersDbPath = path.join(__dirname, 'db', 'users.db');
const productsDbPath = path.join(__dirname, 'db', 'products.db');

const users = new nedb({ filename: usersDbPath, autoload: true });
const products = new nedb({ filename: productsDbPath, autoload: true });

module.exports.users = users;
module.exports.products = products;