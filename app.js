// ====== BSF Cloud Karla (versão simples) ======
import express from "express";

const app = express();
app.use(express.json());

// Vars vindas do Render (Settings -> Environment)
const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "";
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN || "";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bsf-karla-4895";

// Status
app.get("/", (_req, res) => res.send("🟢 BSF Cloud Karla em funcionamento."));

// (extra) Validação de webhook – já deixa pronto para quando a Meta destravar
app.get("/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

// Enviar mensagem de teste (sem depender do webhook)
app.post("/send", async (req, res) => {
  const { to, message } = req.body || {};
  if (!to || !message) return res.status(400).json({ error: "Informe 'to' e 'message'." });

  try {
    const r = await fetch(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : 400).json(data);
  } catch (e) {
    console.error("Erro ao enviar:", e);
    return res.status(500).json({ error: "Erro interno" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Rodando na porta ${PORT}`));


