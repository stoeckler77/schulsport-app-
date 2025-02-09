const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Expanded local responses by category
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
    
    general: [
        "That's fascinating! Tell me more!",
        "*SQUAWK* How interesting!",
        "Polly understands! *nods wisely*",
        "Oh! That reminds me of something! *excited hop*",
        "Really? *tilts head curiously*"
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