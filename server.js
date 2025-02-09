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
        
        // Log API key presence (first few characters only)
        console.log('API Key starts with:', apiKey ? apiKey.substring(0, 4) + '...' : 'missing');
        
        if (!apiKey) {
            throw new Error('API key not configured');
        }

        // Log the attempt
        console.log('Attempting API call with message:', req.body.message);

        const response = await fetch(
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: req.body.message
                })
            }
        );

        // Log the API response status
        console.log('API Response Status:', response.status);

        // Get the raw response text
        const responseText = await response.text();
        console.log('Raw API Response:', responseText);

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}: ${responseText}`);
        }

        // Parse the response
        const data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);

        const aiResponse = data[0].generated_text;
        const parrotResponse = `*SQUAWK* ${aiResponse} *flaps wings*`;

        res.json({ response: parrotResponse });

    } catch (error) {
        // Log the full error
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({ 
            response: "*SQUAWK* Polly is having trouble connecting to her brain! Please check the logs!",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
    console.log('Environment check:', {
        hasApiKey: !!process.env.HUGGING_FACE_API_KEY,
        apiKeyStart: process.env.HUGGING_FACE_API_KEY ? 
            process.env.HUGGING_FACE_API_KEY.substring(0, 4) + '...' : 'missing'
    });
}); 