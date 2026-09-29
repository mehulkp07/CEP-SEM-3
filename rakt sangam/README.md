# Rakt Sangam (रक्त संगम)
> **"Connect. Donate. Save Lives."** — *रक्तदान महादान*

A modern, responsive, community-driven web platform designed for the Indian healthcare ecosystem, focused on blood donation awareness, voluntary blood donation camp discovery, and connecting potential donors with life-saving opportunities.

---

## 🌟 Key Features

### 1. Home Page
- **Hero Section**: High-impact messaging (*"Your One Donation Can Save Lives."*), Indian context badge, primary & secondary CTAs, and interactive visual indicators.
- **National Emergency Helpline**: Top banner highlighting 24x7 emergency helplines **104 / 1075** and **112**.
- **Live Statistics**: Animated counters for daily blood units needed (12,000+), camps organized (450+), lives impacted (18,500+), and active campaigns.
- **Why Donate Blood?**: 5 interactive cards detailing emergency trauma care, major surgeries, accident care, regular transfusions (Thalassemia warriors), and component therapy.
- **"Can I Donate Today?" (60-Second Quick Quiz)**: Interactive self-assessment tool checking age, weight, health, and interval with instant feedback.
- **Upcoming Blood Camps Preview**: Curated preview cards with direct registration triggers.
- **How Blood Donation Works**: 4-step visual timeline (Registration, Screening, Donation, Refreshments & Recovery).
- **Eligibility Guidelines**: General criteria, temporary deferrals, permanent deferrals, and medical disclaimers.
- **Interactive Blood Compatibility Matrix**: Clickable selector for all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) dynamically highlighting "Can Give Red Cells To" and "Can Receive From", with Indian population prevalence.
- **Myths vs Facts**: 6 interactive cards debunking widespread misconceptions with scientific facts.
- **Stories That Inspire**: Sample donor testimonials showcasing community impact.

### 2. Blood Camps Directory
- **Search & Discovery**: Live keyword search matching camp names, cities, landmarks, organizers, and blood banks.
- **Filters**: By Indian cities (New Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Ahmedabad, Kolkata, Chennai), dates (Today, Next 7 Days, Past), and organizers.
- **View Switch**: Grid View vs Interactive Regional Hubs (North, West, South, East).
- **Camp Details Modal**: Full address, partner blood bank, schedule, facilities provided, and what-to-bring checklist.
- **Camp Registration Form**: Pre-registration with validation (Full Name, Age 18-65, Indian 10-digit mobile, Email, Blood Group, Preferred Arrival Slot, Consent).
- **Digital Donor Pass / Slip**: Instant registration pass generator with unique Pass ID (e.g., `RS-2026-8921`), printable summary, and confirmation toast.

### 3. Donate Blood Educational Hub
- In-depth answers to 10 key donation questions (Definition, Importance in India, Eligibility, Intervals, Pre/Post-donation care, DOs and DON'Ts).
- **Interactive Donor Day Checklist**: Interactive checklist for donors to review before arriving at a camp.
- Prominent medical disclaimers.

### 4. Learn & Articles Library
- Categorized educational articles with reading times and badges.
- Full-screen Article Reader Modal with clinical insights on the ABO/Rh system, component fractionation (PRBC, Platelets, FFP, Cryo), apheresis, cold chain logistics, and the Bombay blood group.

### 5. About Us
- Mission: *"To create awareness about blood donation and make it easier for people to discover and participate in blood donation camps across India."*
- Vision, 4-step community ecosystem, and Indian blood banking landscape context.

### 6. Contact & Emergency Helplines
- Working contact form with category selection and validation.
- Emergency helplines (104, 1075, 112), eRaktKosh official links, and FAQs.

### 7. Camp Organizer Portal
- **Organizer Dashboard**: Live counters for total active camps, registered donors, and estimated lives saved.
- **Camp Management**: Create new blood camps, edit existing camp details, or cancel/delete drives.
- **Donor Roster Modal**: View table of registered donors for each camp with one-click TSV export / clipboard copy.
- **Persistence**: All edits and registrations persist in `localStorage`.

---

## 🚀 How to Run Locally

### Option 1: Using the Included PowerShell Server (Recommended)
1. Open PowerShell in the project directory:
   ```powershell
   cd "d:\rakt sangam"
   powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:8080/
   ```

### Option 2: Opening Directly in Browser
Since Rakt Sangam is built with pure standards-compliant HTML5, CSS3, and ES6 JavaScript with zero external npm dependencies, you can also double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari!

---

## 🎨 Design Philosophy
- **Colors**: Refined crimson & ruby (`#DC2626` / `#B91C1C`), crisp white and warm slate (`#0F172A`, `#F8FAFC`), emerald positive accents (`#059669`).
- **Typography**: `Outfit` for modern headings, `Plus Jakarta Sans` for clean, high-legibility body text.
- **Responsiveness**: Mobile-first responsive design with accessible touch targets, hamburger drawer navigation, and clean breakpoints.
- **Tone**: Trustworthy, uplifting, compassionate, and tailored to the Indian voluntary donation movement.
