import { computeSemanticScore } from './ai/matchingIA.js';

const airtableApiKey = 'patuYYQbAWqonAbQd.385aaa716c3620bcd491348141d5c53f3890e4793ef3b0a866a25d149e5af63b';
const airtableBaseId = 'appS7oarBsflokeib';
const airtableTableName = 'ENTREPRISES';

function registerCompany() {
    const companyName = document.getElementById('company-name').value;
    const companyAddress = document.getElementById('company-address').value;
    const companyPostal = document.getElementById('company-postal').value;
    const companyCity = document.getElementById('company-city').value;
    const companyWebsite = document.getElementById('company-website').value;
    const companyEmail = document.getElementById('company-email').value;

    const companyResourceDescription = document.getElementById('resource-description')?.value || "";
    const companyNeedsDescription = document.getElementById('needs-description')?.value || "";

    const companyData = {
        name: companyName,
        address: companyAddress,
        postalCode: companyPostal,
        city: companyCity,
        website: companyWebsite,
        email: companyEmail,
        resourceDescription: companyResourceDescription,
        needsDescription: companyNeedsDescription
    };

    sendRegistrationEmail(companyData);
    envoyerDonneesAMake(companyData);
    showNotification('Inscription réussie! Bienvenue dans l\'écosystème Ré(GE)nère.', 'success');
}

function sendRegistrationEmail(companyData) {
    const templateParams = {
        to_email: companyData.email,
        to_name: companyData.name,
        message: `Merci de vous être inscrit à Ré(GE)nère!`
    };
    return emailjs.send('service_n485hr9', 'template_zm00bwr', templateParams);
}

async function fetchAirtableData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const data = await response.json();
        console.log('Données Airtable :', data.records);

        let container = document.getElementById('matches-section');
        if (!container) {
            container = document.createElement('section');
            container.id = 'matches-section';
            container.className = 'matches';
            document.body.appendChild(container);
        }

        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'matches-grid';

        data.records
            .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
            .slice(0, 6)
            .forEach(record => {
                const fields = record.fields;
                const card = document.createElement('div');
                card.className = 'match-card';

                const cardContent = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="background-color: #E67E35; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">Match</span>
                        <span style="color: #6F795C; font-size: 0.9rem;">${new Date(record.createdTime).toLocaleDateString()}</span>
                    </div>
                    <h3 style="margin-top: 0; color: #6F795C; margin-bottom: 15px;">Catégorie: ${fields["Catégorie"] || 'N/A'}</h3>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #E67E35;">Fournisseur</div>
                        <div>${fields["Fournisseur"] || 'N/A'}</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #6D775A;">Receveur</div>
                        <div>${fields["Receveur"] || 'N/A'}</div>
                    </div>
                    <hr style="border: 0; height: 1px; background-color: #E0D0B8; margin: 15px 0;">
                    <div style="font-size: 0.9rem; color: #6F795C;">
                        <div>Ressource: <span style="font-style: italic;">${fields["Description Ressources"] || ''}</span></div>
                        <div>Besoin: <span style="font-style: italic;">${fields["Description Besoins"] || ''}</span></div>
                    </div>
                `;
                card.innerHTML = cardContent;
                grid.appendChild(card);
            });

        container.appendChild(grid);
    } catch (error) {
        console.error('Erreur lors de la récupération des données Airtable :', error);
    }
}

function envoyerDonneesAMake(companyData) {
    const webhookUrl = 'https://hook.eu2.make.com/dlwatjivrxupwlt1c541a4hkb63f9uwx';

    const dataToSend = {
        "Nom de l’entreprise": companyData.name,
        "Adresse": companyData.address,
        "Code postal": companyData.postalCode,
        "Ville": companyData.city,
        "Email": companyData.email,
        "Site web": companyData.website,
        "Catégorie d’entreprise": companyData.category,
        "Description Ressources": companyData.resources.description,
        "Ressources - Catégories": companyData.resources.categories.join(', '),
        "Ressources - Fréquence": companyData.resources.frequency,
        "Ressources - Mode": companyData.resources.mode,
        "Ressources - Expertise": companyData.resources.expertise,
        "Description Besoins": companyData.needs.description,
        "Besoins - Catégories": companyData.needs.categories.join(', '),
        "Besoins - Fréquence": companyData.needs.frequency,
        "Besoins - Mode": companyData.needs.mode,
        "Besoins - Expertise": companyData.needs.expertise,
        "Préférences de notification": companyData.notificationPreferences
    };

    console.log("📡 Envoi vers Make :", JSON.stringify(dataToSend));

    return fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
    .then(res => {
        console.log("📬 Données envoyées à Make :", res.status);
        return res.text();
    })
    .then(txt => console.log("📦 Réponse Make :", txt))
    .catch(error => console.error("❌ Erreur webhook Make :", error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAirtableData();
    console.log("Chargement des données Airtable...");

    const submitBtn = document.getElementById('submit-button');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerCompany();
        });
    }
});
