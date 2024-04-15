// RECUPERER LES WORKS ET CATEGORIES ******
let works;
let categories;

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

// RECUPERATION DES WORKS ET CATEGORIES ******

export async function chargementDonnees() {
    works = await fetchData("http://localhost:5678/api/works");
    await creategallerie();
    categories = await fetchData("http://localhost:5678/api/categories");
    await creerFiltre();
    await modeAdmin();

}
