const galleryElement = document.querySelector(".gallery")
const titleAddModal = document.getElementById("title-photo")
const categorieAddModal = document.getElementById("categorie-photo")
const btnAddFile = document.getElementById("file")
const contentAddPhoto = document.querySelector(".content-add-photo")
const previewNewPhoto = document.querySelector(".preview")
const focusableSelector = 'button, a, input, textarea'
const btnValidAddModal = document.getElementById("btn-valid")
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
    modal = document.querySelector(".modal")
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null;
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    displayWorksModal()
    openAddModal()
}

const closeModal = function () {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('aria-modal', 'false')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
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
    const ajoutPhoto = document.querySelector(".ajoutphoto")
    const modalUn = document.querySelector("#titlemodal")
    const galerieModal = document.querySelector(".galerieModal")
    const bordure = document.querySelector(".bordure")
    ajoutPhoto.addEventListener("click", () => {
        console.log("hello")
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
        ajoutPhoto.remove()
        bordure.remove()
    })
}

// *Function to get a photo */
function getNewPhoto () {
    /**Constant to retrieve the first selected file, "this" refers to the btn "input type: file" */
    const selectedNewPhoto = this.files[0];
     /**Required size, 4mo */
    const sizeFileMax = 4 * 1024 * 1024;
    /**Required type */
    const typeFile = ["image/jpeg", "image/png"];
    /**Checking the photo size */
    if(selectedNewPhoto.size > sizeFileMax){
        alert("Votre fichier dépasse 4 mo.")
        /**Checking the photo type */    
    } else if(!typeFile.includes(selectedNewPhoto.type)){
        alert("Votre fichier n'est pas au bon format.")
    } else {   
        /**Hide photo content */ 
        contentAddPhoto.style.display = "none";
        /**Creating a new image */
        let newPhoto = document.createElement("img");
        /**Adding the source of the photo using the URL created for it */
        newPhoto.src = URL.createObjectURL(selectedNewPhoto);
        /**Add a class and changing the size to fit in the parent container */
        newPhoto.classList.add("new-photo");
        newPhoto.style.height = "169px";
        /**Adding the new image to the <div> previewNewPhoto */
        previewNewPhoto.appendChild(newPhoto);
        newPhoto.addEventListener("click", () => {
            /**Change photos by clicking on it */
            btnAddFile.click();
            /**Calling the function that resets the photo addition modal */
            // resetAddModal();
        });
    };
};




function setBtnState(disabled) { 
    btnValidAddModal.disabled = disabled;
    btnValidAddModal.style.cursor = disabled ? "not-allowed" : "pointer";
    btnValidAddModal.style.backgroundColor = disabled ? "grey" : "#1D6154";
};

// setBtnState(true);

function toggleSubmitBtn() {
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
btnAddFile.addEventListener("change", getNewPhoto);
titleAddModal.addEventListener("input", toggleSubmitBtn);
categorieAddModal.addEventListener("input", toggleSubmitBtn);
btnAddFile.addEventListener("change", toggleSubmitBtn);


