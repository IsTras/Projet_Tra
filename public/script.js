//test du bouton 
document.getElementById("userForm").addEventListener('submit',function(event){
    //recuperation des valeurs
    const matricule = document.getElementById('matricule').value;
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const filiere = document.getElementById('filiere').value;
    const niveau = document.getElementById('niveau').value;
    //envoyer les donnees aux serveurs
    fetch('/api/etudiant',{
        method:'POST',
        headers:{'content-type':'application/json',

        },
        body:JSON.stringify({
            matricule,prenom,nom,filiere,niveau
        })
    })
        .then(response=>{
            if(response.ok){
                return response.json
            }
            throw new Error('impossible d enregistrer les donnees');
        })
        .then(data=>{
            console.log ('enregistrement effectuee',data);
        }
        )
        .catch((error)=>{
            console.error('erreur du serveur',error);
        })

    
});