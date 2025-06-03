// Structure pour stocker des entreprises et des matchs
let companies = [];
let matches = [];

// Fonction pour initialiser des données de test
function initTestData() {
  // Vérifier si des données existent déjà en localStorage
  const storedCompanies = localStorage.getItem('regenere_companies');
  const storedMatches = localStorage.getItem('regenere_matches');
  
  if (storedCompanies) {
    companies = JSON.parse(storedCompanies);
  } else {
    // Créer quelques entreprises de test si aucune n'existe
    companies = [
      {
        id: 1,
        name: "EcoDesign SA",
        email: "contact@ecodesign.ch",
        address: "15 Rue du Rhône",
        postalCode: "1204",
        city: "Genève",
        website: "www.ecodesign.ch",
        resources: {
          categories: ["Déchets recyclables", "Expertise"],
          description: "30kg de carton recyclé par semaine, 5h de conseil en écoconception par mois",
          frequency: "régulière",
          mode: "présentiel",
          expertise: "expert"
        },
        needs: {
          categories: ["Espace", "Formation"],
          description: "Recherche espace de stockage temporaire (20m²), formation en marketing digital",
          frequency: "ponctuelle",
          mode: "mixte",
          expertise: "débutant"
        },
        notificationPreferences: "all"
      },
      {
        id: 2,
        name: "BureauFlex SARL",
        email: "info@bureauflex.ch",
        address: "25 Avenue de la Gare",
        postalCode: "1201",
        city: "Genève",
        website: "www.bureauflex.ch",
        resources: {
          categories: ["Espace", "Équipements"],
          description: "Salle de réunion disponible les mardis et jeudis, matériel informatique à partager",
          frequency: "régulière",
          mode: "présentiel",
          expertise: "intermédiaire"
        },
        needs: {
          categories: ["Expertise", "Déchets recyclables"],
          description: "Besoin de conseil juridique, recherche solution pour recyclage de mobilier",
          frequency: "ponctuelle",
          mode: "mixte",
          expertise: "expert"
        },
        notificationPreferences: "weekly"
      },
      {
        id: 3,
        name: "FormaPro Genève",
        email: "contact@formapro.ch",
        address: "8 Rue de Carouge",
        postalCode: "1205",
        city: "Genève",
        website: "www.formapro.ch",
        resources: {
          categories: ["Formation", "Compétences numériques"],
          description: "Offre 10h de formation en marketing digital par mois, développement d'outils numériques",
          frequency: "régulière",
          mode: "distanciel",
          expertise: "expert"
        },
        needs: {
          categories: ["Espace", "Matières premières"],
          description: "Recherche local pour ateliers (capacité 15 personnes), matériel de bureau",
          frequency: "régulière",
          mode: "présentiel",
          expertise: "intermédiaire"
        },
        notificationPreferences: "important"
      }
    ];
    localStorage.setItem('regenere_companies', JSON.stringify(companies));
  }
  
  if (storedMatches) {
    matches = JSON.parse(storedMatches);
  } else {
    matches = [];
    localStorage.setItem('regenere_matches', JSON.stringify(matches));
  }
}

// Fonction pour trouver des matchs potentiels
function findMatches() {
  let newMatches = [];
  
  // Pour chaque paire d'entreprises
  for (let i = 0; i < companies.length; i++) {
    for (let j = i + 1; j < companies.length; j++) {
      // Vérifier les matchs dans les deux directions
      const matches1 = findMatchBetweenCompanies(companies[i], companies[j]);
      const matches2 = findMatchBetweenCompanies(companies[j], companies[i]);
      
      newMatches = [...newMatches, ...matches1, ...matches2];
    }
  }
  
  // Filtrer pour éliminer les doublons et les matchs déjà existants
  const uniqueNewMatches = newMatches.filter((match, index, self) => 
    index === self.findIndex(m => 
      m.provider.id === match.provider.id && 
      m.receiver.id === match.receiver.id &&
      m.resourceCategory === match.resourceCategory
    )
  );
  
  // Filtrer pour ne garder que les matchs qui n'existent pas déjà
  const actuallyNewMatches = uniqueNewMatches.filter(newMatch => 
    !matches.some(existingMatch => 
      existingMatch.provider.id === newMatch.provider.id &&
      existingMatch.receiver.id === newMatch.receiver.id &&
      existingMatch.resourceCategory === newMatch.resourceCategory
    )
  );
  
  // Ajouter la date aux nouveaux matchs
  actuallyNewMatches.forEach(match => {
    match.date = new Date().toISOString();
    match.id = Date.now() + Math.floor(Math.random() * 1000);
  });
  
  // Ajouter les nouveaux matchs à la liste existante
  matches = [...matches, ...actuallyNewMatches];
  
  // Sauvegarder dans localStorage
  localStorage.setItem('regenere_matches', JSON.stringify(matches));
  
  return actuallyNewMatches;
}

// Fonction pour trouver les matchs entre deux entreprises spécifiques
function findMatchBetweenCompanies(provider, receiver) {
  let foundMatches = [];
  
  // Pour chaque catégorie de ressources du fournisseur
  provider.resources.categories.forEach(resourceCategory => {
    // Vérifier si cette catégorie correspond à un besoin du receveur
    if (receiver.needs.categories.includes(resourceCategory)) {
      foundMatches.push({
        provider: {
          id: provider.id,
          name: provider.name
        },
        receiver: {
          id: receiver.id,
          name: receiver.name
        },
        resourceCategory: resourceCategory,
        providerDescription: provider.resources.description,
        receiverDescription: receiver.needs.description
      });
    }
  });
  
  return foundMatches;
}

// Fonction pour récupérer les derniers matchs
function getLatestMatches(count = 3) {
  // Trier par date décroissante
  return [...matches].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, count);
}

// Fonction pour afficher les matchs sur la page
function displayMatches() {
  // Créer un conteneur pour les matchs s'il n'existe pas déjà
  let matchesSection = document.getElementById('matches-section');
  if (!matchesSection) {
    // Créer la section de matchs après la section "Comment ça marche"
    const howItWorksSection = document.getElementById('how-it-works');
    
    matchesSection = document.createElement('section');
    matchesSection.id = 'matches-section';
    matchesSection.className = 'matches';
    matchesSection.style.backgroundColor = '#f7f9fc';
    matchesSection.style.padding = '50px 0';
    
    // Insérer après la section "how-it-works"
    howItWorksSection.parentNode.insertBefore(matchesSection, howItWorksSection.nextSibling);
  }
  
  // Récupérer les 3 derniers matchs
  const latestMatches = getLatestMatches(3);
  
  // Générer le HTML pour la section de matchs
  matchesSection.innerHTML = `
    <div class="container">
      <h2>Derniers Matchs Réalisés</h2>
      <p class="text-center" style="margin-bottom: 30px;">Découvrez les dernières synergies créées entre entreprises genevoises.</p>
      
      <div class="matches-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
        ${latestMatches.length > 0 ? latestMatches.map(match => `
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
        `).join('') : `
          <div style="grid-column: 1 / -1; text-align: center; padding: 30px; background-color: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <p>Aucun match n'a encore été réalisé. Rejoignez notre écosystème pour créer les premières synergies !</p>
          </div>
        `}
      </div>
    </div>
  `;
}

// Fonction pour afficher une notification de nouveaux matchs
function showMatchNotification(newMatches) {
  // Création d'un élément modal pour la notification
  let modalOverlay = document.createElement('div');
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';
  
  let modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '30px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '600px';
  modalContent.style.width = '90%';
  modalContent.style.maxHeight = '80vh';
  modalContent.style.overflow = 'auto';
  
  // Titre et contenu
  modalContent.innerHTML = `
    <h2 style="color: #2A9D8F; margin-top: 0;">Nouveaux matchs trouvés! 🎉</h2>
    <p>Félicitations! Nous avons trouvé ${newMatches.length} nouveau${newMatches.length > 1 ? 'x' : ''} match${newMatches.length > 1 ? 's' : ''} entre entreprises:</p>
    
    <div style="margin-top: 20px;">
      ${newMatches.map(match => `
        <div style="border-left: 4px solid #2A9D8F; padding-left: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #264653;">Catégorie: ${match.resourceCategory}</h3>
          <p><strong style="color: #2A9D8F;">${match.provider.name}</strong> peut fournir à <strong style="color: #E76F51;">${match.receiver.name}</strong></p>
        </div>
      `).join('')}
    </div>
    
    <button id="close-modal" style="background-color: #2A9D8F; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 4px; cursor: pointer; margin-top: 20px; float: right;">Fermer</button>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Fermer le modal au clic sur le bouton
  document.getElementById('close-modal').addEventListener('click', function() {
    document.body.removeChild(modalOverlay);
  });
  
  // Fermer le modal au clic sur l'overlay
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}

// Fonction pour ajouter un bouton de démo
function addDemoMatchButton() {
  // Ajouter un bouton discret pour créer des matchs de démonstration (utile pour les tests)
  const registrationSection = document.getElementById('registration');
  const demoButtonContainer = document.createElement('div');
  demoButtonContainer.style.textAlign = 'center';
  demoButtonContainer.style.marginTop = '20px';
  
  const demoButton = document.createElement('button');
  demoButton.textContent = 'Générer des exemples de matchs (démonstration)';
  demoButton.className = 'btn-add';
  demoButton.style.background = '#E9C46A';
  demoButton.style.marginTop = '20px';
  
  demoButton.addEventListener('click', function() {
    // Créer une entreprise de démonstration
    const demoCompany = {
      id: Date.now(),
      name: "Entreprise Demo " + Math.floor(Math.random() * 100),
      address: "1 Rue de la Démo",
      postalCode: "1200",
      city: "Genève",
      website: "www.demo-enterprise.ch",
      email: "contact@demo-enterprise.ch",
      resources: {
        categories: ["Équipements", "Expertise", "Formation"],
        description: "Équipements informatiques disponibles, expertise en développement durable et formation en économie circulaire",
        frequency: "régulière",
        mode: "mixte",
        expertise: "expert"
      },
      needs: {
        categories: ["Espace", "Matières premières", "Compétences numériques"],
        description: "Recherche espace de coworking, matières premières recyclées et aide en développement web",
        frequency: "ponctuelle",
        mode: "présentiel",
        expertise: "intermédiaire"
      },
      notificationPreferences: "all"
    };
    
    // Ajouter l'entreprise de démo
    companies.push(demoCompany);
    localStorage.setItem('regenere_companies', JSON.stringify(companies));
    
    // Trouver des matchs
    const newMatches = findMatches();
    
    // Afficher les nouveaux matchs
    if (newMatches.length > 0) {
      showMatchNotification(newMatches);
      displayMatches();
      showNotification('Matchs de démonstration générés!', 'success');
    } else {
      showNotification('Aucun nouveau match trouvé. Essayez avec d\'autres données.', 'error');
    }
  });
  
  demoButtonContainer.appendChild(demoButton);
  registrationSection.querySelector('.container').appendChild(demoButtonContainer);
}

// Fonction pour montrer des matchs initiaux
function showInitialMatches() {
  // Créer un match initial si aucun n'existe
  if (matches.length === 0) {
    // Créer un match d'exemple entre les deux premières entreprises si elles existent
    if (companies.length >= 2) {
      const provider = companies[0];
      const receiver = companies[1];
      
      // Vérifier s'il y a une correspondance potentielle
      const commonCategory = provider.resources.categories.find(cat => 
        receiver.needs.categories.includes(cat)
      );
      
      if (commonCategory) {
        const example
