// Datos globales del sitio — evita hardcodear strings de marca en cada
// componente (ARCHITECTURE.md §14). Ver docs/VOICE.md §4 para el vocabulario.
export const site = {
  name: "IEP — Inconsciente en Pantuflas",
  shortName: "IEP",
  /** Wordmark del logo, siempre en minúscula (VOICE.md §4). */
  wordmark: "iep",
  tagline: "Psicoanálisis y cultura, sin la solemnidad de siempre.",
  // TODO(cliente): confirmar handle real de Instagram.
  instagramUrl: "https://instagram.com/inconscienteenpantuflas",
  // TODO(cliente): número real de WhatsApp en formato E.164 sin "+" (ej. "5491122334455").
  whatsappPhone: "",
} as const;
