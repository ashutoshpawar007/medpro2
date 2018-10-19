const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();

const mustache = mustacheExpress();
mustache.cache=null;
app.engine('mustache',mustache);
app.set('view engine','mustache');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.get('/meds',(req,res)=>{
  res.render('meds');
});

app.get('/add',(req,res)=>{

  res.render('med-form');
});

app.post('/meds/add',(req,res)=>{
  console.log('post body',req.body);

  const client = new Client({

    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
  client.connect()
  .then(()=>{

    console.log('connection complete');
    const sql = 'INSERT INTO meds (name,count,brand) VALUES ($1, $2, $3)'
    const params = [req.body.name,req.body.count,req.body.brand];
    return client.query(sql,params);
  })
  .then((result)=>{
    console.log('result?',result);
    res.redirect('/meds');
  });

});
app.listen(5001,()=>{
  console.log('listening to port 5001');
});
