const sequelize = require('../model/db/db');
const {Customers,Offices,Products } =
  require("../model/Models").ORM(sequelize);

module.exports = {
    async getAll(req, res, next){
      console.log('hu');
       await Products.findAll().then((customers) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(customers));
          });
    },
    async addCustomer(req, res){
       console.log({ ID: typeof req.body.ID, DESCRIPTION: typeof req.body.DESCRIPTION,PRICE: typeof req.body.PRICE, AVAIL: typeof req.body.AVAIL })
       await Products.create({ ID:req.body.ID, DESCRIPTION: req.body.DESCRIPTION, PRICE: Number(req.body.PRICE), AVAIL: Number(req.body.AVAIL) })
        .then((task) => {
          console.log(task);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ ID:req.body.ID, DESCRIPTION:req.body.DESCRIPTION, PRICE: req.body.PRICE, AVAIL: req.body.AVAIL })
          );
        }).catch((e)=>{console.log(e)})
    },
    async getPage(req, res){
        res.sendFile('C:/Users/User/Documents/Study_6sem/ПСКП/Nodejs_6sem/лабы/19. EXPRESS_MVC/view/product/index.html')
    },
    async deleteCustomer(req, res){
        await Products.destroy({ where: { ID: req.body.id} })
        .then(data => {res.status(200).json({deleted_prod: data})})
    }
}