export default async function handler(req, res) {
  // Sécurité : On n'accepte que les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  // Vérification si la clé est présente sur Vercel
  if (!apiKey) {
    return res.status(500).json({ error: "Configuration manquante : GOOGLE_API_KEY non trouvée." });
  }

  try {
    // Utilisation du modèle 1.5-Flash (plus rapide pour le multi-utilisateur)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    const data = await response.json();

    // Gestion des erreurs spécifiques de l'API Google
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.candidates[0].content.parts[0].text;
    res.status(200).json({ response: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Le système VANTAGE est temporairement saturé. Réessayez." });
  }
}
