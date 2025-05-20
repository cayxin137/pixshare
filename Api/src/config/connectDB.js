const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pixshare', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('connection success');
    } catch (e) {
        console.log('unable: ', e);
    }
}
module.exports = connectDB;