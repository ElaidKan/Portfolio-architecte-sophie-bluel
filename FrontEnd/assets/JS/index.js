// ***** DECLARATION DES VARIABLES GLOBALES *****

const gallerieElement = document.querySelector(".gallerie")
const nvlPhoto = document.querySelector(".nvl-photo");
const ajoutPhoto = document.querySelector(".ajoutphoto")
const modalUn = document.querySelector("#titre-modal")
// Ajout de constante pour MODAL 1 ET 2
const fermerIcone = document.querySelector(".js-modal-close")
const galerieModal = document.querySelector(".galerieModal")
const retourIcone = document.querySelector(".retour")
const bordure = document.querySelector(".bordure")
const containerAjoutPhoto = document.querySelector(".div-ajout-photo")
const apperçuNvlPhoto = document.querySelector(".apperçu")
const focusableSelector = 'button, a, input, textarea'
let focusables = []
let modal = null

// RECUPERER LES WORKS ET CATEGORIES ******
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return await response.json();
    } catch (error) {
        alert("Erreur : " + error)
    }
}

// FONCTION SUPPRIMER LES ANCIENNES IMG (GALERIE) HTML ******

function suppressionGallerie() {
    document.querySelector(".gallerie").innerHTML = '';
}

// FONCTION CRÉER DE NV TRAVAUX API ******

async function creategallerie(categoryId = null) {
    // Supprimer la galerie (works)
    suppressionGallerie()
    // Déterminer quel tableau (works) à utiliser en fonction de la catégorie
    const worksToDisplay = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    // Boucle forEach qui sert à parcourir les works
    worksToDisplay.forEach(work => {
        // Créer un élément <figure> pour chaque work
        const figure = document.createElement("figure");
        // Créer un élément <image> pour chaque work
        const imageElement = document.createElement("img")
        // Changer la source de l'image
        imageElement.src = work.imageUrl;
        // Définir ou mettre à jour l'attribut "alt" de l'élément image HTML
        imageElement.setAttribute("alt", work.title)
        // Créez un élément <figcaption> pour afficher le titre de work
        const titleImage = document.createElement("figcaption");
        // Ajouter du texte au titre 
        titleImage.innerText = work.title;
        // Rattacher les enfants aux parents dans le DOM
        gallerieElement.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleImage);
    });
}


// AJOUT DE FILTRES DE CATEGORIES POUR FILTRER LES WORKS DANS LA GALERIE ******

async function creerFiltre () {
    // Ajout d'une catégorie par défaut "Tous" au début du tableau
    categories.unshift({ id: 0, name: "Tous" });

    // Création d'un élément <div> pour les catégories
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, gallerieElement);
    // Parcourir chaque catégorie avec la boucle forEach
    categories.forEach((categoryElement, i) => {
        // Créer des Btn et personaliser avec texte et valeur
        const btnFiltres = document.createElement("button");
        btnFiltres.innerText = categoryElement.name;
        btnFiltres.value = categoryElement.id;
        btnFiltres.classList.add("btn-filtres");

        // Ajouter la class selected au premier Btn
        if (i === 0) {
            btnFiltres.classList.add("btn-selectionne")
        };
        // Ajouter Btn à la catégories <div>
        categoriesElement.appendChild(btnFiltres);
        // Changer de catégorie au click avec l'écouteur d'évenement
        btnFiltres.addEventListener("click", async (e) => {
            // Obtenir (GET) l'identifiant de la catégorie sélectionnée, convertir un (string) en entier
            const selectedCategoryId = parseInt(e.target.value);
            // Mettre à jour la galerie
            await creategallerie(selectedCategoryId);
            // Changer la couleur du Btn catégorie séléctionné
            const filterColorCategory = document.querySelectorAll(".btn-filtres");
            filterColorCategory.forEach((filterColor, i) => {
                if (i === selectedCategoryId) {
                    filterColor.classList.add("btn-selectionne")
                } else {
                    if (filterColor.classList.contains("btn-selectionne")) {
                        filterColor.classList.remove("btn-selectionne")
                    };
                };
            });
        });
    });
}


// RECUPERATION DES WORKS ET CATEGORIES ******

async function chargementDonnees () {
    works = await fetchData("http://localhost:5678/api/works");
    await creategallerie();
    categories = await fetchData("http://localhost:5678/api/categories");
    await creerFiltre ();
    await modeAdmin ();

}

// ******* MODE ADMIN *******

// BANDEAU NOIR ******

function modeAdmin () {
    // Vérifier si le token est présent dans le localStorage
    if (localStorage.getItem("token")) {
        // Créer une <div> bar-edition et l'inserer dans le header
        const barEdition = `<div class="bar-edition">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "88px"
        header.insertAdjacentHTML("afterbegin", barEdition)
        // Remplacer login par logout après identification
        const logout = document.querySelector(".deconnexion")
        const lienLogin = document.querySelector(".lien-page-login")
        logout.textContent = "logout"
        // supprimer le lien vers page login, rechargement de la page
        lienLogin.href = "#"
        // Supprimez le jeton (token) de session et rechargez la page d'accueil
        logout.addEventListener("click", () => {
            localStorage.removeItem("token")
            location.reload()
        })
        // Créer un container <div> et lui ajouter une class edit-projets
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        // Créer le lien <di> pour modifier les projets
        const btnModifier = `<div class="btn-modifier">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        // Insérer le conteneur avant le 1er élément de portfolio et déplacer les projets à l'intérieur
        const portfolio = document.getElementById("portfolio");
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild)
        const mesProjets = document.querySelector("#portfolio h2")
        containerDivBtn.appendChild(mesProjets)
        // Insérer du code html juste après le edit
        mesProjets.insertAdjacentHTML("afterend", btnModifier)
        // Masquer les boutons de catégories
        const btnFiltres = document.querySelectorAll('.btn-filtres')
        btnFiltres.forEach(btn => {
            btn.style.display = 'none';
        })

        // Acces à modifier
        const edition = document.querySelector(".btn-modifier")
        if (edition) {
            // Si l'élément est trouvé, ajoutez un écouteur d'événement pour le clic
            edition.addEventListener("click", openModal)
        }
    }
}



// ***** PREMIERE MODAL *****

// FONCTION POUR OUVRIR LA MODAL ******

const openModal = function (e) {
    e.preventDefault()
    ajoutPhoto.style.display = "block"
    bordure.style.display = "block"
    // Masquer et style icon retour dans modal 1
    fermerIcone.style.justifyContent = "end"
    retourIcone.style.display = "none"
    // Acces à la modal 1
    modal = document.querySelector(".modal")
    // Récupérer tous les élements Focusables
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null;
    // Modifier l'attribute d'accessibilité
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    // Ajout d'un event listener pour fermer la modal
    modal.addEventListener('click', closeModal)
    // Modif de la class pour fermeture, juste icon et pas sa <div> entiere
    modal.querySelector('.close-deleted').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    // Fonction d'appel pour afficher le contenu
    miseAJourModal()
    // Fonction d'appel pour le modal d'ajout ouvert
    modalAjoutPhoto()
}

// FONCTION POUR FERMER LA MODAL ******

const closeModal = function () {
    // Cacher la modal
    modal.style.display = "none";
    // Modifier accessibilité attribute, cacher
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('aria-modal', 'false')
    // Supprimer l'event listener
    modal.removeEventListener('click', closeModal)
    // Class pour fermeture, juste icon et pas sa div entiere, stop propagation
    modal.querySelector('.close-deleted').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    // Reinitialiser la variable modale a null
    modal = null

}


// EMPECHER LA MODAL DE SE FERMER EN CLIQUANT DESSUS ******

const stopPropagation = function (e) {
    e.stopPropagation()
}

// FONCTION POUR LE FOCUS DANS LA MODAL A L'UTILISATION DU CLAVIER ******

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftkey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()

}


// SUPPORTER LE FONCTIONNEMENT DU CLAVIER ******

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

// METTRE A JOUR ( AFFICHER) LA GALERIE DANS LA MODAL ******

function miseAJourModal() {
    const galerieModal = document.querySelector(".galerieModal")
    // Reset existing content
    galerieModal.innerHTML = ""
    // Parcourir chaque œuvre pour les afficher dans la modal
    works.forEach(work => {
        // Creation d'elements
        const elementFigure = document.createElement("figure");
        elementFigure.setAttribute("class", "elementFigure")
        elementFigure.setAttribute("id", `modal-${work.id}`)
        const elementImage = document.createElement("img")
        elementImage.src = work.imageUrl;
        elementImage.setAttribute("class", "elementImage")
        // Ajout d'elements
        galerieModal.appendChild(elementFigure);
        elementFigure.appendChild(elementImage);
        // Ajout icône de corbeille avec l'id de travail
        const corbeille = `<i class="fa-solid fa-trash-can" id ="trash-${work.id}"></i>`
        elementFigure.insertAdjacentHTML("afterbegin", corbeille)
        // Ajout event listener pour supprimer le work au click
        const corbeilleImage = document.getElementById(`trash-${work.id}`)
        corbeilleImage.addEventListener("click", () => supprimerTravauxModal(work.id))
    });
}


// FONCTION SUPPRIMER PHOTO (work), CORBEILLE ******

async function supprimerTravauxModal(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            },
            body: null
        });
        // Si reponse fetch OK 
        if (response.ok) {
            // il va garder les works dont le id !== du id selectionné
            works = works.filter(work => work.id !== id)
            // remettre a jour la modal
            miseAJourModal()
            // remettre a jour la galerie
            creategallerie()
        } else {
            throw Error(`${response.status}`)
        }

    }
    catch (error) {
        alert("Erreur : " + error)
    }

}
chargementDonnees ();


// *** DEUXIEME MODAL Add work ***

// CREER UNE MODAL AJOUT PHOTOS ******

const modalAjoutPhoto = function () {

    ajoutPhoto.addEventListener("click", (e) => {
        e.preventDefault()
        // Apparition icon retour pour MODAL 2
        retourIcone.style.display = "flex"
        fermerIcone.style.justifyContent = "space-between"
        modalUn.textContent = 'Ajout photo'

        const formulaire = `
        <form class="form-photo" action="#" method="post">
                <div class="add-nvl-photo">
                    <div class="div-ajout-photo">
                        <i class="picture fa-regular fa-image"></i>
                        <label class="btn-add-nvl-photo" for="file">+ Ajouter photo</label>
                        <input
                            id="file"
                            type="file"
                            name="file"
                            accept="image/png, image/jpeg">
                        <p class="type-file">jpg, png : 4mo max</p>
                    </div>
                    <div class="apperçu"></div>
                </div>
                <div class="title-categorie">
                    <label for="title-photo">Titre</label>
                    <input type="text" id="title-photo" name="title-photo" required>
                    <label for="categorie-photo">Catégorie</label>
                    <select id="categorie-photo" name="categorie-photo" required>
                        <option value="">--Choisissez une catégorie--</option>
                    </select>
                </div>
                <input type="submit" id="btn-valid" value="Valider">
            </form>`
        galerieModal.innerHTML = formulaire
        ajoutPhoto.style.display = "none"
        bordure.style.display = "none"

        //FCT appel categories
        addSelectedCategories()

        // Constantes a garder ici pour pouvoir les exploiter
        // pour desactiver le BTN
        const titreNvlPhoto = document.getElementById("title-photo")
        const categorieNvlPhoto = document.getElementById("categorie-photo")
        const btnAjoutPhoto = document.getElementById("file")

        function etatBtn(disabled) {
            const btnValide = document.getElementById("btn-valid")

            btnValide.disabled = disabled;
            btnValide.style.cursor = disabled ? "not-allowed" : "pointer";
            btnValide.style.backgroundColor = disabled ? "grey" : "#1D6154";
        };

        etatBtn(true);

        function basculeBtnEnvoyer() {
            const titreNvlPhoto = document.getElementById("title-photo")
            const categorieNvlPhoto = document.getElementById("categorie-photo")
            const nvlPhoto = document.querySelector(".nvl-photo");


            /**Checks if the title, category, and photo meet the conditions to activate the button */
            if (!(titreNvlPhoto.value && categorieNvlPhoto.value && nvlPhoto !== null)) {
                /**Leave the button disabled */
                etatBtn(true);
            } else {
                /*Activates the button if all conditions are met */
                etatBtn(false);
            };

        };


        // ecouteur qui surveille les INPUTS et l'IMG
        // et appel fonction pour verifier si vide ou non
        titreNvlPhoto.addEventListener("input", basculeBtnEnvoyer);
        categorieNvlPhoto.addEventListener("input", basculeBtnEnvoyer);
        btnAjoutPhoto.addEventListener("change", basculeBtnEnvoyer);

        // APPEL DE LA FONCTION POUR POUVOIR METTRE ET CHANGER DE PHOTO
        btnAjoutPhoto.addEventListener("change", getNewPhoto);
        // Recuperer la class Formulaire photo
        const formAjoutGlobale = document.querySelector(".form-photo")
        // Envoi formulaire photo pour l'envoi sur API, ajout photo
        formAjoutGlobale.addEventListener("submit", (e) => {
            e.preventDefault();
            postPhoto();
        });

    })
    // Fleche retour a la premiere modal
    const retourIcone = document.querySelector(".retour")
    retourIcone.addEventListener("click", (e) => {
        openModal(e);

    })

}


//AJOUT DES CATEGORIES ******

function addSelectedCategories() {
    categories.shift();
    const categorieNvlPhoto = document.getElementById("categorie-photo")
// boucle parcour tout les elements category de l'API
    categories.forEach(category => {
        const categoryWork = document.createElement("option");
        categoryWork.setAttribute("value", category.id);
        categoryWork.setAttribute("name", category.name);
        categoryWork.innerText = category.name;
        categorieNvlPhoto.appendChild(categoryWork);
    });
};

// FORMULAIRE RECUPERE NOUVELLE PHOTO SUR L ORDI ****** 

function getNewPhoto() {
    const btnAjoutPhoto = document.getElementById("file")
    const containerAjoutPhoto = document.querySelector(".div-ajout-photo")
    const apperçuNvlPhoto = document.querySelector(".apperçu")
// fenetre qui recupere photo sur l'ordi
    const photoSelectionnee = btnAjoutPhoto.files[0];
    const taillePhotoMax = 4 * 1024 * 1024;
    const typeFichier = ["image/jpeg", "image/png"];
// Condition taille et format de l'image
    if (photoSelectionnee.size > taillePhotoMax) {
        alert("Votre fichier dépasse 4 Mo.");
    } else if (!typeFichier.includes(photoSelectionnee.type)) {
        alert("Votre fichier n'est pas au bon format.");
    } else {
        // masquer l'icone grise pour la remplacer par photo
        containerAjoutPhoto.style.display = "none";
        let nvlPhoto = document.createElement("img");
        // créer photo a partir de son URL
        nvlPhoto.src = URL.createObjectURL(photoSelectionnee);
        nvlPhoto.classList.add("nvl-photo");
        apperçuNvlPhoto.appendChild(nvlPhoto);
        nvlPhoto.addEventListener("click", () => {
            btnAjoutPhoto.click();
            // container photo , reset photo pour pouvoir remettre une autre 
            const apperçu = document.querySelector(".apperçu")
            apperçu.innerHTML = ""
        });
    }
};


// FOCTION POST PHOTO ******

async function postPhoto() {

    try {
        // Créer Nv formulaire (nvlDonnee)
        const nvlDonnee = new FormData();

        // Recuperer les valeurs du champ de saisie
        const titreNvlPhoto = document.getElementById("title-photo")
        const categorieNvlPhoto = document.getElementById("categorie-photo")
        const btnAjoutPhoto = document.getElementById("file")
        // Tableau swagger Adding values ​​to nvlDonnee 
        nvlDonnee.append("title", titreNvlPhoto.value);
        nvlDonnee.append("category", categorieNvlPhoto.value);
        nvlDonnee.append("image", btnAjoutPhoto.files[0])

        // méthode fetch POST new photo
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            },
            body: nvlDonnee
        });

        if (response.ok) {
            const data = await response.json()
            works.push(data)
            // mettre a jour la galerie
            creategallerie()
            // Fermer la modal
            closeModal()
        } else {
            throw Error(`${response.status}`)
        }

    }
    catch (error) {
        alert("Erreur : " + error)
    }

}
