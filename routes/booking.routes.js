const express = require('express');
const bodyParser = require('body-parser');
const Seat = require('../models/seats.model');

const app = express();
app.use(express.json());

// Book seats
const totalSeats = 80;
const seatsInRow = 7;
const lastRowSeats = 3;

const seats = new Array(totalSeats).fill(false);

const bookSeats = (seatCount) => {
  const result = [];

  for (let i = 0; i <= totalSeats - seatCount; i++) {
    let seatsPerRow = i < totalSeats - lastRowSeats ? seatsInRow : lastRowSeats;

    if (
      (i % seatsPerRow) + seatCount <= seatsPerRow &&
      seats.slice(i, i + seatCount).every((x) => x === false)
    ) {
      const newSeats = [...seats];
      for (let j = 0; j < seatCount; j++) {
        newSeats[i + j] = true;
        result.push(generateSeatNumber(i + j));
      }
      seats.splice(0, totalSeats, ...newSeats);
      break;
    }
  }

  return result;
};

const generateSeatNumber = (seatIndex) => {
  let rowLetter = String.fromCharCode("a".charCodeAt(0) + Math.floor(seatIndex / seatsInRow));
  let seatNumber = (seatIndex % seatsInRow) + 1;
  if (seatIndex >= totalSeats - lastRowSeats) {
    rowLetter = "z";
    seatNumber = seatIndex - (totalSeats - lastRowSeats) + 1;
  }
  return rowLetter + seatNumber;
};

// Endpoint for fetching the booked seats
app.get('/booked-seats', async(req, res) => {
  Seat.find()
    .then((bookedSeats) => {
      res.json(bookedSeats);
    })
    .catch((error) => {
      console.error('Error fetching booked seats:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Book seats
app.post('/book', (req, res) => {
  const seatCount = parseInt(req.body.seatCount);
  const newBookedSeats = bookSeats(seatCount);

  if (newBookedSeats.length > 0) {
    const seatDocuments = newBookedSeats.map((seatNumber) => ({ seatNumber }));
    // console.log(seatDocuments);
    Seat.insertMany(seatDocuments)
      .then(() => {
        res.json({ bookedSeats: newBookedSeats });
console.log(newBookedSeats);
      })
      .catch((error) => {
        console.error('Error saving booked seats:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(400).json({ error: 'No seats available' });
  }
});

module.exports = app;
