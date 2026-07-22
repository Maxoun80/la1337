// =============================================================================
// 1. CONFIGURATION, CARTOGRAPHIES, BANNIÈRES & LOGOS
// =============================================================================

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

// 1. CARTOGRAPHIE DES RÔLES
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

// 2. TEMPLATES / STYLES DE SIGNATURES
const SIGNATURE_TEMPLATES = {
    officiel: {
        id: "officiel",
        name: " Signature Officielle Cyber / Complète",
        showBanner: true,
        showLogo: true,
        showLive: true
    },
    minimaliste: {
        id: "minimaliste",
        name: " Minimaliste / Épurée",
        showBanner: false,
        showLogo: true,
        showLive: false
    },
    ligne: {
        id: "ligne",
        name: " Version Ligne complète",
        showBanner: false,
        showLogo: true,
        showLive: true
    },
    courrier: {
        id: "courrier",
        name: " Version Courrier / Texte brut",
        showBanner: false,
        showLogo: false,
        showLive: false
    }
};

// 3. BANNIÈRES THÉMATIQUES OFFICIELLES
const THEME_IMAGES = {
    cyber: {
        name: "🎧 Mode Radio Cyber (Par défaut - Officiel)",
        url: "https://i.postimg.cc/63Y5PbDR/LA1337-Signatures-de-mail.png",
        textColor: "#ff3366",
        roleColor: "#e1e1e6",
        liveBgColor: "#ff3366",
        liveTxtColor: "#ffffff"
    },
    ete: {
        name: "☀️ Mode Été (Fond Officiel)",
        url: "https://i.postimg.cc/7YyJTjw9/LA1337-Signatures-de-mail(1).png",
        textColor: "#ff3366",
        roleColor: "#e1e1e6",
        liveBgColor: "#ff3366",
        liveTxtColor: "#ffffff"
    },
    noel: {
        name: "🎄 Mode Noël (Fond Officiel)",
        url: "https://i.postimg.cc/XqWNpSdT/LA1337-Signatures-de-mail(2).png",
        textColor: "#ffffff",
        roleColor: "#f0a5a5",
        liveBgColor: "#ffffff",
        liveTxtColor: "#b71c1c"
    },
    nouvelan: {
        name: "🥂 Nouvel An (Fond Officiel)",
        url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png",
        textColor: "#dfb76c",
        roleColor: "#ffffff",
        liveBgColor: "#dfb76c",
        liveTxtColor: "#000000"
    }
};

// 4. LOGOS DE LA RADIO
const LOGO_IMAGES = { 
    blanc: {
        name: "⚪ Logo Blanc Officiel",
        url: "https://i.postimg.cc/4x659pDr/logo-small.png"
    },
    noel: {
        name: "🎄 Logo Noël Officiel",
        url: "https://i.postimg.cc/50Ty8Btq/Capture-d-ecran-2026-07-18-002918.png"
    }
};

let TEAM_DATABASE = [];
let currentTemplateKey = "officiel";
let currentThemeKey = "cyber";
let currentLogoKey = "blanc";

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
        console.warn("⚠️ Secours local activé :", error);
        loadCustomMembers();
        populateTeamSelect();
    }
}

// =============================================================================
// 3. DECLENCHEMENT DU RENDU (TEMPLATES + BANNIÈRE + LOGO)
// =============================================================================

function triggerRender() {
    const templateConfig = SIGNATURE_TEMPLATES[currentTemplateKey] || SIGNATURE_TEMPLATES.officiel;
    const themeConfig    = THEME_IMAGES[currentThemeKey]         || THEME_IMAGES.cyber;
    const logoConfig     = LOGO_IMAGES[currentLogoKey]           || LOGO_IMAGES.blanc;

    // Appel sécurisé des fonctions de rendu avec l'ensemble des configurations visuelles
    if (typeof updateSignature === "function") {
        updateSignature(currentTemplateKey, templateConfig, themeConfig, logoConfig);
    }
    if (typeof render === "function") {
        render(currentTemplateKey, templateConfig, themeConfig, logoConfig);
    }
    if (typeof draw === "function") {
        draw(currentTemplateKey, templateConfig, themeConfig, logoConfig);
    }
}

// =============================================================================
// 4. SELECTION DU MEMBRE & GESTION DES EVENEMENTS
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

    if (memberId === "manual") {
        if (typeof openAddMemberModal === "function") openAddMemberModal();
        else if (typeof openModal === "function") openModal();
        return;
    }

    const member = TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    const nameInput  = document.getElementById("inName")  || document.getElementById("nameInput");
    const mailInput  = document.getElementById("inMail")  || document.getElementById("mailInput");
    const phoneInput = document.getElementById("inPhone") || document.getElementById("phoneInput");

    if (nameInput)  { nameInput.value = member.name;   nameInput.dispatchEvent(new Event('input', { bubbles: true })); }
    if (mailInput)  { mailInput.value = member.mail;   mailInput.dispatchEvent(new Event('input', { bubbles: true })); }
    if (phoneInput) { phoneInput.value = member.phone; phoneInput.dispatchEvent(new Event('input', { bubbles: true })); }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.name === "roles" || cb.id.startsWith("role_") || cb.closest('.roles-container')) {
            cb.checked = false;
        }
    });

    member.roles.forEach(roleId => {
        const cb = document.getElementById(`role_${roleId}`) || 
                   document.querySelector(`input[value="${roleId}"]`) ||
                   document.querySelector(`input[value="${ROLE_MAP[roleId]}"]`);
        if (cb) {
            cb.checked = true;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    triggerRender();
}

function onTemplateSelect(val) {
    if (!val) return;
    if (val.includes("minimaliste") || val === "minimaliste") currentTemplateKey = "minimaliste";
    else if (val.includes("ligne") || val === "ligne") currentTemplateKey = "ligne";
    else if (val.includes("courrier") || val === "courrier") currentTemplateKey = "courrier";
    else currentTemplateKey = "officiel";

    triggerRender();
}

function onThemeSelect(val) {
    if (!val) return;
    currentThemeKey = THEME_IMAGES[val] ? val : "cyber";
    triggerRender();
}

function onLogoSelect(val) {
    if (!val) return;
    currentLogoKey = LOGO_IMAGES[val] ? val : "blanc";
    triggerRender();
}

// =============================================================================
// 5. INITIALISATION
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadCustomMembers();
    populateTeamSelect();
    loadTeamFromGoogleSheet();

    // Écouteur Sélection Membre
    const selectMember = document.getElementById("inMemberSelect") || document.getElementById("memberSelect");
    if (selectMember) {
        selectMember.addEventListener("change", (e) => onTeamMemberSelect(e.target.value));
    }

    // Écouteur Style / Template
    const selectTemplate = document.getElementById("inTemplateSelect") || document.getElementById("templateSelect");
    if (selectTemplate) {
        selectTemplate.addEventListener("change", (e) => onTemplateSelect(e.target.value));
    }

    // Écouteur Bannières / Thèmes
    const selectTheme = document.getElementById("inThemeSelect") || document.getElementById("themeSelect");
    if (selectTheme) {
        selectTheme.addEventListener("change", (e) => onThemeSelect(e.target.value));
    }

    // Écouteur Logos
    const selectLogo = document.getElementById("inLogoSelect") || document.getElementById("logoSelect");
    if (selectLogo) {
        selectLogo.addEventListener("change", (e) => onLogoSelect(e.target.value));
    }
});
