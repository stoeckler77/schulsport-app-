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

        // Using a different, more reliable model
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {
                    text: req.body.message
                },
                parameters: {
                    max_length: 50,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response Data:', data);

        // Extract the response text
        const aiResponse = data[0]?.generated_text || data?.generated_text || "Squawk! That's interesting!";
        
        res.json({ 
            response: aiResponse,
            status: 'success'
        });

    } catch (error) {
        console.error('Error:', error);
        
        // Use backup response if API fails
        const backupResponse = backupResponses[Math.floor(Math.random() * backupResponses.length)];
        
        res.json({ 
            response: backupResponse,
            status: 'using backup',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API Key present:', !!process.env.HUGGING_FACE_API_KEY);
}); 