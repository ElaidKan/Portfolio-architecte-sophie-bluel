import { fetchData } from './service.js';
// import { chargementDonnees } from './service.js';

// let works = await fetchData("http://localhost:5678/api/works");
// await creategallerie();
// let categories = await fetchData("http://localhost:5678/api/categories");
// await creerFiltre();
// await modeAdmin();

// RECUPERATION DES WORKS ET CATEGORIES ******
export async function chargementDonnees() {
    works = await fetchData("http://localhost:5678/api/works");
    await creategallerie();
    categories = await fetchData("http://localhost:5678/api/categories");
    await creerFiltre();
    await modeAdmin();

}


// ***** DECLARATION DES VARIABLES GLOBALES *****
let works;
let categories;
const gallerieElement = document.querySelector(".gallerie")
const nvlPhoto = document.querySelector(".nvl-photo");
const ajoutPhoto = document.querySelector(".ajoutphoto")
const modalUn = document.querySelector("#titre-modal")
const fermerIcone = document.querySelector(".js-modal-close")
const galerieModal = document.querySelector(".galerieModal")
const retourIcone = document.querySelector(".retour")
const bordure = document.querySelector(".bordure")
const containerAjoutPhoto = document.querySelector(".div-ajout-photo")
const apperçuNvlPhoto = document.querySelector(".apperçu")
const focusableSelector = 'button, a, input, textarea'
const modalDeux = document.querySelector(".modal-deux")
let focusables = []
let modal = null

// FONCTION SUPPRIMER L ANCIENNE (GALERIE) ******

function suppressionGallerie() {
    document.querySelector(".gallerie").innerHTML = '';
}

// FONCTION CRÉER DE NV TRAVAUX API ******

async function creategallerie(categoryId = null) {
    suppressionGallerie()
    const worksToDisplay = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    worksToDisplay.forEach(work => {
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img")
        imageElement.src = work.imageUrl;
        imageElement.setAttribute("alt", work.title)
        const titleImage = document.createElement("figcaption");
        titleImage.innerText = work.title;
        gallerieElement.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleImage);
    });
}


// AJOUT DE FILTRES DE CATEGORIES POUR FILTRER LES WORKS DANS LA GALERIE ******

async function creerFiltre() {
    categories.unshift({ id: 0, name: "Tous" });
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, gallerieElement);
    categories.forEach((categoryElement, i) => {
        const btnFiltres = document.createElement("button");
        btnFiltres.innerText = categoryElement.name;
        btnFiltres.value = categoryElement.id;
        btnFiltres.classList.add("btn-filtres");

        // Ajouter la class selected au premier Btn
        if (i === 0) {
            btnFiltres.classList.add("btn-selectionne")
        };
        categoriesElement.appendChild(btnFiltres);
        btnFiltres.addEventListener("click", async (e) => {
            const selectedCategoryId = parseInt(e.target.value);
            await creategallerie(selectedCategoryId);
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


// ******* MODE ADMIN *******

// BANDEAU NOIR 
function bandeauNoir() {
    const barEdition = document.createElement("div")
    barEdition.classList.add("bar-edition")
    const styloCarre = `<i class="logo-edit fa-regular fa-pen-to-square"></i>`
    const textBandeau = document.createElement("p")
    textBandeau.textContent = "mode édition"
    barEdition.insertAdjacentHTML("afterbegin", styloCarre)
    barEdition.appendChild(textBandeau)
    const header = document.querySelector("header");
    header.style.marginTop = "88px"
    header.appendChild(barEdition)
}

// Logout***
function logout() {
    const logout = document.querySelector(".deconnexion")
    const lienLogin = document.querySelector(".lien-page-login")
    logout.textContent = "logout"
    lienLogin.href = "#"
    logout.addEventListener("click", () => {
        localStorage.removeItem("token")
        location.reload()
    })
}

// Bouton Modifier ***
function boutonOuvreModal() {
    const containerDivBtn = document.createElement("div");
    containerDivBtn.classList.add("edit-projets");
    const btnModifier = document.createElement('div');
    btnModifier.classList.add('btn-modifier');
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-pen-to-square');
    const text = document.createElement('p');
    text.textContent = 'modifier';
    btnModifier.appendChild(icon);
    btnModifier.appendChild(text);
    containerDivBtn.appendChild(btnModifier)

    const portfolio = document.getElementById("portfolio");
    portfolio.insertBefore(containerDivBtn, portfolio.firstChild)
    const mesProjets = document.querySelector("#portfolio h2")
    containerDivBtn.appendChild(mesProjets)
    const btnFiltres = document.querySelectorAll('.btn-filtres')
    btnFiltres.forEach(btn => {
        btn.style.display = 'none';
    })
    const edition = document.querySelector(".btn-modifier")
    if (edition) {
        edition.addEventListener("click", openModal)
    }
}

// mode admin et rappel de fonctions
function modeAdmin() {
    if (localStorage.getItem("token")) {
        bandeauNoir()
        logout()
        boutonOuvreModal()
    }
}

// ***** PREMIERE MODAL

// FONCTION POUR OUVRIR LA MODAL ******

const openModal = function (e) {
    e.preventDefault()
    galerieModal.style.display = "grid"
    ajoutPhoto.style.display = "block"
    bordure.style.display = "block"
    fermerIcone.style.justifyContent = "end"
    retourIcone.style.display = "none"
    modalDeux.style.display = "none"
    modal = document.querySelector(".modal")
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.close-deleted').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    miseAJourModal()
    modalAjoutPhoto()
}

// FONCTION POUR FERMER LA MODAL ******

const closeModal = function () {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('aria-modal', 'false')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close-deleted').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}


// EMPECHER LA MODAL DE SE FERMER EN CLIQUANT DESSUS ******

const stopPropagation = function (e) {
    e.stopPropagation()
}

// METTRE A JOUR ( AFFICHER) LA GALERIE DANS LA MODAL ******

function miseAJourModal() {
    const galerieModal = document.querySelector(".galerieModal")
    // Reset existing content
    galerieModal.innerHTML = ""
    works.forEach(work => {
        const elementFigure = document.createElement("figure");
        elementFigure.setAttribute("class", "elementFigure")
        elementFigure.setAttribute("id", `modal-${work.id}`)
        const elementImage = document.createElement("img")
        elementImage.src = work.imageUrl;
        elementImage.setAttribute("class", "elementImage")
        galerieModal.appendChild(elementFigure);
        elementFigure.appendChild(elementImage);
        const corbeille = `<i class="fa-solid fa-trash-can" id ="trash-${work.id}"></i>`
        elementFigure.insertAdjacentHTML("afterbegin", corbeille)
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
        if (response.ok) {
            works = works.filter(work => work.id !== id)
            miseAJourModal()
            creategallerie()
        } else {
            throw Error(`${response.status}`)
        }

    }
    catch (error) {
        alert("Erreur : " + error)
    }

}
chargementDonnees();

// *** DEUXIEME MODAL Add work 

// CREER UNE MODAL AJOUT PHOTOS ******

const modalAjoutPhoto = function () {

    ajoutPhoto.addEventListener("click", (e) => {
        e.preventDefault()
        modalDeux.style.display = "block"
        retourIcone.style.display = "flex"
        fermerIcone.style.justifyContent = "space-between"
        modalUn.textContent = 'Ajout photo'
        modalDeux.innerHTML = ""
        const formulaire = document.createElement('form');
        formulaire.classList.add('form-photo');
        formulaire.setAttribute('action', '#');
        formulaire.setAttribute('method', 'post');

        const addNvlPhotoDiv = document.createElement('div');
        addNvlPhotoDiv.classList.add('add-nvl-photo');

        const divAjoutPhoto = document.createElement('div');
        divAjoutPhoto.classList.add('div-ajout-photo');

        const pictureIcon = document.createElement('i');
        pictureIcon.classList.add('picture', 'fa-regular', 'fa-image');

        const btnAddNvlPhotoLabel = document.createElement('label');
        btnAddNvlPhotoLabel.classList.add('btn-add-nvl-photo');
        btnAddNvlPhotoLabel.setAttribute('for', 'file');
        btnAddNvlPhotoLabel.textContent = '+ Ajouter photo';

        const fileInput = document.createElement('input');
        fileInput.setAttribute('id', 'file');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('name', 'file');
        fileInput.setAttribute('accept', 'image/png, image/jpeg');

        const typeFileParagraph = document.createElement('p');
        typeFileParagraph.classList.add('type-file');
        typeFileParagraph.textContent = 'jpg, png : 4mo max';

        divAjoutPhoto.appendChild(pictureIcon);
        divAjoutPhoto.appendChild(btnAddNvlPhotoLabel);
        divAjoutPhoto.appendChild(fileInput);
        divAjoutPhoto.appendChild(typeFileParagraph);

        const apperçuDiv = document.createElement('div');
        apperçuDiv.classList.add('apperçu');

        addNvlPhotoDiv.appendChild(divAjoutPhoto);
        addNvlPhotoDiv.appendChild(apperçuDiv);

        formulaire.appendChild(addNvlPhotoDiv);

        const titleCategorieDiv = document.createElement('div');
        titleCategorieDiv.classList.add('title-categorie');

        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'title-photo');
        titleLabel.textContent = 'Titre';
        const titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('id', 'title-photo');
        titleInput.setAttribute('name', 'title-photo');
        titleInput.setAttribute('required', '');

        const categorieLabel = document.createElement('label');
        categorieLabel.setAttribute('for', 'categorie-photo');
        categorieLabel.textContent = 'Catégorie';
        const categorieSelect = document.createElement('select');
        categorieSelect.setAttribute('id', 'categorie-photo');
        categorieSelect.setAttribute('name', 'categorie-photo');
        categorieSelect.setAttribute('required', '');
        const optionDefault = document.createElement('option');
        optionDefault.setAttribute('value', '');
        optionDefault.textContent = '--Choisissez une catégorie--';
        categorieSelect.appendChild(optionDefault);

        titleCategorieDiv.appendChild(titleLabel);
        titleCategorieDiv.appendChild(titleInput);
        titleCategorieDiv.appendChild(categorieLabel);
        titleCategorieDiv.appendChild(categorieSelect);

        formulaire.appendChild(titleCategorieDiv);

        const btnValidInput = document.createElement('input');
        btnValidInput.setAttribute('type', 'submit');
        btnValidInput.setAttribute('id', 'btn-valid');
        btnValidInput.setAttribute('value', 'Valider');

        formulaire.appendChild(btnValidInput);
        modalDeux.appendChild(formulaire)
        galerieModal.style.display = "none"
        ajoutPhoto.style.display = "none"
        bordure.style.display = "none"

        function addSelectedCategories() {
            categories.shift();
            const categorieNvlPhoto = document.getElementById("categorie-photo")
            categories.forEach(category => {
                const categoryWork = document.createElement("option");
                categoryWork.setAttribute("value", category.id);
                categoryWork.setAttribute("name", category.name);
                categoryWork.innerText = category.name;
                categorieNvlPhoto.appendChild(categoryWork);
            });
        };
        addSelectedCategories()
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
            if (!(titreNvlPhoto.value && categorieNvlPhoto.value && nvlPhoto !== null)) {
                etatBtn(true);
            } else {
                etatBtn(false);
            };

        };

        titreNvlPhoto.addEventListener("input", basculeBtnEnvoyer);
        categorieNvlPhoto.addEventListener("input", basculeBtnEnvoyer);
        btnAjoutPhoto.addEventListener("change", basculeBtnEnvoyer);
        btnAjoutPhoto.addEventListener("change", getNewPhoto);
        const formAjoutGlobale = document.querySelector(".form-photo")
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

// FORMULAIRE RECUPERE NOUVELLE PHOTO SUR L ORDI ****** 

function getNewPhoto() {
    const btnAjoutPhoto = document.getElementById("file")
    const containerAjoutPhoto = document.querySelector(".div-ajout-photo")
    const apperçuNvlPhoto = document.querySelector(".apperçu")
    const photoSelectionnee = btnAjoutPhoto.files[0];
    const taillePhotoMax = 4 * 1024 * 1024;
    const typeFichier = ["image/jpeg", "image/png"];
    if (photoSelectionnee.size > taillePhotoMax) {
        alert("Votre fichier dépasse 4 Mo.");
    } else if (!typeFichier.includes(photoSelectionnee.type)) {
        alert("Votre fichier n'est pas au bon format.");
    } else {
        containerAjoutPhoto.style.display = "none";
        let nvlPhoto = document.createElement("img");
        nvlPhoto.src = URL.createObjectURL(photoSelectionnee);
        nvlPhoto.classList.add("nvl-photo");
        apperçuNvlPhoto.appendChild(nvlPhoto);
        nvlPhoto.addEventListener("click", () => {
            btnAjoutPhoto.click();
            const apperçu = document.querySelector(".apperçu")
            apperçu.innerHTML = ""
        });
    }
};

// FOCTION POST PHOTO ******

async function postPhoto() {
    try {
        const nvlDonnee = new FormData();
        const titreNvlPhoto = document.getElementById("title-photo")
        const categorieNvlPhoto = document.getElementById("categorie-photo")
        const btnAjoutPhoto = document.getElementById("file")
        nvlDonnee.append("title", titreNvlPhoto.value);
        nvlDonnee.append("category", categorieNvlPhoto.value);
        nvlDonnee.append("image", btnAjoutPhoto.files[0])

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
            creategallerie()
            closeModal()
        } else {
            throw Error(`${response.status}`)
        }
    }
    catch (error) {
        alert("Erreur : " + error)
    }
}