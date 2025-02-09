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
        
        // Using Meta's Llama model
        const response = await fetch(
            'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `<s>[INST] ${req.body.message} [/INST]`,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        return_full_text: false
                    }
                })
            }
        );

        console.log('API Status:', response.status);
        const responseText = await response.text();
        console.log('Raw API Response:', responseText);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed API Response:', data);

        let aiResponse;
        if (Array.isArray(data)) {
            aiResponse = data[0].generated_text;
        } else if (typeof data === 'string') {
            aiResponse = data;
        } else {
            aiResponse = data.generated_text || "Polly understood that!";
        }

        // Clean up Llama formatting
        aiResponse = aiResponse.replace(/<s>\[INST\].*?\[\/INST\]/, '').trim();
        
        // Make it more parrot-like
        const prefixes = ["*SQUAWK* ", "Pretty bird! ", "*CHIRP* ", "Polly says: "];
        const suffixes = [" *flaps wings*", " Want a cracker?", " *bobs head*", " *preens feathers*"];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        const parrotResponse = prefix + aiResponse + suffix;
        
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