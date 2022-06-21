const express= require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}))

app.use(express.json())

app.post('/', (req, res, next)=>{
    if(req.body) {
        console.log('req.body = ', req.body || 'no params');
        res.send(`params: ${JSON.stringify(req.body)}`);
    }

    else res.status(400).send('no bodyparser');
})

app.listen(3000);