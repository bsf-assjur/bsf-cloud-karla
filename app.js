import express from "express";
import fetch from "node-fetch"; // se o Render avisar que não existe, eu ajusto
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// ===== Configurações (preencher depois no Render) =====
const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "802116342993509";
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN || "COLOQUE_SEU_TOKEN_AQUI";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bsf-karla-4895";

// Status
app.get("/", (req, res) => {
  res.send("🟢 BSF Cloud Karla em funcionamento.");
});

// Envio manual de mensagem (para testes)
app.post("/send", async (req, res) => {
  const { to, message } = req.body;
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
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro interno" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Rodando na porta ${PORT}`));

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

