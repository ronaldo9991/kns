import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "en" | "ta";

const dict = {
  en: {
    org: "Kovai Nadar Sangam",
    tagline: "A community trust serving the Hindu & Christian Nadar families of Coimbatore since 1952.",
    eventsLabel: "Upcoming Events",

    nav: {
      home: "Home", matrimony: "Matrimony", members: "Members",
      events: "Events", school: "Our School", about: "About", admin: "Admin",
    },
    cta: { register: "Register for Matrimony", member: "Become a Member", signin: "Sign In", join: "Join Free" },
    stats: { members: "Registered Members", matches: "Successful Matches", years: "Years of Service" },

    // ── Home ────────────────────────────────────────────────────────────
    home: {
      inspiration: "Our Inspiration",
      kamarajCaption: "Former CM of Tamil Nadu · Bharat Ratna · Pride of the Nadar community",
      services: "What we do",
      servicesSub: "Six pillars of service to the community.",
      featured: "Featured Matrimony Profiles",
      featuredSub: "Recently verified profiles. Contact is shared only through the sangam.",
      viewAllProfiles: "View all profiles",
      viewAllEvents: "All events",
      contact: "Contact the Sangam",
      contactSub: "Visit our office, call us, or send an enquiry below.",
      trustVerified: "Profiles verified by office",
      trustRegistered: "Registered Trust · Reg. 42/1952",
      trustCommunity: "Hindu & Christian Nadar families",
      serviceCards: [
        { title: "Matrimony", desc: "Verified profiles, traditional matching, family-first introductions." },
        { title: "Member Directory", desc: "Connect with families across Coimbatore by area and profession." },
        { title: "Our School", desc: "Sangamam Matriculation School — Nursery to Class 12, English medium, run by the Sangam." },
        { title: "Events & Meets", desc: "Annual matrimony meets, cultural gatherings and community days." },
        { title: "Business Network", desc: "Connect Nadar entrepreneurs and traders across the city." },
        { title: "Welfare", desc: "Emergency support for medical, funeral and hardship situations." },
      ],
      contactForm: { name: "Your name", phone: "Phone number", message: "Message", send: "Send enquiry" },
      contactToast: "Enquiry sent. The sangam office will reach you within 2 working days.",
    },

    // ── Matrimony ───────────────────────────────────────────────────────
    matrimony: {
      title: "Matrimony",
      subtitle: "Verified profiles from registered families. Contact details are shared only through the sangam office.",
      filter: "Filter",
      gender: "Gender",
      religion: "Religion",
      age: "Age Range",
      rasi: "Rasi",
      search: "Search by name, education, area…",
      verified: "verified profiles · contact via sangam only",
      expressInterest: "Express Interest",
      interestToast: "Interest sent. The Sangam office will contact both families within 2–3 working days.",
      aiMatch: "AI Compatibility",
      aiActive: "AI Match Active",
      aiActiveSub: "Profiles sorted by compatibility with your profile using traditional & modern criteria.",
      aiSignIn: "AI Matching",
      aiSignInSub: "Sign in to see your compatibility score with each profile.",
      signInLink: "Sign in →",
      noProfiles: "No profiles match those filters",
      noProfilesSub: "Try widening your age range or clearing the rasi filter.",
      registerProfile: "Register Profile",
      sortedByAi: "Sorted by AI compatibility",
      aiCompatibility: "AI Compatibility",
      getDetailedAnalysis: "Get detailed analysis",
      analyzing: "Analyzing…",
      verified_badge: "Verified",
      contactViaSangam: "verified profiles · contact via sangam only",
      paperBiodata: "Have a paper biodata?",
      paperBiodataSub: "Upload it and we'll auto-fill your digital profile.",
      uploadAutoFill: "Upload & auto-fill",
      anyRasi: "Any Rasi",
      anyGender: "Any",
      hinduNadar: "Hindu Nadar",
      christianNadar: "Christian Nadar",
      min: "Min",
      max: "Max",
    },

    // ── Events ──────────────────────────────────────────────────────────
    events: {
      title: "Events & Community Meets",
      subtitle: "Annual matrimony meets, cultural gatherings, health camps and business breakfasts.",
      upcoming: "Upcoming",
      past: "Past events",
      register: "Register",
      registeredToast: "Registered. We'll send venue details on WhatsApp.",
    },

    // ── Members ─────────────────────────────────────────────────────────
    members: {
      title: "Member Directory",
      subtitle: "Connect with fellow community members across Coimbatore.",
      search: "Search by name, area or profession…",
      addSelf: "Add yourself",
      requestContact: "Request contact",
      membershipToast: "Membership form opens at the office. We'll add the online form soon.",
      contactToast: "Sangam office will share contact details after verification.",
    },

    // ── School ─────────────────────────────────────────────────────────
    school: {
      title: "Our School",
      subtitle: "Sangamam Matriculation School — quality education for the Nadar community of Coimbatore, run by Kovai Nadar Sangam.",
      about: "About the School",
      aboutText: "Sangamam Matriculation School is run by Kovai Nadar Sangam and is located on Sanganoor Road, Tatabad, Coimbatore. The school stands as a cornerstone of the Sangam's commitment to quality education for the community.",
      details: "School Details",
      classes: "Classes Offered",
      classesVal: "Nursery to Class 12",
      board: "Board",
      boardVal: "Tamil Nadu State Board (Matriculation)",
      medium: "Medium of Instruction",
      mediumVal: "English",
      type: "School Type",
      typeVal: "Co-educational Day School",
      facilities: "Facilities",
      facilityList: ["Computer Laboratory", "Integrated Science Laboratory", "Mathematics Laboratory", "Robotics Lab", "Library", "Digital Smart Classrooms"],
      admission: "Admissions",
      admissionSub: "Admissions open every academic year. Visit the school during school hours.",
      admissionTime: "Visit school: 8:30 am – 3:30 pm",
      minAge: "Minimum age for Nursery: 3 years",
      fees: "Annual Fees",
      feesVal: "₹25,000 + ₹13,800",
      contact: "Contact the School",
      address: "Sanganoor Road, Tatabad, Coimbatore — 641027",
      phone: "0422-2333185",
      getDirections: "Get Directions",
    },

    // ── About ────────────────────────────────────────────────────────────
    about: {
      title: "About the Sangam",
      subtitle: "A registered community trust serving the Hindu and Christian Nadar families of Coimbatore since 1952.",
      history: "Our history",
      historyP1: "Kovai Nadar Sangam was founded in 1952 by a small group of merchants and educators who saw the need for a unified body that could support Nadar families newly settled in Coimbatore. Over seven decades the sangam has grown from a single rented room in Tatabad into a registered trust with its own community hall, matrimony service, scholarship fund and welfare programs.",
      historyP2: "We welcome both Hindu and Christian Nadar families. Our work spans matrimony, our Sangamam Matriculation School, health camps, business networking and emergency welfare. Every initiative is funded by member contributions and run by volunteer office bearers elected every three years.",
      bearers: "Office bearers (2024 — 2027)",
      gallery: "Gallery",
      founded: "Founded",
      trustReg: "Trust Reg. No.",
      officeHours: "Office hours",
      officeHoursVal: "Mon–Sat · 10am to 6pm",
    },

    // ── Matrimony Register ───────────────────────────────────────────────
    matrimonyRegister: {
      title: "Register Matrimony Profile",
      subtitle: "Profiles are reviewed by the office within 3 working days. Contact details are never shared without consent.",
      ocrTitle: "Auto-fill from paper form",
      ocrSub: "Upload a photo of your printed biodata and we'll fill the form for you.",
      ocrLoading: "Reading your form…",
      ocrDone: "Form filled! Please review and correct any errors.",
      ocrFillToast: "Form auto-filled from the photo. Please review every field.",
      submit: "Submit profile",
      submitToast: "Profile submitted for review. The sangam office will contact you within 3 working days.",
      sections: {
        personal: "Personal details",
        profession: "Education & Profession",
        family: "Family details",
        contact: "Contact information",
        expectations: "Partner expectations",
      },
      fields: {
        name: "Full name *", dob: "Date of birth *", caste: "Religion & caste",
        birthTime: "Birth time", birthPlace: "Birth place", blood: "Blood group",
        height: "Height", weight: "Weight", star: "Star (Nakshatra)", rasi: "Rasi",
        gotram: "Gotram", job: "Job title", workplace: "Workplace / Company",
        income: "Monthly income (₹)", education: "Education",
        fatherName: "Father's name", fatherJob: "Father's occupation",
        motherName: "Mother's name", motherJob: "Mother's occupation",
        address: "Address", phone: "Phone", mobile: "Mobile *", email: "Email",
        siblings: "Siblings", expectations: "Expectations from partner",
        photo: "Profile photo",
      },
    },

    // ── Admin ─────────────────────────────────────────────────────────────
    admin: {
      title: "Admin Panel",
      subtitle: "Internal dashboard for office bearers.",
      dashboard: "Dashboard",
      matrimonyApprovals: "Matrimony",
      members: "Members",
      eventsTab: "Events",
      school: "Our School",
      signIn: "Admin Sign In",
      signInSub: "Office bearers & secretaries only",
      demoHint: "Demo:",
      pendingApprovals: "Pending Approvals",
      totalMembers: "Total Members",
      upcomingEvents: "Upcoming Events",
      schoolInfo: "School Info",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      viewSite: "View site",
      approve: "Approve",
      reject: "Reject",
      addMember: "Add Member",
      newEvent: "New Event",
      approvedToast: "Profile approved",
      rejectedToast: "Profile rejected",
    },

    // ── Auth ──────────────────────────────────────────────────────────────
    auth: {
      signIn: "Sign in",
      signInSub: "Access your Sangam account",
      email: "Email address",
      password: "Password",
      confirm: "Confirm password",
      fullName: "Full name",
      phone: "Phone",
      phoneOptional: "Phone (optional)",
      signInBtn: "Sign in",
      createAccount: "Create account",
      createAccountSub: "Join the Kovai Nadar Sangam community",
      alreadyHaveAccount: "Already have an account?",
      newToSangam: "New to Kovai Nadar Sangam?",
      demoCredentials: "Demo credentials",
      backToHome: "← Back to home",
      welcomeBack: "Welcome back",
      invalidCredentials: "Invalid credentials. Please check your email and password.",
      emailRegistered: "Email already registered",
      passwordMismatch: "Passwords don't match",
      passwordTooShort: "Password must be at least 6 characters",
      createSuccess: "Account created! Welcome to Kovai Nadar Sangam.",
    },

    // ── Common ────────────────────────────────────────────────────────────
    common: {
      loading: "Loading…",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      back: "Back",
      next: "Next",
      submit: "Submit",
      optional: "(optional)",
      signOut: "Sign out",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  ta: {
    org: "கோவை நாடார் சங்கம்",
    tagline: "கோயம்புத்தூரின் இந்து மற்றும் கிறிஸ்தவ நாடார் குடும்பங்களுக்கு 1952 முதல் சேவை.",
    eventsLabel: "வரவிருக்கும் நிகழ்வுகள்",

    nav: {
      home: "முகப்பு", matrimony: "திருமணம்", members: "உறுப்பினர்கள்",
      events: "நிகழ்வுகள்", school: "எங்கள் பள்ளி", about: "எங்களைப் பற்றி", admin: "நிர்வாகம்",
    },
    cta: { register: "திருமண பதிவு", member: "உறுப்பினராகுங்கள்", signin: "உள்நுழைக", join: "இலவசமாக சேர" },
    stats: { members: "பதிவு செய்த உறுப்பினர்கள்", matches: "வெற்றிகரமான பொருத்தங்கள்", years: "சேவை ஆண்டுகள்" },

    // ── Home ────────────────────────────────────────────────────────────
    home: {
      inspiration: "எங்கள் உத்வேகம்",
      kamarajCaption: "தமிழகத்தின் முன்னாள் முதலமைச்சர் · பாரத ரத்னா · நாடார் சமூகத்தின் பெருமை",
      services: "எங்கள் சேவைகள்",
      servicesSub: "சமூகத்திற்கான ஆறு தூண்கள்.",
      featured: "சிறப்பு திருமண சுயவிவரங்கள்",
      featuredSub: "சரிபார்க்கப்பட்ட சுயவிவரங்கள். தொடர்பு சங்கம் வழியாக மட்டுமே.",
      viewAllProfiles: "அனைத்து சுயவிவரங்களும்",
      viewAllEvents: "அனைத்து நிகழ்வுகளும்",
      contact: "தொடர்பு கொள்ள",
      contactSub: "எங்கள் அலுவலகத்தை சந்திக்கவும், அழைக்கவும் அல்லது விசாரிக்கவும்.",
      trustVerified: "அலுவலகத்தால் சரிபார்க்கப்பட்ட சுயவிவரங்கள்",
      trustRegistered: "பதிவு செய்யப்பட்ட அறக்கட்டளை · பதிவு. 42/1952",
      trustCommunity: "இந்து மற்றும் கிறிஸ்தவ நாடார் குடும்பங்கள்",
      serviceCards: [
        { title: "திருமணம்", desc: "சரிபார்க்கப்பட்ட சுயவிவரங்கள், பாரம்பரிய பொருத்தம், குடும்ப அடிப்படையிலான அறிமுகங்கள்." },
        { title: "உறுப்பினர் பட்டியல்", desc: "கோயம்புத்தூரில் பகுதி மற்றும் தொழிலால் குடும்பங்களுடன் தொடர்பு கொள்ளுங்கள்." },
        { title: "எங்கள் பள்ளி", desc: "சங்கமம் மெட்ரிகுலேஷன் பள்ளி — நர்சரி முதல் 12ம் வகுப்பு வரை, ஆங்கில வழி, சங்கத்தால் நடத்தப்படுகிறது." },
        { title: "நிகழ்வுகள் & கூட்டங்கள்", desc: "ஆண்டு திருமண கூட்டங்கள், கலாச்சார நிகழ்வுகள் மற்றும் சமூக நாட்கள்." },
        { title: "வணிக வலையமைப்பு", desc: "நகரம் முழுவதும் நாடார் தொழில்முனைவோர் மற்றும் வணிகர்களை இணைக்கவும்." },
        { title: "நலன்புரி", desc: "மருத்துவ, இறுதி சடங்கு மற்றும் கடின சூழ்நிலைகளில் அவசர ஆதரவு." },
      ],
      contactForm: { name: "உங்கள் பெயர்", phone: "தொலைபேசி எண்", message: "செய்தி", send: "விசாரணை அனுப்புக" },
      contactToast: "விசாரணை அனுப்பப்பட்டது. 2 வேலை நாட்களுக்குள் சங்கம் அலுவலகம் தொடர்பு கொள்ளும்.",
    },

    // ── Matrimony ───────────────────────────────────────────────────────
    matrimony: {
      title: "திருமணம்",
      subtitle: "பதிவு செய்த குடும்பங்களின் சரிபார்க்கப்பட்ட சுயவிவரங்கள். தொடர்பு விவரங்கள் சங்கம் அலுவலகம் வழியாக மட்டுமே பகிரப்படும்.",
      filter: "வடிகட்டி",
      gender: "பாலினம்",
      religion: "மதம்",
      age: "வயது வரம்பு",
      rasi: "ராசி",
      search: "பெயர், கல்வி, இடத்தால் தேடுங்கள்…",
      verified: "சரிபார்க்கப்பட்ட சுயவிவரங்கள் · சங்கம் வழியாக மட்டுமே",
      expressInterest: "ஆர்வம் தெரிவிக்க",
      interestToast: "ஆர்வம் அனுப்பப்பட்டது. 2–3 வேலை நாட்களுக்குள் சங்கம் அலுவலகம் இரு குடும்பங்களையும் தொடர்பு கொள்ளும்.",
      aiMatch: "AI பொருத்தம்",
      aiActive: "AI பொருத்தம் செயலில் உள்ளது",
      aiActiveSub: "சுயவிவரங்கள் பாரம்பரிய மற்றும் நவீன அளவுகோல்களால் உங்கள் சுயவிவரத்துடன் பொருத்தப்படுகின்றன.",
      aiSignIn: "AI பொருத்தம்",
      aiSignInSub: "ஒவ்வொரு சுயவிவரத்துடனும் உங்கள் பொருத்தம் மதிப்பெண்ணைக் காண உள்நுழைக.",
      signInLink: "உள்நுழைக →",
      noProfiles: "தேடலுக்கு பொருந்தும் சுயவிவரங்கள் இல்லை",
      noProfilesSub: "வயது வரம்பை அதிகரிக்கவும் அல்லது ராசி வடிகட்டியை நீக்கவும்.",
      registerProfile: "சுயவிவரம் பதிவு செய்க",
      sortedByAi: "AI பொருத்தத்தால் வரிசைப்படுத்தப்பட்டது",
      aiCompatibility: "AI பொருத்தம்",
      getDetailedAnalysis: "விரிவான பகுப்பாய்வு பெறுக",
      analyzing: "பகுப்பாய்வு செய்கிறது…",
      verified_badge: "சரிபார்க்கப்பட்டது",
      contactViaSangam: "சரிபார்க்கப்பட்ட சுயவிவரங்கள் · சங்கம் வழியாக மட்டுமே",
      paperBiodata: "கையெழுத்து விவரப்பத்திரம் உள்ளதா?",
      paperBiodataSub: "படம் பதிவேற்றவும், நாங்கள் படிவத்தை நிரப்புவோம்.",
      uploadAutoFill: "பதிவேற்றி தானாக நிரப்பு",
      anyRasi: "எந்த ராசியும்",
      anyGender: "எல்லாரும்",
      hinduNadar: "இந்து நாடார்",
      christianNadar: "கிறிஸ்தவ நாடார்",
      min: "குறைந்தபட்சம்",
      max: "அதிகபட்சம்",
    },

    // ── Events ──────────────────────────────────────────────────────────
    events: {
      title: "நிகழ்வுகள் & சமூக கூட்டங்கள்",
      subtitle: "ஆண்டு திருமண கூட்டங்கள், கலாச்சார நிகழ்வுகள், சுகாதார முகாம்கள் மற்றும் வணிக காலை உணவு கூட்டங்கள்.",
      upcoming: "வரவிருக்கும் நிகழ்வுகள்",
      past: "கடந்த நிகழ்வுகள்",
      register: "பதிவு செய்க",
      registeredToast: "பதிவு செய்யப்பட்டது. WhatsApp-ல் இடம் விவரங்கள் அனுப்புவோம்.",
    },

    // ── Members ─────────────────────────────────────────────────────────
    members: {
      title: "உறுப்பினர் பட்டியல்",
      subtitle: "கோயம்புத்தூரில் சக சமூக உறுப்பினர்களுடன் தொடர்பு கொள்ளுங்கள்.",
      search: "பெயர், பகுதி அல்லது தொழிலால் தேடுங்கள்…",
      addSelf: "உங்களை சேர்க்கவும்",
      requestContact: "தொடர்பை கோரவும்",
      membershipToast: "உறுப்பினர் படிவம் அலுவலகத்தில் உள்ளது. விரைவில் ஆன்லைன் படிவம் சேர்க்கப்படும்.",
      contactToast: "சரிபார்ப்பிற்கு பிறகு சங்கம் அலுவலகம் தொடர்பு விவரங்களை பகிரும்.",
    },

    // ── School ─────────────────────────────────────────────────────────
    school: {
      title: "எங்கள் பள்ளி",
      subtitle: "சங்கமம் மெட்ரிகுலேஷன் பள்ளி — கோவை நாடார் சங்கத்தால் நடத்தப்படும் தரமான கல்வி நிறுவனம்.",
      about: "பள்ளியைப் பற்றி",
      aboutText: "சங்கமம் மெட்ரிகுலேஷன் பள்ளி கோவை நாடார் சங்கத்தால் நடத்தப்படுகிறது. தாதாபாட், கோயம்புத்தூரில் சங்கனூர் சாலையில் அமைந்துள்ளது.",
      details: "பள்ளி விவரங்கள்",
      classes: "வழங்கப்படும் வகுப்புகள்",
      classesVal: "நர்சரி முதல் 12ம் வகுப்பு வரை",
      board: "வாரியம்",
      boardVal: "தமிழ்நாடு மெட்ரிகுலேஷன் வாரியம்",
      medium: "கற்பிக்கும் மொழி",
      mediumVal: "ஆங்கிலம்",
      type: "பள்ளி வகை",
      typeVal: "கலப்பு கல்வி பகல் பள்ளி",
      facilities: "வசதிகள்",
      facilityList: ["கணினி ஆய்வகம்", "ஒருங்கிணைந்த அறிவியல் ஆய்வகம்", "கணித ஆய்வகம்", "ரோபோட்டிக்ஸ் ஆய்வகம்", "நூலகம்", "டிஜிட்டல் ஸ்மார்ட் வகுப்பறைகள்"],
      admission: "சேர்க்கை",
      admissionSub: "ஆண்டுதோறும் சேர்க்கை திறக்கப்படும். பள்ளி நேரத்தில் நேரில் வரவும்.",
      admissionTime: "பள்ளியை சந்திக்க: காலை 8:30 — மாலை 3:30",
      minAge: "நர்சரிக்கு குறைந்தபட்ச வயது: 3 ஆண்டுகள்",
      fees: "ஆண்டு கட்டணம்",
      feesVal: "₹25,000 + ₹13,800",
      contact: "பள்ளியை தொடர்பு கொள்ளுங்கள்",
      address: "சங்கனூர் சாலை, தாதாபாட், கோயம்புத்தூர் — 641027",
      phone: "0422-2333185",
      getDirections: "வழிகாட்டல் பெறுக",
    },

    // ── About ────────────────────────────────────────────────────────────
    about: {
      title: "சங்கத்தைப் பற்றி",
      subtitle: "1952 முதல் கோயம்புத்தூரில் இந்து மற்றும் கிறிஸ்தவ நாடார் குடும்பங்களுக்கு சேவை செய்யும் பதிவு செய்யப்பட்ட சமூக அறக்கட்டளை.",
      history: "எங்கள் வரலாறு",
      historyP1: "கோவை நாடார் சங்கம் 1952-ல் சில வணிகர்கள் மற்றும் கல்வியாளர்களால் நிறுவப்பட்டது. கோயம்புத்தூரில் புதிதாக குடியேறிய நாடார் குடும்பங்களை ஆதரிக்கும் ஒரு ஒருங்கிணைந்த அமைப்பின் தேவையை அவர்கள் உணர்ந்தனர். ஏழு தசாப்தங்களுக்கும் மேலாக, சங்கம் தாதாபாடில் ஒரு வாடகை அறையிலிருந்து சொந்த சமூக மண்டபம், திருமண சேவை, உதவித்தொகை நிதி மற்றும் நலன்புரி திட்டங்களுடன் பதிவு செய்யப்பட்ட அறக்கட்டளையாக வளர்ந்துள்ளது.",
      historyP2: "நாங்கள் இந்து மற்றும் கிறிஸ்தவ நாடார் குடும்பங்கள் இருவரையும் வரவேற்கிறோம். எங்கள் பணி திருமணம், சங்கமம் மெட்ரிகுலேஷன் பள்ளி, சுகாதார முகாம்கள், வணிக வலையமைப்பு மற்றும் அவசர நலன்புரியை உள்ளடக்கியது. ஒவ்வொரு முயற்சியும் உறுப்பினர் பங்களிப்பால் நிதியளிக்கப்பட்டு மூன்று ஆண்டுகளுக்கு ஒருமுறை தேர்ந்தெடுக்கப்படும் தன்னார்வ அலுவலக நிர்வாகிகளால் நடத்தப்படுகிறது.",
      bearers: "அலுவலக நிர்வாகிகள் (2024 — 2027)",
      gallery: "படக் தொகுப்பு",
      founded: "நிறுவப்பட்ட ஆண்டு",
      trustReg: "அறக்கட்டளை பதிவு எண்",
      officeHours: "அலுவலக நேரம்",
      officeHoursVal: "திங்கள்–சனி · காலை 10 முதல் மாலை 6 வரை",
    },

    // ── Matrimony Register ───────────────────────────────────────────────
    matrimonyRegister: {
      title: "திருமண சுயவிவரம் பதிவு செய்க",
      subtitle: "சுயவிவரங்கள் 3 வேலை நாட்களுக்குள் அலுவலகத்தால் ஆய்வு செய்யப்படும். ஒப்புதல் இல்லாமல் தொடர்பு விவரங்கள் பகிரப்படாது.",
      ocrTitle: "கையெழுத்து படிவத்திலிருந்து தானாக நிரப்பு",
      ocrSub: "அச்சிடப்பட்ட விவரப்பத்திரத்தின் புகைப்படத்தை பதிவேற்றவும், நாங்கள் படிவத்தை நிரப்புவோம்.",
      ocrLoading: "உங்கள் படிவத்தை படிக்கிறோம்…",
      ocrDone: "படிவம் நிரப்பப்பட்டது! சரிபார்த்து திருத்தவும்.",
      ocrFillToast: "புகைப்படத்திலிருந்து படிவம் தானாக நிரப்பப்பட்டது. ஒவ்வொரு புலத்தையும் சரிபார்க்கவும்.",
      submit: "சுயவிவரத்தை சமர்ப்பிக்கவும்",
      submitToast: "சுயவிவரம் ஆய்வுக்கு சமர்ப்பிக்கப்பட்டது. 3 வேலை நாட்களுக்குள் சங்கம் அலுவலகம் தொடர்பு கொள்ளும்.",
      sections: {
        personal: "தனிப்பட்ட விவரங்கள்",
        profession: "கல்வி மற்றும் தொழில்",
        family: "குடும்ப விவரங்கள்",
        contact: "தொடர்பு தகவல்",
        expectations: "துணைவர் எதிர்பார்ப்புகள்",
      },
      fields: {
        name: "முழு பெயர் *", dob: "பிறந்த தேதி *", caste: "மதம் மற்றும் சாதி",
        birthTime: "பிறந்த நேரம்", birthPlace: "பிறந்த இடம்", blood: "இரத்த வகை",
        height: "உயரம்", weight: "எடை", star: "நட்சத்திரம்", rasi: "ராசி",
        gotram: "கோத்திரம்", job: "பணி பெயர்", workplace: "பணியிடம் / நிறுவனம்",
        income: "மாத வருமானம் (₹)", education: "கல்வித் தகுதி",
        fatherName: "தந்தை பெயர்", fatherJob: "தந்தை தொழில்",
        motherName: "தாய் பெயர்", motherJob: "தாய் தொழில்",
        address: "முகவரி", phone: "தொலைபேசி", mobile: "கைபேசி *", email: "மின்னஞ்சல்",
        siblings: "உடன்பிறந்தோர்", expectations: "துணைவரிடம் எதிர்பார்ப்புகள்",
        photo: "சுயவிவர புகைப்படம்",
      },
    },

    // ── Admin ─────────────────────────────────────────────────────────────
    admin: {
      title: "நிர்வாக பலகை",
      subtitle: "அலுவலக நிர்வாகிகளுக்கான டாஷ்போர்டு.",
      dashboard: "டாஷ்போர்டு",
      matrimonyApprovals: "திருமணம்",
      members: "உறுப்பினர்கள்",
      eventsTab: "நிகழ்வுகள்",
      school: "எங்கள் பள்ளி",
      signIn: "நிர்வாகி உள்நுழைவு",
      signInSub: "அலுவலக நிர்வாகிகள் மற்றும் செயலர்கள் மட்டும்",
      demoHint: "செயல்விளக்கம்:",
      pendingApprovals: "நிலுவையில் உள்ள அனுமதிகள்",
      totalMembers: "மொத்த உறுப்பினர்கள்",
      upcomingEvents: "வரவிருக்கும் நிகழ்வுகள்",
      schoolInfo: "பள்ளி தகவல்",
      recentActivity: "சமீபத்திய செயல்பாடு",
      quickActions: "விரைவான நடவடிக்கைகள்",
      viewSite: "தளத்தை காண்க",
      approve: "அனுமதிக்க",
      reject: "நிராகரிக்க",
      addMember: "உறுப்பினரை சேர்க்க",
      newEvent: "புதிய நிகழ்வு",
      approvedToast: "சுயவிவரம் அனுமதிக்கப்பட்டது",
      rejectedToast: "சுயவிவரம் நிராகரிக்கப்பட்டது",
    },

    // ── Auth ──────────────────────────────────────────────────────────────
    auth: {
      signIn: "உள்நுழைக",
      signInSub: "உங்கள் சங்கம் கணக்கை அணுகவும்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      confirm: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
      fullName: "முழு பெயர்",
      phone: "தொலைபேசி",
      phoneOptional: "தொலைபேசி (விரும்பினால்)",
      signInBtn: "உள்நுழைக",
      createAccount: "கணக்கு உருவாக்கவும்",
      createAccountSub: "கோவை நாடார் சங்கம் சமூகத்தில் சேரவும்",
      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      newToSangam: "கோவை நாடார் சங்கத்தில் புதியவரா?",
      demoCredentials: "செயல்விளக்க நற்சான்றுகள்",
      backToHome: "← முகப்பிற்கு திரும்பவும்",
      welcomeBack: "மீண்டும் வரவேற்கிறோம்",
      invalidCredentials: "தவறான நற்சான்றுகள். மின்னஞ்சல் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.",
      emailRegistered: "மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டது",
      passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
      passwordTooShort: "கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்",
      createSuccess: "கணக்கு உருவாக்கப்பட்டது! கோவை நாடார் சங்கத்திற்கு வரவேற்கிறோம்.",
    },

    // ── Common ────────────────────────────────────────────────────────────
    common: {
      loading: "ஏற்றுகிறது…",
      close: "மூடு",
      cancel: "ரத்து செய்",
      save: "சேமி",
      delete: "நீக்கு",
      edit: "திருத்து",
      search: "தேடு",
      back: "பின்",
      next: "அடுத்து",
      submit: "சமர்ப்பி",
      optional: "(விரும்பினால்)",
      signOut: "வெளியேறு",
    },
  },
};

export type TranslationDict = typeof dict.en;
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: TranslationDict };
const I18nCtx = createContext<Ctx | null>(null);
const LANG_KEY = "kns_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved === "en" || saved === "ta") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  return <I18nCtx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { dict };
