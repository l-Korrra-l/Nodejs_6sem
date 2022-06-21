const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const hbs = require("express-handlebars").create({
    extname: ".hbs",
    defaultLayout:"index",
    layoutsDir:"views",
})

const PORT= process.env.PORT||3000
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

const appRoutes = require('./routes/appRoutes');

appRoutes(app)

const server = app.listen(PORT)
console.log('server running on 3000 port')
