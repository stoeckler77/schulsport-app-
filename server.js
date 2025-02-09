const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Single array of simple responses
const responses = [
    "Hello! I'm Polly!",
    "Would you like a cracker?",
    "Pretty bird loves to chat!",
    "Squawk! Tell me more!",
    "That's interesting! *flaps wings*"
];

app.post('/api/chat', (req, res) => {
    // Log the incoming request
    console.log('Received message:', req.body.message);
    
    // Pick a random response
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Log the response
    console.log('Sending response:', response);
    
    // Send it back
    res.json({ response: response });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
}); 