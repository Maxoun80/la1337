// =============================================================================
// 1. CONFIGURATION & MAPPING
// =============================================================================

// Remplace cette URL par le lien de publication CSV de ton Google Sheet
// (Fichier > Partager > Publier sur le web > Format CSV)
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

// Configuration des rôles officielle (1 à 15)
const ROLE_MAP = {
    1:  "Directeur",
    2:  "Directeur Adjoint",
    3:  "Président",
    4:  "Vice-Président",
    5:  "Secrétaire",
    6:  "Trésorière",
    7:  "Animateur",
    8:  "Animatrice",
    9:  "Programmation",
    10: "Technique",
    11: "RH",
    12: "Événementiel",
    13: "Communication",
    14: "Journaliste",
    15: "Membre extérieur"
};

// Base de données chargée dynamiquement en mémoire
let TEAM_DATABASE = [];

// =============================================================================
// 2. CHARGEMENT DE L'ÉQUIPE (GOOGLE SHEETS)
// =============================================================================

/**
 * Charge les données de l'équipe depuis le CSV Google Sheets
 */
async function loadTeamFromGoogleSheet() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.text();

        // Découpage du CSV par lignes
        const rows = data.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        if (rows.length === 0) return;

        // Lecture des en-têtes (ligne 0) pour repérer dynamiquement l'index des colonnes
        const headers = parseCSVRow(rows[0]);
        const nameIdx = headers.indexOf("Nom");
        const mailIdx = headers.indexOf("Email");
        const phoneIdx = headers.indexOf("Telephone");
        const rolesIdx = headers.indexOf("Roles");

        TEAM_DATABASE = [];

        // Parcours de chaque membre (à partir de la ligne 1)
        for (let i = 1; i < rows.length; i++) {
            const cols = parseCSVRow(rows[i]);
            if (!cols[nameIdx]) continue; // Saute les lignes sans nom

            // Découpage et conversion des rôles calculés ("1, 7" => [1, 7])
            const rawRoles = cols[rolesIdx] || "";
            const rolesArray = rawRoles
                .split(',')
                .map(r => parseInt(r.trim(), 10))
                .filter(r => !isNaN(r));

            // Génération d'un ID unique à partir du nom
            const memberId = cols[nameIdx]
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "_");

            TEAM_DATABASE.push({
                id: memberId,
                name: cols[nameIdx],
                mail: cols[mailIdx] || "",
                phone: cols[phoneIdx] || "",
                roles: rolesArray
            });
        }

        console.log("Équipe chargée avec succès depuis Google Sheets :", TEAM_DATABASE);

        // Mise à jour de la liste déroulante dans l'interface
        populateTeamSelect();

    } catch (error) {
        console.error("Impossible de charger l'équipe depuis Google Sheets :", error);
    }
}

/**
 * Découpe proprement une ligne CSV en gérant les guillemets et virgules internes
 */
function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

// =============================================================================
// 3. INTERFACE UTILISATEUR & ÉVÉNEMENTS
// =============================================================================

/**
 * Remplit le sélecteur d'équipe (<select id="teamSelect">) avec les membres chargés
 */
function populateTeamSelect() {
    const select = document.getElementById("teamSelect");
    if (!select) return;

    // Réinitialisation du sélecteur
    select.innerHTML = '<option value="">-- Sélectionnez un membre --</option>';

    TEAM_DATABASE.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

/**
 * Gère la sélection d'un membre pour pré-remplir les champs du formulaire
 */
function onTeamMemberSelect(memberId) {
    const member = TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    // Mise à jour des champs texte (adapter selon les IDs de tes inputs HTML)
    const nameInput = document.getElementById("nameInput");
    const mailInput = document.getElementById("mailInput");
    const phoneInput = document.getElementById("phoneInput");

    if (nameInput) nameInput.value = member.name;
    if (mailInput) mailInput.value = member.mail;
    if (phoneInput) phoneInput.value = member.phone;

    // Décodage des libellés de rôles via le ROLE_MAP
    const roleLabels = member.roles
        .map(roleId => ROLE_MAP[roleId])
        .filter(Boolean);

    const rolesInput = document.getElementById("rolesInput");
    if (rolesInput) {
        rolesInput.value = roleLabels.join(" - ");
    }

    // Déclenche la mise à jour du rendu du badge / de la signature s'il existe une fonction
    if (typeof updateSignature === "function") {
        updateSignature();
    }
}

// =============================================================================
// 4. INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lancement du chargement dynamique
    loadTeamFromGoogleSheet();

    // 2. Écoute du changement de sélection du membre
    const select = document.getElementById("teamSelect");
    if (select) {
        select.addEventListener("change", (e) => {
            onTeamMemberSelect(e.target.value);
        });
    }
});
