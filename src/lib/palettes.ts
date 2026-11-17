export interface ColorPreset {
  title: string;
  blue: string;
  blue2: string;
  ink: string;
  text: string;
  muted: string;
  paper: string;
  cta?: string;
  ctaHover?: string;
}

export const colorPresets: ColorPreset[] = [
  { title: 'Gold (default)', blue: '#b8860b', blue2: '#e8b84a', ink: '#071018', text: '#20282d', muted: '#52656f', paper: '#ffffff', cta: '#7a2e1f', ctaHover: '#8f3b29' },
  { title: 'Ocean Blue', blue: '#0a8fbd', blue2: '#50bddf', ink: '#071018', text: '#20282d', muted: '#52656f', paper: '#ffffff' },
  { title: 'Indigo', blue: '#4338ca', blue2: '#818cf8', ink: '#0e1029', text: '#24263f', muted: '#52656f', paper: '#ffffff' },
  { title: 'Violet', blue: '#7c3aed', blue2: '#a78bfa', ink: '#150d29', text: '#2b2140', muted: '#52656f', paper: '#ffffff' },
  { title: 'Teal', blue: '#0f766e', blue2: '#2dd4bf', ink: '#06201d', text: '#1f3330', muted: '#52656f', paper: '#ffffff' },
  { title: 'Emerald', blue: '#047857', blue2: '#34d399', ink: '#06200f', text: '#1f3327', muted: '#52656f', paper: '#ffffff' },
  { title: 'Slate', blue: '#334155', blue2: '#64748b', ink: '#0f1620', text: '#262e38', muted: '#52656f', paper: '#ffffff' },
  { title: 'Ruby', blue: '#9f1239', blue2: '#fb7185', ink: '#200608', text: '#33201f', muted: '#52656f', paper: '#ffffff' },
  { title: 'Charcoal Mono', blue: '#1f2937', blue2: '#6b7280', ink: '#0a0a0c', text: '#232326', muted: '#52656f', paper: '#ffffff' },
  { title: 'Red', blue: '#dc2626', blue2: '#f87171', ink: '#450a0a', text: '#7f1d1d', muted: '#52656f', paper: '#ffffff' },
  { title: 'Orange', blue: '#ea580c', blue2: '#fb923c', ink: '#431407', text: '#7c2d12', muted: '#52656f', paper: '#ffffff' },
  { title: 'Amber', blue: '#d97706', blue2: '#fbbf24', ink: '#451a03', text: '#78350f', muted: '#52656f', paper: '#ffffff' },
  { title: 'Yellow', blue: '#ca8a04', blue2: '#facc15', ink: '#422006', text: '#713f12', muted: '#52656f', paper: '#ffffff' },
  { title: 'Lime', blue: '#65a30d', blue2: '#a3e635', ink: '#1a2e05', text: '#365314', muted: '#52656f', paper: '#ffffff' },
  { title: 'Green', blue: '#16a34a', blue2: '#4ade80', ink: '#052e16', text: '#14532d', muted: '#52656f', paper: '#ffffff' },
  { title: 'Cyan', blue: '#0891b2', blue2: '#22d3ee', ink: '#083344', text: '#164e63', muted: '#52656f', paper: '#ffffff' },
  { title: 'Sky', blue: '#0284c7', blue2: '#38bdf8', ink: '#082f49', text: '#0c4a6e', muted: '#52656f', paper: '#ffffff' },
  { title: 'Blue', blue: '#2563eb', blue2: '#60a5fa', ink: '#172554', text: '#1e3a8a', muted: '#52656f', paper: '#ffffff' },
  { title: 'Purple', blue: '#9333ea', blue2: '#c084fc', ink: '#3b0764', text: '#581c87', muted: '#52656f', paper: '#ffffff' },
  { title: 'Fuchsia', blue: '#c026d3', blue2: '#e879f9', ink: '#4a044e', text: '#701a75', muted: '#52656f', paper: '#ffffff' },
  { title: 'Pink', blue: '#db2777', blue2: '#f472b6', ink: '#500724', text: '#831843', muted: '#52656f', paper: '#ffffff' },
  { title: 'Zinc', blue: '#52525b', blue2: '#a1a1aa', ink: '#09090b', text: '#18181b', muted: '#52656f', paper: '#ffffff' },
  { title: 'Neutral', blue: '#525252', blue2: '#a3a3a3', ink: '#0a0a0a', text: '#171717', muted: '#52656f', paper: '#ffffff' },
  { title: 'Stone', blue: '#57534e', blue2: '#a8a29e', ink: '#0c0a09', text: '#1c1917', muted: '#52656f', paper: '#ffffff' },
  { title: 'Crimson', blue: '#dd2344', blue2: '#ef7e91', ink: '#2b0b11', text: '#7a1f2e', muted: '#52656f', paper: '#ffffff' },
  { title: 'Indigo Dusk', blue: '#392f5a', blue2: '#7969b0', ink: '#151122', text: '#2e244c', muted: '#52656f', paper: '#ffffff' },
  { title: 'Mauve', blue: '#5c415d', blue2: '#a681a7', ink: '#211721', text: '#473248', muted: '#52656f', paper: '#ffffff' },
  { title: 'Royal Purple', blue: '#592e83', blue2: '#9e70cd', ink: '#1f102d', text: '#422262', muted: '#52656f', paper: '#ffffff' },
];

export interface CardColorPreset {
  title: string;
  modernize: string;
  build: string;
  ai: string;
}

export const cardColorPresets: CardColorPreset[] = [
  { title: 'White', modernize: '#ffffff', build: '#ffffff', ai: '#ffffff' },
  { title: 'Ocean', modernize: '#0a3d5c', build: '#0f3d33', ai: '#3d1f6b' },
  { title: 'Pastel', modernize: '#eaf3fc', build: '#eaf7ef', ai: '#efeafc' },
  { title: 'Deep', modernize: '#062a38', build: '#04231b', ai: '#1c1140' },
  { title: 'Sunset', modernize: '#7c2d12', build: '#78350f', ai: '#500724' },
  { title: 'Slate', modernize: '#1f2937', build: '#1f2937', ai: '#1f2937' },
];
