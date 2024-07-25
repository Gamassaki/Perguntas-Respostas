const Sequelize = require('sequelize')

const connection = new Sequelize('guiapergunta', 'root', 'MySQLg@m1t0five',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection