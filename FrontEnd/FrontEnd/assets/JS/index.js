// ***Déclaration des variables globales***
let focusables = []
let modal = null
const galleryElement = document.querySelector(".gallery")
const photoAdded = document.querySelector(".new-photo");
const ajoutPhoto = document.querySelector(".ajoutphoto")
const modalUn = document.querySelector("#titlemodal")
// AJOUT DE CONSTANTE POUR MODAL 1 ET 2
const closeIcon = document.querySelector(".js-modal-close")
const galerieModal = document.querySelector(".galerieModal")
const returnAndClose = document.querySelector(".js-modal-close")
const returnIcon = document.querySelector(".return")
const bordure = document.querySelector(".bordure")
const contentAddPhoto = document.querySelector(".content-add-photo")
const previewNewPhoto = document.querySelector(".preview")
const focusableSelector = 'button, a, input, textarea'


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

// Fonction SUPPRIMER les anciennes images HTML***
function deleteOldGallery() {
    document.querySelector(".gallery").innerHTML = '';
}

// Fonction CRÉER de nouveaux travaux API***
async function createGallery(categoryId = null) {
    // Supprimer la galerie (works)
    deleteOldGallery()
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
        galleryElement.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleImage);
    });
}

// Ajout de filtres de catégories pour filtrer les works dans la galerie*****

async function createFilter() {
    // Ajout d'une catégorie par défaut "Tous" au début du tableau
    categories.unshift({ id: 0, name: "Tous" });

    // Création d'un élément <div> pour les catégories
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, galleryElement);
    // Parcourir chaque catégorie avec la boucle forEach
    categories.forEach((categoryElement, i) => {
        // Créer des Btn et personaliser avec texte et valeur
        const categoryBtn = document.createElement("button");
        categoryBtn.innerText = categoryElement.name;
        categoryBtn.value = categoryElement.id;
        categoryBtn.classList.add("category-btn");

        // Ajouter la class selected au premier Btn
        if (i === 0) {
            categoryBtn.classList.add("category-selected")
        };
        // Ajouter Btn à la catégories <div>
        categoriesElement.appendChild(categoryBtn);
        // Changer de catégorie au click avec l'écouteur d'évenement
        categoryBtn.addEventListener("click", async (e) => {
            // Obtenir (GET) l'identifiant de la catégorie sélectionnée, convertir un (string) en entier
            const selectedCategoryId = parseInt(e.target.value);
            // Mettre à jour la galerie
            await createGallery(selectedCategoryId);
            // Changer la couleur du Btn catégorie séléctionné
            const filterColorCategory = document.querySelectorAll(".category-btn");
            filterColorCategory.forEach((filterColor, i) => {
                if (i === selectedCategoryId) {
                    filterColor.classList.add("category-selected")
                } else {
                    if (filterColor.classList.contains("category-selected")) {
                        filterColor.classList.remove("category-selected")
                    };
                };
            });
        });
    });
}

// Récupération des works et catégories
async function loadData() {
    works = await fetchData("http://localhost:5678/api/works");
    await createGallery();
    categories = await fetchData("http://localhost:5678/api/categories");
    await createFilter();
    await adminMode();

}

// ***** MODE ADMIN *****

// bandeau noir
function adminMode() {
    // Vérifier si le token est présent dans le localStorage
    if (localStorage.getItem("token")) {
        // Créer une <div> edit-mode et l'inserer dans le header
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "88px"
        header.insertAdjacentHTML("afterbegin", editModeBar)
        // Remplacer login par logout après identification
        const logout = document.querySelector(".js-alredy-logged")
        const logoutRetourPageAccueil = document.querySelector(".logout-page-accueil")
        logout.textContent = "logout"
        logoutRetourPageAccueil.href = "#"
        // Supprimez le jeton (token) de session et rechargez la page d'accueil
        logout.addEventListener("click", () => {
            localStorage.removeItem("token")
            location.reload()
        })
        // Créer un container <div> et lui ajouter une class edit-projets
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        // Créer le lien <di> pour modifier les projets
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        // Insérer le conteneur avant le 1er élément de portfolio et déplacer les projets à l'intérieur
        const portfolio = document.getElementById("portfolio");
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild)
        const titleProject = document.querySelector("#portfolio h2")
        containerDivBtn.appendChild(titleProject)
        // Insérer du code html juste après le edit
        titleProject.insertAdjacentHTML("afterend", btnToModified)
        // Masquer les boutons de catégories
        const categoryBtn = document.querySelectorAll('.category-btn')
        categoryBtn.forEach(btn => {
            btn.style.display = 'none';
        })

        // Acces à modifier
        const edit = document.querySelector(".edit")
        if (edit) {
            // Si l'élément est trouvé, ajoutez un écouteur d'événement pour le clic
            edit.addEventListener("click", openModal)
        }
    }
}

// Premiere Modal*****

// Fonction pour ouvrir la modal
const openModal = function (e) {
    e.preventDefault()
    ajoutPhoto.style.display = "block"
    bordure.style.display = "block"
    // Masquer et style icon retour dans modal 1
    closeIcon.style.justifyContent = "end"
    returnIcon.style.display = "none"
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
    displayWorksModal()
    // Fonction d'appel pour le modal d'ajout ouvert
    openAddModal()
}

// Fonction pour fermer la modal*****

const closeModal = function () {
    // Cacher la modal
    modal.style.display = "none";
    // Modifier accessibilité attribute
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

// Empêcher la modal de se fermer en cliquant dessus
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Fonction pour le focus dans la modal a l'utilisation du clavier
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

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal)

})

// supporter le fonctionnement du clavier

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

// Mettre la galerie dans la modal a jour
function displayWorksModal() {
    const galerieModal = document.querySelector(".galerieModal")
    galerieModal.innerHTML = ""
    works.forEach(work => {
        const figureModal = document.createElement("figure");
        figureModal.setAttribute("class", "figureModal")
        figureModal.setAttribute("id", `modal-${work.id}`)
        const imageModal = document.createElement("img")
        imageModal.src = work.imageUrl;
        imageModal.setAttribute("class", "imageModal")
        galerieModal.appendChild(figureModal);
        figureModal.appendChild(imageModal);
        const corbeille = `<i class="fa-solid fa-trash-can" id ="trash-${work.id}"></i>`
        figureModal.insertAdjacentHTML("afterbegin", corbeille)
        const trashSelected = document.getElementById(`trash-${work.id}`)
        trashSelected.addEventListener("click", () => deleteWorksModal(work.id))
    });
}
// Fonction supprimer photos
async function deleteWorksModal(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            },
            body: null
        });
        if (response.ok) {
            works = works.filter(work => work.id !== id)
            displayWorksModal()
            createGallery()
        } else {
            throw Error(`${response.status}`)
        }

    }
    catch (error) {
        alert("Erreur : " + error)
    }

}
loadData();


// créer une modal ajout photos

const openAddModal = function () {

    ajoutPhoto.addEventListener("click", (e) => {
        e.preventDefault()
        // APPARITION ICON RETOUR POUR MODAL 2
        returnIcon.style.display = "flex"
        returnAndClose.style.justifyContent = "space-between"
        modalUn.textContent = 'Ajout photo'

        const formulaire = `
        <form class="form-photo" action="#" method="post">
                <div class="add-new-photo">
                    <div class="content-add-photo">
                        <i class="picture fa-regular fa-image"></i>
                        <label class="btn-add-new-photo" for="file">+ Ajouter photo</label>
                        <input
                            id="file"
                            type="file"
                            name="file"
                            accept="image/png, image/jpeg">
                        <p class="type-file">jpg, png : 4mo max</p>
                    </div>
                    <div class="preview"></div>
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

        //FCT APPEL CATEGORIES
        addSelectedCategories()

        // CONSTANTE A GARDER ICI POUR POUVOIR LES EXPLOITER
        // POUR DESACTIVER LE BTN
        const titleAddModal = document.getElementById("title-photo")
        const categorieAddModal = document.getElementById("categorie-photo")
        const btnAddFile = document.getElementById("file")

        function setBtnState(disabled) {
            const btnValidAddModal = document.getElementById("btn-valid")

            btnValidAddModal.disabled = disabled;
            btnValidAddModal.style.cursor = disabled ? "not-allowed" : "pointer";
            btnValidAddModal.style.backgroundColor = disabled ? "grey" : "#1D6154";
        };

        setBtnState(true);

        function toggleSubmitBtn() {
            const titleAddModal = document.getElementById("title-photo")
            const categorieAddModal = document.getElementById("categorie-photo")
            const photoAdded = document.querySelector(".new-photo");


            /**Checks if the title, category, and photo meet the conditions to activate the button */
            if (!(titleAddModal.value && categorieAddModal.value && photoAdded !== null)) {
                /**Leave the button disabled */
                setBtnState(true);
            } else {
                /*Activates the button if all conditions are met */
                setBtnState(false);
            };

        };


        // ECOUTEUR QUI SURVEILLE LES INPUTS ET L IMAGE
        // ET APPEL FONCTION POUR VERIF SI VIDE OU NON
        titleAddModal.addEventListener("input", toggleSubmitBtn);
        categorieAddModal.addEventListener("input", toggleSubmitBtn);
        btnAddFile.addEventListener("change", toggleSubmitBtn);

        // APPEL DE LA FONCTION POUR POUVOIR METTRE ET CHANGER DE PHOTO
        btnAddFile.addEventListener("change", getNewPhoto);
        // Recuperer la class Formulaire photo
        const formPhoto = document.querySelector(".form-photo")
        // Envoi formulaire photo pour l'envoi sur API, ajout photo
        formPhoto.addEventListener("submit", (e) => {
            e.preventDefault();
            postPhoto();
            console.log("teste")
        });

    })
    // Fleche retour a la premiere modal
    const returnModal = document.querySelector (".return")
    returnModal.addEventListener("click", (e) => {
        openModal(e);

    })

}


//AJOUT DES CATEGORIES
function addSelectedCategories() {
    categories.shift();
    const categorieAddModal = document.getElementById("categorie-photo")

    categories.forEach(category => {
        const categoryWork = document.createElement("option");
        categoryWork.setAttribute("value", category.id);
        categoryWork.setAttribute("name", category.name);
        categoryWork.innerText = category.name;
        categorieAddModal.appendChild(categoryWork);
    });
};



function getNewPhoto() {
    const btnAddFile = document.getElementById("file")
    const contentAddPhoto = document.querySelector(".content-add-photo")
    const previewNewPhoto = document.querySelector(".preview")

    const selectedNewPhoto = btnAddFile.files[0];
    const sizeFileMax = 4 * 1024 * 1024;
    const typeFile = ["image/jpeg", "image/png"];

    if (selectedNewPhoto.size > sizeFileMax) {
        alert("Votre fichier dépasse 4 Mo.");
    } else if (!typeFile.includes(selectedNewPhoto.type)) {
        alert("Votre fichier n'est pas au bon format.");
    } else {
        contentAddPhoto.style.display = "none";
        let newPhoto = document.createElement("img");
        newPhoto.src = URL.createObjectURL(selectedNewPhoto);
        newPhoto.classList.add("new-photo");
        newPhoto.style.maxHeight = "169px";
        newPhoto.style.maxWidth = "420px"
        previewNewPhoto.appendChild(newPhoto);
        newPhoto.addEventListener("click", () => {
            btnAddFile.click();
            // container photo , reset photo pour la changer 
            const preview = document.querySelector(".preview")
            preview.innerHTML = ""
        });
    }
};

// Fonction Post photo
async function postPhoto() {

    try {
        // Créer Nv formulaire (formData)
        const formData = new FormData();

        // Recuperer les valeurs du champ de saisie
        const titleAddModal = document.getElementById("title-photo")
        const categorieAddModal = document.getElementById("categorie-photo")
        const btnAddFile = document.getElementById("file")
        // Tableau swagger Adding values ​​to formData 
        formData.append("title", titleAddModal.value);
        formData.append("category", categorieAddModal.value);
        formData.append("image", btnAddFile.files[0])

        console.log("Données envoyées:", {
            title: titleAddModal.value,
            category: categorieAddModal.value,
            image: btnAddFile.files[0]
        });

        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json()
            works.push(data)
            // mettre a jour la galerie
            createGallery()
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
// Fonction pour rediriger l'utilisateur a la page d'accueil qd le token est present



// function isUserLoggedIn() {
//     // vérifier si l'utilisateur est connecté.
//     if (localStorage.getItem("token"))
//     // retourner true si l'utilisateur est connecté, sinon false.
//     return true;
// }

// // Redirige l'utilisateur vers la page d'accueil s'il est connecté
// function redirectUserIfLoggedIn() {
//     if (isUserLoggedIn()) {
//         window.location.href = "./index.html"; // Redirige vers la page d'accueil
//     }
// }

// // Appel de la fonction de redirection lorsque la page est chargée
// document.addEventListener("DOMContentLoaded", function() {
//     redirectUserIfLoggedIn();
// });