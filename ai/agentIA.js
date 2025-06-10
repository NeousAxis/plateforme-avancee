// ai/agentIA.js

import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Pour parser le corps des requêtes JSON
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
const endpoint = 'https://api.openai.com/v1/embeddings';
const model = 'text-embedding-ada-002';

// Fonction pour obtenir l'embedding d'un texte (avec gestion des erreurs détaillées)
async function getEmbedding(text) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API OpenAI : ${response.status} - ${errorText}`);
      throw new Error(`Erreur API OpenAI : ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("Erreur lors de la génération d'embedding :", error);
    throw new Error(`Erreur lors de la génération d'embedding : ${error.message || error}`);
  }
}

// Fonction pour calculer la similarité cosinus
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

// Endpoint principal pour calculer la similarité
app.post('/similarity', async (req, res) => {
  const { desc1, desc2 } = req.body;

  if (!desc1 || !desc2) {
    return res.status(400).json({ error: 'Missing desc1 or desc2 in request body' });
  }

  try {
    const [embedding1, embedding2] = await Promise.all([
      getEmbedding(desc1),
      getEmbedding(desc2)
    ]);
    const score = cosineSimilarity(embedding1, embedding2);
    res.json({ score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error computing similarity' });
  }
});

// Démarre le serveur
app.listen(port, () => {
  console.log(`Agent IA server listening at http://localhost:${port}`);
});
