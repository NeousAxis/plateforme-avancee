import { computeSemanticScore } from './ai/matchingIA.js';

const airtableApiKey = 'patuYYQbAWqonAbQd.385aaa716c3620bcd491348141d5c53f3890e4793ef3b0a866a25d149e5af63b';
const airtableBaseId = 'appS7oarBsflokeib';
const airtableTableId = 'tblw8SLnbBjBnIAbX';
const airtableMatchesTableId = 'tblIYnP7nlOFBmyOV';


// ✅ Fonction principale d'enregistrement
function registerCompany() {
    const companyName = document.getElementById('company-name').value;
    const companyAddress = document.getElementById('company-address').value;
    const companyPostal = document.getElementById('company-postal').value;
    const companyCity = document.getElementById('company-city').value;
    const companyWebsite = document.getElementById('company-website').value;
    const companyEmail = document.getElementById('company-email').value;

    const companyCategory = document.getElementById('company-category')?.value || '';
    const notificationPreferences = document.getElementById('notification-pref')?.value || '';

    const resourceCategories = window.resourceCategories || [];
    const needsCategories = window.needsCategories || [];

    const resources = {
        categories: resourceCategories,
        description: document.getElementById('resource-description')?.value || '',
        frequency: document.getElementById('resource-frequency')?.value || '',
        mode: document.getElementById('resource-mode')?.value || '',
        expertise: document.getElementById('resource-expertise')?.value || ''
    };

    const needs = {
        categories: needsCategories,
        description: document.getElementById('needs-description')?.value || '',
        frequency: document.getElementById('needs-frequency')?.value || '',
        mode: document.getElementById('needs-mode')?.value || '',
        expertise: document.getElementById('needs-expertise')?.value || ''
    };

    const companyData = {
        name: companyName,
        address: companyAddress,
        postalCode: companyPostal,
        city: companyCity,
        website: companyWebsite,
        email: companyEmail,
        category: companyCategory,
        resources,
        needs,
        notificationPreferences
    };

    // ✅ Email de confirmation
    sendRegistrationEmail(companyData);

    // ✅ Envoi direct vers Airtable
    fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
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
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Données enregistrées dans Airtable :", data);
    })
    .catch(error => {
        console.error("❌ Erreur Airtable :", error);
    });

    showNotification('Inscription réussie! Bienvenue dans l\'écosystème Ré(GE)nère.', 'success');
}

// ✅ Envoi d’email de confirmation via EmailJS
function sendRegistrationEmail(companyData) {
    const templateParams = {
        to_email: companyData.email,
        to_name: companyData.name,
        message: `Merci de vous être inscrit à Ré(GE)nère!`
    };
    return emailjs.send('service_n485hr9', 'template_zm00bwr', templateParams);
}

// ✅ Affichage dynamique des matchs (depuis Airtable)

// ✅ Affichage dynamique des matchs (depuis Airtable)
async function fetchAirtableData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/tblw8SLnbBjBnIAbX`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        const data = await response.json();
        console.log('📦 Données ENTREPRISES :', data.records);

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
                        <span style="background-color: #E67E35; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">Entreprise</span>
                        <span style="color: #6F795C; font-size: 0.9rem;">${new Date(record.createdTime).toLocaleDateString()}</span>
                    </div>
                    <h3 style="margin-top: 0; color: #6F795C; margin-bottom: 15px;">Catégorie: ${fields["Catégorie d’entreprise"] || 'N/A'}</h3>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #E67E35;">Nom</div>
                        <div>${fields["Nom de l’entreprise"] || 'N/A'}</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #6D775A;">Ville</div>
                        <div>${fields["Ville"] || 'N/A'}</div>
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
        console.error('❌ Erreur Airtable ENTREPRISES :', error);
    }
}

// ✅ Affichage visuel de notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// ✅ Initialisation au chargement du site
document.addEventListener('DOMContentLoaded', () => {
    fetchAirtableData();
    console.log("Chargement des données ENTREPRISES depuis Airtable...");
});

    const submitBtn = document.getElementById('submit-button');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerCompany();
        });
    }
});
