const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Store API key in environment variable
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: req.body.message,
                options: { wait_for_model: true }
            })
        });
        
        const data = await response.json();
        res.json({ response: data[0].generated_text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 