// team.js - Base de données & Configurations officielles de LA 1337 RADIO

// 1. CARTOGRAPHIE DES RÔLES
const ROLE_MAP = {
    1:  "Directeur",
    2:  "Directeur Adjoint",
    3:  "Président",
    4:  "Vice-Président",
    5:  "Secrétaire",
    6:  "Trésorière",
    7:  "Animateur",
    8:  "Programmation",
    9:  "Technique",
    10: "RH",
    11: "Événementiel",
    12: "Communication",
    13: "Journaliste",
    14: "Membre extérieur"
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
        textColor: "#ff3366",       // À ajuster si besoin
        roleColor: "#e1e1e6",
        liveBgColor: "#ff3366",
        liveTxtColor: "#ffffff"
    },
    noel: {
        name: "🎄 Mode Noël (Fond Officiel)",
        url: "https://i.postimg.cc/XqWNpSdT/LA1337-Signatures-de-mail(2).png",
        textColor: "#ffffff",       // Blanc pour que ça ressorte sur le fond Noël
        roleColor: "#f0a5a5",       // Rose/Rouge très clair pour le rôle
        liveBgColor: "#ffffff",     // Badge blanc
        liveTxtColor: "#b71c1c"     // Écrit en rouge foncé à l'intérieur
    },
    nouvelan: {
        name: "🥂 Nouvel An (Fond Officiel)",
        url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png",
        textColor: "#dfb76c",       // Doré pour le Nouvel An !
        roleColor: "#ffffff",       // Blanc pour le rôle
        liveBgColor: "#dfb76c",     // Badge doré
        liveTxtColor: "#000000"     // Écrit en noir à l'intérieur
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

// 5. FONCTIONS DE STOCKAGE LOCALSTORAGE POUR LES BÉNÉVOLES PERSONNALISÉS
function getCustomMembers() {
    const stored = localStorage.getItem('customMembers');
    return stored ? JSON.parse(stored) : [];
}

function addCustomMember(member) {
    const customMembers = getCustomMembers();
    // Vérifier si le bénévole existe déjà
    const exists = customMembers.some(m => m.mail === member.mail);
    if (!exists) {
        customMembers.push(member);
        localStorage.setItem('customMembers', JSON.stringify(customMembers));
    }
}

function clearCustomMembers() {
    localStorage.removeItem('customMembers');
}

// Intégrer les bénévoles personnalisés à la base de données au chargement
function loadCustomMembers() {
    const customMembers = getCustomMembers();
    customMembers.forEach(member => {
        // Éviter les doublons
        if (!TEAM_DATABASE.find(m => m.mail === member.mail)) {
            TEAM_DATABASE.push(member);
        }
    });
}

// 5. BASE DE DONNÉES DE L'ÉQUIPE
const TEAM_DATABASE = [
    { id: "archer",     name: "ARCHER Vincent",      mail: "vincent.a@la1337.com",      phone: "03 65 17 00 63", roles: [7] },
    { id: "bernard",    name: "BERNARD Elise",       mail: "elise.b@la1337.com",        phone: "03 65 17 00 63", roles: [7, 11, 13] },
    { id: "dafflon",    name: "DAFFLON Anais",       mail: "anais.d@la1337.com",        phone: "03 65 17 00 63", roles: [7] },
    { id: "dherbomez",  name: "DHERBOMEZ Margaux",   mail: "margaux.d@la1337.com",    phone: "03 65 17 00 63", roles: [11] },
    { id: "dossantos",  name: "DOS SANTOS Cindy",    mail: "cindy.d@la1337.com",      phone: "03 65 17 00 63", roles: [7] },
    { id: "fonvielle",  name: "FONVIELLE Magali",    mail: "magali.f@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "haliti",     name: "HALITI Merema",       mail: "merema.h@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "jaffrezic",  name: "JAFFREZIC Solenn",    mail: "solenn.j@la1337.com",     phone: "03 65 17 00 63", roles: [10] },
    { id: "kirsz",      name: "KIRSZ Rafael",        mail: "rafael.k@la1337.com",     phone: "03 65 17 00 63", roles: [7, 8, 10] },
    { id: "marechal",   name: "MARECHAL Laurence",   mail: "laurence.m@la1337.com",   phone: "03 65 17 00 63", roles: [7] },
    { id: "morel",      name: "MOREL Enzo",          mail: "enzo.m@la1337.com",       phone: "03 65 17 00 63", roles: [3] },
    { id: "noel",       name: "NOEL Axel",           mail: "axel.n@la1337.com",        phone: "03 65 17 00 63", roles: [4, 7] },
    { id: "philippon",  name: "PHILIPPON Pierre",    mail: "pierre.p@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "porino",     name: "PORINO Laeticia",     mail: "laeticia.p@la1337.com",   phone: "03 65 17 00 63", roles: [7] },
    { id: "rocquemont", name: "ROCQUEMONT Maxence",  mail: "maxence.r@la1337.com",    phone: "03 65 17 00 63", roles: [2, 5, 7, 9, 10] },
    { id: "samson",     name: "SAMSON Solyvan",      mail: "solyvan.s@la1337.com",    phone: "03 65 17 00 63", roles: [14] },
    { id: "schilling",  name: "SCHILLING Ingrid",    mail: "ingrid.s@la1337.com",     phone: "03 65 17 00 63", roles: [6] },
    { id: "schneider",  name: "SCHNEIDER Thibault",  mail: "thibault.s@la1337.com",   phone: "03 65 17 00 63", roles: [9] },
    { id: "stef",       name: "STEF Laura",          mail: "laura.s@la1337.com",      phone: "03 65 17 00 63", roles: [12] },
    { id: "vankets",    name: "VAN KETS Guillaume",  mail: "guillaume.v@la1337.com",  phone: "03 65 17 00 63", roles: [1, 7] },
    { id: "vernet",     name: "VERNET Jeremy",       mail: "jeremy.v@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "wagne",      name: "WAGNE Coumba",        mail: "coumba.w@la1337.com",     phone: "03 65 17 00 63", roles: [7, 11] }
];
