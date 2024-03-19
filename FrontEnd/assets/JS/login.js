const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");
const form = document.querySelector(".login-form");
const errorMail = document.querySelector(".loginEmail-error")
const errorPassword = document.querySelector(".loginMdp-error")

// envoi des données form pour verifications

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
        if(error.message === "401"){
           errorPassword.style.display = "block";
           errorMail.style.display = "none";
        } else if (error.message === "404"){
            errorMail.style.display = "block";
            errorPassword.style.display = "none";

        } else {
            alert("Erreur : " + error)
        }
    }
});
