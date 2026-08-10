// =============================================================================
// 1. CONFIGURATION GENERALE & RESSOURCES
// =============================================================================

// 1. Initialisation de la connexion Supabase
const SUPABASE_URL = 'https://appepchfrfghfulirckz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wjpCqcbmlEnHvYhJRziUGQ_SIubrlSg';

// Client Supabase connecté au SDK global du navigateur
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    cyber:    { name: "⚡ Généraliste",        url: "https://i.postimg.cc/SsB3VfZD/general.png", color: "#c00000", textColor: "#c00000", roleColor: "#e1e1e6", liveBgColor: "#c00000", liveTxtColor: "#ffffff" },
    ete:      { name: "☀️ Été (prochainement)", url: "[LIEN POSTIMG]",                            color: "#ff3366", textColor: "#ff3366", roleColor: "#e1e1e6", liveBgColor: "#ff3366", liveTxtColor: "#ffffff" },
    noel:     { name: "❄️ Noël",              url: "https://i.postimg.cc/LXcwv3yx/noel.png",    color: "#ffffff", textColor: "#ffffff", roleColor: "#e1e1e6", liveBgColor: "#ffffff", liveTxtColor: "#111111" },
    nouvelan: { name: "🎉 Nouvel An",         url: "https://i.postimg.cc/76FdXnBB/nouvel-an.png",color: "#dfb76c", textColor: "#dfb76c", roleColor: "#e1e1e6", liveBgColor: "#dfb76c", liveTxtColor: "#ffffff" },
    telethon: { name: "☀️ Telethon",          url: "https://i.postimg.cc/zBs6pFdt/telethon.png", color: "#a20352", textColor: "#a20352", roleColor: "#ffffff", liveBgColor: "#a20352", liveTxtColor: "#ffffff" }
};
window.THEME_IMAGES = THEME_IMAGES;
window.THEMES = THEME_IMAGES;

// LOGOS
const LOGO_IMAGES = {
    blanc: { name: "💿 Logo Blanc Officiel", url: "https://i.postimg.cc/4x659pDr/logo-small.png" },
    noel:  { name: "🎅 Logo Bonnet de Noël", url: "https://i.postimg.cc/QNKx2GKj/Logo-de-Noel.png" }
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
// 2. CHARGEMENT SUPABASE & INITIALISATION DU SELECTEUR
// =============================================================================

async function loadTeamMembers() {
    try {
        const { data: membres, error } = await supabaseClient
            .from('membres')
            .select('*')
            .order('nom', { ascending: true });

        if (error) {
            console.error('Erreur Supabase :', error.message);
            return;
        }

        // Adapter la structure de la base pour le reste de l'application
        const formattedMembers = membres.map(m => {
            const fullName = `${m.prenom || ''} ${(m.nom || '').toUpperCase()}`.trim();
            return {
                id: String(m.id),
                name: fullName,
                mail: m.email || '',
                phone: m.telephone || '',
                roles: m.roles ? (Array.isArray(m.roles) ? m.roles : String(m.roles).split(',').map(Number)) : [],
                roleName: m.role || '',
                prenom: m.prenom || '',
                nom: m.nom || ''
            };
        });

        TEAM_DATA = formattedMembers;
        window.TEAM_DATABASE = formattedMembers;

        initMemberSelector();

    } catch (err) {
        console.error("Erreur lors du chargement des membres :", err);
    }
}

function initMemberSelector() {
    const select = document.getElementById('inMemberSelect') || document.getElementById('member-select');
    if (!select) return;

    select.innerHTML = '<option value="">-- Sélectionner un membre --</option>';

    window.TEAM_DATABASE.forEach(membre => {
        const option = document.createElement('option');
        option.value = membre.id;
        option.textContent = membre.name;
        
        option.dataset.prenom = membre.prenom;
        option.dataset.nom = membre.nom;
        option.dataset.role = membre.roleName;
        option.dataset.email = membre.mail;

        select.appendChild(option);
    });
}

// =============================================================================
// 3. FONCTION DE SECOURS (PARSER CSV)
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
    // Si la base Supabase est déjà chargée, on privilégie Supabase
    if (window.TEAM_DATABASE && window.TEAM_DATABASE.length > 0) {
        return;
    }
    await loadTeamMembers();
}

// =============================================================================
// 4. SÉLECTION ET MAJ DES RÔLES / CHAMPS
// =============================================================================

function selectMember(memberId) {
    const member = window.TEAM_DATABASE.find(m => String(m.id) === String(memberId));
    if (!member) return;

    // 1. Remplissage des champs simples s'ils existent dans la page
    const inputName = document.getElementById('inName');
    const inputEmail = document.getElementById('inEmail');
    const inputPhone = document.getElementById('inPhone');
    const inputRole = document.getElementById('inRole');

    if (inputName) inputName.value = member.name;
    if (inputEmail) inputEmail.value = member.mail;
    if (inputPhone) inputPhone.value = member.phone;
    if (inputRole) inputRole.value = member.roleName;

    // 2. Gestion des cases à cocher de rôles (Checkbox)
    const checkboxes = document.getElementsByName('roleCheck');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }

    if (member.roles && Array.isArray(member.roles)) {
        for (let i = 0; i < checkboxes.length; i++) {
            const val = parseInt(checkboxes[i].value, 10);
            if (member.roles.includes(val)) {
                checkboxes[i].checked = true;
            }
        }
    }

    // 3. Réinitialiser le rôle sur-mesure
    const chkCustom = document.getElementById('chkCustomRole');
    if (chkCustom) chkCustom.checked = false;
    const customZone = document.getElementById('customRoleInputZone');
    if (customZone) customZone.style.display = 'none';

    // 4. Mettre à jour le rendu visuel de la signature
    if (typeof updateSig === "function") updateSig();
}

// Interception de l'événement de changement dans le <select>
const originalHandleMemberChange = window.handleMemberChange;
window.handleMemberChange = function() {
    const select = document.getElementById('inMemberSelect') || document.getElementById('member-select');
    const choice = select?.value;

    if (choice && choice !== 'custom' && choice !== '') {
        selectMember(choice);
    } else if (typeof originalHandleMemberChange === 'function') {
        originalHandleMemberChange();
    }
};

// =============================================================================
// 5. INITIALISATION
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadTeamMembers();
});
