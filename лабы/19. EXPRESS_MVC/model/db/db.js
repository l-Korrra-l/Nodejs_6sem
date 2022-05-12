const Sequelize = require("sequelize");
const sequelize = new Sequelize(    {
  username: 'node',
  password: 'aaaaa',
  database: 'Exec_control',
  host:     'localhost',
  dialect:  'mssql',
  logging: false,
  pool:
      {
          max: 10,
          min: 0,
          idle: 10000
      }
});

// 

module.exports = sequelize;