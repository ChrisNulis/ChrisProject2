//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Items = require ('./models/items.js');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;
//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
//___________________
//Middleware
//___________________
//use public folder for static assets
app.use(express.static('public'));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
//___________________
//Starting collection
//___________________
// const startingCollections = [
//    {
//      name: 'Bones',
//      description: 'It\'s just a bag of bones.',
//      img: 'http://bluelips.com/prod_images_large/bones1.jpg',
//      qty: 0,
//      owned: true
//    },
//    {
//      name: 'Bins',
//      description: 'A stack of colorful bins for your beans and bones.',
//      img: 'http://www.clipartbest.com/cliparts/9cz/rMM/9czrMMBcE.jpeg',
//      qty: 1,
//      owned: true
//    }
//  ];

// Items.insertMany(startingCollections, (err, items) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(items);
//     }
//     db.close()
//   })
//___________________
//4. Route for Update
//___________________

app.put('/collections/:id', (req, res) => {
    if(req.body.owned === 'on') {
      req.body.owned = true
    } else {
      req.body.owned = false
    }
    Items.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
        res.redirect('/collections')
    })
})

//___________________
//5. Route for Edit
//___________________
app.get("/collections/:id/edit", (req, res) => {
  Items.findById(req.params.id, (err, foundItem) => {
      res.render(
        "edit.ejs",
        {
          items: foundItem
        }
      )
  })

})

//___________________
//7. Route for Delete
//___________________
app.delete('/collections/:id', (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect('/collections');
  })

})





//___________________
// Routes
//___________________
//localhost:3000
app.get('/' , (req, res) => {
  res.send('Hello World!');
});

//___________________
//2 Route for Index
//___________________
app.get('/collections', (req, res) => {
  Items.find({}, (err, allItems) => {
    res.render(
      'index.ejs',
      {
        items:allItems
      }
    )
  })

})

//____________________
//1Route for New
//____________________
app.get('/collections/new', (req, res) => {
 res.render('new.ejs');
});



//___________________
//3 Route for Show
//___________________
app.get('/collections/:id', (req, res) => {
  Items.findById(req.params.id, (err, foundItem) => {
    res.render(
      'show.ejs',
      {
        items:foundItem
      }
    )
  })
})

//___________________
//6. Post Route for Create
//___________________
app.post('/collections', (req, res) => {
  if(req.body.owned === 'on'){
    req.body.owned = true;
  } else {
    req.body.owned = false;
  }
  Items.create(req.body, (err, createdItem) => {
      res.redirect('/collections')
  })
})








//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
