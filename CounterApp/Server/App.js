// express-server/app.js
//const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Server-side code

const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const CLIENT_ID = '501637194300-mq1ggjtibp0bqk1v91uetihjckd6jdn1.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.use(bodyParser.json());
app.post('/auth/google', async (req, res) => {
    const token = req.body.token;
    try {
      const payload = await verifyGoogleToken(token);
      if (payload) {
        // Token is valid, proceed with user authentication and session management
        // For example, you can generate a JWT token and send it back to the client
        res.status(200).json({ success: true, payload });
      } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error verifying Google token:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

  async function verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return null;
    }
  }

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://0.0.0.0:27017/counter_db')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    mycount: {type: Number, default: 0}
},{ collection: 'counters' });
const Counter = mongoose.model('Counter', counterSchema);

// Routes
app.get('/api/counter', async (req, res) => {
    console.log("Reached GET method")
    try {
        
        const counter = await Counter.findOne();
        console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/increment', async (req, res) => {
    console.log("Reached post inc method")
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count++;
        counter.mycount++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement', async (req, res) => {
    console.log("Reached post dec method")
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count--;
        counter.mycount--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
