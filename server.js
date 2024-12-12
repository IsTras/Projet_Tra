const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestion_utilisateurs",
});


db.connect((err) => {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL");
});


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Servir les fichiers statiques


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});




app.post("/api/register", async (req, res) => {
    const { prenom, nom, email, password, role = "user" } = req.body;
    if (!prenom || !nom || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (prenom, nom, email, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [prenom, nom, email, hashedPassword, role], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(201).json({ message: "Utilisateur enregistré avec succès." });
    });
});


app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        if (results.length === 0) return res.status(401).json({ message: "Utilisateur non trouvé." });

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }

        res.status(200).json({ message: "Connexion réussie.", user });
    });
});


app.get("/api/admin/users", (req, res) => {
    const sql = "SELECT id, prenom, nom, email, role FROM users";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(200).json(results);
    });
});


app.post("/api/admin/users", async (req, res) => {
    const { prenom, nom, email, role, password } = req.body;
    if (!prenom || !nom || !email || !password || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (prenom, nom, email, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [prenom, nom, email, hashedPassword, role], (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(201).json({ message: "Utilisateur ajouté avec succès." });
    });
});


app.put("/api/admin/users/:id", (req, res) => {
    const { id } = req.params;
    const { prenom, nom, email, role } = req.body;

    const sql = "UPDATE users SET prenom = ?, nom = ?, email = ?, role = ? WHERE id = ?";
    db.query(sql, [prenom, nom, email, role, id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(200).json({ message: "Utilisateur mis à jour." });
    });
});


app.delete("/api/admin/users/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(200).json({ message: "Utilisateur supprimé." });
    });
});


app.put("/api/user/update", (req, res) => {
    const { id, prenom, nom, email } = req.body;

    const sql = "UPDATE users SET prenom = ?, nom = ?, email = ? WHERE id = ?";
    db.query(sql, [prenom, nom, email, id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(200).json({ message: "Informations mises à jour." });
    });
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
