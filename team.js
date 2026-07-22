// =============================================================================
// 1. CONFIGURATION GENERALE & RESSOURCES
// =============================================================================

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0a8y_ZHF2WsnBHMbrUKL8p-CH1SJI_6US5bc2Iv-IZRWWo8NiGJEtRjNZfwWSctJBjokRKZruvexz/pub?gid=1526030464&single=true&output=csv";

// Ton dictionnaire de rôles d'origine
const ROLE_MAP = {
    1: "Président",
    2: "Fondateur",
    3: "Vice-Président",
    4: "Trésorier",
    5: "Secrétaire",
    6: "Animateur / Chroniqueur",
    7: "Réalisateur / Technicien",
    8: "Community Manager",
    9: "Développeur / Webmaster",
    10: "Bénévole"
};

// Sécurité au cas où : si une partie du script cherche roleMap ou ROLE_MAP
const roleMap = ROLE_MAP;

const THEMES = {
    cyber:    { url: "https://i.postimg.cc/63Y5PbDR/LA1337-Signatures-de-mail.png", color: "#ff3366" },
    ete:      { url: "https://i.postimg.cc/7YyJTjw9/LA1337-Signatures-de-mail(1).png", color: "#ff3366" },
    noel:     { url: "https://i.postimg.cc/XqWNpSdT/LA1337-Signatures-de-mail(2).png", color: "#ffffff" },
    nouvelan: { url: "https://i.postimg.cc/4x0Jphpd/LA1337-Signatures-de-mail(3).png", color: "#dfb76c" }
};

const LOGOS = {
    blanc: "https://i.postimg.cc/4x659pDr/logo-small.png",
    noel:  "https://i.postimg.cc/50Ty8Btq/Capture-d-ecran-2026-07-18-002918.png"
};

let TEAM_DATA = [];
const imageCache = {};

// =============================================================================
// 2. CHARGEMENT DES IMAGES (AVEC CACHE POUR EVITER LES BUGS)
// =============================================================================

function loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (imageCache[url]) return Promise.resolve(imageCache[url]);

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            imageCache[url] = img;
            resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

// =============================================================================
// 3. RECUPERATION DONNEES DU FORMULAIRE ET DU SHEET
// =============================================================================

function getFormData() {
    const name = document.getElementById("inName")?.value || "";
    const mail = document.getElementById("inMail")?.value || "";
    const phone = document.getElementById("inPhone")?.value || "";
    const template = document.getElementById("inTemplateSelect")?.value || "officiel";
    const themeKey = document.getElementById("inThemeSelect")?.value || "cyber";
    const logoKey = document.getElementById("inLogoSelect")?.value || "blanc";

    // Récupération des rôles cochés
    const selectedRoles = [];
    for (let i = 1; i <= 15; i++) {
        const cb = document.getElementById(`role_${i}`);
        if (cb && cb.checked) {
            selectedRoles.push(ROLES_LIST[i]);
        }
    }

    return {
        name,
        mail,
        phone,
        template,
        theme: THEMES[themeKey] || THEMES.cyber,
        logoUrl: LOGOS[logoKey] || LOGOS.blanc,
        rolesText: selectedRoles.join(" • ") || "Membre"
    };
}

// =============================================================================
// 4. MOTEUR DE DESSIN DU CANVAS (REFAIT ET SEPARE)
// =============================================================================

async function renderCanvas() {
    const canvas = document.getElementById("signatureCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const data = getFormData();
    const bannerImg = await loadImage(data.theme.url);
    const logoImg = await loadImage(data.logoUrl);

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- MODE 1 : SIGNATURE OFFICIELLE (AVEC BANNIERE DE FOND) ---
    if (data.template === "officiel") {
        canvas.height = 200;
        canvas.width = 600;

        // 1. Dessin de la bannière
        if (bannerImg) {
            ctx.drawImage(bannerImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Dessin du Logo
        if (logoImg) {
            ctx.drawImage(logoImg, 25, 25, 70, 70);
        }

        // 3. Textes
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial, sans-serif";
        ctx.fillText(data.name || "Prénom Nom", 110, 50);

        ctx.fillStyle = data.theme.color;
        ctx.font = "bold 13px Arial, sans-serif";
        ctx.fillText(data.rolesText.toUpperCase(), 110, 72);

        ctx.fillStyle = "#cccccc";
        ctx.font = "12px Arial, sans-serif";
        ctx.fillText(`📧 ${data.mail || "contact@la1337radio.fr"}`, 110, 110);
        if (data.phone) {
            ctx.fillText(`📞 ${data.phone}`, 110, 130);
        }
    }

    // --- MODE 2 : SIGNATURE MINIMALISTE (SANS BANNIERE, LOGO + TEXTE) ---
    else if (data.template === "minimaliste") {
        canvas.height = 120;
        canvas.width = 500;

        // Fond transparent/neutre
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Logo à gauche
        if (logoImg) {
            ctx.drawImage(logoImg, 10, 20, 60, 60);
        }

        // Ligne verticale de séparation
        ctx.fillStyle = "#ff3366";
        ctx.fillRect(85, 20, 3, 70);

        // Textes à droite
        ctx.fillStyle = "#111111";
        ctx.font = "bold 18px Arial, sans-serif";
        ctx.fillText(data.name || "Prénom Nom", 100, 38);

        ctx.fillStyle = "#ff3366";
        ctx.font = "bold 12px Arial, sans-serif";
        ctx.fillText(data.rolesText, 100, 56);

        ctx.fillStyle = "#555555";
        ctx.font = "12px Arial, sans-serif";
        ctx.fillText(`${data.mail} ${data.phone ? " | " + data.phone : ""}`, 100, 78);
    }

    // --- MODE 3 : SIGNATURE SIMPLE (TEXTE SUR 1 OU 2 LIGNES) ---
    else if (data.template === "simple") {
        canvas.height = 80;
        canvas.width = 500;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ligne 1 : Nom et Rôle
        ctx.fillStyle = "#111111";
        ctx.font = "bold 15px Arial, sans-serif";
        ctx.fillText(data.name || "Prénom Nom", 10, 30);

        ctx.fillStyle = "#666666";
        ctx.font = "13px Arial, sans-serif";
        ctx.fillText(`— ${data.rolesText}`, ctx.measureText((data.name || "Prénom Nom") + " ").width + 15, 30);

        // Ligne 2 : Contact
        ctx.fillStyle = "#ff3366";
        ctx.font = "12px Arial, sans-serif";
        ctx.fillText(`${data.mail || ""} ${data.phone ? "• " + data.phone : ""}`, 10, 55);
    }
}

// =============================================================================
// 5. GESTION DE LA SELECTION DE MEMBRES ET CSV
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
            
            const fullName = `${cols[1] || ''} ${cols[0] || ''}`.trim();
            const roles = (cols[4] || '').split(',').map(r => parseInt(r.trim(), 10)).filter(r => !isNaN(r));

            members.push({
                id: fullName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                name: fullName,
                mail: cols[2] || '',
                phone: cols[3] || '',
                roles: roles
            });
        }
        TEAM_DATA = members;
        populateSelect();
    } catch (e) {
        console.warn("⚠️ Sheet non disponible :", e);
    }
}

function populateSelect() {
    const select = document.getElementById("inMemberSelect");
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Sélectionner un membre --</option>';
    TEAM_DATA.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.name;
        select.appendChild(opt);
    });
}

function selectMember(memberId) {
    const member = TEAM_DATA.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById("inName").value = member.name;
    document.getElementById("inMail").value = member.mail;
    document.getElementById("inPhone").value = member.phone;

    // Réinitialiser puis cocher les checkboxes
    for (let i = 1; i <= 15; i++) {
        const cb = document.getElementById(`role_${i}`);
        if (cb) cb.checked = member.roles.includes(i);
    }

    renderCanvas();
}

// =============================================================================
// 6. EVENT LISTENERS
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    loadTeamData();

    // Re-dessiner lors des changements d'inputs texte
    ["inName", "inMail", "inPhone"].forEach(id => {
        document.getElementById(id)?.addEventListener("input", renderCanvas);
    });

    // Re-dessiner lors des changements de sélecteurs
    ["inTemplateSelect", "inThemeSelect", "inLogoSelect"].forEach(id => {
        document.getElementById(id)?.addEventListener("change", renderCanvas);
    });

    // Re-dessiner lors du choix d'un membre
    document.getElementById("inMemberSelect")?.addEventListener("change", (e) => {
        selectMember(e.target.value);
    });

    // Re-dessiner lors du clic sur les cases à cocher
    for (let i = 1; i <= 15; i++) {
        document.getElementById(`role_${i}`)?.addEventListener("change", renderCanvas);
    }

    // Premier rendu à vide
    renderCanvas();
});
