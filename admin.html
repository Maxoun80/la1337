// =============================================================================
// 1. CONFIGURATION & CLIENT SUPABASE
// =============================================================================

const SUPABASE_URL = 'https://appepchfrfghfulirckz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wjpCqcbmlEnHvYhJRziUGQ_SIubrlSg';
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

// Aliases globaux
window.ROLE_MAP = ROLE_MAP;
window.roleMap = ROLE_MAP;
window.ROLES_LIST = ROLE_MAP;

// Structures de données globales alimentées par Supabase
window.THEME_IMAGES = {};
window.THEMES = window.THEME_IMAGES;
window.LOGO_IMAGES = {};
window.LOGOS = window.LOGO_IMAGES;
window.TEAM_DATABASE = [];

// =============================================================================
// 2. FONCTIONS DE REMPLISSAGE DES SÉLECTEURS DU GÉNÉRATEUR
// =============================================================================

function populateThemeSelect() {
    const select = document.getElementById('inPresetTheme');
    if (!select) return;

    select.innerHTML = '';
    const keys = Object.keys(window.THEME_IMAGES);

    if (keys.length === 0) {
        select.innerHTML = '<option value="">-- Aucune bannière --</option>';
        return;
    }

    for (const key in window.THEME_IMAGES) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.innerText = window.THEME_IMAGES[key].name;
        select.appendChild(opt);
    }

    select.selectedIndex = 0;
}

function populateLogoSelect() {
    const select = document.getElementById('inPresetLogo');
    if (!select) return;

    select.innerHTML = '';
    const keys = Object.keys(window.LOGO_IMAGES);

    if (keys.length === 0) {
        select.innerHTML = '<option value="">-- Aucun logo --</option>';
        return;
    }

    for (const key in window.LOGO_IMAGES) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.innerText = window.LOGO_IMAGES[key].name;
        select.appendChild(opt);
    }

    select.selectedIndex = 0;
}

function populateMemberSelect() {
    const select = document.getElementById('inMemberSelect');
    if (!select) return;

    select.innerHTML = '';

    const optPlaceholder = document.createElement('option');
    optPlaceholder.value = '';
    optPlaceholder.innerText = '👥 Choisissez un membre';
    optPlaceholder.selected = true;
    optPlaceholder.disabled = true;
    select.appendChild(optPlaceholder);

    const optCustom = document.createElement('option');
    optCustom.value = 'custom';
    optCustom.innerText = '✍️ [NOUVEAU MEMBRE - Saisie libre]';
    select.appendChild(optCustom);

    window.TEAM_DATABASE.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.innerText = m.name;
        select.appendChild(opt);
    });
}

// Redéfinition des fonctions d'initialisation pour index.html
window.initThemeSelector = populateThemeSelect;
window.initLogoSelector = populateLogoSelect;
window.initMemberSelector = populateMemberSelect;

// =============================================================================
// 3. CHARGEMENT DYNAMIQUE SUPABASE
// =============================================================================

async function loadThemesFromSupabase() {
    try {
        const { data: themes, error } = await supabaseClient
            .from('themes')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erreur thèmes Supabase :', error.message);
            return;
        }

        if (themes && themes.length > 0) {
            window.THEME_IMAGES = {};
            themes.forEach(t => {
                const key = t.id ? `theme_${t.id}` : t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                window.THEME_IMAGES[key] = {
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

            window.THEMES = window.THEME_IMAGES;
            populateThemeSelect();
        }
    } catch (err) {
        console.error("Erreur chargement thèmes :", err);
    }
}

async function loadLogosFromSupabase() {
    try {
        const { data: logos, error } = await supabaseClient
            .from('logos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erreur logos Supabase :', error.message);
            return;
        }

        if (logos && logos.length > 0) {
            window.LOGO_IMAGES = {};
            logos.forEach(l => {
                const key = l.id ? `logo_${l.id}` : l.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                window.LOGO_IMAGES[key] = {
                    id: l.id,
                    name: l.name,
                    url: l.url
                };
            });

            window.LOGOS = window.LOGO_IMAGES;
            populateLogoSelect();
        }
    } catch (err) {
        console.error("Erreur chargement logos :", err);
    }
}

async function loadTeamMembersFromSupabase() {
    try {
        const { data: membres, error } = await supabaseClient
            .from('membres')
            .select('*')
            .order('nom', { ascending: true });

        if (error) {
            console.error('Erreur membres Supabase :', error.message);
            return;
        }

        if (membres) {
            window.TEAM_DATABASE = membres.map(m => {
                const fullName = `${m.prenom || ''} ${(m.nom || '').toUpperCase()}`.trim();
                return {
                    id: String(m.id),
                    name: fullName,
                    mail: m.email || '',
                    phone: m.telephone || '03 65 17 00 63',
                    roles: m.roles ? (Array.isArray(m.roles) ? m.roles : String(m.roles).split(',').map(Number)) : []
                };
            });

            populateMemberSelect();
        }
    } catch (err) {
        console.error("Erreur chargement membres :", err);
    }
}

// =============================================================================
// 4. INITIALISATION AU DÉMARRAGE DU GÉNÉRATEUR
// =============================================================================

async function initGeneratorData() {
    // 1. Attente du chargement BDD Supabase
    await Promise.all([
        loadThemesFromSupabase(),
        loadLogosFromSupabase(),
        loadTeamMembersFromSupabase()
    ]);

    // 2. Application dynamique du premier thème et du premier logo présent en BDD
    if (typeof applyPresetTheme === "function") {
        applyPresetTheme();
    }
    if (typeof applyPresetLogo === "function") {
        applyPresetLogo();
    }
    if (typeof updateSig === "function") {
        updateSig();
    }
}

// Déclenchement automatique dès que le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
    initGeneratorData();
});
