const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seat: Number,
  isBooked:{
    type:Boolean,
    default:false
  }
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
