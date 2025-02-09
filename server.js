const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Available models with descriptions
const MODELS = {
    blenderbot: {
        name: 'facebook/blenderbot-400M-distill',
        displayName: 'BlenderBot',
        description: 'Friendly chatbot good at casual conversation'
    },
    deepseek: {
        name: 'deepseek-ai/deepseek-chat-instruct',
        displayName: 'DeepSeek Chat',
        description: 'Advanced model for detailed conversations'
    },
    deepseekR1: {
        name: 'deepseek-ai/DeepSeek-R1',
        displayName: 'DeepSeek R1',
        description: 'Latest DeepSeek model with enhanced capabilities'
    }
};

app.get('/api/models', (req, res) => {
    res.json(MODELS);
});

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
        const selectedModel = MODELS[req.body.model || 'blenderbot'];
        
        console.log('Using model:', selectedModel.displayName);

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${selectedModel.name}`,
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
            const errorText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data[0].generated_text;
        const parrotResponse = `*SQUAWK* ${aiResponse} *flaps wings*`;

        res.json({ 
            response: parrotResponse,
            model: selectedModel.displayName,
            description: selectedModel.description
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            response: "*SQUAWK* Polly is having trouble with that model! Try another one!",
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