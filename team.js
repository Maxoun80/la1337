// =============================================================================
// 1. CONFIGURATION, CARTOGRAPHIE & BANNIES / LOGOS (LA 1337 RADIO)
// =============================================================================

// Lien de publication CSV officiel de ton Google Sheet
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

// 2. BANNIÈRES THÉMATIQUES AVEC COULEURS ADAPTÉES
const THEME_IMAGES = {
    cyber: {
        name: "🎧 Mode Radio Cyber (Par défaut - Officiel)",
        url: "https://i.postimg.cc/63Y5PbDR/LA1337-Signatures-de-mail.png",
        textColor: "#ff3366",       // Rose/Rouge cyber d'origine
        roleColor: "#e1e1e6",       // Gris clair
        liveBgColor: "#ff3366",     // Fond du Live On
        liveTxtColor: "#ffffff"     // Texte du Live On
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
        textColor: "#ffffff",       // Blanc
        roleColor: "#f0a5a5",       // Rose/Rouge clair
        liveBgColor: "#ffffff",     // Badge blanc
        liveTxtColor: "#b71c1c"     // Rouge foncé
    },
    nouvelan: {
        name: "🥂 Nouvel An (Fond Officiel)",
        url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png",
        textColor: "#dfb76c",       // Doré
        roleColor: "#ffffff",       // Blanc
        liveBgColor: "#dfb76c",     // Badge doré
        liveTxtColor: "#000000"     // Noir
    }
};

// 3. LOGOS DE LA RADIO
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

// Base de données locale de fallback
let TEAM_DATABASE = [
    { id: "archer",    name: "ARCHER Vincent",      mail: "vincent.a@la1337.com",      phone: "03 65 17 00 63", roles: [7] },
    { id: "bernard",   name: "BERNARD Elise",       mail: "elise.b@la1337.com",        phone: "03 65 17 00 63", roles: [8, 12, 14] },
    { id: "dafflon",   name: "DAFFLON Anais",       mail: "anais.d@la1337.com",        phone: "03 65 17 00 63", roles: [8] },
    { id: "dherbomez", name: "DHERBOMEZ Margaux",   mail: "margaux.d@la1337.com",    phone: "03 65 17 00 63", roles: [12] },
    { id: "dossantos", name: "DOS SANTOS Cindy",    mail: "cindy.d@la1337.com",      phone: "03 65 17 00 63", roles: [8] },
    { id: "fonvielle", name: "FONVIELLE Magali",    mail: "magali.f@la1337.com",     phone: "03 65 17 00 63", roles: [8] },
    { id: "haliti",    name: "HALITI Merema",       mail: "merema.h@la1337.com",     phone: "03 65 17 00 63", roles: [8] },
    { id: "jaffrezic", name: "JAFFREZIC Solenn",    mail: "solenn.j@la1337.com",     phone: "03 65 17 00 63", roles: [11] },
    { id: "kirsz",     name: "KIRSZ Rafael",        mail: "rafael.k@la1337.com",     phone: "03 65 17 00 63", roles: [7, 9, 11] },
    { id: "marechal",  name: "MARECHAL Laurence",   mail: "laurence.m@la1337.com",   phone: "03 65 17 00 63", roles: [8] },
    { id: "morel",     name: "MOREL Enzo",          mail: "enzo.m@la1337.com",       phone: "03 65 17 00 63", roles: [3] },
    { id: "noel",      name: "NOEL Axel",           mail: "axel.n@la1337.com",        phone: "03 65 17 00 63", roles: [4, 7] },
    { id: "philippon", name: "PHILIPPON Pierre",    mail: "pierre.p@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "porino",    name: "PORINO Laeticia",     mail: "laeticia.p@la1337.com",   phone: "03 65 17 00 63", roles: [8] },
    { id: "rocquemont",name: "ROCQUEMONT Maxence",  mail: "maxence.r@la1337.com",    phone: "03 65 17 00 63", roles: [2, 5, 7, 10, 11] },
    { id: "samson",    name: "SAMSON Solyvan",      mail: "solyvan.s@la1337.com",    phone: "03 65 17 00 63", roles: [15] },
    { id: "schilling", name: "SCHILLING Ingrid",    mail: "ingrid.s@la1337.com",     phone: "03 65 17 00 63", roles: [6] },
    { id: "schneider", name: "SCHNEIDER Thibault",  mail: "thibault.s@la1337.com",   phone: "03 65 17 00 63", roles: [10] },
    { id: "stef",      name: "STEF Laura",          mail: "laura.s@la1337.com",      phone: "03 65 17 00 63", roles: [13] },
    { id: "vankets",   name: "VAN KETS Guillaume",  mail: "guillaume.v@la1337.com",  phone: "03 65 17 00 63", roles: [1, 7] },
    { id: "vernet",    name: "VERNET Jeremy",       mail: "jeremy.v@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "wagne",     name: "WAGNE Coumba",        mail: "coumba.w@la1337.com",     phone: "03 65 17 00 63", roles: [8, 12] }
];

// =============================================================================
// 2. FONCTIONS DE STOCKAGE ET SÉCURITÉ LOCALSTORAGE
// =============================================================================

function getCustomMembers() {
    const stored = localStorage.getItem('customMembers');
    return stored ? JSON.parse(stored) : [];
}

function addCustomMember(member) {
    const customMembers = getCustomMembers();
    const exists = customMembers.some(m => m.mail === member.mail);
    if (!exists) {
        customMembers.push(member);
        localStorage.setItem('customMembers', JSON.stringify(customMembers));
    }
}

function clearCustomMembers() {
    localStorage.removeItem('customMembers');
}

function loadCustomMembers() {
    const customMembers = getCustomMembers();
    customMembers.forEach(member => {
        if (!TEAM_DATABASE.find(m => m.mail === member.mail)) {
            TEAM_DATABASE.push(member);
        }
    });
}

// =============================================================================
// 3. PARSING CSV & SYNCHRONISATION GOOGLE SHEETS
// =============================================================================

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

        // On réintègre les personnes ajoutées à la main si besoin
        loadCustomMembers();

        // Met à jour l'affichage
        populateTeamSelect();

    } catch (error) {
        console.warn("⚠️ Utilisation de la base locale de secours :", error);
        loadCustomMembers();
        populateTeamSelect();
    }
}

// =============================================================================
// 4. GESTION DE L'IHM ET SÉLECTION DES BÉNÉVOLES
// =============================================================================

function populateTeamSelect() {
    const select = document.getElementById("inMemberSelect");
    if (!select) return;

    select.innerHTML = '<option value="">-- Saisie manuelle / Sélectionner --</option>';

    TEAM_DATABASE.forEach(member => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

function onTeamMemberSelect(memberId) {
    if (!memberId) return;

    const member = TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    const nameInput  = document.getElementById("inName")  || document.getElementById("nameInput");
    const mailInput  = document.getElementById("inMail")  || document.getElementById("mailInput");
    const phoneInput = document.getElementById("inPhone") || document.getElementById("phoneInput");
    const rolesInput = document.getElementById("inRole")  || document.getElementById("rolesInput");

    const updateInputValue = (inputEl, value) => {
        if (inputEl) {
            inputEl.value = value;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    updateInputValue(nameInput, member.name);
    updateInputValue(mailInput, member.mail);
    updateInputValue(phoneInput, member.phone);

    const roleLabels = member.roles
        .map(roleId => ROLE_MAP[roleId])
        .filter(Boolean);

    updateInputValue(rolesInput, roleLabels.join(" - "));

    if (typeof updateSignature === "function") updateSignature();
    if (typeof render === "function") render();
    if (typeof draw === "function") draw();
}

// =============================================================================
// 5. INITIALISATION
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Charge d'abord les membres sauvegardés localement
    loadCustomMembers();
    populateTeamSelect();

    // 2. Tente la synchro live depuis le Google Sheet
    loadTeamFromGoogleSheet();

    // 3. Écoute la sélection dans la liste
    const select = document.getElementById("inMemberSelect");
    if (select) {
        select.addEventListener("change", (e) => {
            onTeamMemberSelect(e.target.value);
        });
    }
});
