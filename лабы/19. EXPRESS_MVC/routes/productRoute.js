const customerController = require('../controller/productController');

module.exports = app => {
    app.get('/products', customerController.getAll);
    app.post('/products', customerController.addCustomer);
    app.get('/products/index', customerController.getPage);
    app.delete('/products', customerController.deleteCustomer)
}