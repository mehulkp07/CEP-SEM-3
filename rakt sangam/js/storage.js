/**
 * Rakt Sangam Pune (रक्त संगम पुणे) - Local Storage Engine
 * Manages persistent state for Pune Blood Centers, Camps, and Donor Registrations
 */

const STORAGE_KEYS = {
  CENTERS: "rakt_pune_centers_v3",
  CAMPS: "rakt_pune_camps_v3",
  REGISTRATIONS: "rakt_pune_registrations_v3",
  MESSAGES: "rakt_pune_messages_v3"
};

const StorageService = {
  init() {
    // Initialize or refresh Pune Permanent Blood Centers
    if (!localStorage.getItem(STORAGE_KEYS.CENTERS)) {
      localStorage.setItem(STORAGE_KEYS.CENTERS, JSON.stringify(PUNE_PERMANENT_CENTERS));
    } else {
      // Ensure Pimpri Serological is present
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.CENTERS) || "[]");
        if (!existing.some(c => c.id === 'center-pimpri-serological')) {
          localStorage.setItem(STORAGE_KEYS.CENTERS, JSON.stringify(PUNE_PERMANENT_CENTERS));
        }
      } catch(e) {}
    }

    // Initialize or refresh Pune Upcoming Camps
    if (!localStorage.getItem(STORAGE_KEYS.CAMPS)) {
      localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(PUNE_UPCOMING_CAMPS));
    } else {
      try {
        const existingCamps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPS) || "[]");
        if (!existingCamps.some(c => c.id === 'camp-pune-pcmc-serological-01')) {
          localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(PUNE_UPCOMING_CAMPS));
        }
      } catch(e) {}
    }

    // Initialize Registrations
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      const initialRegistrations = [
        {
          id: "PUNE-DK-4011",
          campId: "camp-pune-dhankawadi-01",
          campName: "Dhankawadi Citizens & Youth Mega Blood Donation Camp",
          name: "Amol Jagtap",
          age: 27,
          phone: "+91 98220 12345",
          email: "amol.jagtap@example.com",
          bloodGroup: "O+",
          preferredDate: "2026-09-26",
          preferredSlot: "Morning (09:00 AM - 12:00 PM)",
          registeredAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "PUNE-BV-4012",
          campId: "camp-pune-bvdu-01",
          campName: "Bharati Vidyapeeth Campus Annual Life Saver Blood Drive",
          name: "Neha Salunke",
          age: 22,
          phone: "+91 98901 67890",
          email: "neha.s@bvdu.edu",
          bloodGroup: "B+",
          preferredDate: "2026-09-27",
          preferredSlot: "Morning (09:00 AM - 12:00 PM)",
          registeredAt: new Date(Date.now() - 43200000).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(initialRegistrations));
    }

    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
  },

  // Centers Operations
  getCenters() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CENTERS);
      return data ? JSON.parse(data) : PUNE_PERMANENT_CENTERS;
    } catch (e) {
      console.error("Error reading Pune centers", e);
      return PUNE_PERMANENT_CENTERS;
    }
  },

  getCenterById(id) {
    const centers = this.getCenters();
    return centers.find(c => c.id === id) || null;
  },

  // Camps Operations
  getCamps() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAMPS);
      return data ? JSON.parse(data) : PUNE_UPCOMING_CAMPS;
    } catch (e) {
      console.error("Error reading Pune camps", e);
      return PUNE_UPCOMING_CAMPS;
    }
  },

  getCampById(campId) {
    const camps = this.getCamps();
    return camps.find(c => c.id === campId) || null;
  },

  saveCamp(campData) {
    const camps = this.getCamps();
    if (!campData.id) {
      campData.id = "camp-pune-" + Date.now();
      campData.registeredCount = 0;
      campData.status = "upcoming";
      camps.unshift(campData);
    } else {
      const index = camps.findIndex(c => c.id === campData.id);
      if (index !== -1) {
        camps[index] = { ...camps[index], ...campData };
      } else {
        camps.unshift(campData);
      }
    }
    localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(camps));
    return campData;
  },

  deleteCamp(campId) {
    let camps = this.getCamps();
    camps = camps.filter(c => c.id !== campId);
    localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(camps));
    return true;
  },

  // Registrations Operations
  getRegistrations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getRegistrationsForCamp(campId) {
    const registrations = this.getRegistrations();
    return registrations.filter(r => r.campId === campId);
  },

  registerDonor(registration) {
    const registrations = this.getRegistrations();
    const passCode = Math.floor(1000 + Math.random() * 9000);
    const passId = `PUNE-${new Date().getFullYear()}-${passCode}`;

    const newReg = {
      id: passId,
      ...registration,
      registeredAt: new Date().toISOString()
    };

    registrations.unshift(newReg);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

    // Increment camp count
    const camps = this.getCamps();
    const camp = camps.find(c => c.id === registration.campId);
    if (camp) {
      camp.registeredCount = (camp.registeredCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(camps));
    }

    return newReg;
  },

  saveMessage(msg) {
    try {
      const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]");
      const newMsg = {
        id: "pune-msg-" + Date.now(),
        ...msg,
        receivedAt: new Date().toISOString()
      };
      messages.unshift(newMsg);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      return newMsg;
    } catch (e) {
      return null;
    }
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.CENTERS, JSON.stringify(PUNE_PERMANENT_CENTERS));
    localStorage.setItem(STORAGE_KEYS.CAMPS, JSON.stringify(PUNE_UPCOMING_CAMPS));
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    this.init();
  }
};

StorageService.init();
