const express = require('express');
const cors = require('cors');
const { connection } = require('./db');

const Reservation = require('./routes/booking.routes');

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

app.use('/', Reservation); 

app.listen(8080, async () => {
  try {
    await connection;
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.log('Could not connect to MongoDB Atlas', error);
  }
  console.log('Server listening on port 8080');
});
