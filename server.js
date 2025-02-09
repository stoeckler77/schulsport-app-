const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Available models with descriptions
const MODELS = {
    gpt2: {
        name: 'gpt2',
        displayName: 'GPT-2',
        description: 'Classic language model good at general text generation'
    },
    distilgpt2: {
        name: 'distilgpt2',
        displayName: 'DistilGPT-2',
        description: 'Lighter, faster version of GPT-2'
    },
    bloom: {
        name: 'bigscience/bloom-560m',
        displayName: 'BLOOM',
        description: 'Multilingual model good at various tasks'
    }
};

async function queryModel(model, message, apiKey, retries = 2) {
    const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_length: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        }
    );

    const result = await response.json();

    if (response.status === 503 && retries > 0) {
        // Model is loading, wait and retry
        const waitTime = (result.estimated_time || 20) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return queryModel(model, message, apiKey, retries - 1);
    }

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return result;
}

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
        const selectedModel = MODELS[req.body.model || 'gpt2'];
        
        console.log('Using model:', selectedModel.displayName);

        const data = await queryModel(selectedModel.name, req.body.message, apiKey);
        
        let aiResponse;
        if (Array.isArray(data)) {
            aiResponse = data[0].generated_text;
        } else if (typeof data === 'string') {
            aiResponse = data;
        } else if (data.generated_text) {
            aiResponse = data.generated_text;
        } else {
            console.log('Unexpected response format:', data);
            aiResponse = "Polly understood that!";
        }

        // Make response more parrot-like
        const parrotPrefixes = ["*SQUAWK* ", "Pretty bird! ", "*CHIRP* ", "Polly says: "];
        const parrotSuffixes = [" *flaps wings*", " Want a cracker?", " *bobs head*", ""];
        const prefix = parrotPrefixes[Math.floor(Math.random() * parrotPrefixes.length)];
        const suffix = parrotSuffixes[Math.floor(Math.random() * parrotSuffixes.length)];
        
        const parrotResponse = prefix + aiResponse + suffix;

        res.json({ 
            response: parrotResponse,
            model: selectedModel.displayName,
            description: selectedModel.description
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            response: "*SQUAWK* Polly needs a moment to think! Try again!",
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