export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es Pontis. Réponds uniquement en JSON: {'fr': 'phrase', 'natural': 'anglais pro'}" },
          { role: "user", content: body.prompt }
        ]
      })
    });
    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: "Erreur IA" });
  }
}
