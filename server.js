const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Categories of responses for different topics
const responses = {
    greeting: [
        "*SQUAWK* Hello there, friend!",
        "Pretty bird says hi! *flaps wings*",
        "Greetings, human! Want a cracker?",
        "*CHIRP* Welcome back! I missed you!"
    ],
    
    questions: [
        "Hmm... *tilts head* That's a good question!",
        "Polly knows! *excited hop* Let me tell you...",
        "*SQUAWK* I've been thinking about that too!",
        "Oh! That's my favorite topic! *preens feathers*"
    ],
    
    food: [
        "Crackers are my favorite! *excited dance*",
        "*SQUAWK* I love fresh fruits and seeds!",
        "Have you tried mango? It's delicious! *happy chirp*",
        "Sunflower seeds are the best! Want to share?"
    ],
    
    tricks: [
        "*SQUAWK* Watch this! *does a twirl*",
        "Polly can dance! *bobs head rhythmically*",
        "Want to see my best trick? *spreads wings*",
        "*CHIRP* I can sing too! La la la!"
    ],
    
    compliments: [
        "*CHIRP* You're such a good friend!",
        "Pretty human! *happy dance*",
        "You make Polly so happy! *flaps wings*",
        "*SQUAWK* I like you too!"
    ],
    
    general: [
        "That's fascinating! Tell me more!",
        "*SQUAWK* How interesting!",
        "Polly understands! *nods wisely*",
        "Oh! That reminds me of something! *excited hop*",
        "Really? *tilts head curiously*",
        "Polly loves chatting about that! *preens feathers*",
        "*CHIRP* What a wonderful conversation!"
    ]
};

app.post('/api/chat', (req, res) => {
    try {
        const message = req.body.message.toLowerCase();
        let category = 'general';
        
        // Determine message category
        if (message.includes('hello') || message.includes('hi ') || message.includes('hey')) {
            category = 'greeting';
        } else if (message.includes('?')) {
            category = 'questions';
        } else if (message.includes('food') || message.includes('eat') || message.includes('cracker')) {
            category = 'food';
        } else if (message.includes('trick') || message.includes('dance') || message.includes('sing')) {
            category = 'tricks';
        } else if (message.includes('good') || message.includes('nice') || message.includes('love')) {
            category = 'compliments';
        }
        
        // Get random response from category
        const categoryResponses = responses[category];
        const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
        
        console.log('Message:', message);
        console.log('Category:', category);
        console.log('Response:', response);
        
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            response: "*SQUAWK* Polly is happy to chat with you!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 