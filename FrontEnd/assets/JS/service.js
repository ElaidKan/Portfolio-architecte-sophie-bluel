
/**
 * Récupère les données de travail à partir du point de terminaison de l'API spécifié.
 * @return {Promise} Les données de travaux récupérées au format JSON.
 */

export async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");

        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return await response.json();
    } catch (error) {
        alert("Erreur : " + error)
    }
}
/**
 *Récupère les données à partir d'une URL spécifiée.
 *
 * @param {string} url - L'URL à partir de laquelle récupérer les données
 * @return {Promise} Renvoie une promesse qui se résout avec les données JSON extraites de l'URL
 */

export async function fetchData(url) {
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

/**
 * Supprime un élément de travail spécifique par ID.
 * @param {number} id - L'ID de l'élément de travail à supprimer
 * @return {Promise<Response>} La réponse de la demande de suppression
 */

export async function deleteWork(id) {

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "authorization": "Bearer " + localStorage.getItem("token")
        },
        body: null
    });
    return response

}

/**
 * Envoie une nouvelle photo au serveur avec le titre, la catégorie et le fichier image fourni.
 * @return {Promise} L'objet de réponse du serveur
 */
export async function envoiPhoto() {

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
    return response
}