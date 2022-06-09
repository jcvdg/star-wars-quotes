const express = require('express');
const bodyParser= require('body-parser');
// const res = require('express/lib/response');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


// MongoClient.connect(connectionString, (err, client) => {
//   if (err) return console.error(err)
//   console.log('Connected to Database')
// });
MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    /*****----------------------------------
           All your handlers here...
    ----------------------------------*****/

    // set our view engine to ejs, as our template engine.
    app.set('view engine', 'ejs');

    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));

    // tells Express to make our public folder accessible to the public by using the built-in middleware, express.static
    app.use(express.static('public'));

    // allows our server to read JSON data
    app.use(bodyParser.json());
    
    
      // app.get('/', (req, res) => {
      //     res.send('Hello World')
      // })
      app.get('/', (req, res) => {
        // const cursor = db.collection('quotes').find().toArray(); // cursor contains all quotes in the db
        quotesCollection.find().toArray()
        .then(results => {
          // console.log(results);
          res.render('index.ejs', { quotes: results });
        })
        .catch(error => console.error(error));
        
        
        // res.sendFile(__dirname + '/index.html')
        // Note: __dirname is the current directory you're in. Try logging it and see what you get!
        // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
        // this replaces the sendFile as we're trying to modify the html (via the EJS engine
        // res.render('index.ejs', {}); ----- > moved to above after we've added quotes to the DB collection


      })

    app.post('/quotes', (req, res) => {
      // console.log('Hellooooooooooooooooo!')
      // console.log(req.body)

      quotesCollection.insertOne(req.body)
        .then( result => {
          // console.log(result)
          res.redirect('/'); // it'll take us back to the index.html after adding to the collection
        })
        .catch(error => console.error(error));

    });

    app.put('/quotes', (req, res) => {
      console.log(req.body)

      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
          res.json('Success');
        })
        .catch(error => console.error(error));
    });



    app.delete('/quotes', (req,res) => {
      quotesCollection.deleteOne (
        { name: req.body.name}
      )
          .then( result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete');
            }
            res.json(`Deleted Darth Vadar's quote`);
          })
          .catch( error => console.error(error));
    });
    // app.delete('/quotes', (req, res) => {
    //   quotesCollection.deleteOne(
    //     { name: req.body.name }
    //   )
    //     .then(result => {
    //       if (result.deletedCount === 0) {
    //         return res.json('No quote to delete')
    //       }
    //       res.json('Deleted Darth Vadar\'s quote')
    //     })
    //     .catch(error => console.error(error))
    // })

    // console.log('may node be with you');
    app.listen(8000, function() {
      console.log('listening on 8000')
    });


  })
  .catch(error => console.error(error));



