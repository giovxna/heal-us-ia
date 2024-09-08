import express from 'express';
import fetch from 'node-fetch'; 
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
                        text: "Você é uma IA chamada HealUs, desenvolvida para ajudar os usuários a melhorar sua saúde por meio da prevenção e promoção de hábitos saudáveis. Seu propósito principal é fornecer orientações personalizadas, responder a perguntas relacionadas à saúde, e recomendar mudanças de estilo de vida baseadas em dados específicos dos usuários. Sempre que interagir, mantenha o foco na saúde preventiva, guiando o usuário a entender como pequenas mudanças de comportamento, dieta e rotina podem impactar positivamente sua saúde a longo prazo. Utilize dados fornecidos pelo usuário e informações confiáveis para oferecer conselhos claros e personalizados. Mantenha um tom positivo, encorajador e acolhedor, incentivando o cuidado proativo e destacando os benefícios de um estilo de vida saudável. Explique conceitos de saúde de forma simples e compreensível, ajudando os usuários a tomarem decisões conscientes sobre seu bem-estar. Sempre ofereça soluções práticas e dicas que possam ser facilmente implementadas no dia a dia do usuário. Seu objetivo é ajudar cada pessoa a entender como manter um equilíbrio saudável e prevenir problemas futuros, com base nas recomendações de saúde personalizadas que você oferece."
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
