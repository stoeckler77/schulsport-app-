const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Backup responses in case the API fails
const backupResponses = [
    "*SQUAWK* Hello there!",
    "Pretty bird wants a cracker!",
    "Polly loves to chat!"
];

// Function to make responses more parrot-like
function parrotify(text) {
    const prefixes = ["*SQUAWK* ", "Pretty bird! ", "*CHIRP* ", "Polly says: "];
    const suffixes = [" *flaps wings*", " Want a cracker?", " *bobs head*", ""];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return prefix + text + suffix;
}

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        
        if (!apiKey) {
            throw new Error('API key not configured');
        }

        console.log('Sending to API:', req.body.message);

        const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: req.body.message,
                    options: {
                        wait_for_model: true
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        // Get the AI response and parrotify it
        const aiResponse = data[0].generated_text;
        const parrotResponse = parrotify(aiResponse);

        res.json({ response: parrotResponse });

    } catch (error) {
        console.error('Error:', error);
        // Use backup response if API fails
        const backupResponse = backupResponses[Math.floor(Math.random() * backupResponses.length)];
        res.json({ response: backupResponse });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API Key present:', !!process.env.HUGGING_FACE_API_KEY);
}); 