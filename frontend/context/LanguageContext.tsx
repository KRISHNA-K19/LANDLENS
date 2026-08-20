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
    // Top Banner & Navbar
    portal_name: "LANDLENS",
    portal_tagline: "Citizen-Centric Land Record Verification & Grievance Resolution Platform",
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

    // Landing Page (app/page.tsx)
    hero_badge: "Citizen-Centric Verification Layer",
    hero_title: "Transparent Land Record Verification & Discrepancy Resolution",
    hero_subtitle: "Locate land parcels, compare reference registries against title evidence with AI assistance, and track grievance resolution with jurisdiction revenue officers.",
    btn_locate_land: "Locate My Land & Jurisdiction",
    btn_raise_grievance: "Raise a Grievance",
    how_it_works: "How LANDLENS Works",
    step1_title: "1. Locate & Verify",
    step1_desc: "Search by District, Taluk, Village, or Survey Number to identify assigned revenue officers and reference land records.",
    step2_title: "2. Raise Grievance & Upload Evidence",
    step2_desc: "Submit your registered deed or patta document to flag potential mismatches in area, survey number, or ownership.",
    step3_title: "3. AI Discrepancy Analysis",
    step3_desc: "Gemini AI extracts document text and compares it against reference records to generate advisory verification findings.",
    step4_title: "4. Officer Resolution",
    step4_desc: "Jurisdiction Tahsildars review findings, request evidence, resolve grievances, or escalate cases within SLA deadlines.",
    primary_case_study: "Primary Verification Case Study",
    case_gl1024_desc: "Citizen K. Kumar holds Patta PT-10245 in Ambattur Kaveri Village.",
    inspect_case_gl1024: "Inspect Case GL-1024",
    gov_ref_record: "Government Reference Record:",
    citizen_evidence_doc: "Citizen Uploaded Evidence (Sale Deed):",
    patta_no: "Patta Number:",
    survey_no: "Survey Number:",
    owner_name: "Owner Name:",
    doc_no: "Document No:",

    // Locate Page & Map
    locate_page_step: "Step 2: Jurisdiction Routing & Land Search",
    locate_page_title: "Locate My Land",
    locate_page_subtitle: "Select your land location using the interactive map or manual dropdown filters to determine the assigned jurisdiction officer.",
    interactive_map: "Interactive Map Selection",
    manual_jurisdiction: "Manual Jurisdiction Selection (Fallback)",
    district: "District",
    taluk: "Taluk",
    village: "Village",
    assigned_officer_title: "Assigned Jurisdiction Officer",
    designation: "Designation:",
    official_records_title: "Official Land Records (Reference)",
    records_found: "Found",
    land_details_title: "Land Location & Extent Details",
    survey_parcel: "Survey Parcel",
    parcel_extent: "Parcel Extent",
    land_type: "Land Classification",
    village_capacity: "Village Total Capacity",
    select_jurisdiction: "Select Jurisdiction",

    // Raise Grievance Page
    raise_page_step: "Step 3: Submit Grievance & Supporting Documents",
    raise_page_title: "Raise a Land Record Grievance",
    raise_page_subtitle: "Provide details of your land record issue and upload supporting evidence documents for AI comparison.",
    select_land_record: "Select Reference Land Record",
    grievance_category: "Grievance Category",
    select_category: "-- Select Category --",
    cat_survey_mismatch: "Survey Number Mismatch",
    cat_extent_mismatch: "Extent / Area Mismatch",
    cat_owner_mismatch: "Owner Name Mismatch",
    cat_record_not_updated: "Record Not Updated / Mutation Delay",
    cat_other: "Other Discrepancy",
    issue_details: "Detailed Description of Grievance",
    upload_evidence: "Upload Evidence Document (Sale Deed / Patta / Survey Extract)",
    supported_formats: "PDF, PNG, JPG up to 10MB",
    submit_button: "Submit Grievance for AI Verification",
    submitting_button: "Processing Document & Generating AI Analysis...",

    // Citizen Dashboard & Case Detail
    citizen_dashboard_title: "My Land Grievances",
    citizen_dashboard_subtitle: "Track live status, SLA deadlines, and officer actions for your submitted land grievances.",
    case_code: "Case Code",
    category: "Category",
    status: "Status",
    priority: "Priority",
    sla_remaining: "SLA Remaining",
    action: "Action",
    view_details: "View Details",
    case_timeline: "Grievance Status Timeline",
    ai_analysis_findings: "AI Discrepancy Analysis & Findings",
    advisory_notice: "AI-assisted finding — Authorized revenue officer verification required for legal decision.",
    discrepancy_field: "Field",
    reference_val: "Reference Value",
    submitted_val: "Submitted Evidence Value",
    severity: "Severity",
    reason: "Discrepancy Reason",

    // Officer Dashboard & Verification Console
    officer_dashboard_title: "Officer Grievance Resolution Queue",
    officer_dashboard_subtitle: "Review assigned cases, inspect AI field comparisons, and execute verification actions.",
    total_assigned: "Total Assigned Cases",
    pending_review: "Pending Review",
    resolved_cases: "Resolved Cases",
    sla_breached: "SLA Breached",
    officer_console_title: "Revenue Officer Verification Console",
    decision_console: "Officer Verification & Decision Console",
    officer_remarks: "Officer Verification Remarks",
    btn_resolve: "Resolve Grievance",
    btn_request_docs: "Request Additional Documents",
    btn_escalate: "Escalate Case",

    // Admin Dashboard
    admin_dashboard_title: "Administration & System Governance",
    admin_dashboard_subtitle: "Platform governance, officer assignments, SLA breach tracking, and audit logging.",
    admin_assignment_title: "Admin Officer Assignment & Case Rerouting",
    target_jurisdiction: "Target Jurisdiction",
    assign_officer_btn: "Save Officer Assignment",
    active_officer_mappings: "Active Officer Mappings",

    // Footer
    core_principle_title: "Core Principle",
    core_principle_text: "\"AI ASSISTS THE INVESTIGATION; THE AUTHORIZED OFFICER MAKES THE DECISION.\" LANDLENS does not make legal ownership decisions automatically.",
    data_constraint_title: "Data Source Constraint",
    data_constraint_text: "Government land registries maintain final legal authority. LANDLENS operates as an intelligent civil verification layer.",
    copyright_text: "© 2026 LANDLENS - Citizen-Centric Land Record Verification & Grievance Resolution Platform"
  },

  ta: {
    // Top Banner & Navbar
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
    admin_overview: "நிர்வாக மேலோட்டம்",
    audit_logs: "தணிக்கைப் பதிவுகள்",
    sign_in: "உள்நுழைய",
    role_citizen: "குடிமகன்",
    role_officer: "அலுவலர்",
    role_admin: "நிர்வாகி",

    // Landing Page (app/page.tsx)
    hero_badge: "குடிமக்கள் நிலப் பதிவு சரிபார்ப்பு அடுக்கு",
    hero_title: "வெளிப்படையான நிலப் பதிவு சரிபார்ப்பு மற்றும் குறை தீர்ப்பு",
    hero_subtitle: "நிலப் புலங்களைக் கண்டறிந்து, AI உதவியுடன் பட்டா சான்றுகளை ஒப்பிட்டு, வருவாய் அலுவலர்கள் மூலம் தீர்வு காணுங்கள்.",
    btn_locate_land: "என் நிலம் மற்றும் அதிகார வரம்பைக் கண்டறியவும்",
    btn_raise_grievance: "குறை மனு அளிக்கவும்",
    how_it_works: "LANDLENS எவ்வாறு செயல்படுகிறது",
    step1_title: "1. கண்டறிந்து சரிபார்க்கவும்",
    step1_desc: "மாவட்டம், வட்டம், கிராமம் அல்லது புல எண் மூலம் தேடி ஒதுக்கீடு செய்யப்பட்ட வருவாய் அலுவலர்களைக் கண்டறியவும்.",
    step2_title: "2. மனு அளித்து சான்று பதிவேற்றவும்",
    step2_desc: "பரப்பளவு, புல எண் அல்லது உரிமையாளர் பெயர் வேறுபாடுகளைச் சுட்டிக்காட்ட பத்திரச் சான்றைப் பதிவேற்றவும்.",
    step3_title: "3. AI வேறுபாட்டு பகுப்பாய்வு",
    step3_desc: "ஜெமினி AI ஆவண உரையைப் பிரித்தெடுத்து அரசுப் பதிவுகளுடன் ஒப்பிட்டு வழிகாட்டும் அறிக்கை தயார் செய்கிறது.",
    step4_title: "4. அலுவலர் தீர்வு",
    step4_desc: "வட்டட்சியர்கள் அறிக்கையை மதிப்பாய்வு செய்து, சான்றுகளைக் கேட்டு, மனுக்களைத் தீர்க்கிறார்கள்.",
    primary_case_study: "முதன்மை சரிபார்ப்பு வழக்கு ஆய்வு",
    case_gl1024_desc: "குடிமகன் கே. குமார் அம்பத்தூர் காவிரி கிராமத்தில் பட்டா PT-10245 வைத்துள்ளார்.",
    inspect_case_gl1024: "வழக்கு GL-1024 ஐப் பார்வையிடவும்",
    gov_ref_record: "அரசு குறிப்புப் பதிவு:",
    citizen_evidence_doc: "குடிமகன் பதிவேற்றிய சான்று (கிரயப் பத்திரம்):",
    patta_no: "பட்டா எண்:",
    survey_no: "புல எண் (Survey No):",
    owner_name: "உரிமையாளர் பெயர்:",
    doc_no: "ஆவண எண்:",

    // Locate Page & Map
    locate_page_step: "படி 2: அதிகார வரம்பு மற்றும் நிலத் தேடல்",
    locate_page_title: "என் நிலத்தைக் கண்டறியவும்",
    locate_page_subtitle: "வரைபடம் அல்லது மாவட்டப் பட்டியலைப் பயன்படுத்தி உங்கள் நிலத்தின் அதிகாரப்பூர்வ அலுவலரைக் கண்டறியவும்.",
    interactive_map: "இணைப்பு வரைபடத் தேர்வு",
    manual_jurisdiction: "கைமுறை அதிகார வரம்புத் தேர்வு",
    district: "மாவட்டம்",
    taluk: "வட்டம் (Taluk)",
    village: "கிராமம்",
    assigned_officer_title: "ஒதுக்கப்பட்ட அதிகார வரம்பு அலுவலர்",
    designation: "பதவி பெயர்:",
    official_records_title: "அதிகாரப்பூர்வ நிலப் பதிவுகள் (குறிப்பு)",
    records_found: "கண்டறியப்பட்டது",
    land_details_title: "நில இருப்பிடம் மற்றும் பரப்பு விவரங்கள்",
    survey_parcel: "புல எண் (Survey No)",
    parcel_extent: "நிலப் பரப்பு (Acres)",
    land_type: "நில வகைப்பாடு",
    village_capacity: "கிராம மொத்த பரப்பு",
    select_jurisdiction: "அதிகார வரம்பைத் தேர்ந்தெடுக்கவும்",

    // Raise Grievance Page
    raise_page_step: "படி 3: குறை மனு மற்றும் சான்றுகளைச் சமர்ப்பிக்கவும்",
    raise_page_title: "நிலப் பதிவு குறை மனு அளிக்கவும்",
    raise_page_subtitle: "உங்கள் நிலப் பதிவு பிரச்சனையின் వివరங்களை வழங்கி, AI ஒப்பீட்டிற்காக சான்றுகளைப் பதிவேற்றவும்.",
    select_land_record: "குறிப்பு நிலப் பதிவைத் தேர்ந்தெடுக்கவும்",
    grievance_category: "குறை வகை",
    select_category: "-- வகையைத் தேர்ந்தெடுக்கவும் --",
    cat_survey_mismatch: "புல எண் (Survey No) வேறுபாடு",
    cat_extent_mismatch: "பரப்பளவு (Extent) வேறுபாடு",
    cat_owner_mismatch: "உரிமையாளர் பெயர் வேறுபாடு",
    cat_record_not_updated: "பதிவு புதுப்பிக்கப்படவில்லை / பெயர் மாற்றத் தாமதம்",
    cat_other: "இதர வேறுபாடு",
    issue_details: "குறை மனுவின் விரிவான விளக்கம்",
    upload_evidence: "சான்று ஆவணத்தைப் பதிவேற்றவும் (பத்திரம் / பட்டா / வரைபடம்)",
    supported_formats: "PDF, PNG, JPG (அதிகபட்சம் 10MB)",
    submit_button: "AI சரிபார்ப்பிற்கு சமர்ப்பிக்கவும்",
    submitting_button: "ஆவணம் பகுப்பாய்வு செய்யப்படுகிறது...",

    // Citizen Dashboard & Case Detail
    citizen_dashboard_title: "என் நிலக் குறை மனுக்கள்",
    citizen_dashboard_subtitle: "உங்கள் மனுக்களின் நேரலை நிலை, காலக்கெடு மற்றும் அலுவலர் நடவடிக்கைகளைக் கண்காணிக்கவும்.",
    case_code: "வழக்குக் குறியீடு",
    category: "வகை",
    status: "நிலை",
    priority: "முன்னுரிமை",
    sla_remaining: "மீதமுள்ள நேரம்",
    action: "நடவடிக்கை",
    view_details: "விவரங்களைப் பார்க்க",
    case_timeline: "மனு நிலை காலவரிசை",
    ai_analysis_findings: "AI வேறுபாட்டு பகுப்பாய்வு மற்றும் கண்டுபிடிப்புகள்",
    advisory_notice: "AI வழிகாட்டுதல் கண்டுபிடிப்பு — அதிகாரப்பூர்வ வருவாய் அலுவலர் சரிபார்ப்பு அவசியம்.",
    discrepancy_field: "புலம் (Field)",
    reference_val: "அரசு குறிப்பு மதிப்பு",
    submitted_val: "சமர்ப்பிக்கப்பட்ட சான்று மதிப்பு",
    severity: "தீவிரம்",
    reason: "வேறுபாட்டிற்கான காரணம்",

    // Officer Dashboard & Verification Console
    officer_dashboard_title: "வருவாய் அலுவலர் குறை தீர்க்கும் வரிசை",
    officer_dashboard_subtitle: "ஒதுக்கப்பட்ட வழக்குகளை மதிப்பாய்வு செய்து AI கண்டுபிடிப்புகளைச் சரிபார்க்கவும்.",
    total_assigned: "மொத்த வழக்குகள்",
    pending_review: "நிலுவையில் உள்ளவை",
    resolved_cases: "தீர்க்கப்பட்டவை",
    sla_breached: "காலக்கெடு மீறப்பட்டவை",
    officer_console_title: "வருவாய் அலுவலர் சரிபார்ப்பு முனையம்",
    decision_console: "அலுவலர் சரிபார்ப்பு மற்றும் முடிவு முனையம்",
    officer_remarks: "அலுவலர் சரிபார்ப்புக் குறிப்புகள்",
    btn_resolve: "மனுவைத் தீர்க்கவும்",
    btn_request_docs: "கூடுதல் சான்றுகளைக் கேட்கவும்",
    btn_escalate: "மேலதிகாரிக்கு அனுப்பவும்",

    // Admin Dashboard
    admin_dashboard_title: "நிர்வாகம் மற்றும் அமைப்பு மேலாண்மை",
    admin_dashboard_subtitle: "தள மேலாண்மை, அலுவலர் ஒதுக்கீடு, SLA கண்காணிப்பு மற்றும் தணிக்கைப் பதிவுகள்.",
    admin_assignment_title: "அலுவலர் ஒதுக்கீடு மற்றும் வழக்கு மாற்றல்",
    target_jurisdiction: "இலக்கு அதிகார வரம்பு",
    assign_officer_btn: "அலுவலர் ஒதுக்கீட்டைச் சேமிக்கவும்",
    active_officer_mappings: "செயலில் உள்ள அலுவலர் ஒதுக்கீடுகள்",

    // Footer
    core_principle_title: "முதன்மைத் தத்துவம்",
    core_principle_text: "\"AI விசாரணைக்கு உதவுகிறது; அதிகாரப்பூர்வ அலுவலரே முடிவெடுக்கிறார்.\" LANDLENS தானாக சட்ட உரிமையை தீர்மானிக்காது.",
    data_constraint_title: "தரவு மூல வரம்பு",
    data_constraint_text: "அரசு நிலப் பதிவேடுகளே இறுதியானவை. LANDLENS குடிமக்கள் பயன்பாட்டிற்கான சரிபார்ப்புத் தளமாகச் செயல்படுகிறது.",
    copyright_text: "© 2026 LANDLENS - குடிமக்கள் நிலப் பதிவு சரிபார்ப்பு மற்றும் குறை தீர்க்கும் தளம்"
  },

  hi: {
    // Top Banner & Navbar
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

    // Landing Page (app/page.tsx)
    hero_badge: "नागरिक भू-अभिलेख सत्यापन परत",
    hero_title: "पारदर्शी भू-अभिलेख सत्यापन एवं विसंगति निवारण",
    hero_subtitle: "अपनी भूमि पार्सल खोजें, AI सहायता से अभिलेखों की तुलना करें और राजस्व अधिकारियों द्वारा समाधान प्राप्त करें।",
    btn_locate_land: "मेरी भूमि और क्षेत्राधिकार खोजें",
    btn_raise_grievance: "शिकायत दर्ज करें",
    how_it_works: "LANDLENS कैसे काम करता है",
    step1_title: "1. खोजें और सत्यापित करें",
    step1_desc: "जिला, तहसील, गांव या खसरा संख्या द्वारा खोजकर नामित राजस्व अधिकारी का पता लगाएं।",
    step2_title: "2. शिकायत दर्ज करें और साक्ष्य अपलोड करें",
    step2_desc: "क्षेत्रफल, सर्वे नंबर या स्वामित्व विसंगतियों को चिह्नित करने के लिए अपना बैनामा दस्तावेज़ अपलोड करें।",
    step3_title: "3. AI विसंगति विश्लेषण",
    step3_desc: "जेमिनी AI दस्तावेज़ पाठ निकालकर सरकारी रिकॉर्ड से तुलना करता है और सलाहकारी निष्कर्ष उत्पन्न करता है।",
    step4_title: "4. अधिकारी निवारण",
    step4_desc: "तहसीलदार निष्कर्षों की समीक्षा करते हैं, अतिरिक्त साक्ष्य मांगते हैं और शिकायतों का समाधान करते हैं।",
    primary_case_study: "प्रमुख सत्यापन मामला अध्ययन",
    case_gl1024_desc: "नागरिक के. कुमार के पास अंबात्तूर कावेरी गांव में पट्टा PT-10245 है।",
    inspect_case_gl1024: "मामला GL-1024 का निरीक्षण करें",
    gov_ref_record: "सरकारी संदर्भ रिकॉर्ड:",
    citizen_evidence_doc: "नागरिक द्वारा अपलोड साक्ष्य (बैनामा):",
    patta_no: "पट्टा संख्या:",
    survey_no: "खसरा / सर्वे नंबर:",
    owner_name: "मालिक का नाम:",
    doc_no: "दस्तावेज़ संख्या:",

    // Locate Page & Map
    locate_page_step: "चरण 2: क्षेत्राधिकार और भूमि खोज",
    locate_page_title: "मेरी भूमि खोजें",
    locate_page_subtitle: "मानचित्र या जिला फ़िल्टर का उपयोग करके अपनी भूमि के नामित राजस्व अधिकारी का पता लगाएं।",
    interactive_map: "इंटरएक्टिव मानचित्र चयन",
    manual_jurisdiction: "मैनुअल क्षेत्राधिकार चयन",
    district: "जिला",
    taluk: "तहसील / तालुका",
    village: "गांव",
    assigned_officer_title: "नामित क्षेत्राधिकारी अधिकारी",
    designation: "पदनाम:",
    official_records_title: "आधिकारिक भू-अभिलेख (संदर्भ)",
    records_found: "पाए गए",
    land_details_title: "भूमि स्थान एवं क्षेत्रफल विवरण",
    survey_parcel: "खसरा / सर्वे नंबर",
    parcel_extent: "भूमि क्षेत्रफल (Acres)",
    land_type: "भूमि वर्गीकरण",
    village_capacity: "गांव की कुल क्षमता",
    select_jurisdiction: "क्षेत्राधिकार चुनें",

    // Raise Grievance Page
    raise_page_step: "चरण 3: शिकायत और सहायक दस्तावेज़ जमा करें",
    raise_page_title: "भू-अभिलेख शिकायत दर्ज करें",
    raise_page_subtitle: "अपनी भूमि समस्या का विवरण दें और AI तुलना के लिए साक्ष्य दस्तावेज़ अपलोड करें।",
    select_land_record: "संदर्भ भू-अभिलेख चुनें",
    grievance_category: "शिकायत श्रेणी",
    select_category: "-- श्रेणी चुनें --",
    cat_survey_mismatch: "खसरा / सर्वे नंबर विसंगति",
    cat_extent_mismatch: "क्षेत्रफल (Extent) विसंगति",
    cat_owner_mismatch: "मालिक के नाम में विसंगति",
    cat_record_not_updated: "रिकॉर्ड अद्यतन नहीं / नामांतरण में देरी",
    cat_other: "अन्य विसंगति",
    issue_details: "शिकायत का विस्तृत विवरण",
    upload_evidence: "साक्ष्य दस्तावेज़ अपलोड करें (बैनामा / पट्टा / नक्शा)",
    supported_formats: "PDF, PNG, JPG (अधिकतम 10MB)",
    submit_button: "AI सत्यापन के लिए जमा करें",
    submitting_button: "दस्तावेज़ का विश्लेषण किया जा रहा है...",

    // Citizen Dashboard & Case Detail
    citizen_dashboard_title: "मेरी भूमि शिकायतें",
    citizen_dashboard_subtitle: "अपनी शिकायतों की स्थिति, समय सीमा और अधिकारी की कार्रवाई को ट्रैक करें।",
    case_code: "मामला कोड",
    category: "श्रेणी",
    status: "स्थिति",
    priority: "प्राथमिकता",
    sla_remaining: "शेष समय",
    action: "कार्रवाई",
    view_details: "विवरण देखें",
    case_timeline: "मामला स्थिति समयरेखा",
    ai_analysis_findings: "AI विसंगति विश्लेषण और निष्कर्ष",
    advisory_notice: "AI सलाहकारी निष्कर्ष — कानूनी निर्णय के लिए अधिकृत राजस्व अधिकारी का सत्यापन आवश्यक है।",
    discrepancy_field: "क्षेत्र (Field)",
    reference_val: "सरकारी संदर्भ मान",
    submitted_val: "जमा साक्ष्य मान",
    severity: "गंभीरता",
    reason: "विसंगति का कारण",

    // Officer Dashboard & Verification Console
    officer_dashboard_title: "राजस्व अधिकारी शिकायत निवारण कतार",
    officer_dashboard_subtitle: "आवंटित मामलों की समीक्षा करें और AI निष्कर्षों का सत्यापन करें।",
    total_assigned: "कुल आवंटित मामले",
    pending_review: "समीक्षा हेतु लंबित",
    resolved_cases: "निस्तारित मामले",
    sla_breached: "समय सीमा का उल्लंघन",
    officer_console_title: "राजस्व अधिकारी सत्यापन कंसोल",
    decision_console: "अधिकारी सत्यापन एवं निर्णय कंसोल",
    officer_remarks: "अधिकारी सत्यापन टिप्पणी",
    btn_resolve: "शिकायत का निस्तारण करें",
    btn_request_docs: "अतिरिक्त साक्ष्य का अनुरोध करें",
    btn_escalate: "उच्चाधिकारी को प्रेषित करें",

    // Admin Dashboard
    admin_dashboard_title: "प्रशासन एवं प्रणाली शासन",
    admin_dashboard_subtitle: "प्लेटफ़ॉर्म प्रशासन, अधिकारी आवंटन, SLA ट्रैकिंग और ऑडिट लॉग्स।",
    admin_assignment_title: "अधिकारी आवंटन एवं मामला पुनर्निर्देशन",
    target_jurisdiction: "लक्ष्य क्षेत्राधिकार",
    assign_officer_btn: "अधिकारी आवंटन सहेजें",
    active_officer_mappings: "सक्रिय अधिकारी आवंटन",

    // Footer
    core_principle_title: "मूल सिद्धांत",
    core_principle_text: "\"AI जांच में सहायता करता है; अधिकृत अधिकारी निर्णय लेता है।\" LANDLENS स्वचालित रूप से मालिकाना हक तय नहीं करता है।",
    data_constraint_title: "डेटा स्रोत सीमा",
    data_constraint_text: "सरकारी भू-अभिलेख ही अंतिम कानूनी अधिकार रखते हैं। LANDLENS नागरिक सत्यापन परत के रूप में कार्य करता है।",
    copyright_text: "© 2026 LANDLENS - नागरिक भू-अभिलेख सत्यापन एवं शिकायत निवारण मंच"
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
