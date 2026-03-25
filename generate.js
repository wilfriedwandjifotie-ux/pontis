export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { prompt } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const result = data.candidates[0].content.parts[0].text;
    res.status(200).json({ response: result });
  } catch (error) {
    res.status(500).json({ error: "L'IA est fatiguée, vérifie ta clé API." });
  }
}
