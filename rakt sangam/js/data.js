/**
 * Rakt Sangam Pune (रक्त संगम पुणे) - Mock Data & Constants
 * Focused exclusively on Pune City & PCMC
 * Featuring Aadhar Blood Bank (Dhankawadi), Bharati Vidyapeeth (Katraj), and prominent Pune blood centers.
 */

// 1. Permanent 24x7 Blood Centers & Hospital Blood Banks in Pune
const PUNE_PERMANENT_CENTERS = [
  {
    id: "center-aadhar-dhankawadi",
    name: "Aadhar Blood Bank & Component Centre",
    locality: "Dhankawadi & Katraj",
    address: "1st & 2nd Floor, Dhankawadi Corner, Near Mohan Nagar, Pune-Satara Road, Dhankawadi, Pune - 411043",
    landmark: "Opposite Shankar Maharaj Math / Near Katraj-Dhankawadi Flyover",
    phone: "020-2437 2020",
    altPhone: "+91 98224 15678",
    email: "aadharbloodbank.pune@gmail.com",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Mon - Sun: 08:30 AM to 08:00 PM (Emergency 24x7)",
    type: "24x7 Licensed Blood Component Centre",
    accreditation: "FDA Maharashtra Approved & ISO Certified",
    facilities: [
      "Whole Blood & Component Separation",
      "Packed Red Blood Cells (PRBC)",
      "Single Donor Platelets (SDP Apheresis)",
      "Random Donor Platelets (RDP)",
      "Fresh Frozen Plasma (FFP)",
      "Air-Conditioned Donor Lounge",
      "Emergency Blood Dispatch Van"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Critical / Urgent",
      "A+": "Adequate",
      "A-": "Low Stock",
      "B+": "Adequate",
      "B-": "Low Stock",
      "AB+": "Adequate",
      "AB-": "Critical / Urgent"
    },
    googleMapsUrl: "https://maps.google.com/?q=Aadhar+Blood+Bank+Dhankawadi+Pune",
    isSpotlight: true,
    donationsTodayCount: 19
  },
  {
    id: "center-bharati-vidyapeeth",
    name: "Bharati Vidyapeeth Medical College & Hospital Blood Centre",
    locality: "Dhankawadi & Katraj",
    address: "Ground Floor, Bharati Hospital & Research Centre, BVDU Campus, Pune-Satara Road, Katraj-Dhankawadi, Pune - 411046",
    landmark: "Inside Bharati Vidyapeeth Deemed University Educational Complex, Katraj",
    phone: "020-2437 3226",
    altPhone: "020-2437 1116",
    email: "bloodbank.bvumc@bharatividyapeeth.edu",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Mon - Sun: 08:00 AM to 08:30 PM (24x7 Emergency Services)",
    type: "NABH Accredited Tertiary Teaching Hospital Blood Centre",
    accreditation: "NABH Accredited & National Board of Examinations Recognised",
    facilities: [
      "Advanced Apheresis & SDP Unit",
      "Cryoprecipitate & Platelet Concentrates",
      "Free Transfusion for Thalassemia Patients",
      "State-of-the-art Nucleic Acid Testing (NAT)",
      "Mobile Air-Conditioned Blood Collection Van",
      "Dedicated Medical Officers & Phlebotomists",
      "Donor Honor Roll & Digital Certificates"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Moderate",
      "A+": "Adequate",
      "A-": "Critical / Urgent",
      "B+": "Adequate",
      "B-": "Adequate",
      "AB+": "Adequate",
      "AB-": "Low Stock"
    },
    googleMapsUrl: "https://maps.google.com/?q=Bharati+Vidyapeeth+Hospital+Blood+Bank+Katraj+Pune",
    isSpotlight: true,
    donationsTodayCount: 34
  },
  {
    id: "center-sassoon-pune",
    name: "Sassoon General Hospital & B.J. Medical College Blood Bank",
    locality: "Swargate & Pune Station",
    address: "Near Pune Railway Station, Sassoon Road, Pune - 411001",
    landmark: "Opposite Pune Central Railway Station",
    phone: "020-2612 8000",
    altPhone: "020-2612 8005",
    email: "sassoonbloodbank@punemc.org",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "24x7 Walk-in Voluntary Donations",
    type: "Government Apex Regional Blood Centre",
    accreditation: "State Blood Transfusion Council (SBTC) Apex Center",
    facilities: [
      "Highest Capacity Storage in Pune District",
      "Free Blood for Accident & Indigent Patients",
      "Trauma & Emergency Resuscitation Bank",
      "Component Separation & Testing"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Critical / Urgent",
      "A+": "Moderate",
      "A-": "Critical / Urgent",
      "B+": "Adequate",
      "B-": "Low Stock",
      "AB+": "Adequate",
      "AB-": "Low Stock"
    },
    googleMapsUrl: "https://maps.google.com/?q=Sassoon+General+Hospital+Blood+Bank+Pune",
    isSpotlight: false,
    donationsTodayCount: 52
  },
  {
    id: "center-poona-serological",
    name: "Poona Serological Institute Blood Bank",
    locality: "Swargate & Sadashiv Peth",
    address: "1198, Shukrawar/Sadashiv Peth, Near Perugate Police Chowky, Pune - 411030",
    landmark: "Near SP College & Tilak Road",
    phone: "020-2447 6296",
    altPhone: "020-2447 7178",
    email: "poonaserological@gmail.com",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Mon - Sat: 09:00 AM to 07:00 PM",
    type: "Pioneer Voluntary Trust Blood Bank",
    accreditation: "FDA Maharashtra Approved & ISO 9001",
    facilities: [
      "Component Processing Unit",
      "Rare Blood Registry Coordination",
      "Hemoglobin & Pre-donation Check",
      "Emergency Blood Distribution"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Low Stock",
      "A+": "Adequate",
      "A-": "Moderate",
      "B+": "Adequate",
      "B-": "Adequate",
      "AB+": "Adequate",
      "AB-": "Critical / Urgent"
    },
    googleMapsUrl: "https://maps.google.com/?q=Poona+Serological+Institute+Blood+Bank+Pune",
    isSpotlight: false,
    donationsTodayCount: 16
  },
  {
    id: "center-deenanath-kothrud",
    name: "Deenanath Mangeshkar Hospital Blood Centre",
    locality: "Kothrud & Karve Nagar",
    address: "Erandwane, Near Mhatre Bridge, Kothrud, Pune - 411004",
    landmark: "Mhatre Bridge, Karve Road",
    phone: "020-4015 1000",
    altPhone: "020-4015 1111",
    email: "bloodcentre@dmhospital.org",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Daily: 08:30 AM to 08:00 PM",
    type: "NABH Accredited Super-Speciality Hospital Centre",
    accreditation: "NABH Accredited & NABL Certified Lab",
    facilities: [
      "Dedicated Oncology Platelet Apheresis",
      "Transfusion Medicine Consultation",
      "Pediatric Cardiac Surgery Support",
      "Leukoreduced Blood Components"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Moderate",
      "A+": "Adequate",
      "A-": "Low Stock",
      "B+": "Adequate",
      "B-": "Adequate",
      "AB+": "Adequate",
      "AB-": "Moderate"
    },
    googleMapsUrl: "https://maps.google.com/?q=Deenanath+Mangeshkar+Hospital+Blood+Bank+Pune",
    isSpotlight: false,
    donationsTodayCount: 28
  },
  {
    id: "center-redcross-pune",
    name: "Indian Red Cross Society Blood Bank (Pune Chapter)",
    locality: "Hadapsar & Camp",
    address: "593/2, Rasta Peth, Near Apollo Cinema & KEM Hospital, Pune - 411011",
    landmark: "Near KEM Hospital & Nana Peth",
    phone: "020-2612 4112",
    altPhone: "020-2612 4113",
    email: "redcross.puneblood@gmail.com",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Mon - Sun: 08:30 AM to 07:30 PM",
    type: "Humanitarian Non-Profit Blood Centre",
    accreditation: "Indian Red Cross Society & SBTC Recognised",
    facilities: [
      "Subsidized Blood for Rural Patients",
      "Active College Outreach Vans",
      "Free Blood Group Identification",
      "Volunteer Donor Network"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Critical / Urgent",
      "A+": "Moderate",
      "A-": "Low Stock",
      "B+": "Adequate",
      "B-": "Adequate",
      "AB+": "Adequate",
      "AB-": "Critical / Urgent"
    },
    googleMapsUrl: "https://maps.google.com/?q=Indian+Red+Cross+Society+Blood+Bank+Pune",
    isSpotlight: false,
    donationsTodayCount: 23
  },
  {
    id: "center-pimpri-serological",
    name: "Pimpri Serological Institute Blood Centre",
    locality: "Hinjawadi & PCMC",
    address: "Near Finolex Chowk, Morwadi Road, Old Mumbai-Pune Highway, Pimpri, PCMC, Pune - 411018",
    landmark: "Near Pimpri Railway Station & Morwadi Court, PCMC",
    phone: "020-2742 5566",
    altPhone: "+91 98220 78910",
    email: "pimpriserological.blood@gmail.com",
    timings: "Open 24 Hours / 7 Days a Week",
    walkInDonations: "Mon - Sun: 08:30 AM to 08:00 PM (Emergency 24x7)",
    type: "24x7 Licensed Blood Component Centre in PCMC",
    accreditation: "FDA Maharashtra Approved & SBTC Recognised",
    facilities: [
      "Whole Blood & Component Separation Unit",
      "Packed Red Blood Cells (PRBC)",
      "Single Donor Platelets (SDP Apheresis) & RDP",
      "Fresh Frozen Plasma (FFP)",
      "Dedicated Industrial Belt & Highway Emergency Supply",
      "Air-Conditioned Donor Bay",
      "Emergency PCMC Blood Delivery Vehicle"
    ],
    currentStockStatus: {
      "O+": "Adequate",
      "O-": "Low Stock",
      "A+": "Adequate",
      "A-": "Moderate",
      "B+": "Adequate",
      "B-": "Low Stock",
      "AB+": "Adequate",
      "AB-": "Critical / Urgent"
    },
    googleMapsUrl: "https://maps.google.com/?q=Pimpri+Serological+Institute+Blood+Centre+PCMC+Pune",
    isSpotlight: true,
    donationsTodayCount: 21
  }
];

// 2. Upcoming Community Blood Donation Camps in Pune Localities
const PUNE_UPCOMING_CAMPS = [
  {
    id: "camp-pune-dhankawadi-01",
    name: "Dhankawadi Citizens & Youth Mega Blood Donation Camp",
    organizer: "Dhankawadi Residents Welfare Association & Youth Club",
    bloodBank: "Aadhar Blood Bank, Dhankawadi, Pune",
    locality: "Dhankawadi & Katraj",
    date: "2026-09-26",
    startTime: "09:00 AM",
    endTime: "04:30 PM",
    venue: "Dhankawadi Sahakari Bank Community Hall, Near Mohan Nagar",
    address: "Pune-Satara Road, Dhankawadi, Pune - 411043",
    contactName: "Sanjay Shinde (Coordinator)",
    contactPhone: "+91 98224 15678",
    contactEmail: "dhankawadi.bloodcamp@gmail.com",
    description: "Annual community camp organized in collaboration with Aadhar Blood Bank to build emergency reserves for patients in Dhankawadi, Katraj, and Southern Pune medical centers.",
    targetUnits: 180,
    registeredCount: 68,
    facilities: [
      "Organized by Aadhar Blood Bank Medical Team",
      "Doctors & Phlebotomists on Site",
      "Air-Conditioned Mobile Van Support",
      "Instant Donor Certificate & Blood Group Card",
      "Fresh Fruit Juice, Chikki & High-Protein Snacks"
    ],
    instructions: [
      "Bring Aadhaar Card, Driving License, or College/Govt ID",
      "Have a healthy breakfast before arriving; avoid donating on an empty stomach",
      "Hydrate well with 500ml water",
      "Rest 10 minutes in the recovery lounge after donation"
    ],
    status: "upcoming"
  },
  {
    id: "camp-pune-bvdu-01",
    name: "Bharati Vidyapeeth Campus Annual Life Saver Blood Drive",
    organizer: "NSS Wing, Bharati Vidyapeeth Medical College & Hospital",
    bloodBank: "Bharati Vidyapeeth Medical College Blood Centre (Katraj)",
    locality: "Dhankawadi & Katraj",
    date: "2026-09-27",
    startTime: "08:30 AM",
    endTime: "05:00 PM",
    venue: "Main Medical College Auditorium, Ground Floor, BVDU Campus",
    address: "Pune-Satara Road, Katraj-Dhankawadi, Pune - 411046",
    contactName: "Dr. Pratibha Patil (Blood Centre In-charge)",
    contactPhone: "020-2437 3226",
    contactEmail: "nss.bvdu.blood@bharatividyapeeth.edu",
    description: "Dedicated to supporting pediatric cancer chemotherapy patients, thalassemia children, and emergency trauma victims admitted to Bharati Hospital.",
    targetUnits: 250,
    registeredCount: 114,
    facilities: [
      "NABH Accredited Hospital Phlebotomy Team",
      "Free Full Hemoglobin & Vital Diagnostic Screen",
      "Exclusive Commemorative Badge & Digital Donor Passport",
      "Spacious AC Recovery Pavilion with Refreshments"
    ],
    instructions: [
      "Open to university students, faculty, and local residents of Katraj and Dhankawadi",
      "Minimum 18 years of age and 45 kg body weight",
      "Wear loose clothing with easily rollable sleeves"
    ],
    status: "upcoming"
  },
  {
    id: "camp-pune-kothrud-01",
    name: "Kothrud Rotary Community Blood Donation Drive",
    organizer: "Rotary Club of Pune Kothrud & Youth Forum",
    bloodBank: "Deenanath Mangeshkar Hospital Blood Centre",
    locality: "Kothrud & Karve Nagar",
    date: "2026-09-29",
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    venue: "Yashwantrao Chavan Natyagruha Complex, Kothrud",
    address: "Karve Road, Kothrud, Pune - 411038",
    contactName: "Adv. Rahul Kulkarni",
    contactPhone: "+91 98230 44556",
    contactEmail: "rotary.kothrud@org.in",
    description: "Supporting heart surgeries and critical cancer care at Deenanath Mangeshkar and Sahyadri Hospitals.",
    targetUnits: 200,
    registeredCount: 82,
    facilities: [
      "Senior Doctors on Site",
      "Quick Donor Queuing Desk",
      "Nutritious Snacks & Juice",
      "Digital Donor Pass Verification"
    ],
    instructions: [
      "Carry any Government Photo ID",
      "Avoid smoking 2 hours before and after donation"
    ],
    status: "upcoming"
  },
  {
    id: "camp-pune-swargate-01",
    name: "Sadashiv Peth & Swargate Ganeshotsav Lifeline Camp",
    organizer: "Samast Sadashiv Peth Citizen Forum",
    bloodBank: "Poona Serological Institute Blood Bank",
    locality: "Swargate & Sadashiv Peth",
    date: "2026-10-02",
    startTime: "08:30 AM",
    endTime: "03:30 PM",
    venue: "SP College Ground Pavilion, Tilak Road",
    address: "Tilak Road, Sadashiv Peth, Pune - 411030",
    contactName: "Mahesh Joshi",
    contactPhone: "+91 94220 11223",
    contactEmail: "sadashiv.blood@gmail.com",
    description: "Honoring Gandhi Jayanti through voluntary community blood donation to assist government and municipal hospital patients.",
    targetUnits: 175,
    registeredCount: 56,
    facilities: [
      "On-spot Free Blood Group Testing",
      "Healthy Post-Donation Energy Drink & Chikki",
      "Special Donor Certificate"
    ],
    instructions: [
      "Ensure at least 90 days gap since your last whole blood donation",
      "Drink ample water before arriving"
    ],
    status: "upcoming"
  },
  {
    id: "camp-pune-hinjawadi-01",
    name: "Hinjawadi IT Park Corporate Blood Drive",
    organizer: "Pune IT Techies Social Responsibility Forum",
    bloodBank: "Sassoon General Hospital & YCM Hospital Blood Bank",
    locality: "Hinjawadi & PCMC",
    date: "2026-10-05",
    startTime: "10:00 AM",
    endTime: "05:30 PM",
    venue: "Quadron Business Park Central Cafeteria, Phase 2",
    address: "Hinjawadi Phase 2, Pune - 411057",
    contactName: "Rohan Deshpande",
    contactPhone: "+91 99700 98765",
    contactEmail: "hinjawadi.csr@itvolunteers.org",
    description: "Tech professionals in Hinjawadi uniting to replenish critical emergency reserves for municipal trauma hospitals.",
    targetUnits: 300,
    registeredCount: 135,
    facilities: [
      "Twin Phlebotomy Mobile Buses",
      "Express Registration via Rakt Sangam QR",
      "Certificate of Humanitarian Contribution"
    ],
    instructions: [
      "Carry Company ID or Aadhaar Card",
      "Do not donate on an empty stomach"
    ],
    status: "upcoming"
  },
  {
    id: "camp-pune-pcmc-serological-01",
    name: "PCMC & Pimpri Industrial Lifeline Blood Donation Drive",
    organizer: "Pimpri Chinchwad Citizens & Industrial Welfare Forum",
    bloodBank: "Pimpri Serological Institute Blood Centre",
    locality: "Hinjawadi & PCMC",
    date: "2026-10-06",
    startTime: "09:00 AM",
    endTime: "04:30 PM",
    venue: "PCMC Community Hall, Near Morwadi Chowk",
    address: "Near Pimpri Chinchwad Court, Morwadi, Pimpri, Pune - 411018",
    contactName: "Mahesh Patil (Coordinator)",
    contactPhone: "+91 98220 78910",
    contactEmail: "pcmc.blooddrive@pimpriserological.org",
    description: "Annual industrial & community blood drive with Pimpri Serological Institute Blood Centre, serving accident trauma cases along the Old Mumbai-Pune Highway and local PCMC hospital beds.",
    targetUnits: 200,
    registeredCount: 74,
    facilities: [
      "Managed by Pimpri Serological Institute Phlebotomy Officers",
      "Free Full Hemoglobin & Vital Diagnostic Screen",
      "Instant Digital Pune Donor Pass & Certificate",
      "Juices, Chikki & High-Energy Snacks"
    ],
    instructions: [
      "Bring Aadhaar Card or Company/Govt Photo ID",
      "Eat a wholesome breakfast 1-2 hours prior",
      "Hydrate well with 500ml water"
    ],
    status: "upcoming"
  }
];

// 3. Live Pune Blood Stock Matrix (Simulated Real-time Grid)
const PUNE_LIVE_STOCK = {
  lastUpdated: "Today at 09:30 AM (Updated every 30 mins)",
  cityTotalRequiredDaily: 650,
  cityTotalCollectedToday: 412,
  stockByGroup: {
    "O+": { status: "Adequate", units: 142, demand: "High", badgeClass: "status-adequate", note: "Common emergency type; steady supply at Bharati & Aadhar" },
    "O-": { status: "Critical / Urgent", units: 18, demand: "Urgent", badgeClass: "status-critical", note: "Urgent demand at Sassoon Trauma & Bharati Hospital" },
    "A+": { status: "Adequate", units: 98, demand: "Moderate", badgeClass: "status-adequate", note: "Good stock available across Dhankawadi centers" },
    "A-": { status: "Low Stock", units: 12, demand: "High", badgeClass: "status-warning", note: "Donors requested for scheduled surgeries in Kothrud & Katraj" },
    "B+": { status: "Adequate", units: 165, demand: "High", badgeClass: "status-adequate", note: "High prevalence group; stable at Aadhar Blood Bank" },
    "B-": { status: "Low Stock", units: 15, demand: "High", badgeClass: "status-warning", note: "Urgent call for voluntary negative donors in Pune south" },
    "AB+": { status: "Adequate", units: 48, demand: "Moderate", badgeClass: "status-adequate", note: "Universal plasma donor; healthy reserves" },
    "AB-": { status: "Critical / Urgent", units: 7, demand: "Urgent", badgeClass: "status-critical", note: "Rarest regular group; pre-registered donors mobilized" }
  }
};

// 4. Pune Localities for Fast Filtering
const PUNE_LOCALITIES = [
  "All Pune",
  "Dhankawadi & Katraj",
  "Swargate & Sadashiv Peth",
  "Kothrud & Karve Nagar",
  "Hadapsar & Camp",
  "Hinjawadi & PCMC"
];

// 5. Blood Compatibility Matrix
const BLOOD_COMPATIBILITY = {
  "O-": {
    giveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    receiveFrom: ["O-"],
    label: "Universal Red Cell Donor",
    badge: "Universal Donor",
    distributionIndia: "Approx. 2% in Pune & Maharashtra",
    fact: "In critical trauma admissions at Sassoon or Bharati Hospital, O-negative blood is transfused immediately when there is no time for cross-matching."
  },
  "O+": {
    giveTo: ["O+", "A+", "B+", "AB+"],
    receiveFrom: ["O-", "O+"],
    label: "Highest Demand in Pune",
    badge: "Most Common Donor",
    distributionIndia: "Approx. 36% in Pune",
    fact: "O-positive is the most frequently transfused group across accident care units on Pune-Satara Highway and Katraj bypass."
  },
  "A-": {
    giveTo: ["A-", "A+", "AB-", "AB+"],
    receiveFrom: ["A-", "O-"],
    label: "Rare Negative Group",
    badge: "Rare Group",
    distributionIndia: "Approx. 1.8% in Pune",
    fact: "A-negative donors are crucial for cardiac bypass and oncology patients at Deenanath Mangeshkar and Sahyadri Hospitals."
  },
  "A+": {
    giveTo: ["A+", "AB+"],
    receiveFrom: ["A+", "A-", "O+", "O-"],
    label: "Essential Surgical Group",
    badge: "High Demand",
    distributionIndia: "Approx. 21% in Pune",
    fact: "Widely used for planned orthopedic surgeries and maternity emergency care across Dhankawadi maternity clinics."
  },
  "B-": {
    giveTo: ["B-", "B+", "AB-", "AB+"],
    receiveFrom: ["B-", "O-"],
    label: "Critical Negative Group",
    badge: "Rare Group",
    distributionIndia: "Approx. 2.7% in Pune",
    fact: "B-negative units are constantly monitored by Aadhar Blood Bank to support pediatric thalassemia transfusions."
  },
  "B+": {
    giveTo: ["B+", "AB+"],
    receiveFrom: ["B+", "B-", "O+", "O-"],
    label: "Most Prevalent in Maharashtra",
    badge: "High Demand",
    distributionIndia: "Approx. 33% in Pune",
    fact: "Over one-third of Punekars belong to B-positive, creating high daily usage for surgeries and routine procedures."
  },
  "AB-": {
    giveTo: ["AB-", "AB+"],
    receiveFrom: ["AB-", "A-", "B-", "O-"],
    label: "Rarest Regular Blood Group",
    badge: "Rarest Type",
    distributionIndia: "Less than 1% in Pune",
    fact: "Fewer than 1 in 120 Punekars have AB-negative blood. Aadhar Blood Bank maintains a dedicated voluntary call list for emergencies."
  },
  "AB+": {
    giveTo: ["AB+"],
    receiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    label: "Universal Red Cell Recipient",
    badge: "Universal Recipient",
    distributionIndia: "Approx. 7% in Pune",
    fact: "AB-positive individuals can safely receive red blood cells from any blood group, and are universal donors for life-saving plasma."
  }
};

// 6. Myths and Scientific Facts
const MYTHS_AND_FACTS = [
  {
    myth: "Blood donation makes you permanently weak and affects your daily work in Pune.",
    fact: "Your body replenishes the donated fluid volume (plasma) within 24 to 48 hours, and red blood cells fully regenerate in a few short weeks. Most healthy donors resume regular office or college activities the very next day."
  },
  {
    myth: "You can catch infections or viruses during blood donation.",
    fact: "At licensed centers like Aadhar Blood Bank and Bharati Vidyapeeth, sterile, factory-sealed, single-use disposable needles and bags are opened right in front of you and incinerated immediately after."
  },
  {
    myth: "Vegetarians in Pune have low hemoglobin and cannot donate.",
    fact: "A balanced Maharashtrian vegetarian diet rich in sprouts (matki/moong), lentils, jaggery, peanuts, and green leafy vegetables easily maintains healthy hemoglobin (≥12.5 g/dL) for regular donation."
  },
  {
    myth: "Donating blood is extremely painful.",
    fact: "The only sensation is a mild 1-second prick when the needle is placed. The subsequent 8 to 10 minutes of collection are completely pain-free and comfortable."
  },
  {
    myth: "Only the O-negative blood group is useful for hospitals.",
    fact: "Every single blood group is needed daily across Pune hospitals. Type-specific blood ensures the best clinical outcomes for cancer, surgery, and trauma patients."
  },
  {
    myth: "If you have a tattoo or piercing, you can never donate blood in Pune.",
    fact: "A tattoo or ear piercing does not disqualify you forever. In India, you only need to wait for a 6 to 12 month deferral period after getting inked before donating safely."
  }
];

// 7. Inspiring Stories from Pune Donors
const SAMPLE_STORIES = [
  {
    name: "Dr. Nilesh Kulkarni",
    city: "Dhankawadi, Pune",
    bloodGroup: "O-",
    donationsCount: 26,
    quote: "Living right near Mohan Nagar in Dhankawadi, I walk into Aadhar Blood Bank whenever they have an urgent call for O-negative blood. Knowing that my 15 minutes can save someone on the Katraj-Satara highway accident corridor gives immense peace.",
    isSample: true
  },
  {
    name: "Pooja Jadhav",
    city: "Katraj, Pune (BVDU Student)",
    bloodGroup: "B+",
    donationsCount: 8,
    quote: "I donated for the first time during the Bharati Vidyapeeth campus drive. The doctors were very comforting, gave me juice and a donor badge. Now, donating blood every four months is a habit I share with my college friends.",
    isSample: true
  },
  {
    name: "Rohan & Sneha Joshi",
    city: "Kothrud, Pune",
    bloodGroup: "A+ & AB+",
    donationsCount: "Couple Donors (18 total)",
    quote: "We believe giving blood is the purest form of service to our city. We mark every Ganeshotsav and wedding anniversary with a voluntary donation at Poona Serological or Deenanath Mangeshkar.",
    isSample: true
  }
];

// 8. Educational Articles for Pune Citizens
const EDUCATIONAL_ARTICLES = [
  {
    id: "art-dhankawadi-katraj-corridor",
    title: "Why Dhankawadi & Katraj are Crucial for Pune's Blood Lifeline",
    category: "Pune Context",
    readingTime: "3 min read",
    badge: "Local Spotlight",
    excerpt: "Positioned along the busy Pune-Satara Highway, Dhankawadi and Katraj house premier medical centers like Aadhar Blood Bank and Bharati Hospital serving critical trauma care.",
    content: `
      <h3>The Strategic Importance of South Pune</h3>
      <p>The Pune-Satara corridor connecting Katraj, Dhankawadi, and Swargate sees thousands of commuters, interstate travel, and rapid residential growth. Because of its proximity to national highways, accident trauma cases frequently rely on nearby medical hubs.</p>
      <h3>Premier Blood Centers in the Area</h3>
      <ul>
        <li><strong>Aadhar Blood Bank (Dhankawadi Corner):</strong> A specialized 24x7 component center ensuring round-the-clock availability of PRBCs, platelets, and emergency units.</li>
        <li><strong>Bharati Vidyapeeth Medical College Blood Centre (Katraj):</strong> An NABH-accredited tertiary teaching facility offering advanced apheresis (SDP), NAT testing, and free transfusions for thalassemia patients.</li>
      </ul>
      <p>By registering for voluntary donation in Dhankawadi and Katraj, local citizens act as first-line guardians for emergencies across southern Pune.</p>
    `
  },
  {
    id: "art-blood-components",
    title: "Component Separation: How One Donation Saves 3 Lives in Pune",
    category: "Science",
    readingTime: "4 min read",
    badge: "Medical Science",
    excerpt: "Learn how blood centers in Pune separate whole blood into packed red cells, platelets, and plasma to maximize clinical efficiency.",
    content: `
      <h3>Component Therapy in Modern Transfusion</h3>
      <p>Rather than transfusing whole blood, modern blood banks utilize high-speed centrifuges to separate blood into individual elements:</p>
      <ul>
        <li><strong>Packed Red Blood Cells (PRBC):</strong> For severe anemia, surgical blood loss, and trauma patients. Preserved at 2°C to 6°C for up to 35-42 days.</li>
        <li><strong>Platelets (Thrombocytes):</strong> Critical for dengue cases with thrombocytopenia and cancer chemotherapy patients. Kept at 20°C to 24°C under constant agitation for 5 days.</li>
        <li><strong>Fresh Frozen Plasma (FFP):</strong> Packed with essential clotting factors for burn victims, acute bleeding, and liver disease. Frozen at -30°C for up to 1 year.</li>
      </ul>
      <p>A single whole blood donation at Aadhar Blood Bank or Bharati Vidyapeeth can directly benefit three different patients across Pune.</p>
    `
  },
  {
    id: "art-apheresis-sdp",
    title: "Platelet Apheresis (SDP) in Pune Hospitals",
    category: "Specialized",
    readingTime: "4 min read",
    badge: "Critical Need",
    excerpt: "How automated cell separators collect Single Donor Platelets (SDP) for leukemia and dengue patients across Pune.",
    content: `
      <h3>What is Single Donor Platelet (SDP) Donation?</h3>
      <p>Apheresis is an automated procedure where blood is drawn through a sterile single-use kit into a cell separator. The machine separates only platelets and a small quantity of plasma, returning red cells and white cells back to the donor.</p>
      <h3>Why SDP is Essential</h3>
      <p>One SDP unit provides the equivalent platelet dose of 6 to 8 random donor platelet units, significantly reducing donor exposure for vulnerable cancer patients.</p>
      <p>Both Bharati Vidyapeeth Hospital and specialized centers in Pune offer comfortable apheresis suites with donor monitoring.</p>
    `
  },
  {
    id: "art-first-time-guide",
    title: "First-Time Donor's Complete Guide in Pune",
    category: "Guide",
    readingTime: "3 min read",
    badge: "First-Timers",
    excerpt: "Everything you need to know before stepping into a Pune blood center: prep, meals, registration, and post-donation care.",
    content: `
      <h3>Preparing for Donation Day</h3>
      <ul>
        <li><strong>Hydrate:</strong> Drink 2-3 glasses of water or kokum sherbet before arriving.</li>
        <li><strong>Eat:</strong> Have a light meal (such as poha, upma, or idli) 1 to 2 hours prior; never donate on an empty stomach.</li>
        <li><strong>Sleep:</strong> Ensure a restful 7 to 8 hours of sleep the night before.</li>
        <li><strong>Carry ID:</strong> Bring Aadhaar Card, Driving License, or College ID.</li>
      </ul>
      <h3>What to Expect on Arrival</h3>
      <p>The medical officer will verify your vitals (weight ≥ 45kg, BP, and hemoglobin ≥ 12.5 g/dL). The needle prick takes 1 second, followed by 8-10 minutes of relaxation in an AC chair. You'll be served fruit juice, energy chikki, and receive your donor certificate!</p>
    `
  }
];

const PUNE_STATS = {
  dailyNeeded: "650+ Units",
  activeCenters: "38+ Centers",
  monthlyDonors: "1,200+",
  livesImpacted: "14,000+"
};
