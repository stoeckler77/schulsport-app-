const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Backup responses in case API fails
const backupResponses = [
    "Hello! I'm a friendly parrot!",
    "Would you like a cracker?",
    "I love to chat with humans!"
];

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        
        if (!apiKey) {
            throw new Error('API key is missing');
        }

        // Changed the model and request format
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: req.body.message
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        res.json({ 
            response: data[0].generated_text || "Squawk! That's interesting!"
        });

    } catch (error) {
        console.error('Full error:', error);
        res.status(500).json({ 
            error: 'Error communicating with AI',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API Key present:', !!process.env.HUGGING_FACE_API_KEY);
}); 