// =============================================================================
// 1. CONFIGURATION & CARTOGRAPHIES OFFICIELLES
// =============================================================================

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

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

const SIGNATURE_TEMPLATES = {
    officiel:    { id: "officiel",    name: " Signature Officielle Cyber / Complète" },
    minimaliste: { id: "minimaliste", name: " Minimaliste / Épurée" },
    ligne:       { id: "ligne",       name: " Version Ligne complète" },
    courrier:    { id: "courrier",    name: " Version Courrier / Texte brut" }
};

const THEME_IMAGES = {
    cyber:    { name: "🎧 Mode Radio Cyber", url: "https://i.postimg.cc/63Y5PbDR/LA1337-Signatures-de-mail.png" },
    ete:      { name: "☀️ Mode Été",        url: "https://i.postimg.cc/7YyJTjw9/LA1337-Signatures-de-mail(1).png" },
    noel:     { name: "🎄 Mode Noël",       url: "https://i.postimg.cc/XqWNpSdT/LA1337-Signatures-de-mail(2).png" },
    nouvelan: { name: "🥂 Nouvel An",       url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png" }
};

const LOGO_IMAGES = { 
    blanc: { name: "⚪ Logo Blanc Officiel", url: "https://i.postimg.cc/4x659pDr/logo-small.png" },
    noel:  { name: "🎄 Logo Noël Officiel",  url: "https://i.postimg.cc/50Ty8Btq/Capture-d-ecran-2026-07-18-002918.png" }
};

let TEAM_DATABASE = [];

// =============================================================================
// 2. LOCALSTORAGE & CHARGEMENT CSV GOOGLE SHEETS
// =============================================================================

function getCustomMembers() {
    const stored = localStorage.getItem('customMembers');
    return stored ? JSON.parse(stored) : [];
}

function loadCustomMembers() {
    const customMembers = getCustomMembers();
    customMembers.forEach(member => {
        if (!TEAM_DATABASE.find(m => m.mail === member.mail)) {
            TEAM_DATABASE.push(member);
        }
    });
}

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

async function loadTeamFromGoogleSheet() {
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.text();
        const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) return;

        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const parsed = parseCSVRow(lines[i]);
            if (parsed.includes("Nom") || parsed.includes("Prénom")) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) return;

        const headers = parseCSVRow(lines[headerRowIndex]);
        const firstNameIdx = headers.indexOf("Prénom");
        const lastNameIdx = headers.indexOf("Nom");
        const mailIdx = headers.indexOf("Email");
        const phoneIdx = headers.findIndex(h => h.startsWith("Tél") || h.startsWith("Tel"));
        const rolesIdx = headers.findIndex(h => h.startsWith("Rô") || h.startsWith("Ro"));

        const remoteTeam = [];

        for (let i = headerRowIndex + 1; i < lines.length; i++) {
            const cols = parseCSVRow(lines[i]);
            const firstName = firstNameIdx !== -1 ? (cols[firstNameIdx] || "") : "";
            const lastName = lastNameIdx !== -1 ? (cols[lastNameIdx] || "") : "";
            const fullName = `${firstName} ${lastName}`.trim();

            if (!fullName) continue;

            const rawRoles = (rolesIdx !== -1 && cols[rolesIdx]) ? cols[rolesIdx] : "";
            const rolesArray = rawRoles
                .split(',')
                .map(r => parseInt(r.trim(), 10))
                .filter(r => !isNaN(r));

            const memberId = fullName
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "_");

            remoteTeam.push({
                id: memberId,
                name: fullName,
                mail: mailIdx !== -1 ? (cols[mailIdx] || "") : "",
                phone: phoneIdx !== -1 ? (cols[phoneIdx] || "") : "",
                roles: rolesArray
            });
        }

        if (remoteTeam.length > 0) {
            TEAM_DATABASE = remoteTeam;
        }

        loadCustomMembers();
        populateTeamSelect();

    } catch (error) {
        console.warn("⚠️ Utilisation du secours local :", error);
        loadCustomMembers();
        populateTeamSelect();
    }
}

// =============================================================================
// 3. SYNCHRONISATION AVEC L'INTERFACE HTML
// =============================================================================

function populateTeamSelect() {
    const select = document.getElementById("inMemberSelect") || document.getElementById("memberSelect");
    if (!select) return;

    select.innerHTML = `
        <option value="">-- Sélectionner un membre --</option>
        <option value="manual">➕ Saisie manuelle / Ajouter un membre</option>
    `;

    TEAM_DATABASE.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

function onTeamMemberSelect(memberId) {
    if (!memberId) return;

    // Saisie manuelle : ouvre la modal existante du site
    if (memberId === "manual") {
        if (typeof openAddMemberModal === "function") openAddMemberModal();
        else if (typeof openModal === "function") openModal();
        return;
    }

    const member = TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    // Remplissage du Nom / Mail / Téléphone
    const nameInput  = document.getElementById("inName")  || document.getElementById("nameInput");
    const mailInput  = document.getElementById("inMail")  || document.getElementById("mailInput");
    const phoneInput = document.getElementById("inPhone") || document.getElementById("phoneInput");

    if (nameInput)  { nameInput.value = member.name;   nameInput.dispatchEvent(new Event('input', { bubbles: true })); }
    if (mailInput)  { mailInput.value = member.mail;   mailInput.dispatchEvent(new Event('input', { bubbles: true })); }
    if (phoneInput) { phoneInput.value = member.phone; phoneInput.dispatchEvent(new Event('input', { bubbles: true })); }

    // Remplissage des Checkboxes de Rôles
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        // On décoche par défaut si c'est une case de rôle
        if (cb.name === "roles" || cb.id.startsWith("role_") || cb.closest('.roles-container')) {
            cb.checked = false;
        }
    });

    member.roles.forEach(roleId => {
        // Recherche par ID ou valeur de rôle
        const cb = document.getElementById(`role_${roleId}`) || 
                   document.querySelector(`input[value="${roleId}"]`) ||
                   document.querySelector(`input[value="${ROLE_MAP[roleId]}"]`);
        if (cb) {
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Appel des fonctions globales du script principal pour rafraîchir l'aperçu Canvas/HTML
    if (typeof updateSignature === "function") updateSignature();
    if (typeof render === "function") render();
    if (typeof draw === "function") draw();
}

// =============================================================================
// 4. INITIALISATION AU CHARGEMENT
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadCustomMembers();
    populateTeamSelect();
    loadTeamFromGoogleSheet();

    const select = document.getElementById("inMemberSelect") || document.getElementById("memberSelect");
    if (select) {
        select.addEventListener("change", (e) => {
            onTeamMemberSelect(e.target.value);
        });
    }
});
