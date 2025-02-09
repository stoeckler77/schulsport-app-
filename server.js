const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.HUGGING_FACE_API_KEY;
        
        const response = await fetch(
            'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: [{
                        role: "user",
                        content: req.body.message
                    }],
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        trust_remote_code: true
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Extract the response and parrotify it
        let aiResponse = data[0]?.generated_text || "Squawk!";
        const parrotResponse = `*SQUAWK* ${aiResponse} *flaps wings*`;

        res.json({ response: parrotResponse });

    } catch (error) {
        console.error('Error:', error);
        // Fallback response
        res.json({ 
            response: "*SQUAWK* Polly needs a moment to think! Try again!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server starting up...');
}); 