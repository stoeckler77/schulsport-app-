const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Simple responses as backup
const backupResponses = [
    "*SQUAWK* Hello there! Let's chat!",
    "Pretty bird wants to know more!",
    "*CHIRP* That's fascinating!",
    "Polly thinks that's interesting!",
    "*RAWWK* Tell me more about that!"
];

// Available models
const MODELS = {
    local: {
        name: 'local',
        displayName: 'Polly Basic',
        description: 'Simple and reliable responses'
    },
    gpt2: {
        name: 'gpt2',
        displayName: 'GPT-2',
        description: 'AI-powered responses (might take longer)'
    }
};

app.post('/api/chat', async (req, res) => {
    try {
        const selectedModel = req.body.model || 'local';
        
        // Use local responses if selected or as fallback
        if (selectedModel === 'local') {
            const response = backupResponses[Math.floor(Math.random() * backupResponses.length)];
            return res.json({ 
                response,
                model: MODELS.local.displayName,
                description: MODELS.local.description
            });
        }

        // Try AI model
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        const response = await fetch(
            'https://api-inference.huggingface.co/models/gpt2',
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

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        let aiResponse = Array.isArray(data) ? data[0].generated_text : data.generated_text;
        
        // Parrotify the response
        const parrotResponse = `*SQUAWK* ${aiResponse} *flaps wings*`;

        res.json({ 
            response: parrotResponse,
            model: MODELS.gpt2.displayName,
            description: MODELS.gpt2.description
        });

    } catch (error) {
        console.error('Error:', error);
        // Fallback to local response on error
        const fallbackResponse = backupResponses[Math.floor(Math.random() * backupResponses.length)];
        res.json({ 
            response: fallbackResponse,
            model: MODELS.local.displayName,
            description: MODELS.local.description + ' (Fallback mode)'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
}); 