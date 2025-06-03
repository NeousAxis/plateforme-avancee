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

    // Tu peux aussi garder ici ton enregistrement localStorage ou autre code
    // ...
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
