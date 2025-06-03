function envoyerDonneesAMake(companyData) {
    const webhookUrl = 'https://hook.eu2.make.com/x38i6elzcm3c3fr6u8ps6fqodhrb56t1'; // Ton URL Make

    // Construire un objet avec uniquement les champs de la table ENTREPRISES
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

