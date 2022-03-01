const sequelize = require('sequelize');
const connection = require('../database/database');

const users = connection.define('users',{
    email:{ 
        type: sequelize.STRING,
        allowNull: false
    },
    password:{
        type:sequelize.STRING,
        allowNull: false
    }
})

users.sync({force: false});

module.exports = users