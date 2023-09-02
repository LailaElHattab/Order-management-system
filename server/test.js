const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/api',(req, res, next) => {
    console.log('Time:', Date.now())
    if(req.header('xx-test') === '1'){
        next();
    }
    else{
        res.status(401).send('pls se');
    }
    
})

app.get('/api/bbbb', (req, res) => {
  console.log(req.body);
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})