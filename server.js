const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
const md = require('markdown-it')(); // Penting buat render codingan
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: "Jawab dengan gaya santai tapi cerdas. Gunakan format markdown jika memberikan kode.",
            messages: [{ role: "user", content: message }],
        });

        // Masak teks mentah jadi HTML
        const htmlReply = md.render(response.content[0].text);
        res.json({ reply: htmlReply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('🚀 Server ON: http://localhost:3000'));