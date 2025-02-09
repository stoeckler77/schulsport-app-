const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Backup responses if API fails
const backupResponses = {
    greeting: [
        "*SQUAWK* Hello there, friend!",
        "Pretty bird says hi! *flaps wings*",
    ],
    general: [
        "*CHIRP* That's interesting!",
        "Polly loves making new friends!"
    ]
};

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        if (!apiKey) {
            throw new Error('Hugging Face API key not configured');
        }

        // Using a small, reliable model
        const response = await fetch(
            'https://api-inference.huggingface.co/models/google/flan-t5-small',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `You are a friendly parrot named Polly. Respond to this message in a parrot-like way: ${req.body.message}`,
                    parameters: {
                        max_length: 100,
                        temperature: 0.7,
                        top_p: 0.9
                    }
                })
            }
        );

        console.log('API Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Process the response
        let aiResponse = Array.isArray(data) ? data[0].generated_text : data;
        
        // Make it more parrot-like
        const prefixes = ["*SQUAWK* ", "Pretty bird! ", "*CHIRP* ", "Polly says: "];
        const suffixes = [" *flaps wings*", " Want a cracker?", " *bobs head*", " *preens feathers*"];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        const parrotResponse = prefix + aiResponse + suffix;

        res.json({ response: parrotResponse });

    } catch (error) {
        console.error('Error:', error);
        // Use backup response if API fails
        const category = req.body.message.toLowerCase().includes('hello') ? 'greeting' : 'general';
        const backupCategory = backupResponses[category];
        const backupResponse = backupCategory[Math.floor(Math.random() * backupCategory.length)];
        res.json({ response: backupResponse });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
    console.log('Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!process.env.HUGGING_FACE_API_KEY
    });
}); 