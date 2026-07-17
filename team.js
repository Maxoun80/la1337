// team.js - Base de données officielle de LA 1337 RADIO
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
    { id: "wagne",      name: "WAGNE Coumba",        mail: "coumba.w@la1337.com",     phone: "03 65 17 00 63", roles: [7, 11] },
    { id: "test",      name: "TEST",        mail: "test@la1337.com",     phone: "03 65 17 00 63", roles: [7, 11] }
];
