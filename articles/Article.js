const sequelize = require('sequelize');
const connection = require('../database/database');
const category = require('../categories/Category');

const article = connection.define('articles',{
    title:{
        type:sequelize.STRING,
        allowNull: false
    },slug:{
        type:sequelize.STRING,
        allowNull: false
    },
    body:{
        type:sequelize.TEXT,
        allowNull: false
    }
});

category.hasMany(article);
article.belongsTo(category);

article.sync({force: false}).then(()=>{});

module.exports = article;