document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;

    // Envoi des données au serveur
    fetch('/api/client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prenom, nom })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erreur lors de l\'enregistrement des données.');
    })
    .then(data => {
        console.log('Succès:', data);
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });
});
