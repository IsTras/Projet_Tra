const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fonction générique pour faire des requêtes à l'API
 */
async function fetchAPI(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response.json();
}

/**
 * Gestion du formulaire d'inscription
 */
document.getElementById("form-register")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;

    try {
        const result = await fetchAPI("/register", "POST", { prenom, nom, email, password });
        alert(result.message || "Inscription réussie !");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        alert("Une erreur est survenue lors de l'inscription.");
    }
});

/**
 * Gestion du formulaire de connexion
 */
document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;

    try {
        const result = await fetchAPI("/login", "POST", { email, password });

        if (result.user) {
            localStorage.setItem("user", JSON.stringify(result.user));
            alert(result.message);

            if (result.user.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "user.html";
            }
        } else {
            alert(result.message || "Erreur lors de la connexion.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue lors de la connexion.");
    }
});

/**
 * Déconnexion
 */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

/**
 * Chargement des utilisateurs pour la page admin
 */
async function loadUsers() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
        alert("Accès non autorisé.");
        window.location.href = "login.html";
        return;
    }

    try {
        const users = await fetchAPI("/admin/users");
        const tbody = document.querySelector("#user-table tbody");
        tbody.innerHTML = ""; // Vider le tableau

        users.forEach((u) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.prenom}</td>
                <td>${u.nom}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Supprimer</button>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${u.id}, '${u.prenom}', '${u.nom}', '${u.email}', '${u.role}')">Modifier</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        alert("Une erreur est survenue lors du chargement des utilisateurs.");
    }
}

/**
 * Suppression d'un utilisateur
 */
async function deleteUser(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        try {
            const result = await fetchAPI(`/admin/users/${id}`, "DELETE");
            alert(result.message);
            loadUsers();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Une erreur est survenue lors de la suppression.");
        }
    }
}

/**
 * Modification d'un utilisateur
 */
function editUser(id, prenom, nom, email, role) {
    const prenomField = document.getElementById("prenom");
    const nomField = document.getElementById("nom");
    const emailField = document.getElementById("email");
    const roleField = document.getElementById("role");

    prenomField.value = prenom;
    nomField.value = nom;
    emailField.value = email;
    roleField.value = role;

    document.getElementById("form-add-user").onsubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            prenom: prenomField.value,
            nom: nomField.value,
            email: emailField.value,
            role: roleField.value,
        };

        try {
            const result = await fetchAPI(`/admin/users/${id}`, "PUT", updatedUser);
            alert(result.message || "Utilisateur mis à jour !");
            loadUsers();
            document.getElementById("form-add-user").reset(); // Réinitialiser le formulaire
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            alert("Une erreur est survenue lors de la mise à jour.");
        }
    };
}

/**
 * Gestion de l'ajout d'un nouvel utilisateur
 */
document.getElementById("form-add-user")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    try {
        const result = await fetchAPI("/admin/users", "POST", { prenom, nom, email, role, password: "defaultpassword" });
        alert(result.message || "Utilisateur ajouté !");
        loadUsers(); // Recharge les utilisateurs
        document.getElementById("form-add-user").reset(); // Réinitialise le formulaire
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Une erreur est survenue lors de l'ajout.");
    }
});


/**
 * Mise à jour du profil utilisateur
 */
document.getElementById("form-update-profile")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Non connecté.");
        window.location.href = "login.html";
        return;
    }

    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;

    try {
        const result = await fetchAPI("/user/update", "PUT", { id: user.id, prenom, nom, email });
        alert(result.message || "Mise à jour réussie !");
        localStorage.setItem("user", JSON.stringify({ ...user, prenom, nom, email }));
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Une erreur est survenue lors de la mise à jour.");
    }
});

// Charger les utilisateurs sur la page admin
if (window.location.pathname.endsWith("admin.html")) {
    loadUsers();
}
