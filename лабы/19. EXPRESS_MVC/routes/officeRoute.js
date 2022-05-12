const customerController = require('../controller/officeController');

module.exports = app => {
    app.get('/offices', customerController.getAll);
    app.post('/offices', customerController.addCustomer);
    app.get('/offices/index', customerController.getPage);
    app.delete('/offices', customerController.deleteCustomer)
}