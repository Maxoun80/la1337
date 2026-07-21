/* changelog.js - Historique des Mises à Jour */
const CHANGELOG_DATA = [
    {
        version: "v1.7.0",
        date: "22/07/2026 à 00:36",
        isLatest: true,
        changes: [
            "<strong>Externalisation du Changelog :</strong> Déportation complète du système d'historique dans un fichier dédié <code>changelog.js</code>.",
            "<strong>Nettoyage HTML :</strong> Simplification de la structure du fichier principal en conservant les images au sein du projet.",
            "<strong>Génération Dynamique :</strong> L'onglet Mises à jour se génère désormais automatiquement à partir des données JS."
        ]
    },
    {
        version: "v1.6.0",
        date: "22/07/2026 à 00:34",
        isLatest: false,
        changes: [
            "<strong>Optimisation de la structure :</strong> Nettoyage du code principal et amélioration de la lisibilité.",
            "<strong>Formatage du Footer :</strong> Horodatage et badge de version automatisés."
        ]
    },
    {
        version: "v1.5.0",
        date: "22/07/2026 à 00:31",
        isLatest: false,
        changes: [
            "<strong>Navigation par Menu :</strong> Ajout du système d'onglets pour passer du générateur à l'historique.",
            "<strong>Module Changelog :</strong> Intégration du journal des modifications."
        ]
    }
];
