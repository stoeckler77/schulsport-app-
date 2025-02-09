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
        
        // Using a smaller, hosted model
        const response = await fetch(
            'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-125m',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: req.body.message,
                    parameters: {
                        max_length: 50,
                        temperature: 0.7,
                        return_full_text: false
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

        let aiResponse;
        if (Array.isArray(data)) {
            aiResponse = data[0].generated_text;
        } else if (typeof data === 'string') {
            aiResponse = data;
        } else {
            aiResponse = data.generated_text || "Polly understood that!";
        }

        const parrotResponse = `*SQUAWK* ${aiResponse} *flaps wings*`;
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
    console.log('Server starting up...');
    console.log('API Key present:', !!process.env.HUGGING_FACE_API_KEY);
}); 