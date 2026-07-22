// =============================================================================
// 1. CONFIGURATION, CARTOGRAPHIE & BANNIÈRES / LOGOS / TEMPLATES (LA 1337 RADIO)
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

// 2. TEMPLATES / STYLES DE SIGNATURES
const SIGNATURE_TEMPLATES = {
    officiel: {
        id: "officiel",
        name: " Signature Officielle Cyber / Complète",
        showBanner: true,
        showLogo: true,
        showLive: true,
        layout: "full"
    },
    minimaliste: {
        id: "minimaliste",
        name: " Minimaliste / Épurée",
        showBanner: false,
        showLogo: true,
        showLive: false,
        layout: "compact"
    },
    ligne: {
        id: "ligne",
        name: " Version Ligne complète",
        showBanner: false,
        showLogo: true,
        showLive: true,
        layout: "inline"
    },
    courrier: {
        id: "courrier",
        name: " Version Courrier / Texte brut",
        showBanner: false,
        showLogo: false,
        showLive: false,
        layout: "text"
    }
};

// 3. BANNIÈRES THÉMATIQUES AVEC COULEURS ADAPTÉES
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

// Base de données de l'équipe (remplie dynamiquement par le Google Sheet)
let TEAM_DATABASE = [];

// =============================================================================
// 2. FONCTIONS DE STOCKAGE LOCALSTORAGE POUR BÉNÉVOLES PERSONNALISÉS
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

        // Ajout des membres enregistrés localement
        loadCustomMembers();

        // Met à jour l'affichage dans le sélecteur HTML
        populateTeamSelect();

    } catch (error) {
        console.warn("⚠️ Impossible de charger Google Sheets, fallback sur localStorage :", error);
        loadCustomMembers();
        populateTeamSelect();
    }
}

// =============================================================================
// 4. GESTION DES MODALS & SAISIE MANUELLE
// =============================================================================

function openAddMemberModal() {
    const modal = document.getElementById("addMemberModal") || document.getElementById("memberModal") || document.querySelector(".modal");
    if (modal) {
        modal.classList.add("active");
        modal.classList.add("show");
        modal.style.display = "flex";
    } else {
        // Fallback si la pop-in HTML n'existe pas : invite JS simple
        const name = prompt("Nom et Prénom du nouveau membre :");
        if (!name) return;
        const mail = prompt("Adresse E-mail :");
        const phone = prompt("Téléphone (ex: 03 65 17 00 63) :", "03 65 17 00 63");
        const roleStr = prompt("Rôle(s) (ex: Animateur) :");

        const newMember = {
            id: name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            name: name,
            mail: mail || "",
            phone: phone || "03 65 17 00 63",
            roles: []
        };

        addCustomMember(newMember);
        TEAM_DATABASE.push(newMember);
        populateTeamSelect();
        
        const select = document.getElementById("inMemberSelect");
        if (select) select.value = newMember.id;
        onTeamMemberSelect(newMember.id);
    }
}

function closeAddMemberModal() {
    const modal = document.getElementById("addMemberModal") || document.getElementById("memberModal") || document.querySelector(".modal");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("show");
        modal.style.display = "none";
    }
}

// =============================================================================
// 5. GESTION DE L'IHM, SÉLECTION ET TEMPLATES
// =============================================================================

function populateTeamSelect() {
    const select = document.getElementById("inMemberSelect");
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

    // Déclenchement de la pop-up / modal lors de la Saisie Manuelle
    if (memberId === "manual") {
        openAddMemberModal();
        return;
    }

    // --- Autoremplissage pour un membre sélectionné ---
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

    // Événements de mise à jour globaux
    if (typeof updateSignature === "function") updateSignature();
    if (typeof render === "function") render();
    if (typeof draw === "function") draw();
}

function onTemplateSelect(templateId) {
    const template = SIGNATURE_TEMPLATES[templateId] || SIGNATURE_TEMPLATES.officiel;
    if (typeof updateSignature === "function") updateSignature(template);
    if (typeof render === "function") render(template);
    if (typeof draw === "function") draw(template);
}

// =============================================================================
// 6. INITIALISATION & ÉCOUTEURS D'ÉVÉNEMENTS
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialise les membres personnalisés
    loadCustomMembers();
    populateTeamSelect();

    // 2. Synchronise avec le Google Sheet en arrière-plan
    loadTeamFromGoogleSheet();

    // 3. Écoute du sélecteur membre
    const select = document.getElementById("inMemberSelect");
    if (select) {
        select.addEventListener("change", (e) => {
            onTeamMemberSelect(e.target.value);
        });
    }

    // 4. Écoute des boutons d'ouverture / fermeture du Modal (si présents dans le HTML)
    const btnAddMember = document.getElementById("btnAddMember") || document.querySelector(".btn-add-member");
    if (btnAddMember) {
        btnAddMember.addEventListener("click", (e) => {
            e.preventDefault();
            openAddMemberModal();
        });
    }

    const btnCloseModal = document.getElementById("btnCloseModal") || document.querySelector(".btn-close-modal");
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", (e) => {
            e.preventDefault();
            closeAddMemberModal();
        });
    }

    // 5. Écoute du sélecteur de style / template
    const templateSelect = document.getElementById("inTemplateSelect") || document.getElementById("templateSelect");
    if (templateSelect) {
        templateSelect.addEventListener("change", (e) => {
            onTemplateSelect(e.target.value);
        });
    }
});
