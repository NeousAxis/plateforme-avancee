function seDeconnecter() {
    logoutUser();
}
// Fonction pour ouvrir la modal de connexion
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Fonction pour fermer la modal de connexion
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Fonction pour faire défiler jusqu'au formulaire d'inscription
function scrollToRegistration() {
    document.getElementById('registration').scrollIntoView({ behavior: 'smooth' });
}

// Fonction de connexion
function loginUser() {
    const email = document.getElementById('login-email').value;
    
    if (!email) {
        showNotification('Veuillez entrer votre email professionnel.', 'error');
        return;
    }
    
    // Rechercher l'entreprise correspondante dans le localStorage
    const companies = JSON.parse(localStorage.getItem('regenere_companies') || '[]');
    const company = companies.find(comp => comp.email === email);
    
    if (company) {
        // Simuler une connexion réussie
        showNotification('Connexion réussie! Bienvenue ' + company.name, 'success');
        closeLoginModal();
        
        // Mettre à jour l'interface pour montrer que l'utilisateur est connecté
        document.getElementById('auth-status').innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; margin-right: 10px;">
                    <div style="color: white; font-size: 0.9rem;">Connecté en tant que :</div>
                    <div style="color: white; font-weight: bold;">${company.name}</div>
                </div>
                <button class="submit-btn" style="background-color: #264653; margin: 0;" onclick="logoutUser()">Déconnexion</button>
            </div>
        `;
    } else {
        showNotification('Email non reconnu. Veuillez vous inscrire.', 'error');
    }
}
// Fonction de déconnexion
function logoutUser() {
    document.getElementById('auth-status').innerHTML = `
        <div style="display: flex; gap: 10px;">
            <button style="background-color: transparent; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer;" onclick="openLoginModal()">Connexion</button>
            <button class="submit-btn" onclick="scrollToRegistration()">Inscription</button>
        </div>
    `;
}
