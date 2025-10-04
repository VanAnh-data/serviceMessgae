import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

// ✅ Autoriser toutes les origines (pour test)
app.use(cors());
app.use(express.json());
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY =", process.env.SUPABASE_ANON_KEY ? "OK" : "MISSING");

// Connecte-toi à Supabase avec ta clé SERVICE_ROLE (jamais la clé anon côté serveur)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// API endpoint pour recevoir le nom

app.post("/api/send", async (req, res) => {
    const { name, message, participants } = req.body;

    if (!name || !message || !participants) {
        return res.status(400).send("Tous les champs sont requis !");
    }

    const { error } = await supabase
        .from("invitee")
        .insert([{ name, message, participants: parseInt(participants) }]);

    if (error) {
        console.error("Erreur Supabase :", error.message);
        return res.status(500).send("Erreur serveur !");
    }

    res.send("✅ Message envoyé avec succès !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));