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

    const companyData = {
        name: companyName,
        address: companyAddress,
        postalCode: companyPostal,
        city: companyCity,
        website: companyWebsite,
        email: companyEmail
    };

    // 🚀 Envoi des données à Make
    envoyerDonneesAMake(companyData);

    // Ensuite, ton code existant (console log par exemple)
    console.log("Données d'entreprise:", companyData);

    // Affiche les données Airtable après envoi
    fetchAirtableData();
}

function envoyerDonneesAMake(companyData) {
    const webhookUrl = 'https://hook.eu2.make.com/x38i6elzcm3c3fr6u8ps6fqodhrb56t1';

    const dataToSend = {
        "Nom de l’entreprise": companyData.name,
        "Adresse": companyData.address,
        "Code postal": companyData.postalCode,
        "Ville": companyData.city,
        "Email": companyData.email,
        "Site web": companyData.website
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

        data.records.forEach(record => {
            const fields = record.fields;
            const card = document.createElement('div');
            card.className = 'match-card';

            let cardContent = '<h3>Entreprise</h3>';

            Object.keys(fields).forEach(fieldName => {
                let value = fields[fieldName];
                if (Array.isArray(value)) {
                    value = value.join(', ');
                }
                cardContent += `<p><strong>${fieldName} :</strong> ${value}</p>`;
            });

            card.innerHTML = cardContent;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des données Airtable :', error);
    }
}

// Charger les données Airtable au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchAirtableData();
});

