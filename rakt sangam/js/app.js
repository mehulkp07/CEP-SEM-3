/**
 * Rakt Sangam Pune (रक्त संगम पुणे) - Application Logic
 * Tailored exclusively for Pune City & PCMC
 * Spotlight on Aadhar Blood Bank (Dhankawadi) & Bharati Vidyapeeth (Katraj)
 */

// Application State
const AppState = {
  currentRoute: 'home',
  directoryTab: 'centers', // 'centers' | 'camps'
  selectedLocality: 'All Pune',
  campsSearchQuery: '',
  selectedBloodGroup: 'O-',
  learnSearchQuery: '',
  selectedArticleCategory: 'all',
  activeCampForRegistration: null,
  activeCenterForDetails: null,
  activeCampForDonors: null,
  quizAnswers: { q1: null, q2: null, q3: null, q4: null }
};

// ==========================================================================
// Toast Notification Engine
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  
  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// Router & Page Rendering
// ==========================================================================
const Router = {
  routes: {
    '': 'home',
    'home': 'home',
    'camps': 'camps',
    'donate': 'donate',
    'learn': 'learn',
    'about': 'about',
    'contact': 'contact',
    'organizer': 'organizer'
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('site-header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Mobile drawer toggle
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('active');
      });
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => drawer.classList.remove('active'));
      });
    }

    // Modal close handlers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      }
    });

    this.setupGlobalForms();
  },

  handleRoute() {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '');
    const route = this.routes[rawHash] || 'home';
    AppState.currentRoute = route;

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      if (link.getAttribute('data-route') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const mainContent = document.getElementById('app-content');
    if (!mainContent) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (route) {
      case 'home':
        mainContent.innerHTML = renderHomePage();
        initHomeInteractions();
        break;
      case 'camps':
        mainContent.innerHTML = renderCampsPage();
        initCampsInteractions();
        break;
      case 'donate':
        mainContent.innerHTML = renderDonatePage();
        initDonateInteractions();
        break;
      case 'learn':
        mainContent.innerHTML = renderLearnPage();
        initLearnInteractions();
        break;
      case 'about':
        mainContent.innerHTML = renderAboutPage();
        break;
      case 'contact':
        mainContent.innerHTML = renderContactPage();
        initContactInteractions();
        break;
      case 'organizer':
        mainContent.innerHTML = renderOrganizerPage();
        initOrganizerInteractions();
        break;
      default:
        mainContent.innerHTML = renderHomePage();
        initHomeInteractions();
    }
  },

  setupGlobalForms() {
    // 1. Donor Registration Form
    const regForm = document.getElementById('donor-registration-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const campId = document.getElementById('reg-camp-id').value;
        const campName = document.getElementById('reg-camp-name').value;
        const name = document.getElementById('reg-full-name').value.trim();
        const age = parseInt(document.getElementById('reg-age').value, 10);
        const bloodGroup = document.getElementById('reg-blood-group').value || 'Not Disclosed';
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const preferredSlot = document.getElementById('reg-slot').value;
        const consent = document.getElementById('reg-consent').checked;

        if (!name || isNaN(age) || age < 18 || age > 65 || !phone || !email || !consent) {
          showToast('Please check all fields. Age must be 18-65.', 'warning');
          return;
        }

        const camp = StorageService.getCampById(campId) || StorageService.getCenterById(campId);
        const newReg = StorageService.registerDonor({
          campId,
          campName,
          name,
          age,
          bloodGroup,
          phone,
          email,
          preferredDate: camp ? (camp.date || 'Walk-in Today') : 'Upcoming',
          preferredSlot
        });

        document.getElementById('camp-register-modal').classList.remove('active');
        regForm.reset();

        renderDonorPass(newReg, camp);
        showToast('Registration confirmed! Pune Donor Pass generated.', 'success');

        if (AppState.currentRoute === 'camps') {
          Router.handleRoute();
        }
      });
    }

    // 2. Organizer Form (Create / Edit Pune Camp)
    const orgForm = document.getElementById('organizer-camp-form');
    if (orgForm) {
      orgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('org-camp-id').value;
        const name = document.getElementById('org-camp-name').value.trim();
        const organizer = document.getElementById('org-camp-organizer').value.trim();
        const bloodBank = document.getElementById('org-camp-bloodbank').value;
        const locality = document.getElementById('org-camp-locality').value;
        const date = document.getElementById('org-camp-date').value;
        const startTime = document.getElementById('org-camp-start').value.trim();
        const endTime = document.getElementById('org-camp-end').value.trim();
        const venue = document.getElementById('org-camp-venue').value.trim();
        const address = document.getElementById('org-camp-address').value.trim();
        const contactName = document.getElementById('org-camp-contact-name').value.trim();
        const contactPhone = document.getElementById('org-camp-contact-phone').value.trim();
        const description = document.getElementById('org-camp-desc').value.trim();

        if (!name || !organizer || !date || !venue || !address || !contactName || !contactPhone) {
          showToast('Please fill all required Pune camp details.', 'warning');
          return;
        }

        const existingCamp = id ? StorageService.getCampById(id) : null;

        const campData = {
          id: id || undefined,
          name,
          organizer,
          bloodBank,
          locality,
          date,
          startTime,
          endTime,
          venue,
          address,
          contactName,
          contactPhone,
          contactEmail: 'pune.camps@raktsangam.org.in',
          description,
          targetUnits: existingCamp ? existingCamp.targetUnits : 150,
          registeredCount: existingCamp ? existingCamp.registeredCount : 0,
          facilities: ["Doctors On-Site", "Hemoglobin Check", "Energy Refreshments", "Pune Donor Certificate"],
          instructions: [
            "Bring Govt ID (Aadhaar/Driving License)",
            "Eat a wholesome meal 1-2 hours beforehand",
            "Hydrate well with 500ml water"
          ],
          status: "upcoming"
        };

        StorageService.saveCamp(campData);
        document.getElementById('organizer-camp-modal').classList.remove('active');
        orgForm.reset();

        showToast(id ? 'Camp updated!' : 'New Pune blood camp created successfully!', 'success');
        Router.handleRoute();
      });
    }

    // 3. Export Roster
    const exportBtn = document.getElementById('btn-export-donors');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (!AppState.activeCampForDonors) return;
        const donors = StorageService.getRegistrationsForCamp(AppState.activeCampForDonors.id);
        if (donors.length === 0) {
          showToast('No donors registered for this Pune drive yet.', 'info');
          return;
        }
        
        let tsv = 'Pass ID\tDonor Name\tAge\tBlood Group\tPhone\tEmail\tSlot\tRegistered Date\n';
        donors.forEach(d => {
          tsv += `${d.id}\t${d.name}\t${d.age}\t${d.bloodGroup}\t${d.phone}\t${d.email}\t${d.preferredSlot}\t${new Date(d.registeredAt).toLocaleDateString()}\n`;
        });

        navigator.clipboard.writeText(tsv).then(() => {
          showToast('Donor roster copied to clipboard (TSV format)!', 'success');
        }).catch(() => {
          showToast('Could not copy to clipboard.', 'warning');
        });
      });
    }
  }
};

// ==========================================================================
// 1. HOME PAGE VIEW (Pune Edition)
// ==========================================================================
function renderHomePage() {
  const centers = StorageService.getCenters();
  const aadharCenter = centers.find(c => c.id === 'center-aadhar-dhankawadi') || PUNE_PERMANENT_CENTERS[0];
  const bvduCenter = centers.find(c => c.id === 'center-bharati-vidyapeeth') || PUNE_PERMANENT_CENTERS[1];
  const pimpriCenter = centers.find(c => c.id === 'center-pimpri-serological') || PUNE_PERMANENT_CENTERS.find(c => c.id === 'center-pimpri-serological');
  const upcomingCamps = StorageService.getCamps().slice(0, 3);

  return `
    <!-- Hero Section (Pune Edition) -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          
          <div class="hero-content">
            <div class="hero-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626"><circle cx="12" cy="12" r="10"/></svg>
              <span>पुणेकरांचा जीवनरक्षक उपक्रम • Dedicated to Pune & PCMC</span>
            </div>

            <h1 class="hero-title">
              Keep Pune Beating: Your Blood Donation <span class="text-gradient">Saves Lives.</span>
            </h1>

            <p class="hero-subtitle">
              Every single day, hospitals across Pune require over 650 units of blood. Find verified 24x7 blood centers in Dhankawadi, Katraj, and across Pune, check live blood stock, or register for local weekend camps.
            </p>

            <div class="hero-cta-group">
              <a href="#/camps" class="btn btn-primary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                Find Pune Blood Centers & Camps
              </a>
              <a href="#/donate" class="btn btn-secondary btn-lg">
                Donor Guide & Eligibility &rarr;
              </a>
            </div>

            <div class="hero-trust-badges">
              <div class="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Aadhar & Bharati Vidyapeeth Verified</span>
              </div>
              <div class="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>24x7 Walk-in Donation</span>
              </div>
              <div class="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Zero Wait-Time Digital Passes</span>
              </div>
            </div>
          </div>

          <!-- Hero Graphic Card (Live Dhankawadi-Katraj Focus) -->
          <div class="hero-visual">
            <div class="hero-card-stack">
              
              <div class="floating-badge floating-badge-2">
                <div class="pulse-dot"></div>
                <span>Dhankawadi & Katraj Corridor</span>
              </div>

              <div class="hero-main-card">
                <div class="hero-pulse-badge">
                  <div class="pulse-dot"></div>
                  <span>Urgent: O- & AB- Needed Today</span>
                </div>

                <div class="card-top-icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>

                <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">South Pune Blood Lifeline</h3>
                <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                  Immediate access to <strong>Aadhar Blood Bank (Dhankawadi)</strong> & <strong>Bharati Hospital (Katraj)</strong> along the Pune-Satara road.
                </p>

                <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span>Pune Today's Target: 650 Units</span>
                    <span style="color: var(--primary);">412 Collected</span>
                  </div>
                  <div style="height: 8px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden;">
                    <div style="width: 63%; height: 100%; background: var(--primary-gradient); border-radius: var(--radius-full);"></div>
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem;">
                  <a href="tel:02024372020" class="btn btn-secondary btn-sm" style="flex:1; justify-content: center; font-size: 0.8rem;">
                    📞 Aadhar: 2437 2020
                  </a>
                  <a href="tel:02024373226" class="btn btn-secondary btn-sm" style="flex:1; justify-content: center; font-size: 0.8rem;">
                    📞 Bharati: 2437 3226
                  </a>
                </div>
              </div>

              <div class="floating-badge floating-badge-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>38+ Pune Centers Active</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- PROMINENT SPOTLIGHT: Aadhar Blood Bank (Dhankawadi) & Bharati Vidyapeeth (Katraj) -->
    <section class="section" style="padding-top: 1rem; padding-bottom: 3.5rem;">
      <div class="container">
        
        <div class="spotlight-banner">
          <div class="spotlight-header">
            <div>
              <span class="section-tag" style="background:#fef2f2; color:#dc2626;">Featured Premier Blood Centers</span>
              <h2 style="font-size: 1.85rem; margin-top: 0.25rem;">Dhankawadi & Katraj 24x7 Blood Hubs</h2>
              <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.2rem;">
                Official accredited centers serving emergency trauma care along Pune-Satara highway and southern Pune.
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="pulse-dot"></span>
              <span style="font-size: 0.85rem; font-weight: 700; color: #059669;">Both Centers Open 24/7 for Donations & Issues</span>
            </div>
          </div>

          <div class="spotlight-grid">
            
            <!-- Aadhar Blood Bank Card -->
            <div class="spotlight-card featured-aadhar">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="spotlight-badge">Dhankawadi Corner</span>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">${aadharCenter.donationsTodayCount} Donors Today</span>
              </div>

              <h3 class="spotlight-title">${aadharCenter.name}</h3>
              <div class="spotlight-area">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${aadharCenter.address}</span>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1rem;">
                State-of-the-art blood component separation unit producing Packed Red Cells, Single Donor Platelets (SDP), and Fresh Frozen Plasma with 24x7 emergency issuance.
              </p>

              <!-- Stock preview pills -->
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">O+ Available</span>
                <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">B+ Available</span>
                <span style="font-size: 0.75rem; background: #fef2f2; color: #991b1b; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 800; border: 1px solid #fecaca;">O- Urgent</span>
                <span style="font-size: 0.75rem; background: #fffbeb; color: #92400e; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">A- Low</span>
              </div>

              <div class="spotlight-action-row">
                <a href="tel:02024372020" class="btn btn-primary btn-sm" style="flex: 1.2; justify-content: center;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call 020-2437 2020
                </a>
                <a href="${aadharCenter.googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center;">
                  Directions ↗
                </a>
              </div>
            </div>

            <!-- Bharati Vidyapeeth Medical College Blood Centre Card -->
            <div class="spotlight-card featured-bvdu">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="spotlight-badge" style="background:#fff7ed; color:#c2410c;">Katraj BVDU Campus</span>
                <span style="font-size: 0.8rem; font-weight: 700; color: #ea580c;">${bvduCenter.donationsTodayCount} Donors Today</span>
              </div>

              <h3 class="spotlight-title">${bvduCenter.name}</h3>
              <div class="spotlight-area">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${bvduCenter.address}</span>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1rem;">
                NABH-accredited tertiary medical hospital blood center equipped with advanced apheresis (Single Donor Platelet) suites, Nucleic Acid Testing (NAT), and free thalassemia support.
              </p>

              <!-- Stock preview pills -->
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">All Major Groups OK</span>
                <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">SDP Apheresis Ready</span>
                <span style="font-size: 0.75rem; background: #fef2f2; color: #991b1b; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 800; border: 1px solid #fecaca;">A- Urgent</span>
              </div>

              <div class="spotlight-action-row">
                <a href="tel:02024373226" class="btn btn-primary btn-sm" style="flex: 1.2; justify-content: center; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call 020-2437 3226
                </a>
                <a href="${bvduCenter.googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center;">
                  Directions ↗
                </a>
              </div>
            </div>

            <!-- Pimpri Serological Institute Blood Centre Card (PCMC) -->
            ${pimpriCenter ? `
              <div class="spotlight-card featured-pimpri">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="spotlight-badge" style="background:#f0f9ff; color:#0369a1;">Pimpri (PCMC Hub)</span>
                  <span style="font-size: 0.8rem; font-weight: 700; color: #0284c7;">${pimpriCenter.donationsTodayCount} Donors Today</span>
                </div>

                <h3 class="spotlight-title">${pimpriCenter.name}</h3>
                <div class="spotlight-area">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>${pimpriCenter.address}</span>
                </div>

                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1rem;">
                  Premier 24x7 blood component center in Pimpri-Chinchwad serving industrial accident trauma, highway emergencies on the Old Mumbai-Pune road, and local PCMC hospitals.
                </p>

                <!-- Stock preview pills -->
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
                  <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">O+ Available</span>
                  <span style="font-size: 0.75rem; background: #ecfdf5; color: #065f46; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">B+ Available</span>
                  <span style="font-size: 0.75rem; background: #fffbeb; color: #92400e; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 700;">O- Low</span>
                  <span style="font-size: 0.75rem; background: #fef2f2; color: #991b1b; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); font-weight: 800; border: 1px solid #fecaca;">AB- Urgent</span>
                </div>

                <div class="spotlight-action-row">
                  <a href="tel:${pimpriCenter.phone.replace(/[^0-9]/g, '')}" class="btn btn-primary btn-sm" style="flex: 1.2; justify-content: center; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Call ${pimpriCenter.phone}
                  </a>
                  <a href="${pimpriCenter.googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center;">
                    Directions ↗
                  </a>
                </div>
              </div>
            ` : ''}

          </div>
        </div>

      </div>
    </section>

    <!-- LIVE PUNE BLOOD STOCK BOARD -->
    <section class="section section-alt" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="live-stock-board">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem;">
            <div>
              <span class="section-tag">Real-Time City Tracker</span>
              <h2 style="font-size: 1.6rem; margin-top: 0.25rem;">Live Pune Blood Inventory Status</h2>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.2rem;">
                Estimated consolidated availability across 38+ licensed blood centers in Pune district. ${PUNE_LIVE_STOCK.lastUpdated}.
              </p>
            </div>
            <div>
              <a href="#/camps" class="btn btn-outline-primary btn-sm">
                View All Center Inventories &rarr;
              </a>
            </div>
          </div>

          <!-- 8 Blood Group Stock Grid -->
          <div class="stock-grid">
            ${Object.keys(PUNE_LIVE_STOCK.stockByGroup).map(grp => {
              const item = PUNE_LIVE_STOCK.stockByGroup[grp];
              return `
                <div class="stock-card" title="${item.note}">
                  <div class="stock-blood-group">${grp}</div>
                  <span class="stock-status-pill ${item.badgeClass}">${item.status}</span>
                  <div class="stock-units-count">~${item.units} Units</div>
                  <div style="font-size: 0.72rem; color: var(--text-light); margin-top: 0.2rem;">Demand: ${item.demand}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-top: 1.5rem; background: var(--bg-subtle); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.75rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span><strong>Urgent Need Alert:</strong> O-negative and AB-negative stocks are currently running low in Katraj, Dhankawadi, and Pune Station trauma facilities. Eligible negative-group donors are encouraged to walk into Aadhar or Bharati Vidyapeeth today.</span>
          </div>
        </div>

      </div>
    </section>

    <!-- Quick Stats for Pune -->
    <section class="stats-section" aria-label="Pune Statistics">
      <div class="container">
        <div class="stats-grid">
          
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </div>
            <div class="stat-number">${PUNE_STATS.dailyNeeded}</div>
            <div class="stat-label">Daily Pune Blood Need</div>
            <div class="stat-note">Across Sassoon, Bharati, KEM & private hospitals</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="stat-number">${PUNE_STATS.activeCenters}</div>
            <div class="stat-label">Verified Blood Centers</div>
            <div class="stat-note">Licensed in Pune & PCMC</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-number">${PUNE_STATS.monthlyDonors}</div>
            <div class="stat-label">Dhankawadi & Katraj Donors</div>
            <div class="stat-note">Regular monthly voluntary champions</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div class="stat-number">${PUNE_STATS.livesImpacted}</div>
            <div class="stat-label">Lives Saved in Pune</div>
            <div class="stat-note">Through safe component transfusions</div>
          </div>

        </div>
      </div>
    </section>

    <!-- Why Donate Blood in Pune? -->
    <section class="section">
      <div class="container">
        
        <div class="section-header">
          <span class="section-tag">Pune Healthcare Context</span>
          <h2 class="section-title">Why Voluntary Blood Matters in Pune</h2>
          <p class="section-description">
            Serving national highway corridors, regional oncology centers, and neonatal ICUs across Pune district.
          </p>
        </div>

        <div class="why-donate-grid">
          
          <div class="why-card">
            <div class="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3 class="why-title">Pune-Satara Highway Trauma</h3>
            <p class="why-text">
              The busy highway corridor through Katraj and Dhankawadi sees multiple emergency trauma incidents where prompt transfusions at Bharati Hospital save lives in the Golden Hour.
            </p>
            <div class="why-stat-highlight">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>Crucial during the Golden Hour</span>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 class="why-title">Surgeries & Complex Procedures</h3>
            <p class="why-text">
              Hospitals like Deenanath Mangeshkar, Sahyadri, and KEM perform complex cardiac bypasses and neurosurgeries requiring continuous PRBC supplies.
            </p>
            <div class="why-stat-highlight">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>2 to 6 units needed per major surgery</span>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 class="why-title">Thalassemia Day Care Patients</h3>
            <p class="why-text">
              Over 1,200 children and adults in Pune with Thalassemia Major depend on monthly transfusions. Bharati Hospital provides free specialized transfusion support.
            </p>
            <div class="why-stat-highlight">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>Regular support for Pune warriors</span>
            </div>
          </div>

          <div class="why-card">
            <div class="why-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 class="why-title">Component Fractionation</h3>
            <p class="why-text">
              A single donation at Aadhar Blood Bank is fractionated into Packed Red Cells, Platelets (for dengue/chemo), and Plasma, directly aiding 3 Pune patients.
            </p>
            <div class="why-stat-highlight">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>1 Donation = 3 Pune Lives</span>
            </div>
          </div>

        </div>

        <!-- Quick 60-Second Quiz Widget -->
        <div class="quiz-widget" id="quick-eligibility-quiz">
          <div class="quiz-header">
            <div class="quiz-title-wrap">
              <h3>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Can I Donate Today in Pune? (60-Second Check)
              </h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
                Quick self-assessment before visiting Aadhar Blood Bank or your nearest camp.
              </p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-reset-quiz">Reset</button>
          </div>

          <div class="quiz-questions-grid">
            <div class="quiz-q-card">
              <div class="quiz-q-label">1. Are you between 18 and 65 years of age?</div>
              <div class="quiz-q-options">
                <button class="quiz-btn" data-q="q1" data-val="yes">Yes</button>
                <button class="quiz-btn" data-q="q1" data-val="no">No</button>
              </div>
            </div>

            <div class="quiz-q-card">
              <div class="quiz-q-label">2. Is your body weight at least 45 kg (99 lbs)?</div>
              <div class="quiz-q-options">
                <button class="quiz-btn" data-q="q2" data-val="yes">Yes</button>
                <button class="quiz-btn" data-q="q2" data-val="no">No</button>
              </div>
            </div>

            <div class="quiz-q-card">
              <div class="quiz-q-label">3. Are you feeling completely healthy today?</div>
              <div class="quiz-q-options">
                <button class="quiz-btn" data-q="q3" data-val="yes">Yes</button>
                <button class="quiz-btn" data-q="q3" data-val="no">No</button>
              </div>
            </div>

            <div class="quiz-q-card">
              <div class="quiz-q-label">4. Has it been ≥90 days since your last donation?</div>
              <div class="quiz-q-options">
                <button class="quiz-btn" data-q="q4" data-val="yes">Yes (or 1st time)</button>
                <button class="quiz-btn" data-q="q4" data-val="no">No</button>
              </div>
            </div>
          </div>

          <div class="quiz-result-box" id="quiz-result"></div>
        </div>

      </div>
    </section>

    <!-- Blood Groups & Interactive Compatibility Matrix -->
    <section class="section section-alt">
      <div class="container">
        
        <div class="section-header">
          <span class="section-tag">Compatibility Guide</span>
          <h2 class="section-title">Blood Group Compatibility in Pune</h2>
          <p class="section-description">
            Click your blood group to see which patients in Pune hospitals can receive your blood.
          </p>
        </div>

        <div class="compat-matrix-card">
          <div class="blood-selector-row" id="blood-selector-buttons">
            ${Object.keys(BLOOD_COMPATIBILITY).map(group => `
              <button class="blood-btn ${group === AppState.selectedBloodGroup ? 'active' : ''}" data-blood="${group}">
                ${group}
              </button>
            `).join('')}
          </div>

          <div id="compat-details-container">
            ${renderCompatDetails(AppState.selectedBloodGroup)}
          </div>
        </div>

      </div>
    </section>

    <!-- Upcoming Pune Camps Preview -->
    <section class="section">
      <div class="container">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem;">
          <div>
            <span class="section-tag">Dhankawadi, Katraj & Pune Drives</span>
            <h2 class="section-title" style="margin-bottom: 0.25rem;">Upcoming Community Blood Donation Camps</h2>
            <p class="section-description">Verified weekend drives across Pune neighborhoods.</p>
          </div>
          <a href="#/camps" class="btn btn-outline-primary">
            View All Pune Camps &rarr;
          </a>
        </div>

        <div class="camp-grid">
          ${upcomingCamps.map(camp => renderCampCard(camp)).join('')}
        </div>
      </div>
    </section>

    <!-- Myths vs Facts Section -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Dispelling Misconceptions</span>
          <h2 class="section-title">Blood Donation Myths vs Scientific Facts</h2>
          <p class="section-description">Evidence-backed answers for Pune donors.</p>
        </div>

        <div class="myths-grid">
          ${MYTHS_AND_FACTS.map(item => `
            <div class="myth-card">
              <div class="myth-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>Myth</span>
              </div>
              <div class="myth-text">"${item.myth}"</div>
              
              <div class="fact-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Scientific Fact</span>
              </div>
              <div class="fact-text">${item.fact}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Stories from Pune Donors -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Local Stories</span>
          <h2 class="section-title">Stories That Inspire Pune</h2>
          <p class="section-description">Real voices from Dhankawadi, Katraj, and Kothrud.</p>
        </div>

        <div class="stories-grid">
          ${SAMPLE_STORIES.map(story => `
            <div class="story-card">
              <span class="story-sample-tag">★ Pune Donor Story</span>
              <p class="story-quote">"${story.quote}"</p>
              <div class="story-author">
                <div class="author-avatar">${story.name.charAt(0)}</div>
                <div>
                  <div class="author-name">${story.name}</div>
                  <div class="author-meta">${story.city} • Group ${story.bloodGroup} • ${story.donationsCount} Donations</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="final-cta-section">
      <div class="container">
        <div class="final-cta-content">
          <h2 class="final-cta-title">पुणेकरांनो, पुढे या आणि जीवन वाचवा!</h2>
          <p class="final-cta-desc">
            Your single donation at Aadhar Blood Bank (Dhankawadi) or Bharati Hospital (Katraj) can save an accident victim tonight.
          </p>
          <div class="final-cta-btn-group">
            <a href="#/camps" class="btn btn-secondary btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              Find Nearest Pune Center
            </a>
            <a href="tel:02024372020" class="btn btn-outline btn-lg">
              Call Aadhar Dhankawadi (24x7)
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function initHomeInteractions() {
  document.querySelectorAll('.blood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-blood');
      AppState.selectedBloodGroup = group;
      document.querySelectorAll('.blood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const container = document.getElementById('compat-details-container');
      if (container) {
        container.innerHTML = renderCompatDetails(group);
      }
    });
  });

  document.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      const val = btn.getAttribute('data-val');
      AppState.quizAnswers[q] = val;

      const parent = btn.closest('.quiz-q-options');
      parent.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected-yes', 'selected-no'));
      btn.classList.add(val === 'yes' ? 'selected-yes' : 'selected-no');

      evaluateQuiz();
    });
  });

  const resetQuizBtn = document.getElementById('btn-reset-quiz');
  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      AppState.quizAnswers = { q1: null, q2: null, q3: null, q4: null };
      document.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected-yes', 'selected-no'));
      const resultBox = document.getElementById('quiz-result');
      if (resultBox) {
        resultBox.style.display = 'none';
        resultBox.className = 'quiz-result-box';
        resultBox.innerHTML = '';
      }
    });
  }

  attachCardListeners();
}

function evaluateQuiz() {
  const ans = AppState.quizAnswers;
  const resultBox = document.getElementById('quiz-result');
  if (!resultBox) return;

  if (ans.q1 && ans.q2 && ans.q3 && ans.q4) {
    if (ans.q1 === 'yes' && ans.q2 === 'yes' && ans.q3 === 'yes' && ans.q4 === 'yes') {
      resultBox.className = 'quiz-result-box eligible';
      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <div style="font-weight: 800; font-size: 1.05rem;">You Are Eligible to Donate Today! 🎉</div>
            <div style="font-size: 0.88rem;">Walk into Aadhar Blood Bank (Dhankawadi) or Bharati Hospital (Katraj) now.</div>
          </div>
        </div>
        <a href="#/camps" class="btn btn-primary btn-sm">Find Nearest Center &rarr;</a>
      `;
    } else {
      resultBox.className = 'quiz-result-box deferred';
      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <div style="font-weight: 800; font-size: 1.05rem;">Temporary Deferral Advised</div>
            <div style="font-size: 0.88rem;">Ensure at least 90 days gap and good health before donating.</div>
          </div>
        </div>
        <a href="#/donate" class="btn btn-secondary btn-sm">Read Guidelines</a>
      `;
    }
    resultBox.style.display = 'flex';
  }
}

function renderCompatDetails(bloodGroup) {
  const data = BLOOD_COMPATIBILITY[bloodGroup];
  if (!data) return '';

  return `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
      <div>
        <div style="font-size: 1.4rem; font-weight: 800;">
          Blood Group ${bloodGroup}
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary); background: var(--primary-light); padding: 0.25rem 0.65rem; border-radius: var(--radius-full); margin-left: 0.5rem;">
            ${data.badge}
          </span>
        </div>
        <div style="font-size: 0.88rem; color: var(--text-light); margin-top: 0.2rem;">
          Prevalence in Pune: <strong>${data.distributionIndia}</strong>
        </div>
      </div>
      <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted);">
        ${data.label}
      </div>
    </div>

    <div class="compat-display-grid">
      <div class="compat-box">
        <div class="compat-box-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          <span>Can Give Red Cells To:</span>
        </div>
        <div class="compat-badge-list">
          ${data.giveTo.map(g => `<span class="compat-pill match">${g}</span>`).join('')}
        </div>
      </div>

      <div class="compat-box">
        <div class="compat-box-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          <span>Can Receive Red Cells From:</span>
        </div>
        <div class="compat-badge-list">
          ${data.receiveFrom.map(g => `<span class="compat-pill match">${g}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="compat-fact-box">
      <strong>Pune Medical Insight:</strong> ${data.fact}
    </div>
  `;
}

// ==========================================================================
// 2. PUNE BLOOD CENTERS & CAMPS DIRECTORY PAGE
// ==========================================================================
function renderCampsPage() {
  const centers = StorageService.getCenters();
  const camps = StorageService.getCamps();

  // Filter centers or camps depending on active tab
  const isCentersTab = AppState.directoryTab === 'centers';

  let listToFilter = isCentersTab ? centers : camps;

  // Apply Locality Filter
  if (AppState.selectedLocality !== 'All Pune') {
    listToFilter = listToFilter.filter(item => item.locality === AppState.selectedLocality);
  }

  // Apply Search Query
  if (AppState.campsSearchQuery) {
    const q = AppState.campsSearchQuery.toLowerCase();
    listToFilter = listToFilter.filter(item => {
      return (item.name && item.name.toLowerCase().includes(q)) ||
             (item.locality && item.locality.toLowerCase().includes(q)) ||
             (item.address && item.address.toLowerCase().includes(q)) ||
             (item.bloodBank && item.bloodBank.toLowerCase().includes(q));
    });
  }

  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div style="margin-bottom: 2rem; text-align: center;">
          <span class="section-tag">Dedicated Pune Directory</span>
          <h1 class="section-title" style="margin-bottom: 0.4rem;">Pune Blood Centers & Donation Camps</h1>
          <p class="section-description" style="max-width: 650px; margin: 0 auto;">
            Explore permanent 24x7 blood banks (including Aadhar Blood Bank & Bharati Vidyapeeth) or register for upcoming weekend neighborhood camps in Pune.
          </p>
        </div>

        <!-- DUAL DIRECTORY TAB SWITCHER -->
        <div class="dir-tabs-wrapper">
          <button class="dir-tab-btn ${isCentersTab ? 'active' : ''}" id="tab-centers-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
            24x7 Permanent Blood Centers (${centers.length})
          </button>
          <button class="dir-tab-btn ${!isCentersTab ? 'active' : ''}" id="tab-camps-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Upcoming Neighborhood Camps (${camps.length})
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="filter-toolbar">
          
          <div class="filter-search-row">
            <div class="search-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input" id="pune-search-input" placeholder="Search by name (e.g. Aadhar, Bharati, Sassoon), street, or locality..." value="${AppState.campsSearchQuery}">
            </div>
            ${!isCentersTab ? `
              <a href="#/organizer" class="btn btn-outline-primary btn-sm" style="white-space: nowrap;">
                + Register New Camp
              </a>
            ` : ''}
          </div>

          <!-- Pune Localities Filter Row -->
          <div class="filter-pills-row">
            <span class="filter-label">Filter Area:</span>
            ${PUNE_LOCALITIES.map(loc => `
              <button class="filter-pill ${AppState.selectedLocality === loc ? 'active' : ''}" data-loc="${loc}">
                ${loc}
              </button>
            `).join('')}
          </div>

        </div>

        <!-- Content Listing -->
        <div style="margin-bottom: 1.25rem; font-size: 0.92rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
          <span>Showing <strong>${listToFilter.length}</strong> ${isCentersTab ? 'Permanent Blood Centers' : 'Upcoming Camps'} in <strong>${AppState.selectedLocality}</strong></span>
          <span style="font-size: 0.8rem; color: #059669; font-weight: 700;">● Live Verified Directory</span>
        </div>

        ${listToFilter.length === 0 ? `
          <div style="background: white; border-radius: var(--radius-lg); padding: 4rem 2rem; text-align: center; border: 1px dashed var(--border-color);">
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No Results Found in ${AppState.selectedLocality}</h3>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">Try selecting "All Pune" to view centers across the entire city.</p>
            <button class="btn btn-primary btn-sm" id="btn-reset-pune-filter">Show All Pune Centers</button>
          </div>
        ` : `
          <div class="camp-grid">
            ${isCentersTab ? listToFilter.map(center => renderPermanentCenterCard(center)).join('') : listToFilter.map(camp => renderCampCard(camp)).join('')}
          </div>
        `}

      </div>
    </div>
  `;
}

function renderPermanentCenterCard(center) {
  const isAadhar = center.id === 'center-aadhar-dhankawadi';
  const isBVDU = center.id === 'center-bharati-vidyapeeth';

  return `
    <div class="camp-card ${isAadhar || isBVDU ? 'featured-center' : ''}" style="${isAadhar ? 'border-top: 4px solid #dc2626;' : ''} ${isBVDU ? 'border-top: 4px solid #ea580c;' : ''}">
      <div class="camp-card-header">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="camp-status-badge center247">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#059669"><circle cx="12" cy="12" r="10"/></svg>
            24x7 Permanent Center
          </span>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">
            ${center.locality}
          </span>
        </div>

        <h3 class="camp-title">${center.name}</h3>
        <div class="camp-organizer" style="font-size: 0.8rem; color: var(--text-muted);">
          <span>${center.accreditation}</span>
        </div>
      </div>

      <div class="camp-card-body">
        <div class="camp-info-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <strong style="color: var(--text-main); font-size: 0.9rem;">${center.address}</strong>
            <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 2px;">Landmark: ${center.landmark}</div>
          </div>
        </div>

        <div class="camp-info-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">${center.timings}</div>
            <div style="font-size: 0.8rem; color: var(--text-light);">Walk-in Donations: ${center.walkInDonations}</div>
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
          <strong>Facilities:</strong> ${center.facilities.slice(0, 3).join(', ')}...
        </div>
      </div>

      <div class="camp-card-footer">
        <a href="tel:${center.phone.replace(/[^0-9]/g, '')}" class="btn btn-primary btn-sm" style="flex:1.2; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Call: ${center.phone}
        </a>
        <a href="${center.googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex:0.8; justify-content: center;">
          Map ↗
        </a>
        <button class="btn btn-secondary btn-sm btn-center-details" data-id="${center.id}">
          Info
        </button>
      </div>
    </div>
  `;
}

function renderCampCard(camp) {
  let formattedDate = camp.date;
  try {
    const d = new Date(camp.date);
    formattedDate = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {}

  const progressPercent = Math.min(100, Math.round(((camp.registeredCount || 0) / (camp.targetUnits || 150)) * 100));

  return `
    <div class="camp-card" data-camp-id="${camp.id}">
      <div class="camp-card-header">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="camp-status-badge upcoming">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626"><circle cx="12" cy="12" r="10"/></svg>
            ${camp.locality}
          </span>
          <span style="font-size: 0.75rem; font-weight: 700; color: #059669;">Verified Pune Camp</span>
        </div>

        <h3 class="camp-title">${camp.name}</h3>
        <div class="camp-organizer">
          <span>By ${camp.organizer}</span>
        </div>
      </div>

      <div class="camp-card-body">
        <div class="camp-info-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <div>
            <strong>${formattedDate}</strong>
            <div style="font-size: 0.8rem; color: var(--text-light);">${camp.startTime} - ${camp.endTime}</div>
          </div>
        </div>

        <div class="camp-info-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <strong style="color: var(--text-main); font-size: 0.9rem;">${camp.venue}</strong>
            <div style="font-size: 0.8rem; color: var(--text-light);">${camp.address}</div>
          </div>
        </div>

        <div class="camp-hospital-badge">
          <span>Associated Blood Bank: <strong>${camp.bloodBank}</strong></span>
        </div>

        <div style="margin-top: 0.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">
            <span>${camp.registeredCount || 0} Donors Pre-registered</span>
            <span>Target: ${camp.targetUnits || 150}</span>
          </div>
          <div style="height: 6px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: var(--primary-gradient); border-radius: var(--radius-full);"></div>
          </div>
        </div>
      </div>

      <div class="camp-card-footer">
        <button class="btn btn-secondary btn-sm btn-view-camp-details" data-id="${camp.id}">
          Details
        </button>
        <button class="btn btn-primary btn-sm btn-register-camp-trigger" data-id="${camp.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          Pre-Register (Pass)
        </button>
      </div>
    </div>
  `;
}

function initCampsInteractions() {
  // Tab toggles
  const tabCenters = document.getElementById('tab-centers-btn');
  const tabCamps = document.getElementById('tab-camps-btn');
  if (tabCenters) {
    tabCenters.addEventListener('click', () => {
      AppState.directoryTab = 'centers';
      Router.handleRoute();
    });
  }
  if (tabCamps) {
    tabCamps.addEventListener('click', () => {
      AppState.directoryTab = 'camps';
      Router.handleRoute();
    });
  }

  // Search Input
  const searchInput = document.getElementById('pune-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.campsSearchQuery = e.target.value.trim();
      Router.handleRoute();
    });
  }

  // Locality Filter Pills
  document.querySelectorAll('.filter-pill[data-loc]').forEach(pill => {
    pill.addEventListener('click', () => {
      AppState.selectedLocality = pill.getAttribute('data-loc');
      Router.handleRoute();
    });
  });

  const resetBtn = document.getElementById('btn-reset-pune-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      AppState.selectedLocality = 'All Pune';
      AppState.campsSearchQuery = '';
      Router.handleRoute();
    });
  }

  attachCardListeners();
}

function attachCardListeners() {
  // Center Info Details
  document.querySelectorAll('.btn-center-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const centerId = btn.getAttribute('data-id');
      const center = StorageService.getCenterById(centerId);
      if (center) openCenterDetailsModal(center);
    });
  });

  // Camp Details
  document.querySelectorAll('.btn-view-camp-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const campId = btn.getAttribute('data-id');
      const camp = StorageService.getCampById(campId);
      if (camp) openCampDetailsModal(camp);
    });
  });

  // Camp Register
  document.querySelectorAll('.btn-register-camp-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const campId = btn.getAttribute('data-id');
      const camp = StorageService.getCampById(campId);
      if (camp) openCampRegisterModal(camp);
    });
  });
}

function openCenterDetailsModal(center) {
  document.getElementById('camp-modal-city-tag').textContent = center.locality;
  document.getElementById('camp-details-title').textContent = center.name;

  const body = document.getElementById('camp-details-body');
  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <p style="font-size: 1rem; color: var(--text-main); line-height: 1.6; margin-bottom: 1rem;">
        ${center.type} • <strong>${center.accreditation}</strong>
      </p>

      <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">24x7 Helpline</span>
          <div style="font-weight: 800; color: var(--primary); font-size: 1.05rem;">
            <a href="tel:${center.phone.replace(/[^0-9]/g, '')}">${center.phone}</a>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${center.altPhone || ''}</div>
        </div>
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">Walk-in Donation Hours</span>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${center.walkInDonations}</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Address & Directions</h4>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 0.5rem;">
        <strong>${center.address}</strong><br>
        Landmark: ${center.landmark}
      </p>
      <a href="${center.googleMapsUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
        Open in Google Maps ↗
      </a>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.1rem; margin-bottom: 0.65rem;">Available Facilities & Components</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${center.facilities.map(f => `
          <span style="background: var(--status-adequate-bg); color: var(--status-adequate-text); font-weight: 600; font-size: 0.85rem; padding: 0.35rem 0.75rem; border-radius: var(--radius-full);">
            ✔ ${f}
          </span>
        `).join('')}
      </div>
    </div>
  `;

  const regTrigger = document.getElementById('camp-modal-register-trigger');
  regTrigger.textContent = 'Register Walk-in Donor Pass';
  regTrigger.onclick = () => {
    document.getElementById('camp-details-modal').classList.remove('active');
    openCampRegisterModal({
      id: center.id,
      name: center.name,
      date: 'Walk-in (Any Day)',
      venue: center.name + ' (' + center.locality + ')'
    });
  };

  document.getElementById('camp-details-modal').classList.add('active');
}

function openCampDetailsModal(camp) {
  document.getElementById('camp-modal-city-tag').textContent = camp.locality;
  document.getElementById('camp-details-title').textContent = camp.name;

  const body = document.getElementById('camp-details-body');
  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <p style="font-size: 1.05rem; color: var(--text-main); line-height: 1.6; margin-bottom: 1rem;">
        ${camp.description}
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md);">
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">Organizer</span>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${camp.organizer}</div>
        </div>
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">Blood Bank Partner</span>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${camp.bloodBank}</div>
        </div>
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">Date & Time</span>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${camp.date} (${camp.startTime} - ${camp.endTime})</div>
        </div>
        <div>
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-light); font-weight: 700;">Coordinator Contact</span>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${camp.contactName} (${camp.contactPhone})</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.1rem; margin-bottom: 0.65rem;">Venue</h4>
      <p style="font-size: 0.92rem; color: var(--text-muted);">
        <strong>${camp.venue}</strong><br>
        ${camp.address}
      </p>
    </div>

    <div style="margin-bottom: 1rem;">
      <h4 style="font-size: 1.1rem; margin-bottom: 0.65rem;">Instructions</h4>
      <ul style="padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">
        ${(camp.instructions || []).map(inst => `<li>${inst}</li>`).join('')}
      </ul>
    </div>
  `;

  const regTrigger = document.getElementById('camp-modal-register-trigger');
  regTrigger.textContent = 'Pre-Register for this Camp';
  regTrigger.onclick = () => {
    document.getElementById('camp-details-modal').classList.remove('active');
    openCampRegisterModal(camp);
  };

  document.getElementById('camp-details-modal').classList.add('active');
}

function openCampRegisterModal(camp) {
  AppState.activeCampForRegistration = camp;
  document.getElementById('reg-camp-id').value = camp.id;
  document.getElementById('reg-camp-name').value = camp.name;
  document.getElementById('camp-reg-title').textContent = `Donor Pass: ${camp.name}`;
  document.getElementById('camp-register-modal').classList.add('active');
}

function renderDonorPass(registration, camp) {
  const body = document.getElementById('donor-pass-body');
  body.innerHTML = `
    <div class="donor-pass-card">
      <div class="donor-pass-badge">Official Pune Donor Pass</div>
      <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Rakt Sangam Pune</h3>
      <p style="font-size: 0.85rem; color: var(--text-light);">पुणेकरांचा जीवनरक्षक उपक्रम</p>
      
      <div class="pass-id">${registration.id}</div>

      <table class="pass-details-table">
        <tr>
          <td>Donor Name:</td>
          <td><strong>${registration.name}</strong> (Age: ${registration.age})</td>
        </tr>
        <tr>
          <td>Selected Center/Camp:</td>
          <td><strong>${registration.campName}</strong></td>
        </tr>
        <tr>
          <td>Slot / Timing:</td>
          <td><strong>${registration.preferredSlot}</strong></td>
        </tr>
        <tr>
          <td>Blood Group:</td>
          <td><span style="background: var(--primary-light); color: var(--primary); font-weight: 800; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">${registration.bloodGroup}</span></td>
        </tr>
        <tr>
          <td>Registered Phone:</td>
          <td>${registration.phone}</td>
        </tr>
      </table>

      <div style="font-size: 0.82rem; color: var(--text-muted); background: white; border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-md); text-align: left;">
        <strong>Instructions for Donation:</strong> Show this digital pass on your phone at the reception desk. Kindly carry a Government Photo ID (Aadhaar / Voter ID).
      </div>
    </div>
  `;

  document.getElementById('donor-pass-modal').classList.add('active');
}

// ==========================================================================
// 3. DONATE BLOOD GUIDE PAGE (Pune Context)
// ==========================================================================
function renderDonatePage() {
  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="section-header text-left">
          <span class="section-tag">Pune Donor Guide</span>
          <h1 class="section-title">Everything You Need to Know About Donating Blood in Pune</h1>
          <p class="section-description">
            A comprehensive, medically verified guide for first-time and regular voluntary donors across Pune.
          </p>
        </div>

        <div class="disclaimer-card" style="margin-top: 0; margin-bottom: 3rem;">
          <div class="disclaimer-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="disclaimer-text">
            <strong>Medical Awareness Notice:</strong> Guidelines are governed by the Maharashtra State Blood Transfusion Council (SBTC) and Food and Drug Administration (FDA). Final donation clearance is granted by medical doctors on-site at Aadhar Blood Bank, Bharati Hospital, or camp venues.
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; align-items: flex-start;">
          
          <div style="display: flex; flex-direction: column; gap: 2.5rem;">
            
            <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 2rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary-dark);">1. What is Blood Donation?</h3>
              <p style="color: var(--text-muted); line-height: 1.7;">
                Blood donation is a safe, painless 15-minute voluntary procedure where ~350 ml or ~450 ml of blood is collected using a sealed single-use sterile kit. The fluid volume replenishes within 24-48 hours, while your bone marrow generates new red cells over the next few weeks.
              </p>
            </article>

            <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 2rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary-dark);">2. Why is it Urgent in Pune?</h3>
              <p style="color: var(--text-muted); line-height: 1.7;">
                Pune has over 650 daily blood unit requirements due to major tertiary referral hospitals, cancer chemotherapy wards, cardiac surgery suites, and accident trauma along the Mumbai-Pune Expressway and Pune-Satara highway.
              </p>
            </article>

            <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 2rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary-dark);">3. Who Can Generally Donate?</h3>
              <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 0.75rem;">
                Any healthy individual aged 18 to 65 years, weighing at least 45 kg, with hemoglobin ≥ 12.5 g/dL.
              </p>
              <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem;">
                <strong>Common Deferrals:</strong> 6-12 months deferral for tattoos/piercings; 2 weeks after fever/flu; 72 hours after antibiotics.
              </div>
            </article>

            <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 2rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary-dark);">4. Frequency of Donation</h3>
              <p style="color: var(--text-muted); line-height: 1.7;">
                Men can donate whole blood every <strong>90 days (3 months)</strong>, while women can donate every <strong>120 days (4 months)</strong>. Platelet apheresis (SDP) donors at Bharati Hospital can donate every 7-14 days.
              </p>
            </article>

            <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 2rem;">
              <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--primary-dark);">5. Pre & Post-Donation Diet in Pune</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.75rem;">
                <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
                  <strong style="color: #059669; font-size: 0.95rem;">Before Donating:</strong>
                  <ul style="font-size: 0.88rem; margin-top: 0.5rem; padding-left: 1.2rem; color: var(--text-muted);">
                    <li>Eat a healthy Maharashtrian breakfast (poha, upma, idli).</li>
                    <li>Drink 2 large glasses of water or kokum sherbet.</li>
                    <li>Rest 7-8 hours the previous night.</li>
                  </ul>
                </div>
                <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
                  <strong style="color: var(--primary); font-size: 0.95rem;">After Donating:</strong>
                  <ul style="font-size: 0.88rem; margin-top: 0.5rem; padding-left: 1.2rem; color: var(--text-muted);">
                    <li>Enjoy complimentary juice & energy chikki.</li>
                    <li>Avoid heavy workouts at the gym today.</li>
                    <li>No smoking for 2 hours.</li>
                  </ul>
                </div>
              </div>
            </article>

          </div>

          <!-- Sticky Checklist Sidebar -->
          <div style="position: sticky; top: 100px;">
            <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 2rem; box-shadow: var(--shadow-card);">
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Pune Donor Checklist</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                Check off before heading to Aadhar or Bharati Hospital:
              </p>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;" id="interactive-checklist">
                <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" style="accent-color: var(--primary); width: 18px; height: 18px;">
                  <span>Govt Photo ID (Aadhaar / Voter ID / Driving License)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" style="accent-color: var(--primary); width: 18px; height: 18px;">
                  <span>Had breakfast / meal 1-2 hours ago</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" style="accent-color: var(--primary); width: 18px; height: 18px;">
                  <span>Drank at least 500ml water</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" style="accent-color: var(--primary); width: 18px; height: 18px;">
                  <span>Slept 7+ hours last night</span>
                </label>
              </div>

              <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color);">
                <a href="#/camps" class="btn btn-primary" style="width: 100%; justify-content: center;">
                  Find Blood Centers in Pune
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

function initDonateInteractions() {
  const checkboxes = document.querySelectorAll('#interactive-checklist input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const allChecked = Array.from(checkboxes).every(c => c.checked);
      if (allChecked) {
        showToast('All set! You are fully prepared to donate in Pune today.', 'success');
      }
    });
  });
}

// ==========================================================================
// 4. LEARN & ARTICLES LIBRARY PAGE
// ==========================================================================
function renderLearnPage() {
  const articles = EDUCATIONAL_ARTICLES;

  const filtered = articles.filter(art => {
    if (AppState.learnSearchQuery) {
      const q = AppState.learnSearchQuery.toLowerCase();
      const match = art.title.toLowerCase().includes(q) ||
                    art.excerpt.toLowerCase().includes(q) ||
                    art.content.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="section-header text-left">
          <span class="section-tag">Pune Medical Insights</span>
          <h1 class="section-title">Blood Science & Awareness Library</h1>
          <p class="section-description">
            Discover why Dhankawadi & Katraj are critical, understand component fractionation, and learn about apheresis.
          </p>
        </div>

        <div class="learn-grid">
          ${filtered.map(art => `
            <div class="learn-card btn-read-article" data-id="${art.id}">
              <span class="learn-badge">${art.badge}</span>
              <h3 class="learn-title">${art.title}</h3>
              <p class="learn-excerpt">${art.excerpt}</p>
              <div class="learn-meta">
                <span>Category: <strong>${art.category}</strong></span>
                <span style="color: var(--primary); font-weight: 700;">${art.readingTime} &rarr;</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}

function initLearnInteractions() {
  document.querySelectorAll('.btn-read-article').forEach(card => {
    card.addEventListener('click', () => {
      const artId = card.getAttribute('data-id');
      const article = EDUCATIONAL_ARTICLES.find(a => a.id === artId);
      if (article) {
        document.getElementById('article-modal-category').textContent = `${article.category} • ${article.readingTime}`;
        document.getElementById('article-modal-title').textContent = article.title;
        document.getElementById('article-modal-body').innerHTML = article.content;
        document.getElementById('article-modal').classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 5. ABOUT US PAGE (Pune Focus)
// ==========================================================================
function renderAboutPage() {
  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="about-hero-grid">
          <div>
            <span class="section-tag">About Rakt Sangam Pune</span>
            <h1 class="hero-title" style="margin-bottom: 1.25rem;">
              Connecting Punekars to Life-Saving Blood Centers.
            </h1>
            <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
              <strong>Rakt Sangam Pune (रक्त संगम पुणे)</strong> is dedicated to ensuring that no patient at Sassoon, Bharati Hospital, Aadhar Blood Bank, or private medical facilities in Pune faces critical delays in finding safe blood.
            </p>
            <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.7;">
              From the busy student hubs of Katraj and Dhankawadi to the corporate IT corridors of Hinjawadi, Rakt Sangam empowers voluntary donors with instant transparency, live stock status, and digital camp passes.
            </p>
          </div>

          <div style="background: white; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 2.5rem; box-shadow: var(--shadow-card);">
            <div style="width: 50px; height: 50px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </div>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Mission for Pune</h3>
            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 1.5rem;">
              Transforming Pune from an emergency replacement-driven system to a 100% voluntary, proactive donor community where hospitals maintain robust, safe reserves 24x7.
            </p>
            <div style="padding: 1rem; background: var(--bg-subtle); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted);">
              पुणेकरांचा जीवनरक्षक उपक्रम • Connect. Donate. Save Lives in Pune.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ==========================================================================
// 6. CONTACT & PUNE HELPLINES PAGE
// ==========================================================================
function renderContactPage() {
  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="section-header text-left">
          <span class="section-tag">Pune Contact & Helplines</span>
          <h1 class="section-title">Emergency Numbers & Community Desk</h1>
          <p class="section-description">
            Need urgent blood in Pune or want to host a camp in your society/college?
          </p>
        </div>

        <div class="disclaimer-card" style="margin-top: 0; margin-bottom: 3rem;">
          <div class="disclaimer-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="disclaimer-text">
            <strong>Urgent Emergency Contact:</strong> For immediate hospital ICU requirements, call <strong>Aadhar Blood Bank (020-2437 2020)</strong> or <strong>Bharati Hospital Blood Bank (020-2437 3226)</strong> directly.
          </div>
        </div>

        <div class="contact-grid">
          
          <div class="contact-info-card">
            <h3 style="font-size: 1.45rem; margin-bottom: 1.5rem;">Verified Pune 24x7 Helplines</h3>

            <div class="contact-detail-item">
              <div class="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <strong style="color: var(--text-main);">Aadhar Blood Bank (Dhankawadi)</strong>
                <p style="font-size: 0.9rem; margin-top: 0.2rem;">
                  <a href="tel:02024372020" style="color:var(--primary); font-weight:700;">020-2437 2020</a> / +91 98224 15678
                </p>
                <p style="font-size: 0.8rem; color: var(--text-light);">Near Mohan Nagar, Dhankawadi, Pune - 411043</p>
              </div>
            </div>

            <div class="contact-detail-item">
              <div class="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <strong style="color: var(--text-main);">Bharati Hospital Blood Centre (Katraj)</strong>
                <p style="font-size: 0.9rem; margin-top: 0.2rem;">
                  <a href="tel:02024373226" style="color:var(--primary); font-weight:700;">020-2437 3226</a> / 020-2437 1116
                </p>
                <p style="font-size: 0.8rem; color: var(--text-light);">BVDU Campus, Pune-Satara Road, Katraj - 411046</p>
              </div>
            </div>

            <div class="contact-detail-item">
              <div class="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <strong style="color: var(--text-main);">PMC Health Control Room</strong>
                <p style="font-size: 0.9rem; margin-top: 0.2rem;">020-25501000 / National: 104</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-card">
            <h3 style="font-size: 1.45rem; margin-bottom: 0.5rem;">Send a Message</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              Organize a camp in your Pune college or society, or request volunteer assistance.
            </p>

            <form id="pune-contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Full Name *</label>
                  <input type="text" class="form-control" id="contact-name" name="name" required placeholder="e.g. Ramesh Shinde">
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address *</label>
                  <input type="email" class="form-control" id="contact-email" name="email" required placeholder="name@example.com">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number *</label>
                  <input type="tel" class="form-control" id="contact-phone" name="phone" required placeholder="098220 XXXXX">
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-area">Pune Locality *</label>
                  <select class="form-control" id="contact-area" name="area">
                    <option value="Dhankawadi & Katraj">Dhankawadi & Katraj</option>
                    <option value="Swargate & Sadashiv Peth">Swargate & Sadashiv Peth</option>
                    <option value="Kothrud & Karve Nagar">Kothrud & Karve Nagar</option>
                    <option value="Hadapsar & Camp">Hadapsar & Camp</option>
                    <option value="Hinjawadi & PCMC">Hinjawadi & PCMC</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-subject">Subject *</label>
                <input type="text" class="form-control" id="contact-subject" name="subject" required placeholder="e.g. Host a blood camp in Katraj society">
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-msg">Message *</label>
                <textarea class="form-control" id="contact-msg" name="message" rows="3" required placeholder="Details about your inquiry..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
                Submit Inquiry &rarr;
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  `;
}

function initContactInteractions() {
  const form = document.getElementById('pune-contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-msg').value.trim();

      StorageService.saveMessage({ name, email, phone, subject, message });
      form.reset();
      showToast('Thank you! Your Pune coordinator has received your message.', 'success');
    });
  }
}

// ==========================================================================
// 7. PUNE ORGANIZER DASHBOARD PORTAL
// ==========================================================================
function renderOrganizerPage() {
  const camps = StorageService.getCamps();
  const totalDonors = camps.reduce((sum, c) => sum + (c.registeredCount || 0), 0);

  return `
    <div class="section" style="padding-top: 3.5rem;">
      <div class="container">
        
        <div class="organizer-header-bar">
          <div>
            <span class="section-tag">Pune Camp Portal</span>
            <h1 class="section-title" style="margin-bottom: 0.25rem;">Pune Blood Drive Dashboard</h1>
            <p class="section-description">
              Coordinate and manage neighborhood blood camps in Dhankawadi, Katraj, and across Pune.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-primary" id="btn-create-pune-camp">
              + Register New Pune Camp
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-reset-pune-data">
              Reset Demo Records
            </button>
          </div>
        </div>

        <div class="organizer-stats">
          <div class="org-stat-card">
            <div class="org-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div style="font-size: 1.8rem; font-weight: 800; line-height: 1;">${camps.length}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">Scheduled Pune Drives</div>
            </div>
          </div>

          <div class="org-stat-card">
            <div class="org-stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div style="font-size: 1.8rem; font-weight: 800; line-height: 1;">${totalDonors}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">Registered Pune Donors</div>
            </div>
          </div>
        </div>

        <div class="camps-table-wrap">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Camp Name</th>
                <th>Locality & Date</th>
                <th>Partner Blood Bank</th>
                <th>Donors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${camps.map(camp => `
                <tr>
                  <td>
                    <strong style="color: var(--text-main);">${camp.name}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-light);">${camp.venue}</div>
                  </td>
                  <td>
                    <strong>${camp.locality}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-light);">${camp.date}</div>
                  </td>
                  <td>${camp.bloodBank}</td>
                  <td>
                    <span style="background: var(--primary-light); color: var(--primary-dark); font-weight: 800; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.82rem;">
                      ${camp.registeredCount || 0} Donors
                    </span>
                  </td>
                  <td>
                    <div class="action-btns-group">
                      <button class="btn btn-secondary btn-sm btn-org-view-donors" data-id="${camp.id}">
                        Roster
                      </button>
                      <button class="btn btn-secondary btn-sm btn-org-delete-camp" data-id="${camp.id}" style="color: #dc2626;">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `;
}

function initOrganizerInteractions() {
  const createBtn = document.getElementById('btn-create-pune-camp');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      document.getElementById('organizer-camp-form').reset();
      document.getElementById('org-camp-id').value = '';
      document.getElementById('organizer-camp-modal').classList.add('active');
    });
  }

  const resetBtn = document.getElementById('btn-reset-pune-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all Pune records to default state?')) {
        StorageService.resetAll();
        showToast('Reset to default Pune demo state.', 'info');
        Router.handleRoute();
      }
    });
  }

  document.querySelectorAll('.btn-org-delete-camp').forEach(btn => {
    btn.addEventListener('click', () => {
      const campId = btn.getAttribute('data-id');
      const camp = StorageService.getCampById(campId);
      if (!camp) return;
      if (confirm(`Delete camp "${camp.name}"?`)) {
        StorageService.deleteCamp(campId);
        showToast('Camp deleted.', 'info');
        Router.handleRoute();
      }
    });
  });

  document.querySelectorAll('.btn-org-view-donors').forEach(btn => {
    btn.addEventListener('click', () => {
      const campId = btn.getAttribute('data-id');
      const camp = StorageService.getCampById(campId);
      if (!camp) return;
      AppState.activeCampForDonors = camp;
      openDonorsRosterModal(camp);
    });
  });
}

function openDonorsRosterModal(camp) {
  const registrations = StorageService.getRegistrationsForCamp(camp.id);
  document.getElementById('org-donors-modal-title').textContent = `Donor Roster: ${camp.name}`;

  const body = document.getElementById('org-donors-modal-body');
  if (registrations.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <p style="font-size: 1rem; color: var(--text-muted);">No donors have registered for this Pune camp yet.</p>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-muted); display: flex; justify-content: space-between;">
        <span>Total Registered: <strong>${registrations.length} Donors</strong></span>
        <span>Target: <strong>${camp.targetUnits} Units</strong></span>
      </div>

      <div class="camps-table-wrap">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Pass ID</th>
              <th>Donor Name</th>
              <th>Age</th>
              <th>Group</th>
              <th>Slot</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            ${registrations.map(r => `
              <tr>
                <td><code>${r.id}</code></td>
                <td><strong>${r.name}</strong></td>
                <td>${r.age}</td>
                <td><span style="background:var(--primary-light); color:var(--primary); font-weight:800; padding:0.2rem 0.5rem; border-radius:var(--radius-sm);">${r.bloodGroup}</span></td>
                <td>${r.preferredSlot}</td>
                <td><a href="tel:${r.phone}">${r.phone}</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  document.getElementById('organizer-donors-modal').classList.add('active');
}

// Bootstrap
Router.init();
