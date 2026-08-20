import re
from typing import Dict, Any, List, Tuple

def normalize_string(text: str) -> str:
    """Normalizes whitespace, casing, and punctuation for deterministic field comparison."""
    if not text:
        return ""
    text = text.upper().strip()
    text = re.sub(r'[\s\.\,\-_/]+', '', text)
    return text

def normalize_owner_name(name: str) -> str:
    """Normalizes owner names by stripping initials spacing (e.g., 'K KUMAR' -> 'KKUMAR')."""
    if not name:
        return ""
    name = name.upper().strip()
    return re.sub(r'[^A-Z0-9]', '', name)

class DiscrepancyEngine:
    def compare_fields(
        self,
        reference: Dict[str, Any],
        extracted: Dict[str, Any]
    ) -> Tuple[List[Dict[str, Any]], str]:
        """
        Executes deterministic rule-based comparison between reference land record and extracted document fields.
        Returns (discrepancies, summary_text).
        """
        discrepancies = []

        # 1. Survey Number Comparison
        ref_survey = str(reference.get("survey_number", "")).strip()
        doc_survey = str(extracted.get("survey_number", "")).strip()
        if doc_survey and normalize_string(ref_survey) != normalize_string(doc_survey):
            discrepancies.append({
                "field": "Survey Number",
                "reference_value": ref_survey,
                "submitted_value": doc_survey,
                "severity": "HIGH",
                "reason": "The survey identifier in the submitted evidence differs from the reference record."
            })

        # 2. Owner Name Comparison
        ref_owner = str(reference.get("owner_name", "")).strip()
        doc_owner = str(extracted.get("owner_name", "")).strip()
        if doc_owner and normalize_owner_name(ref_owner) != normalize_owner_name(doc_owner):
            # Check for partial name match vs complete mismatch
            severity = "HIGH" if len(normalize_owner_name(doc_owner)) > 3 else "MEDIUM"
            discrepancies.append({
                "field": "Owner Name",
                "reference_value": ref_owner,
                "submitted_value": doc_owner,
                "severity": severity,
                "reason": "The owner name stated in the submitted document does not match the reference patta holder."
            })

        # 3. Extent / Area Comparison
        try:
            ref_extent = float(reference.get("extent_acres", 0.0))
            doc_extent_str = str(extracted.get("extent", "")).strip()
            doc_extent_match = re.search(r"(\d+(\.\d+)?)", doc_extent_str)
            if doc_extent_match:
                doc_extent = float(doc_extent_match.group(1))
                if abs(ref_extent - doc_extent) > 0.01:
                    discrepancies.append({
                        "field": "Extent / Area",
                        "reference_value": f"{ref_extent} Acres",
                        "submitted_value": f"{doc_extent} Acres",
                        "severity": "MEDIUM",
                        "reason": "The specified land extent differs between the reference record and submitted document."
                    })
        except Exception:
            pass

        # 4. Patta Number Comparison
        ref_patta = str(reference.get("patta_number", "")).strip()
        doc_patta = str(extracted.get("patta_number", "")).strip()
        if doc_patta and normalize_string(ref_patta) != normalize_string(doc_patta):
            discrepancies.append({
                "field": "Patta Number",
                "reference_value": ref_patta,
                "submitted_value": doc_patta,
                "severity": "MEDIUM",
                "reason": "Patta reference numbers differ between record database and uploaded document."
            })

        # 5. Village / Location Comparison
        ref_village = str(reference.get("village", "")).strip()
        doc_village = str(extracted.get("village", "")).strip()
        if doc_village and normalize_string(ref_village) != normalize_string(doc_village):
            discrepancies.append({
                "field": "Village",
                "reference_value": ref_village,
                "submitted_value": doc_village,
                "severity": "LOW",
                "reason": "Village name spelling variance detected between reference record and submitted document."
            })

        # Generate Human Summary
        if not discrepancies:
            summary = "No immediate structural discrepancies detected between the reference land record and submitted document fields."
        else:
            high_count = sum(1 for d in discrepancies if d["severity"] == "HIGH")
            med_count = sum(1 for d in discrepancies if d["severity"] == "MEDIUM")
            fields_str = ", ".join(d["field"] for d in discrepancies)
            summary = f"Detected {len(discrepancies)} potential discrepancy(ies) across: {fields_str}. " \
                      f"Severity breakdown: {high_count} High, {med_count} Medium. Advisory officer verification recommended."

        return discrepancies, summary

discrepancy_engine = DiscrepancyEngine()
