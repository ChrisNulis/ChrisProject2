//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const session = require ('express-session');
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
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, }
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
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)




//___________________
//Controller
//___________________
//Items Controller
//___________________
const itemsController = require ('./controllers/items_controller.js');
app.use('/collections', itemsController);
//___________________
//Users Controller
//___________________
const userController = require('./controllers/users_controller.js');
app.use('/users', userController);
//___________________
//Sessions Controller
//___________________
const sessionsController = require('./controllers/sessions_controller.js');
app.use('/sessions', sessionsController);





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
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
