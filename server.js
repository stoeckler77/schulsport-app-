const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Expanded responses with more personality
const responses = {
    greeting: [
        "*CHIRP CHIRP* Oh my goodness, hello there friend! *does a happy little dance*",
        "Pretty bird is so excited to see you! *flutters wings joyfully*",
        "*GENTLE SQUAWK* Welcome back, my wonderful friend! Would you fancy a cracker?",
        "Aww, it's you! *hops closer* Polly has missed our chats! *nuzzles*"
    ],
    
    questions: [
        "*tilts head thoughtfully* Ooh, what an interesting question! *ruffles feathers excitedly* Let me think...",
        "Polly loves when you ask such clever questions! *bounces happily* Here's what I think...",
        "*SOFT CHIRP* That's something I've been wondering about too! *preens feathers while thinking*",
        "Oh my! *flutters wings* That's my favorite kind of question! *does a twirl of joy*"
    ],
    
    food: [
        "*HAPPY SQUAWK* Did someone mention snacks? Polly adores crackers, especially when sharing with friends! *dances excitedly*",
        "Mmm, Polly loves fresh fruits! *delicate nibbling sounds* Would you like to share some mango? It's simply divine!",
        "*gentle head bob* Sunflower seeds are my absolute favorite! *offers one politely* Would you like to try?",
        "Oh! *excited hop* Have you tried papaya? It's wonderfully sweet! *preens contentedly*"
    ],
    
    compliments: [
        "*happy flutter* You're such a wonderful friend! *gentle nuzzle* Polly is so lucky to know you!",
        "Pretty human makes Polly's heart sing! *does a graceful twirl* You're simply the best!",
        "*soft happy chirps* Your kindness makes my feathers all warm and fuzzy! *gentle wing hug*",
        "Aww! *delighted bounce* You always know how to make a parrot blush! *preens happily*"
    ],
    
    activities: [
        "Would you like to see my newest dance? *gracefully sways* I've been practicing just for you!",
        "*melodious whistle* I learned a new song! *bobs head rhythmically* Want to hear it?",
        "Let's play a game! *excited hop* I'm ever so good at peek-a-boo! *playfully hides behind wing*",
        "*gentle squawk* I love showing off my tricks! *spreads wings majestically* Watch this!"
    ],
    
    general: [
        "*interested head tilt* Oh, do tell me more! Polly finds that absolutely fascinating!",
        "How delightful! *gentle wing flutter* Your stories always make me so happy!",
        "*soft happy chirp* What a wonderful thing to share! *preens contentedly*",
        "Polly understands completely! *nods wisely* You're so good at explaining things!",
        "*gentle squawk* That reminds me of something lovely! *bounces excitedly*",
        "Oh my! *flutters wings gently* How absolutely marvelous! Tell me more!"
    ]
};

app.post('/api/chat', (req, res) => {
    try {
        const message = req.body.message.toLowerCase();
        let category = 'general';
        
        // Enhanced category detection
        if (message.includes('hello') || message.includes('hi ') || message.includes('hey') || message.includes('greetings')) {
            category = 'greeting';
        } else if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('why')) {
            category = 'questions';
        } else if (message.includes('food') || message.includes('eat') || message.includes('cracker') || message.includes('hungry')) {
            category = 'food';
        } else if (message.includes('good') || message.includes('nice') || message.includes('love') || message.includes('sweet')) {
            category = 'compliments';
        } else if (message.includes('play') || message.includes('dance') || message.includes('sing') || message.includes('game')) {
            category = 'activities';
        }
        
        // Get random response from category
        const categoryResponses = responses[category];
        const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
        
        console.log('Message:', message);
        console.log('Category:', category);
        console.log('Response:', response);
        
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.json({ 
            response: "*gentle chirp* Oh my! Polly is a bit flustered, but still happy to chat with you! *preens feathers nervously*"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 