const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type: String, required: true},
  img: {type: String},
  qty: {type: Number, min:[0, "Can't be less than 0"], required: true},
  owned: Boolean
})

const Items= mongoose.model('Items', itemsSchema);

module.exports = Items;
