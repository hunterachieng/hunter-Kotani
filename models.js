const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('database', 'username', 'password',{
    host: 'localhost',
    dialect: 'sqlite'
})

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
    }catch(error){
        console.error('unable to connect to the database', error);
    }