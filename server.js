const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Expanded responses for more variety
const responses = [
    {
        type: 'greeting',
        messages: [
            "*SQUAWK* Hello there! Welcome to Polly's chat!",
            "Pretty bird says hello! How are you today?",
            "*CHIRP* Greetings, human friend!"
        ]
    },
    {
        type: 'general',
        messages: [
            "Polly loves to chat about seeds and sunshine!",
            "*SQUAWK* Tell me more about that!",
            "That's fascinating! *preens feathers*",
            "Oh! Polly knows all about that! *bobs head*"
        ]
    },
    {
        type: 'question',
        messages: [
            "Hmm... let me think about that *tilts head*",
            "That's a great question! *flaps wings excitedly*",
            "Polly has been wondering about that too!"
        ]
    }
];

app.post('/api/chat', (req, res) => {
    try {
        // Get message from request
        const userMessage = req.body.message.toLowerCase();
        
        // Select response category
        let category = 'general';
        if (userMessage.includes('hello') || userMessage.includes('hi ')) {
            category = 'greeting';
        } else if (userMessage.includes('?')) {
            category = 'question';
        }
        
        // Get responses for category
        const categoryResponses = responses.find(r => r.type === category).messages;
        
        // Select random response from category
        const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
        
        console.log('User said:', userMessage);
        console.log('Polly responds:', response);
        
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            response: "*SQUAWK* Polly is excited to chat with you!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 