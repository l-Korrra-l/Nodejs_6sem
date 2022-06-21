const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res)=>{
    var a = new URLSearchParams(req.url)
    console.log(a)
    res.json(a);
});
app.listen(PORT, () =>
{
  console.log(`http://localhost:${PORT}/swagger`);
})
