// Récupération des élements du formulaire ***
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const form = document.querySelector(".login-form");
const errorMail = document.querySelector(".loginEmail-error")
const errorPassword = document.querySelector(".loginMdp-error")

// ENVOI DE DONNEES FORMULAIRE POUR VERIFICATION ***

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = {
        email: email.value,
        password: password.value,
    };
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
            location.href = "index.html"
        } else {
            throw Error(`${response.status}`)
        }

    }
    catch (error) {
        // Si 401, afficher erreur mot de passe
        if (error.message === "401" || error.message === "404") {
            errorPassword.style.display = "block";
            errorMail.style.display = "none";
            //    Sinon si 404, afficher erreur mail
        // } else if (error.message === "404") {
        //     errorMail.style.display = "block";
        //     errorPassword.style.display = "none";
            // Sinon, afficher erreur avec son code
        } else {
            alert("Erreur : " + error)
        }
    }
});
