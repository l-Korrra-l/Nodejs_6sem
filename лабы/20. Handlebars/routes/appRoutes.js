const appController = require('../controllers/appController')

module.exports = app =>{
    app.get('/',appController.returnViewIndex)
    app.get('/add',appController.returnViewAdd)
    app.post('/add',appController.addNumber)
    app.get('/update/:name/:number',appController.returnViewUpdate)
    app.put('/update',appController.updateNumber),
    app.delete('/delete/:number',appController.deleteNumber)
}