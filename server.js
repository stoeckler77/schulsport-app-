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
    "Polly says: Let me tell you about my favorite seeds..."
];

app.post('/api/chat', (req, res) => {
    try {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        res.json({ response: randomResponse });
    } catch (error) {
        res.status(500).json({ 
            response: "Squawk! Something went wrong!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 