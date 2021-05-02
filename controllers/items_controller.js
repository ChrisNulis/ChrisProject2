const express = require('express');
const router = express.Router();
const Items = require('../models/items.js');

const isAuthenticated = (res, req, next) => {
  if (req.session.currentUser) {
    return next()
    } else {
      res.redirect('/sessions/new')
    }
  }
//___________________
//4. Route for Update
//___________________
router.put('/:id', (req, res) => {
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
router.get("/:id/edit", (req, res) => {
  Items.findById(req.params.id, (err, foundItem) => {
      res.render(
        "edit.ejs",
        {
          items: foundItem
          ,currentUser: req.session.currentUser
        }
      )
  })
})
//___________________
//7. Route for Delete
//___________________
router.delete('/:id', (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect('/collections');
  })
})
//___________________
// Routes
//___________________
//localhost:3000
// app.get('/' , (req, res) => {
//   res.send('Hello World!');
// });

//___________________
//2 Route for Index
//___________________
router.get('/', (req, res) => {
  Items.find({}, (err, allItems) => {
    res.render(
      'index.ejs',
      {
        items:allItems,
            currentUser: req.session.currentUser,
      }
    )
  })
})
//____________________
//1Route for New
//____________________
router.get('/new', (req, res) => {
 res.render(
   'new.ejs'
 , {currentUser: req.session.currentUser}
);
});
//___________________
//3 Route for Show
//___________________
router.get('/:id', (req, res) => {
    Items.findById(req.params.id, (err, foundItem) => {
      res.render(
        'show.ejs',
        {
          items:foundItem,
          currentUser: req.session.currentUser,
        })
      })
})
//___________________
//6. Post Route for Create
//___________________
router.post('/', (req, res) => {
  if(req.body.owned === 'on'){
    req.body.owned = true;
  } else {
    req.body.owned = false;
  }
  Items.create(req.body, (err, createdItem) => {
      res.redirect('/collections')
  })
})













module.exports = router;
