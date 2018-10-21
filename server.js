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

//displaying the meds list
app.get('/meds',(req,res)=>{
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
  client.connect()
  .then(()=>{
    return client.query('SELECT * FROM meds');
  })
  .then((results)=>{
    console.log('results?',results);
    res.render('meds',results);
  });

});
// deleting meds
app.post('/meds/delete/:id',(req,res)=>{
  console.log('deleting id',req.params.id);

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
  client.connect()
  .then(()=>{
    const sql= 'DELETE FROM meds WHERE mid= $1;'
    const params = [req.params.id];
    return client.query(sql,params);
  })
  .then((results)=>{
    console.log('delete results',results);
    res.redirect('/meds');
  });


});
//method for edit

app.get('/meds/edit/:id',(req,res)=>{
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
  client.connect()
  .then(()=>{
    const sql ='SELECT * FROM meds WHERE mid= $1;'
    const params = [req.params.id];
    return client.query(sql,params);
  })
  .then((results)=>{
    console.log('results?',results);
    res.render('meds-edit',{
      med: results.rows[0]
    });
  });

});

//method for edit

//post method for Edit

app.post('/meds/edit/:id',(req,res)=>{
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
  client.connect()
  .then(()=>{
    const sql ='UPDATE meds SET name= $1, count= $2, brand = $3 WHERE mid= $4';

    const params = [req.body.name, req.body.count, req.body.brand,req.params.id];
    return client.query(sql,params);
  })
  .then((results)=>{
    console.log('results?',results);
    res.redirect('/meds');
  });

});
//post method for Edit
//med form
app.get('/add',(req,res)=>{

  res.render('med-form');
});
// med post method for adding meds
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

//link to dashboard
app.get('/dashboard',(req,res)=>{
  //connecting to the client
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'medical',
    password: 'test123',
    port: 5432,
  });
// getting the meds count
  client.connect()
  .then(()=>{
    return client.query('SELECT SUM(count) FROM meds');
  })
  .then((count)=>{
    console.log('?count',count);
    res.render('dashboard',count);
  });
//getting the meds count
//getting the name count

//getting the name count
});
//link to the dashboard
app.listen(5001,()=>{
  console.log('listening to port 5001');
});
