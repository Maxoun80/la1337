// =============================================================================
// 1. CONFIGURATION GENERALE & RESSOURCES
// =============================================================================

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

// Dictionnaire officiel des 15 rôles LA 1337
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

// Aliases globaux pour compatibilité HTML
window.ROLE_MAP = ROLE_MAP;
window.roleMap = ROLE_MAP;
window.ROLES_LIST = ROLE_MAP;

// BANNIÈRES & THÈMES
const THEME_IMAGES = {
    cyber:    { name: "⚡ Cyberpunk Rouge", url: "https://i.postimg.cc/63Y5PbDR/LA1337-Signatures-de-mail.png", color: "#ff3366", textColor: "#ff3366", roleColor: "#e1e1e6", liveBgColor: "#ff3366", liveTxtColor: "#ffffff" },
    ete:      { name: "☀️ Été",            url: "https://i.postimg.cc/7YyJTjw9/LA1337-Signatures-de-mail(1).png", color: "#ff3366", textColor: "#ff3366", roleColor: "#e1e1e6", liveBgColor: "#ff3366", liveTxtColor: "#ffffff" },
    noel:     { name: "❄️ Noël",           url: "https://i.postimg.cc/XqWNpSdT/LA1337-Signatures-de-mail(2).png", color: "#ffffff", textColor: "#ffffff", roleColor: "#e1e1e6", liveBgColor: "#ffffff", liveTxtColor: "#111111" },
    nouvelan: { name: "🎉 Nouvel An",      url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png", color: "#dfb76c", textColor: "#dfb76c", roleColor: "#e1e1e6", liveBgColor: "#dfb76c", liveTxtColor: "#ffffff" }
};
window.THEME_IMAGES = THEME_IMAGES;
window.THEMES = THEME_IMAGES;

// LOGOS
const LOGO_IMAGES = {
    blanc: { name: "💿 Logo Blanc Officiel", url: "https://i.postimg.cc/4x659pDr/logo-small.png" },
    noel:  { name: "🎅 Logo Bonnet de Noël", url: "https://i.postimg.cc/50Ty8Btq/Capture-d-ecran-2026-07-18-002918.png" }
};
window.LOGO_IMAGES = LOGO_IMAGES;
window.LOGOS = {
    blanc: LOGO_IMAGES.blanc.url,
    noel:  LOGO_IMAGES.noel.url
};

let TEAM_DATA = [];
window.TEAM_DATABASE = [];
const imageCache = {};

// =============================================================================
// 2. PARSER CSV & CHARGEMENT DE L'ÉQUIPE
// =============================================================================

function parseCSVRow(row) {
    const result = [];
    let current = '', inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim());
    return result;
}

async function loadTeamData() {
    try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL);
        const text = await res.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        const members = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVRow(lines[i]);
            if (!cols[0] && !cols[1]) continue;
            
            // Nettoyage des chaînes
            let rawFirstName = (cols[1] || '').trim();
            let rawLastName = (cols[0] || '').trim();
            
            // On retire les emails éventuels collés dans le nom/prénom
            rawFirstName = rawFirstName.replace(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*/, '');
            rawLastName = rawLastName.replace(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\s*/, '');

            const fullName = `${rawFirstName} ${rawLastName}`.trim();
            const roles = (cols[4] || '').split(',').map(r => parseInt(r.trim(), 10)).filter(r => !isNaN(r));

            members.push({
                id: fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_'),
                name: fullName,
                mail: cols[2] || '',
                phone: cols[3] || '',
                roles: roles
            });
        }
        
        TEAM_DATA = members;
        window.TEAM_DATABASE = members;
        
        // Initialiser le sélecteur du HTML s'il est prêt
        if (typeof initMemberSelector === "function") {
            initMemberSelector();
        }
    } catch (e) {
        console.warn("⚠️ Impossible de charger le Sheet CSV :", e);
    }
}

// =============================================================================
// 3. SELECTION DU MEMBRE & COCHAGE AUTOMATIQUE DES RÔLES
// =============================================================================

function selectMember(memberId) {
    const member = window.TEAM_DATABASE.find(m => m.id === memberId);
    if (!member) return;

    // 1. Décocher toutes les cases de rôles
    const checkboxes = document.getElementsByName('roleCheck');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

    // 2. Cocher les rôles attribués à ce membre
    if (member.roles && Array.isArray(member.roles)) {
        for (let i = 0; i < checkboxes.length; i++) {
            const val = parseInt(checkboxes[i].value, 10);
            if (member.roles.includes(val)) {
                checkboxes[i].checked = true;
            }
        }
    }

    // 3. Réinitialiser le rôle personnalisé
    const chkCustom = document.getElementById('chkCustomRole');
    if (chkCustom) chkCustom.checked = false;
    const customZone = document.getElementById('customRoleInputZone');
    if (customZone) customZone.style.display = 'none';

    // 4. Mettre à jour la signature HTML / Canvas
    if (typeof updateSig === "function") updateSig();
}

// Intercepter et compléter la fonction du HTML
const originalHandleMemberChange = window.handleMemberChange;
window.handleMemberChange = function() {
    const choice = document.getElementById('inMemberSelect')?.value;
    if (choice && choice !== 'custom' && choice !== '') {
        selectMember(choice);
    } else if (typeof originalHandleMemberChange === 'function') {
        originalHandleMemberChange();
    }
};

// =============================================================================
// 4. INITIALISATION AU CHARGEMENT DE LA PAGE
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadTeamData();
});
