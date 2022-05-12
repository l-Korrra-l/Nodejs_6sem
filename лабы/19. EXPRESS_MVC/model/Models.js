const Sequelize = require('sequelize');
const Model =Sequelize.Model;
const op = Sequelize.Op;

class Customers extends Model{};
class Offices extends Model{};
class Products extends Model{};


function internalORM(sequelize)
{
    Customers.init(
        {
            CUST_NUM:{type:Sequelize.INTEGER, allowNull:false, primaryKey:true},
            COMPANY:{type: Sequelize.STRING, allowNull:false},
            CUST_REP:{type:Sequelize.INTEGER, allowNull:true},
            CREDIT_LIMIT:{type:Sequelize.DECIMAL, allowNull:true},
        },
        {
            sequelize,
            modelName:'Customers',
            tableName:'Customers',
            timestamps: false
        }
    )

    Offices.init(
        {
            ID:{type:Sequelize.INTEGER, allowNull:false, primaryKey:true},
            CITY:{type: Sequelize.STRING, allowNull:false},
            REGION:{type: Sequelize.STRING, allowNull:false},
            SALES:{type:Sequelize.DECIMAL, allowNull:false},
        },
        {
            sequelize,
            modelName:'Offices',
            tableName:'Offices',
            timestamps: false
        }
    );

    Products.init(
        {
            ID:{type:Sequelize.STRING, allowNull:false, primaryKey:true},
            DESCRIPTION:{type: Sequelize.STRING, allowNull:false},
            PRICE:{type:Sequelize.INTEGER, allowNull:false},
            AVAIL:{type: Sequelize.INTEGER, allowNull:false},

        },
        {
            sequelize,
            modelName:'Products',
            tableName:'Products',
            timestamps: false
        }
    );

}
exports.ORM = (s)=>{internalORM(s); return {Customers,Offices,Products};}