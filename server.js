const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Simple responses without API
const responses = [
    "*SQUAWK* Hello! I'm a friendly parrot!",
    "*CHIRP* Would you like a cracker?",
    "Pretty bird! I love to chat with humans!",
    "*RAWWK* What a beautiful day for flying!",
    "Polly says: Let me tell you about my favorite seeds...",
    "*SQUAWK* Did you know parrots are very intelligent?",
    "Clever bird! I can mimic many sounds! *flaps wings*",
    "*CHIRP* Want to learn a bird dance?",
    "RAWWK! That's interesting! *bobs head*"
];

app.post('/api/chat', (req, res) => {
    try {
        console.log('Received message:', req.body.message);
        
        // Get a random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        console.log('Sending response:', randomResponse);
        
        res.json({ 
            response: randomResponse,
            status: 'success'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            response: "Squawk! Something went wrong!",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 