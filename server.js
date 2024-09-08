import express from 'express';
import fetch from 'node-fetch'; // ou `import axios from 'axios';`
import 'dotenv/config';
import { join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

app.get('/', (_req, res) => {
    let html = readFileSync(join(__dirname, 'public', 'index.html'), 'utf8');
    res.send(html);
});

app.post('/api/search', async (req, res) => {
    const apiKey = process.env.API_KEY;
    const prompt = req.body.prompt;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: {
                        text: "Você é uma IA chamada HealUs..." // Suas instruções personalizadas
                    }
                },
                contents: {
                    parts: {
                        text: prompt
                    }
                }
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        res.status(500).json({ error: 'Erro ao chamar a API' });
    }
});

app.use(express.static(join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
