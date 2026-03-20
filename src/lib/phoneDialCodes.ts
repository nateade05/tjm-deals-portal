/**
 * Common calling codes for the lead form (dropdown + national number).
 * UK and Singapore first; rest alphabetical by label.
 */
const PRIORITY: { dial: string; label: string }[] = [
  { dial: '+44', label: 'United Kingdom (+44)' },
  { dial: '+65', label: 'Singapore (+65)' },
];

const OTHER: { dial: string; label: string }[] = [
  { dial: '+93', label: 'Afghanistan (+93)' },
  { dial: '+355', label: 'Albania (+355)' },
  { dial: '+213', label: 'Algeria (+213)' },
  { dial: '+376', label: 'Andorra (+376)' },
  { dial: '+244', label: 'Angola (+244)' },
  { dial: '+54', label: 'Argentina (+54)' },
  { dial: '+374', label: 'Armenia (+374)' },
  { dial: '+61', label: 'Australia (+61)' },
  { dial: '+43', label: 'Austria (+43)' },
  { dial: '+994', label: 'Azerbaijan (+994)' },
  { dial: '+973', label: 'Bahrain (+973)' },
  { dial: '+880', label: 'Bangladesh (+880)' },
  { dial: '+375', label: 'Belarus (+375)' },
  { dial: '+32', label: 'Belgium (+32)' },
  { dial: '+501', label: 'Belize (+501)' },
  { dial: '+229', label: 'Benin (+229)' },
  { dial: '+591', label: 'Bolivia (+591)' },
  { dial: '+387', label: 'Bosnia & Herzegovina (+387)' },
  { dial: '+267', label: 'Botswana (+267)' },
  { dial: '+55', label: 'Brazil (+55)' },
  { dial: '+673', label: 'Brunei (+673)' },
  { dial: '+359', label: 'Bulgaria (+359)' },
  { dial: '+855', label: 'Cambodia (+855)' },
  { dial: '+237', label: 'Cameroon (+237)' },
  { dial: '+1', label: 'United States & Canada (+1)' },
  { dial: '+56', label: 'Chile (+56)' },
  { dial: '+86', label: 'China (+86)' },
  { dial: '+57', label: 'Colombia (+57)' },
  { dial: '+506', label: 'Costa Rica (+506)' },
  { dial: '+385', label: 'Croatia (+385)' },
  { dial: '+357', label: 'Cyprus (+357)' },
  { dial: '+420', label: 'Czech Republic (+420)' },
  { dial: '+45', label: 'Denmark (+45)' },
  { dial: '+593', label: 'Ecuador (+593)' },
  { dial: '+20', label: 'Egypt (+20)' },
  { dial: '+372', label: 'Estonia (+372)' },
  { dial: '+251', label: 'Ethiopia (+251)' },
  { dial: '+358', label: 'Finland (+358)' },
  { dial: '+33', label: 'France (+33)' },
  { dial: '+49', label: 'Germany (+49)' },
  { dial: '+30', label: 'Greece (+30)' },
  { dial: '+852', label: 'Hong Kong (+852)' },
  { dial: '+36', label: 'Hungary (+36)' },
  { dial: '+354', label: 'Iceland (+354)' },
  { dial: '+91', label: 'India (+91)' },
  { dial: '+62', label: 'Indonesia (+62)' },
  { dial: '+98', label: 'Iran (+98)' },
  { dial: '+964', label: 'Iraq (+964)' },
  { dial: '+353', label: 'Ireland (+353)' },
  { dial: '+972', label: 'Israel (+972)' },
  { dial: '+39', label: 'Italy (+39)' },
  { dial: '+81', label: 'Japan (+81)' },
  { dial: '+962', label: 'Jordan (+962)' },
  { dial: '+254', label: 'Kenya (+254)' },
  { dial: '+82', label: 'South Korea (+82)' },
  { dial: '+965', label: 'Kuwait (+965)' },
  { dial: '+856', label: 'Laos (+856)' },
  { dial: '+371', label: 'Latvia (+371)' },
  { dial: '+961', label: 'Lebanon (+961)' },
  { dial: '+218', label: 'Libya (+218)' },
  { dial: '+370', label: 'Lithuania (+370)' },
  { dial: '+352', label: 'Luxembourg (+352)' },
  { dial: '+853', label: 'Macau (+853)' },
  { dial: '+60', label: 'Malaysia (+60)' },
  { dial: '+356', label: 'Malta (+356)' },
  { dial: '+52', label: 'Mexico (+52)' },
  { dial: '+373', label: 'Moldova (+373)' },
  { dial: '+377', label: 'Monaco (+377)' },
  { dial: '+976', label: 'Mongolia (+976)' },
  { dial: '+382', label: 'Montenegro (+382)' },
  { dial: '+212', label: 'Morocco (+212)' },
  { dial: '+95', label: 'Myanmar (+95)' },
  { dial: '+977', label: 'Nepal (+977)' },
  { dial: '+31', label: 'Netherlands (+31)' },
  { dial: '+64', label: 'New Zealand (+64)' },
  { dial: '+234', label: 'Nigeria (+234)' },
  { dial: '+47', label: 'Norway (+47)' },
  { dial: '+968', label: 'Oman (+968)' },
  { dial: '+92', label: 'Pakistan (+92)' },
  { dial: '+507', label: 'Panama (+507)' },
  { dial: '+595', label: 'Paraguay (+595)' },
  { dial: '+51', label: 'Peru (+51)' },
  { dial: '+63', label: 'Philippines (+63)' },
  { dial: '+48', label: 'Poland (+48)' },
  { dial: '+351', label: 'Portugal (+351)' },
  { dial: '+974', label: 'Qatar (+974)' },
  { dial: '+40', label: 'Romania (+40)' },
  { dial: '+7', label: 'Russia & Kazakhstan (+7)' },
  { dial: '+966', label: 'Saudi Arabia (+966)' },
  { dial: '+381', label: 'Serbia (+381)' },
  { dial: '+248', label: 'Seychelles (+248)' },
  { dial: '+27', label: 'South Africa (+27)' },
  { dial: '+34', label: 'Spain (+34)' },
  { dial: '+94', label: 'Sri Lanka (+94)' },
  { dial: '+46', label: 'Sweden (+46)' },
  { dial: '+41', label: 'Switzerland (+41)' },
  { dial: '+886', label: 'Taiwan (+886)' },
  { dial: '+66', label: 'Thailand (+66)' },
  { dial: '+90', label: 'Türkiye (+90)' },
  { dial: '+971', label: 'United Arab Emirates (+971)' },
  { dial: '+598', label: 'Uruguay (+598)' },
  { dial: '+998', label: 'Uzbekistan (+998)' },
  { dial: '+58', label: 'Venezuela (+58)' },
  { dial: '+84', label: 'Vietnam (+84)' },
  { dial: '+967', label: 'Yemen (+967)' },
  { dial: '+260', label: 'Zambia (+260)' },
  { dial: '+263', label: 'Zimbabwe (+263)' },
].sort((a, b) => a.label.localeCompare(b.label, 'en'));

/** Dedupe by dial (keep first label after sort — Canada/US both +1: one entry). */
function dedupeByDial(entries: { dial: string; label: string }[]): { dial: string; label: string }[] {
  const seen = new Set<string>();
  const out: { dial: string; label: string }[] = [];
  for (const e of entries) {
    if (seen.has(e.dial)) continue;
    seen.add(e.dial);
    out.push(e);
  }
  return out;
}

const otherDeduped = dedupeByDial(OTHER);

export const PHONE_DIAL_PRIORITY = PRIORITY;
export const PHONE_DIAL_OTHER = otherDeduped;

export const DEFAULT_PHONE_DIAL = '+44';
