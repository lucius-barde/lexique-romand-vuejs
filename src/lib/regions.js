// Régions disponibles pour le profil utilisateur et les avis sur les termes.
export const REGIONS = [
  { code: 'GE', label: 'Genève (GE)' },
  { code: 'VD', label: 'Vaud (VD)' },
  { code: 'VS', label: 'Valais (VS)' },
  { code: 'FR', label: 'Fribourg (FR)' },
  { code: 'BE', label: 'Jura bernois (BE)' },
  { code: 'JU', label: 'Jura (JU)' },
  { code: 'NE', label: 'Neuchâtel (NE)' },
  { code: '74', label: 'Haute-Savoie (74)' },
  { code: '73', label: 'Savoie (73)' },
]

export function regionLabel(code) {
  return REGIONS.find((r) => r.code === code)?.label ?? code
}
