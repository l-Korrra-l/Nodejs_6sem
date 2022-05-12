const express = require('express');
const app = express();

const officeRoutes = require('./routes/officeRoute')
const customerRoutes = require('./routes/customerRoute')
const productRoutes = require('./routes/productRoute')

app.use(express.json());
app.use(express.static(__dirname + "/views"))

officeRoutes(app);
customerRoutes(app);
productRoutes(app);


app.listen(3000)