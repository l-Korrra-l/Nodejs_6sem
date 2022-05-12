const customerController = require('../controller/customerController');

module.exports = app => {
    app.get('/customers', customerController.getAll);
    app.post('/customers', customerController.addCustomer);
    app.get('/customers/index', customerController.getPage);
    app.delete('/customers', customerController.deleteCustomer);
    app.put('/customers', customerController.updateCustomer);
}