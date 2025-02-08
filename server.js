const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add error handling for the chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        if (!process.env.HUGGING_FACE_API_KEY) {
            throw new Error('API key not configured');
        }

        const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
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
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'An error occurred', 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 