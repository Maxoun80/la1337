// =============================================================================
// 1. CONFIGURATION & MAPPING
// =============================================================================

// Lien de publication CSV officiel de ton Google Sheet
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

// Configuration des 15 rôles officiels (IDs 1 à 15)
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

// Base de données locale chargée dynamiquement
let TEAM_DATABASE = [];

// =============================================================================
// 2. UTILITAIRES & PARSING CSV
// =============================================================================

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
// 3. CHARGEMENT DE L'ÉQUIPE (GOOGLE SHEETS)
// =============================================================================

/**
 * Charge les bénévoles depuis le CSV Google Sheets
 */
async function loadTeamFromGoogleSheet() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.text();

        // Découpage en lignes
        const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
            console.warn("Fichier CSV vide ou incomplet.");
            return;
        }

        // Recherche automatique de la ligne d'en-tête (cherche "Nom" ou "Prénom")
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const parsed = parseCSVRow(lines[i]);
            if (parsed.includes("Nom") || parsed.includes("Prénom")) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            console.error("Impossible de trouver la ligne d'en-tête dans le CSV.");
            return;
        }

        const headers = parseCSVRow(lines[headerRowIndex]);

        // Repérage souple des index de colonnes
        const firstNameIdx = headers.indexOf("Prénom");
        const lastNameIdx = headers.indexOf("Nom");
        const mailIdx = headers.indexOf("Email");
        
        // Support de "Téléphone" ou "Telephone"
        const phoneIdx = headers.findIndex(h => h.startsWith("Tél") || h.startsWith("Tel"));
        
        // Support de "Rôle", "Role", "Roles"
        const rolesIdx = headers.findIndex(h => h.startsWith("Rô") || h.startsWith("Ro"));

        TEAM_DATABASE = [];

        // Lecture des lignes de données (sous l'en-tête)
        for (let i = headerRowIndex + 1; i < lines.length; i++) {
            const cols = parseCSVRow(lines[i]);

            const firstName = firstNameIdx !== -1 ? (cols[firstNameIdx] || "") : "";
            const lastName = lastNameIdx !== -1 ? (cols[lastNameIdx] || "") : "";
            
            // Reconstitution du nom complet
            const fullName = `${firstName} ${lastName}`.trim();

            if (!fullName) continue;

            // Extraction et conversion des rôles (ex: "1, 7" => [1, 7])
            const rawRoles = (rolesIdx !== -1 && cols[rolesIdx]) ? cols[rolesIdx] : "";
            const rolesArray = rawRoles
                .split(',')
                .map(r => parseInt(r.trim(), 10))
                .filter(r => !isNaN(r));

            // ID unique pour le sélecteur
            const memberId = fullName
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "_");

            TEAM_DATABASE.push({
                id: memberId,
                name: fullName,
                mail: mailIdx !== -1 ? (cols[mailIdx] || "") : "",
                phone: phoneIdx !== -1 ? (cols[phoneIdx] || "") : "",
                roles: rolesArray
            });
        }

        console.log(`✅ Équipe chargée avec succès (${TEAM_DATABASE.length} bénévoles) :`, TEAM_DATABASE);

        // Mise à jour du menu déroulant
        populateTeamSelect();

    } catch (error) {
        console.error("Erreur lors du chargement de l'équipe :", error);
    }
}

// =============================================================================
// 4. INTERFACE UTILISATEUR & ÉVÉNEMENTS
// =============================================================================

/**
 * Remplit le sélecteur d'équipe (<select id="inMemberSelect">)
 */
function populateTeamSelect() {
    // Utilisation du BON ID HTML : inMemberSelect
    const select = document.getElementById("inMemberSelect");
    if (!select) {
        console.warn("⚠️ Élément HTML #inMemberSelect introuvable.");
        return;
    }

    select.innerHTML = '<option value="">-- Sélectionnez un bénévole --</option>';

    TEAM_DATABASE.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

/**
 * Remplit automatiquement les champs du formulaire lors du choix d'un bénévole
 */
function onTeamMemberSelect(memberId) {
    const member = TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    // Remplissage des inputs HTML
    const nameInput = document.getElementById("nameInput") || document.getElementById("inName");
    const mailInput = document.getElementById("mailInput") || document.getElementById("inMail");
    const phoneInput = document.getElementById("phoneInput") || document.getElementById("inPhone");
    const rolesInput = document.getElementById("rolesInput") || document.getElementById("inRole");

    if (nameInput) nameInput.value = member.name;
    if (mailInput) mailInput.value = member.mail;
    if (phoneInput) phoneInput.value = member.phone;

    // Traduction des IDs [1, 7] en libellés textuels ("Directeur - Animateur")
    const roleLabels = member.roles
        .map(roleId => ROLE_MAP[roleId])
        .filter(Boolean);

    if (rolesInput) {
        rolesInput.value = roleLabels.join(" - ");
    }

    // Déclenche la fonction de mise à jour si elle existe dans ton projet
    if (typeof updateSignature === "function") {
        updateSignature();
    }
}

// =============================================================================
// 5. INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadTeamFromGoogleSheet();

    // Écouteur placé sur inMemberSelect
    const select = document.getElementById("inMemberSelect");
    if (select) {
        select.addEventListener("change", (e) => {
            onTeamMemberSelect(e.target.value);
        });
    }
});
