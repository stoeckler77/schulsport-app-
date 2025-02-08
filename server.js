const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Debug logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve parrot.png explicitly
app.get('/parrot.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'parrot.png'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        if (!process.env.HUGGING_FACE_API_KEY) {
            throw new Error('API key not configured');
        }

        // Use different model based on language
        const model = req.body.language === 'de' ?
            'facebook/blenderbot-1B-distill' :  // or another model that handles German well
            'facebook/blenderbot-400M-distill';

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: req.body.message,
                options: { 
                    wait_for_model: true,
                    language: req.body.language
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

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

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        hasApiKey: !!process.env.HUGGING_FACE_API_KEY
    });
}); 