const express = require('express'); 
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

//Fixation du port
const port = 3000;
//Configuration des parametres de connexion mysql
const con = mysql.createConnection({
    host: 'localhost',     
    user: 'root', 
    password: '',
    database: 'nodebd',
  });

  con.connect((err) => {
    if (err) {
      console.error('Erreur de connexion :', err.message);
      return;
    }
    console.log('Connexion réussie à MySQL !');
  });

  //middleware 
  app.use(bodyparser.json());
  app.use(express.static('public'));

  //Route pour enregistrer les donnees
  app.post('/api/etudiant',(req,res)=>{
    const{matricule,prenom,nom,filiere,niveau}=req.body;
    const sql = 'INSERT INTO etudiant(matricule, prenom, nom, filiere, niveau) VALUES(?,?,?,?,?)';
    con.query(sql,[matricule,prenom,nom,filiere,niveau],(error,results)=>{
        if (error){
            return res.status(500).send(error);
        }
        res.status(200).json({message:'Enregistrement effectuee avec succees', results});
    });

  });
  //Route principale
  app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public',userForm.html));
  });


  //Demarrage du serveur
  app.listen(port,()=>{
    console.log(`serveur en cours d execussion sur http://localhost:${port}`);
  });