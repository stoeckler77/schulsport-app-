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

// Add model information
const MODEL_INFO = {
    name: 'deepseek-ai/deepseek-chat-instruct',
    version: '1.0'
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        if (!process.env.HUGGING_FACE_API_KEY) {
            throw new Error('API key not configured');
        }

        console.log('Using model:', MODEL_INFO.name);
        console.log('Input message:', req.body.message);

        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_INFO.name}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: `${req.body.language === 'de' ? 'Antworte auf Deutsch: ' : ''}${req.body.message}`,
                options: { 
                    wait_for_model: true,
                    max_length: 100,
                    temperature: 0.7
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Model response:', data);

        res.json({ 
            response: data[0].generated_text,
            model: MODEL_INFO.name
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'An error occurred', 
            details: error.message,
            model: MODEL_INFO.name
        });
    }
});

app.get('/api/model-info', (req, res) => {
    res.json(MODEL_INFO);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Using AI Model:', MODEL_INFO.name);
}); 