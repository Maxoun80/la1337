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

// 4. FONCTIONS LOCALSTORAGE
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

// 5. BASE DE DONNÉES DE L'ÉQUIPE
const TEAM_DATABASE = [
    { id: "archer",     name: "ARCHER Vincent",      mail: "vincent.a@la1337.com",      phone: "03 65 17 00 63", roles: [7] },
    { id: "bernard",    name: "BERNARD Elise",       mail: "elise.b@la1337.com",        phone: "03 65 17 00 63", roles: [8, 12, 14] },
    { id: "dafflon",    name: "DAFFLON Anais",       mail: "anais.d@la1337.com",        phone: "03 65 17 00 63", roles: [8] },
    { id: "dherbomez",  name: "DHERBOMEZ Margaux",   mail: "margaux.d@la1337.com",    phone: "03 65 17 00 63", roles: [12] },
    { id: "dossantos",  name: "DOS SANTOS Cindy",    mail: "cindy.d@la1337.com",      phone: "03 65 17 00 63", roles: [8] },
    { id: "fonvielle",  name: "FONVIELLE Magali",    mail: "magali.f@la1337.com",     phone: "03 65 17 00 63", roles: [8] },
    { id: "haliti",     name: "HALITI Merema",       mail: "merema.h@la1337.com",     phone: "03 65 17 00 63", roles: [8] },
    { id: "jaffrezic",  name: "JAFFREZIC Solenn",    mail: "solenn.j@la1337.com",     phone: "03 65 17 00 63", roles: [11] },
    { id: "kirsz",      name: "KIRSZ Rafael",        mail: "rafael.k@la1337.com",     phone: "03 65 17 00 63", roles: [7, 9, 11] },
    { id: "marechal",   name: "MARECHAL Laurence",   mail: "laurence.m@la1337.com",   phone: "03 65 17 00 63", roles: [8] },
    { id: "morel",      name: "MOREL Enzo",          mail: "enzo.m@la1337.com",       phone: "03 65 17 00 63", roles: [3] },
    { id: "noel",       name: "NOEL Axel",           mail: "axel.n@la1337.com",        phone: "03 65 17 00 63", roles: [4, 7] },
    { id: "philippon",  name: "PHILIPPON Pierre",    mail: "pierre.p@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "porino",     name: "PORINO Laeticia",     mail: "laeticia.p@la1337.com",   phone: "03 65 17 00 63", roles: [8] },
    { id: "rocquemont", name: "ROCQUEMONT Maxence",  mail: "maxence.r@la1337.com",    phone: "03 65 17 00 63", roles: [2, 5, 7, 10, 11] },
    { id: "samson",     name: "SAMSON Solyvan",      mail: "solyvan.s@la1337.com",    phone: "03 65 17 00 63", roles: [15] },
    { id: "schilling",  name: "SCHILLING Ingrid",    mail: "ingrid.s@la1337.com",     phone: "03 65 17 00 63", roles: [6] },
    { id: "schneider",  name: "SCHNEIDER Thibault",  mail: "thibault.s@la1337.com",   phone: "03 65 17 00 63", roles: [10] },
    { id: "stef",       name: "STEF Laura",          mail: "laura.s@la1337.com",      phone: "03 65 17 00 63", roles: [13] },
    { id: "vankets",    name: "VAN KETS Guillaume",  mail: "guillaume.v@la1337.com",  phone: "03 65 17 00 63", roles: [1, 7] },
    { id: "vernet",     name: "VERNET Jeremy",       mail: "jeremy.v@la1337.com",     phone: "03 65 17 00 63", roles: [7] },
    { id: "wagne",      name: "WAGNE Coumba",        mail: "coumba.w@la1337.com",     phone: "03 65 17 00 63", roles: [8, 12] }
];

// 6. GÉNÉRATEURS DE SIGNATURES TEXTE (SIMPLE & MINIMALISTE)
function generateBanalSignature(name, roles, mail, phone, style) {
    const rolesStr = roles || "Membre";
    const phoneStr = phone ? phone : "03 65 17 00 63";
    const mailStr = mail || "contact@la1337.com";

    if (style === 'baweb_line') {
        // Style Simple (Ligne complète)
        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #ffffff; line-height: 1.4; text-align: left; background: transparent;">
  <tr>
    <td style="padding-right: 15px; border-right: 3px solid #ff3366; vertical-align: top;">
      <div style="font-size: 16px; font-weight: bold; color: #ff3366;">${name}</div>
      <div style="font-size: 13px; color: #e1e1e6; font-weight: 600; margin-top: 2px;">${rolesStr}</div>
      <div style="font-size: 11px; color: #aaa; font-weight: bold; margin-top: 4px;">LA 1337 RADIO</div>
    </td>
    <td style="padding-left: 15px; vertical-align: top; color: #ddd;">
      <div>📞 <strong>Tél :</strong> ${phoneStr}</div>
      <div>✉️ <strong>Email :</strong> <a href="mailto:${mailStr}" style="color: #ff3366; text-decoration: none;">${mailStr}</a></div>
      <div>🌐 <strong>Web :</strong> <a href="https://www.la1337.com" style="color: #ff3366; text-decoration: none;">www.la1337.com</a></div>
    </td>
  </tr>
</table>`;
    } else {
        // Style Minimaliste (Courrier officiel) : Nom, Prénom & Fonction uniquement
        return `
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #ffffff; line-height: 1.4; text-align: left; background: transparent;">
  <div style="font-weight: bold; font-size: 16px; color: #ff3366;">${name}</div>
  <div style="color: #e1e1e6; font-size: 13px; margin-top: 2px;">${rolesStr}</div>
</div>`;
    }
}
