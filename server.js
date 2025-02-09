const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Backup responses if API fails
const backupResponses = [
    "*SQUAWK* Hello there!",
    "Pretty bird wants to chat!",
    "*CHIRP* That's interesting!",
    "Polly loves making new friends!"
];

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        
        // Using distilGPT-2, one of the smallest and fastest models
        const response = await fetch(
            'https://api-inference.huggingface.co/models/distilgpt2',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `Human: ${req.body.message}\nParrot: `,
                    parameters: {
                        max_length: 50,
                        temperature: 0.7,
                        top_p: 0.9,
                        return_full_text: false,
                        wait_for_model: true
                    }
                })
            }
        );

        // Log everything for debugging
        console.log('Request sent to:', 'distilgpt2');
        console.log('API Key starts with:', apiKey ? apiKey.substring(0, 4) + '...' : 'missing');
        console.log('API Status:', response.status);
        
        const responseText = await response.text();
        console.log('Raw API Response:', responseText);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);

        let aiResponse;
        if (Array.isArray(data)) {
            aiResponse = data[0].generated_text;
        } else if (typeof data === 'string') {
            aiResponse = data;
        } else {
            aiResponse = data.generated_text || "Polly understood that!";
        }

        // Clean up the response
        aiResponse = aiResponse
            .replace(/^Human:.*\nParrot:\s*/i, '')
            .replace(/Human:/i, '')
            .replace(/Parrot:/i, '')
            .trim();
        
        // Make it more parrot-like
        const prefixes = ["*SQUAWK* ", "Pretty bird! ", "*CHIRP* ", "Polly says: "];
        const suffixes = [" *flaps wings*", " Want a cracker?", " *bobs head*", " *preens feathers*"];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        const parrotResponse = prefix + aiResponse + suffix;
        
        res.json({ response: parrotResponse });

    } catch (error) {
        console.error('Detailed error:', error);
        // Use backup response if API fails
        const backupResponse = backupResponses[Math.floor(Math.random() * backupResponses.length)];
        res.json({ response: backupResponse });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
    console.log('Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!process.env.HUGGING_FACE_API_KEY,
        apiKeyStart: process.env.HUGGING_FACE_API_KEY ? 
            process.env.HUGGING_FACE_API_KEY.substring(0, 4) + '...' : 'missing'
    });
}); 