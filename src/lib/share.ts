// Unified sharing / WhatsApp copy for the Falah endowment.
// Keep this tone: quiet, spiritual, an invitation to a daily journey with the
// Qur'an — never marketing language. Any new WhatsApp link in the app should
// go through the helpers below so the opening line stays consistent.

export const SHARE_URL = "https://falah.me";
export const WHATSAPP_CONTACT = "971504105804";

// Invitation to join the daily journey — used for share-with-a-friend links.
export const WHATSAPP_INVITE_MESSAGE = [
  "السلام عليكم ورحمة الله،",
  "أحببتُ أن أشارككم رحلةً يوميةً مع القرآن — آيةٌ تُقرأ، وعملٌ يُطبَّق، وتدبّرٌ يُكتب في القلب.",
  "لعلها تكون سببًا في خيرٍ لي ولكم، فالدالُّ على الخير كفاعله.",
  SHARE_URL,
].join("\n");

// Contact message for those who want to contribute to sustaining the endowment.
export const WHATSAPP_CONTRIBUTE_MESSAGE = [
  "السلام عليكم ورحمة الله،",
  "أحببتُ أن أُسهم في وقف الفلاح — احتسابًا وصدقةً جارية.",
].join("\n");

/** Open WhatsApp share sheet with the unified invitation. */
export const waInviteLink = (message: string = WHATSAPP_INVITE_MESSAGE) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;

/** Contact a specific number (defaults to the endowment contact). */
export const waContactLink = (
  message: string = WHATSAPP_CONTRIBUTE_MESSAGE,
  phone: string = WHATSAPP_CONTACT,
) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;