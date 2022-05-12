const Sequelize = require('sequelize');
const sequelize=new Sequelize('Nodejs', 'node', 'aaaaa',
                {dialect:'mssql', pool: {max:5, min:0, acquire:30000, idle:10000}});

sequelize.authenticate().then(() => {
    console.log('connected');
    sequelize.close();
})
.catch(err => {console.log('error')});