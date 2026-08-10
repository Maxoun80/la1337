// =============================================================================
// 1. INITIALISATION DU CLIENT SUPABASE ET STRUCTURES GLOBALES
// =============================================================================

const SUPABASE_URL = 'https://appepchfrfghfulirckz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wjpCqcbmlEnHvYhJRziUGQ_SIubrlSg';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dictionnaire des 15 rôles officiels
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

window.ROLE_MAP = ROLE_MAP;
window.roleMap = ROLE_MAP;
window.ROLES_LIST = ROLE_MAP;

// Objets globaux dynamiques alimentés par Supabase
let THEME_IMAGES = {};
let LOGO_IMAGES = {};
let TEAM_DATA = [];

window.THEME_IMAGES = THEME_IMAGES;
window.THEMES = THEME_IMAGES;
window.LOGO_IMAGES = LOGO_IMAGES;
window.LOGOS = LOGO_IMAGES;
window.TEAM_DATABASE = [];

// =============================================================================
// 2. REMPLISSAGE DYNAMIQUE DES SÉLECTEURS (<select>) DANS INDEX.HTML
// =============================================================================

function renderThemeSelectOptions() {
    const select = document.getElementById('inThemeSelect') || document.getElementById('theme-select');
    if (!select) return;

    select.innerHTML = '';
    for (const [key, theme] of Object.entries(THEME_IMAGES)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.name;
        select.appendChild(option);
    }
}

function renderLogoSelectOptions() {
    const select = document.getElementById('inLogoSelect') || document.getElementById('logo-select');
    if (!select) return;

    select.innerHTML = '';
    for (const [key, logo] of Object.entries(LOGO_IMAGES)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = logo.name;
        select.appendChild(option);
    }
}

function renderMemberSelectOptions() {
    const select = document.getElementById('inMemberSelect') || document.getElementById('member-select');
    if (!select) return;

    select.innerHTML = '<option value="custom">-- Choisir un membre pré-enregistré --</option>';
    TEAM_DATA.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = m.name;
        select.appendChild(option);
    });
}

// =============================================================================
// 3. RECUPÉRATION DES DONNÉES SUPABASE ET DÉCLENCHEMENT DU RENDU
// =============================================================================

async function loadThemesFromSupabase() {
    try {
        const { data: themes, error } = await supabaseClient.from('themes').select('*').order('id', { ascending: true });
        if (error) { console.error("Erreur thèmes Supabase:", error.message); return; }

        if (themes && themes.length > 0) {
            THEME_IMAGES = {};
            themes.forEach(t => {
                const key = t.id ? `theme_${t.id}` : t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                THEME_IMAGES[key] = {
                    id: t.id,
                    name: t.name,
                    url: t.url,
                    color: t.textColor || t.color || "#ff3366",
                    textColor: t.textColor || t.color || "#ff3366",
                    roleColor: t.roleColor || "#e1e1e6",
                    liveBgColor: t.liveBgColor || "#ff3366",
                    liveTxtColor: t.liveTxtColor || "#ffffff"
                };
            });
            window.THEME_IMAGES = THEME_IMAGES;
            window.THEMES = THEME_IMAGES;
            renderThemeSelectOptions();
        }
    } catch (err) {
        console.error("Erreur chargement thèmes :", err);
    }
}

async function loadLogosFromSupabase() {
    try {
        const { data: logos, error } = await supabaseClient.from('logos').select('*').order('id', { ascending: true });
        if (error) { console.error("Erreur logos Supabase:", error.message); return; }

        if (logos && logos.length > 0) {
            LOGO_IMAGES = {};
            logos.forEach(l => {
                const key = l.id ? `logo_${l.id}` : l.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                LOGO_IMAGES[key] = { id: l.id, name: l.name, url: l.url };
            });
            window.LOGO_IMAGES = LOGO_IMAGES;
            window.LOGOS = LOGO_IMAGES;
            renderLogoSelectOptions();
        }
    } catch (err) {
        console.error("Erreur chargement logos :", err);
    }
}

async function loadTeamMembers() {
    try {
        const { data: membres, error } = await supabaseClient.from('membres').select('*').order('nom', { ascending: true });
        if (error) { console.error("Erreur membres Supabase:", error.message); return; }

        const formattedMembers = membres.map(m => {
            const fullName = `${m.prenom || ''} ${(m.nom || '').toUpperCase()}`.trim();
            return {
                id: String(m.id),
                name: fullName,
                mail: m.email || '',
                phone: m.telephone || '03 65 17 00 63',
                roles: m.roles ? (Array.isArray(m.roles) ? m.roles : String(m.roles).split(',').map(Number)) : [],
                prenom: m.prenom || '',
                nom: m.nom || ''
            };
        });

        TEAM_DATA = formattedMembers;
        window.TEAM_DATABASE = formattedMembers;
        renderMemberSelectOptions();
    } catch (err) {
        console.error("Erreur chargement membres :", err);
    }
}

// =============================================================================
// 4. SELECTION D'UN MEMBRE DANS LE GÉNÉRATEUR
// =============================================================================

function selectMember(memberId) {
    const member = window.TEAM_DATABASE.find(m => String(m.id) === String(memberId));
    if (!member) return;

    // Remplir les champs du formulaire du générateur
    const inName = document.getElementById('inName') || document.getElementById('name');
    const inMail = document.getElementById('inMail') || document.getElementById('email');
    const inPhone = document.getElementById('inPhone') || document.getElementById('phone');

    if (inName) inName.value = member.name;
    if (inMail) inMail.value = member.mail;
    if (inPhone) inPhone.value = member.phone;

    // Réinitialiser puis cocher les bons rôles
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

    // Force la réactualisation de la signature visuelle
    if (typeof updateSig === "function") updateSig();
}

window.handleMemberChange = function() {
    const select = document.getElementById('inMemberSelect') || document.getElementById('member-select');
    const choice = select?.value;

    if (choice && choice !== 'custom') {
        selectMember(choice);
    }
};

// =============================================================================
// 5. INITIALISATION GLOBALE AUTOMATIQUE
// =============================================================================

async function initAllAppData() {
    // Chargement parallèle de toutes les tables Supabase
    await Promise.all([
        loadThemesFromSupabase(),
        loadLogosFromSupabase(),
        loadTeamMembers()
    ]);

    // Application automatique des premiers éléments en base au chargement de la page
    if (typeof applyPresetTheme === "function") applyPresetTheme();
    if (typeof applyPresetLogo === "function") applyPresetLogo();
    if (typeof updateSig === "function") updateSig();
}

document.addEventListener("DOMContentLoaded", () => {
    initAllAppData();
});
