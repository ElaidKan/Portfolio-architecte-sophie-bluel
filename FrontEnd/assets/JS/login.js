// Récupération des élements du formulaire***
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const form = document.querySelector(".login-form");
const errorMail = document.querySelector(".loginEmail-error")
const errorPassword = document.querySelector(".loginMdp-error")

// Envoi des données form pour vérification***
form.addEventListener("submit", async (e) => {
    // Prévenir le comportement par defaut du submit pour pouvoir le gérer
    e.preventDefault();
    // Récupérer et stocker la valeur utilisateur du mail et MDP
    const user = {
        email: email.value,
        password: password.value,
    };
    // Envoi d'une requête POST au serveur***
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user)
        });
        // Si ok, stockage du token en localStorage et redirection vers la page d'index***
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            location.href = "index.html"
            // Sinon envoyer erreur***
        } else {
            throw Error(`${response.status}`)
        }

    }
    // Gestion des erreurs en fonction de l'état de la réponse***
    catch (error) {
        // Si 401, afficher erreur mot de passe
        if (error.message === "401") {
            errorPassword.style.display = "block";
            errorMail.style.display = "none";
            //    Sinon si 404, afficher erreur mail
        } else if (error.message === "404") {
            errorMail.style.display = "block";
            errorPassword.style.display = "none";
            // Sinon, afficher erreur avec son code
        } else {
            alert("Erreur : " + error)
        }
    }
});
