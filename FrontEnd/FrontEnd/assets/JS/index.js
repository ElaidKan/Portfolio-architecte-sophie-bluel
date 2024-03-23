const galleryElement = document.querySelector(".gallery")
const photoAdded = document.querySelector(".new-photo");
const ajoutPhoto = document.querySelector(".ajoutphoto")
const modalUn = document.querySelector("#titlemodal")
// AJOUT DE CONSTANTE POUR MODAL 1 ET 2
const galerieModal = document.querySelector(".galerieModal")
const returnAndClose = document.querySelector(".js-modal-close")
const returnIcon= document.querySelector(".return")
const bordure = document.querySelector(".bordure")
const contentAddPhoto = document.querySelector(".content-add-photo")
const previewNewPhoto = document.querySelector(".preview")
const focusableSelector = 'button, a, input, textarea'
let focusables = []
let modal = null
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

function deleteOldGallery() {
    document.querySelector(".gallery").innerHTML = '';
}

async function createGallery(categoryId = null) {
    deleteOldGallery()
    const worksToDisplay = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    worksToDisplay.forEach(work => {
        const figure = document.createElement("figure");
        const imageElement = document.createElement("img")
        imageElement.src = work.imageUrl;
        imageElement.setAttribute("alt", work.title)
        const titleImage = document.createElement("figcaption");
        titleImage.innerText = work.title;
        galleryElement.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleImage);
    });
}



async function createFilter() {
    categories.unshift({ id: 0, name: "Tous" });
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, galleryElement);
    categories.forEach((categoryElement, i) => {
        const categoryBtn = document.createElement("button");
        categoryBtn.innerText = categoryElement.name;
        categoryBtn.value = categoryElement.id;
        categoryBtn.classList.add("category-btn");
        if (i === 0) {
            categoryBtn.classList.add("category-selected")
        };
        categoriesElement.appendChild(categoryBtn);
        categoryBtn.addEventListener("click", async (e) => {
            const selectedCategoryId = parseInt(e.target.value);
            await createGallery(selectedCategoryId);
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


async function loadData() {
    works = await fetchData("http://localhost:5678/api/works");
    await createGallery();
    categories = await fetchData("http://localhost:5678/api/categories");
    await createFilter();
    await adminMode();
}


// bandeau noir

function adminMode() {
    if (localStorage.getItem("token")) {
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "88px"
        // header.appendChild(editModeBar);
        header.insertAdjacentHTML("afterbegin", editModeBar)
        const logout = document.querySelector(".js-alredy-logged")
        const logoutRetourPageAccueil = document.querySelector(".logout-page-accueil")
        logout.textContent = "logout"
        logoutRetourPageAccueil.href = "#"
        logout.addEventListener("click", () => {
            localStorage.removeItem("token")
            location.reload()
        })
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        /**Create the <di> link to edit projects */
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;
        const portfolio = document.getElementById("portfolio");
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild)
        const titleProject = document.querySelector("#portfolio h2")
        containerDivBtn.appendChild(titleProject)
        titleProject.insertAdjacentHTML("afterend", btnToModified)
        const categoryBtn = document.querySelectorAll('.category-btn')
        categoryBtn.forEach(btn => {
            btn.style.display = 'none';
        })
        const edit = document.querySelector(".edit")
        if (edit) {
            edit.addEventListener("click", openModal)
        }
    }
}

// les Modals


const openModal = function (e) {
    e.preventDefault()
    ajoutPhoto.style.display = "block"
    bordure.style.display = "block"
    // masque icon retour dans modal 1
    returnIcon.style.display ="none"

    modal = document.querySelector(".modal")
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    // modif de la class pour fermeture juste icon et pa sa div entiere
    modal.querySelector('.close-deleted').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    displayWorksModal()
    openAddModal()
}

const closeModal = function () {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('aria-modal', 'false')
    modal.removeEventListener('click', closeModal)
    // MODIF DE LA CLASS POUR FERMETURE, JUSTE ICONE ET PASA DIV ENTIERE
    modal.querySelector('.close-deleted').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

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

    ajoutPhoto.addEventListener("click", () => {
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
            const btnAddFile = document.getElementById("file")
            
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

    })
}


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
        newPhoto.style.height = "169px";
        previewNewPhoto.appendChild(newPhoto);
        newPhoto.addEventListener("click", () => {
            btnAddFile.click();
        });
    }
};




