// Datos globales del sitio — evita hardcodear strings de marca en cada
// componente (ARCHITECTURE.md §14). Ver docs/VOICE.md §4 para el vocabulario.
export const site = {
  name: "IEP — Inconsciente en Pantuflas",
  shortName: "IEP",
  /** Wordmark del logo, siempre en minúscula (VOICE.md §4). */
  wordmark: "iep",
  tagline: "Espacio de interés en Cultura, Salud y Educación",
  founders: "Iñaki Barés • Manu Calandra",
  decree: "Decreto N.° 63.036",
  // Handle real, visto en el flyer y en el feed provistos ("@iccenpantuflas").
  instagramUrl: "https://instagram.com/iccenpantuflas",
  instagramHandle: "@iccenpantuflas",
  // Número real de WhatsApp de Pantu, en formato E.164 sin "+" (+54 9 3417 46-7464).
  whatsappPhone: "5493417467464",
} as const;
