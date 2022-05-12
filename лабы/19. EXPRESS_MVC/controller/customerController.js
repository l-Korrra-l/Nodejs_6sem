const sequelize = require('../model/db/db');
const {Customers,Offices,Products } =
  require("../model/Models").ORM(sequelize);

module.exports = {
    async getAll(req, res, next){
      console.log('hu');
       await Customers.findAll().then((customers) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(customers));
          });
    },
    async addCustomer(req, res){
       await Customers.create({ CUST_NUM:Number(req.body.cust_num), COMPANY:req.body.company, CUST_REP:Number(req.body.cust_rep), CREDIT_LIMIT: Number(req.body.credit_limit) })
        .then((task) => {
          console.log(task);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ CUST_NUM:req.body.cust_num, COMPANY:req.body.company, CUST_REP:req.body.cust_rep, CREDIT_LIMIT: req.body.credit_limit })
          );
        })
    },
    async getPage(req, res){
        res.sendFile('C:/Users/User/Documents/Study_6sem/ПСКП/Nodejs_6sem/лабы/19. EXPRESS_MVC/view/customer/index.html')
    },
    async deleteCustomer(req, res){
        await Customers.destroy({ where: { CUST_NUM: Number(req.body.cust_num) } })
        .then(data => {res.status(200).json({deleted_customer: data})})
    },
    async updateCustomer(req, res){
      await Customers.findAll({CUST_NUM:Number(req.body.cust_num)}).then(async (customers) => {
        
        await Customers.update({ COMPANY:req.body.company, CUST_REP:Number(req.body.cust_rep), CREDIT_LIMIT: Number(req.body.credit_limit) }, { where: { CUST_NUM:Number(req.body.cust_num) } })
        .then((task) => {
          console.log(task);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ CUST_NUM:req.body.cust_num, COMPANY:req.body.company, CUST_REP:req.body.cust_rep, CREDIT_LIMIT: req.body.credit_limit })
          );
        });

      }).catch((e)=>{
        console.log(e)
      });

   },
   async getPage(req, res){
       res.sendFile('C:/Users/User/Documents/Study_6sem/ПСКП/Nodejs_6sem/лабы/19. EXPRESS_MVC/view/customer/index.html')
   }
}