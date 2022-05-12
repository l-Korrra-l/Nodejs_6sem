const sequelize = require('../model/db/db');
const {Customers,Offices,Products } =
  require("../model/Models").ORM(sequelize);

module.exports = {
    async getAll(req, res, next){
       await Offices.findAll().then((customers) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(customers));
          });
    },
    async addCustomer(req, res){
       await Offices.create({ ID:Number(req.body.ID), CITY:req.body.CITY, REGION:req.body.REGION, SALES: Number(req.body.SALES) })
        .then((task) => {
          console.log(task);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ ID:Number(req.body.ID), CITY:req.body.CITY, REGION:req.body.REGION, SALES: Number(req.body.SALES) })
          );
        })
    },
    async getPage(req, res){
        res.sendFile('C:/Users/User/Documents/Study_6sem/ПСКП/Nodejs_6sem/лабы/19. EXPRESS_MVC/view/office/index.html')
    },
    async deleteCustomer(req, res){
        await Offices.destroy({ where: { ID: Number(req.body.id) } })
        .then(data => {res.status(200).json({deleted_customer: data})}).catch((e)=>{console.log(e)})
    }
}