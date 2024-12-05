//Ajout des modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
//Fixation du port
const PORT = 3000;

// Configuration de la connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodebd'
});
// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données: ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données avec l\'ID ' + db.threadId);
});
// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour enregistrer les données
app.post('/api/etudiant', (req, res) => {
    const { matricule, prenom, nom ,filiere,niveau} = req.body;

    const query = 'INSERT INTO etudiant (matricule,prenom, nom,filiere,niveau) VALUES (?,?,?,?,?)';
    db.query(query, [matricule,prenom, nom,filiere,niveau], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Utilisateur enregistré avec succès!', results });
    });
});

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userForm.html'));
});

// Route pour récupérer la liste des utilisateurs
app.get('/api/etudiant', (req, res) => {
    const query = 'SELECT matricule, prenom, nom,filiere,niveau  FROM client';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(results); // Renvoyer la liste des utilisateurs en JSON
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});