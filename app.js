import { computeSemanticScore } from './ai/matchingIA.js';

const airtableApiKey = 'patDeduCdDLw16q41.8116fea5e72f5cbce467f46297ba4f4c40014c5bcd267046b910a3da5b4814a1';
const airtableBaseId = 'appNP1LL1RkTdwVrT';
const airtableTableName = 'ENTREPRISES'; // À ajuster si besoin

function registerCompany() {
    const companyName = document.getElementById('company-name').value;
    const companyAddress = document.getElementById('company-address').value;
    const companyPostal = document.getElementById('company-postal').value;
    const companyCity = document.getElementById('company-city').value;
    const companyWebsite = document.getElementById('company-website').value;
    const companyEmail = document.getElementById('company-email').value;

    // Champs supplémentaires pour ressources et besoins
    const companyResourceDescription = document.getElementById('resource-description') ? document.getElementById('resource-description').value : "";
    const companyNeedsDescription = document.getElementById('needs-description') ? document.getElementById('needs-description').value : "";

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

    // 🚀 Envoi des données à Make
    envoyerDonneesAMake(companyData);

    // Ensuite, ton code existant (console log par exemple)
    console.log("Données d'entreprise:", companyData);

    // Affiche les données Airtable après envoi
async function fetchAirtableData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Données Airtable :', data.records);

        // Sélectionner la section pour afficher les correspondances
        let matchesSection = document.getElementById('matches-section');
        if (!matchesSection) {
            matchesSection = document.createElement('section');
            matchesSection.id = 'matches-section';
            matchesSection.className = 'matches';
            matchesSection.style.padding = '50px 0';
            document.body.appendChild(matchesSection);
        }

        // Construire la liste des matchs à partir de Airtable
        const latestMatches = [];
        data.records.forEach(record => {
            const fields = record.fields;
            const matchCategories = fields["MATCHS"] || [];

            matchCategories.forEach(category => {
                latestMatches.push({
                    date: record.createdTime,
                    resourceCategory: category,
                    provider: { name: fields["Nom de l'entreprise"] || 'N/A' },
                    receiver: { name: 'N/A' }, // Placeholder
                    providerDescription: fields["Description Ressources"] || '',
                    receiverDescription: fields["Description Besoins"] || ''
                });
            });
        });

        // Afficher les matchs
        matchesSection.innerHTML = `
          <div class="container">
            <h2>Derniers Matchs Réalisés</h2>
            <p class="text-center" style="margin-bottom: 30px;">Découvrez les dernières synergies créées entre entreprises genevoises.</p>
            <div class="matches-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
              ${
                latestMatches.length > 0
                  ? latestMatches.map(match => `
                      <div class="match-card" style="background-color: white; border-radius: 8px; padding: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                          <span style="background-color: #2A9D8F; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;">Match</span>
                          <span style="color: #6c757d; font-size: 0.9rem;">${new Date(match.date).toLocaleDateString()}</span>
                        </div>
                        <h3 style="margin-top: 0; color: #264653; margin-bottom: 15px;">Catégorie: ${match.resourceCategory}</h3>
                        <div style="margin-bottom: 15px;">
                          <div style="font-weight: bold; color: #2A9D8F;">Fournisseur</div>
                          <div>${match.provider.name}</div>
                        </div>
                        <div style="margin-bottom: 15px;">
                          <div style="font-weight: bold; color: #E76F51;">Receveur</div>
                          <div>${match.receiver.name}</div>
                        </div>
                        <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 15px 0;">
                        <div style="font-size: 0.9rem; color: #333;">
                          <div>Ressource: <span style="font-style: italic;">${match.providerDescription.substring(0, 100)}${match.providerDescription.length > 100 ? '...' : ''}</span></div>
                          <div>Besoin: <span style="font-style: italic;">${match.receiverDescription.substring(0, 100)}${match.receiverDescription.length > 100 ? '...' : ''}</span></div>
                        </div>
                      </div>
                    `).join('')
                  : `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 30px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                      <p>Aucun match n'a encore été réalisé. Rejoignez notre écosystème pour créer les premières synergies !</p>
                    </div>
                  `
              }
            </div>
          </div>
        `;
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

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi des données à Make.');
        }
        console.log('Données envoyées à Make avec succès.');
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi des données à Make:', error);
    });
}
function computeSemanticScore(desc1, desc2) {
    // Pour l’instant, on simule un score aléatoire
    return Math.random();
}
async function fetchAirtableData() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Données Airtable :', data.records);

        // Vérifier si le conteneur existe déjà
        let container = document.getElementById('matches-section');
        if (!container) {
            container = document.createElement('section');
            container.id = 'matches-section';
            container.className = 'matches';
            document.body.appendChild(container);
        }
        container.innerHTML = ''; // Vider le conteneur avant affichage

        const grid = document.createElement('div');
grid.className = 'matches-grid';

const grid = document.createElement('div');
grid.className = 'matches-grid';

data.records.forEach(record => {
    const fields = record.fields;
    // 🧸 Ajout d’un score IA simulé pour la ressource et le besoin
const resourceDescription = fields["Description Ressources"] || '';
const needsDescription = fields["Description Besoins"] || '';
const score = computeSemanticScore(resourceDescription, needsDescription);
console.log("Score IA :", score);

    const card = document.createElement('div');
    card.className = 'match-card';

    let cardContent = `
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

// Charger les données Airtable au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchAirtableData();
});


