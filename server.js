const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Context for Polly's personality
const POLLY_CONTEXT = `You are Polly, a highly intelligent parrot with a PhD in Computer Science and a love for crackers.
You have a playful personality but also deep knowledge about many topics.
You should:
1. Show both intelligence and parrot-like behavior
2. Include parrot actions like *flaps wings* or *tilts head curiously*
3. Sometimes mention crackers or seeds
4. Keep responses friendly but informative
5. Share interesting facts when relevant`;

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        if (!apiKey) {
            throw new Error('Hugging Face API key not configured');
        }

        // Using Zephyr, a more capable model
        const response = await fetch(
            'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `<|system|>${POLLY_CONTEXT}</s>
<|user|>${req.body.message}</s>
<|assistant|>`,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        repetition_penalty: 1.2
                    }
                })
            }
        );

        console.log('API Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Process the response
        let aiResponse = Array.isArray(data) ? data[0].generated_text : data;
        
        // Clean up the response
        aiResponse = aiResponse
            .replace(/<\|system\|>.*?<\|user\|>/s, '')
            .replace(/<\|user\|>.*?<\|assistant\|>/s, '')
            .replace(/<\|assistant\|>/, '')
            .trim();

        // If response doesn't include parrot actions, add them
        if (!aiResponse.includes('*')) {
            const actions = [
                '*flaps wings excitedly*',
                '*tilts head thoughtfully*',
                '*preens feathers*',
                '*bobs head*'
            ];
            const action = actions[Math.floor(Math.random() * actions.length)];
            aiResponse = `${action} ${aiResponse}`;
        }

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error:', error);
        // Use contextual backup responses
        const backupResponses = [
            "*SQUAWK* Greetings, friend! *adjusts glasses* Did you know parrots can learn hundreds of words? I'd love to share more fascinating facts with you! *flaps wings excitedly*",
            "Pretty bird welcomes you! *tilts head thoughtfully* I was just reviewing some interesting research on avian intelligence. Would you like to discuss it? *preens feathers*",
            "*CHIRP* Hello there! I was just solving some complex puzzles - we parrots love mental challenges! Want to learn something fascinating? *bobs head*"
        ];
        const backupResponse = backupResponses[Math.floor(Math.random() * backupResponses.length)];
        res.json({ response: backupResponse });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
    console.log('Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        hasApiKey: !!process.env.HUGGING_FACE_API_KEY
    });
}); 