'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Global
    portal_name: "LANDLENS",
    portal_tagline: "Citizen-Centric Land Record Verification & Grievance Resolution",
    civil_portal_banner: "CIVIL VERIFICATION PORTAL",
    banner_legal_notice: "Official Land Record Verification Layer. Final legal authority rests with jurisdiction officers.",
    featured_case: "Featured Case:",
    my_grievances: "My Grievances",
    locate_my_land: "Locate My Land",
    raise_grievance: "+ Raise Grievance",
    case_queue: "Case Queue",
    case_review: "Case Review",
    admin_overview: "Overview & SLAs",
    audit_logs: "Audit Logs",
    sign_in: "Sign In",
    role_citizen: "Citizen",
    role_officer: "Officer",
    role_admin: "Admin",

    // Locate & Map
    step2_title: "Locate My Land & Jurisdiction",
    locate_desc: "Select your land location using the interactive map or manual dropdown filters to determine the assigned jurisdiction officer.",
    land_details_title: "Land Location & Extent Details",
    village: "Village",
    survey_parcel: "Survey Parcel",
    patta_number: "Patta Number",
    parcel_extent: "Parcel Extent",
    land_type: "Land Classification",
    village_capacity: "Village Total Capacity",
    assigned_officer: "Assigned Officer",
    select_jurisdiction: "Select Jurisdiction",

    // Grievance Form & Workflow
    raise_grievance_title: "Raise a Land Record Grievance",
    category_select: "Select Grievance Category",
    issue_description: "Issue Description & Evidence Details",
    upload_document: "Upload Supporting Land Document (PDF / Image)",
    submit_grievance: "Submit Grievance for AI Verification",

    // Statuses
    status_submitted: "SUBMITTED",
    status_assigned: "ASSIGNED",
    status_under_review: "UNDER REVIEW",
    status_docs_required: "ADDITIONAL DOCUMENTS REQUIRED",
    status_resolved: "RESOLVED",
    status_escalated: "ESCALATED",

    // Officer Console
    officer_console: "Revenue Officer Verification Console",
    gov_ref_record: "Authoritative Reference Record",
    citizen_evidence: "Citizen Evidence & AI Extractions",
    ai_findings: "AI Discrepancy Findings",
    officer_action: "Officer Action & Decision",
    action_resolve: "Resolve Grievance",
    action_request_docs: "Request Additional Evidence",
    action_escalate: "Escalate to Superior Authority",
  },

  ta: {
    // Navbar & Global
    portal_name: "LANDLENS",
    portal_tagline: "குடிமக்கள் நிலப் பதிவு சரிபார்ப்பு மற்றும் குறை தீர்க்கும் தளம்",
    civil_portal_banner: "குடிமக்கள் சரிபார்ப்பு தளம்",
    banner_legal_notice: "அதிகாரப்பூர்வ நிலப் பதிவு சரிபார்ப்பு அடுக்கு. இறுதி சட்ட அதிகாரம் வருவாய் அலுவலர்களிடம் உள்ளது.",
    featured_case: "முக்கிய வழக்கு:",
    my_grievances: "என் மனுக்கள்",
    locate_my_land: "என் நிலத்தைக் கண்டறியவும்",
    raise_grievance: "+ மனு அளிக்கவும்",
    case_queue: "வழக்கு வரிசை",
    case_review: "வழக்கு பரிசீலனை",
    admin_overview: "நிர்வாகக் மேலோட்டம்",
    audit_logs: "தணிக்கைப் பதிவுகள்",
    sign_in: "உள்நுழைய",
    role_citizen: "குடிமகன்",
    role_officer: "அலுவலர்",
    role_admin: "நிர்வாகி",

    // Locate & Map
    step2_title: "என் நிலம் மற்றும் அதிகார வரம்பைக் கண்டறியவும்",
    locate_desc: "வரைபடம் அல்லது மாவட்டப் பட்டியலைப் பயன்படுத்தி உங்கள் நிலத்தின் அதிகாரப்பூர்வ அலுவலரைக் கண்டறியவும்.",
    land_details_title: "நில இருப்பிடம் மற்றும் பரப்பு விவரங்கள்",
    village: "கிராமம்",
    survey_parcel: "புல எண் (Survey No)",
    patta_number: "பட்டா எண்",
    parcel_extent: "நிலப் பரப்பு (Acres)",
    land_type: "நில வகைப்பாடு",
    village_capacity: "கிராம மொத்த பரப்பு",
    assigned_officer: "ஒதுக்கப்பட்ட அலுவலர்",
    select_jurisdiction: "அதிகார வரம்பைத் தேர்ந்தெடுக்கவும்",

    // Grievance Form & Workflow
    raise_grievance_title: "நிலப் பதிவு குறை மனு அளிக்கவும்",
    category_select: "குறை வகையைத் தேர்ந்தெடுக்கவும்",
    issue_description: "பிரச்சனை விளக்கம் மற்றும் சான்று விவரங்கள்",
    upload_document: "ஆவணச் சான்றைப் பதிவேற்றவும் (PDF / Image)",
    submit_grievance: "AI சரிபார்ப்பிற்கு சமர்ப்பிக்கவும்",

    // Statuses
    status_submitted: "சமர்ப்பிக்கப்பட்டது",
    status_assigned: "ஒதுக்கப்பட்டது",
    status_under_review: "பரிசீலனையில் உள்ளது",
    status_docs_required: "கூடுதல் ஆவணங்கள் தேவை",
    status_resolved: "தீர்க்கப்பட்டது",
    status_escalated: "மேல்முறையீடு செய்யப்பட்டது",

    // Officer Console
    officer_console: "வருவாய் அலுவலர் சரிபார்ப்பு முனையம்",
    gov_ref_record: "அரசு குறிப்புப் பதிவு",
    citizen_evidence: "குடிமகன் சான்று மற்றும் AI பிரித்தெடுத்தல்",
    ai_findings: "AI வேறுபாட்டுக் கண்டுபிடிப்புகள்",
    officer_action: "அலுவலர் நடவடிக்கை மற்றும் முடிவு",
    action_resolve: "மனுவைத் தீர்க்கவும்",
    action_request_docs: "கூடுதல் சான்றுகளைக் கேட்கவும்",
    action_escalate: "மேலதிகாரிக்கு அனுப்பவும்",
  },

  hi: {
    // Navbar & Global
    portal_name: "LANDLENS",
    portal_tagline: "नागरिक भू-अभिलेख सत्यापन एवं शिकायत निवारण मंच",
    civil_portal_banner: "नागरिक सत्यापन पोर्टल",
    banner_legal_notice: "आधिकारिक भू-अभिलेख सत्यापन परत। अंतिम कानूनी अधिकार क्षेत्राधिकारी अधिकारियों के पास है।",
    featured_case: "प्रमुख मामला:",
    my_grievances: "मेरी शिकायतें",
    locate_my_land: "मेरी भूमि खोजें",
    raise_grievance: "+ शिकायत दर्ज करें",
    case_queue: "मामला कतार",
    case_review: "मामला समीक्षा",
    admin_overview: "प्रशासनिक अवलोकन",
    audit_logs: "ऑडिट लॉग्स",
    sign_in: "साइन इन करें",
    role_citizen: "नागरिक",
    role_officer: "अधिकारी",
    role_admin: "प्रशासक",

    // Locate & Map
    step2_title: "मेरी भूमि और क्षेत्राधिकार खोजें",
    locate_desc: "मानचित्र या जिला फ़िल्टर का उपयोग करके अपनी भूमि के नामित राजस्व अधिकारी का पता लगाएं।",
    land_details_title: "भूमि स्थान एवं क्षेत्रफल विवरण",
    village: "गांव",
    survey_parcel: "खसरा / सर्वे नंबर",
    patta_number: "पट्टा संख्या",
    parcel_extent: "भूमि क्षेत्रफल (Acres)",
    land_type: "भूमि वर्गीकरण",
    village_capacity: "गांव की कुल क्षमता",
    assigned_officer: "नामित अधिकारी",
    select_jurisdiction: "क्षेत्राधिकार चुनें",

    // Grievance Form & Workflow
    raise_grievance_title: "भू-अभिलेख शिकायत दर्ज करें",
    category_select: "शिकायत श्रेणी चुनें",
    issue_description: "समस्या विवरण और साक्ष्य जानकारी",
    upload_document: "सहायक दस्तावेज़ अपलोड करें (PDF / Image)",
    submit_grievance: "AI सत्यापन के लिए जमा करें",

    // Statuses
    status_submitted: "दर्ज की गई",
    status_assigned: "आवंटित",
    status_under_review: "समीक्षाधीन",
    status_docs_required: "अतिरिक्त दस्तावेज़ आवश्यक",
    status_resolved: "निस्तारित",
    status_escalated: "उच्चाधिकारी को प्रेषित",

    // Officer Console
    officer_console: "राजस्व अधिकारी सत्यापन कंसोल",
    gov_ref_record: "सरकारी संदर्भ रिकॉर्ड",
    citizen_evidence: "नागरिक साक्ष्य एवं AI निष्कर्षण",
    ai_findings: "AI विसंगति निष्कर्ष",
    officer_action: "अधिकारी कार्रवाई एवं निर्णय",
    action_resolve: "शिकायत का निस्तारण करें",
    action_request_docs: "अतिरिक्त साक्ष्य का अनुरोध करें",
    action_escalate: "उच्चाधिकारी को प्रेषित करें",
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('landlens_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('landlens_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
