import { computeSemanticScore } from './ai/matchingIA.js';

const airtableApiKey = 'patDeduCdDLw16q41.8116fea5e72f5cbce467f46297ba4f4c40014c5bcd267046b910a3da5b4814a1';
const airtableBaseId = 'appNP1LL1RkTdwVrT';
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

    Promise.all([
        sendRegistrationEmail(companyData),
        envoyerDonneesAMake(companyData)
    ])
    .then(() => {
        showNotification('Inscription réussie! Bienvenue dans l\'écosystème Ré(GE)nère.', 'success');
    })
    .catch(error => {
        console.error("❌ Erreur lors de l'inscription :", error);
        showNotification("Une erreur est survenue. Merci de réessayer.", "error");
    });
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
    const webhookUrl = 'https://hook.eu2.make.com/x38i6elzcm3c3fr6u8ps6fqodhrb56t1';
    const dataToSend = {
        "Nom de l’entreprise": companyData.name,
        "Adresse": companyData.address,
        "Code postal": companyData.postalCode,
        "Ville": companyData.city,
        "Email": companyData.email,
        "Site web": companyData.website,
        "Description Ressources": companyData.resourceDescription,
        "Description Besoins": companyData.needsDescription
    };

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
});
