// Plugin: Survey / Rating Buttons
// Inject tombol penilaian bintang ke pesan:
//   1–3. quick_reply bintang  ⭐ / ⭐⭐ / ⭐⭐⭐⭐⭐  (bisa dikurangi di config)
//   4.   cta_url — "Isi Form Lengkap" untuk survey panjang
// Cocok untuk follow-up after-service, penilaian produk, atau feedback CS.
"use strict"

const DEFAULT_CONFIG = {
  enabled: true,
  title:   "⭐ Nilai Pengalaman Anda",
  footer:  "Feedback Anda sangat berarti!",

  // Bintang — bisa di-disable satu-satu
  show_star1: true,
  show_star2: false,   // bintang 2 biasanya dilewati supaya tidak terlalu banyak
  show_star3: true,
  show_star4: false,
  show_star5: true,

  label_star1: "😞 Buruk",
  label_star2: "😕 Kurang",
  label_star3: "😐 Cukup",
  label_star4: "🙂 Baik",
  label_star5: "😍 Sangat Baik",

  id_star1: "rate_1",
  id_star2: "rate_2",
  id_star3: "rate_3",
  id_star4: "rate_4",
  id_star5: "rate_5",

  // Form lengkap
  show_form: true,
  form_text: "📝 Isi Form Lengkap",
  form_url:  "https://forms.google.com/your-survey",
}

let config = { ...DEFAULT_CONFIG }

module.exports.settings = [
  { key: "enabled", label: "Aktifkan", type: "boolean", default: true },
  { key: "title",   label: "Judul",    type: "text",    default: DEFAULT_CONFIG.title },
  { key: "footer",  label: "Footer",   type: "text",    default: DEFAULT_CONFIG.footer },

  { key: "show_star1", label: "Tampilkan Bintang 1", type: "boolean", default: true },
  { key: "label_star1", label: "Label Bintang 1",    type: "text",    default: DEFAULT_CONFIG.label_star1 },
  { key: "id_star1",    label: "ID Reply Bintang 1", type: "text",    default: DEFAULT_CONFIG.id_star1 },

  { key: "show_star2", label: "Tampilkan Bintang 2", type: "boolean", default: false },
  { key: "label_star2", label: "Label Bintang 2",    type: "text",    default: DEFAULT_CONFIG.label_star2 },
  { key: "id_star2",    label: "ID Reply Bintang 2", type: "text",    default: DEFAULT_CONFIG.id_star2 },

  { key: "show_star3", label: "Tampilkan Bintang 3", type: "boolean", default: true },
  { key: "label_star3", label: "Label Bintang 3",    type: "text",    default: DEFAULT_CONFIG.label_star3 },
  { key: "id_star3",    label: "ID Reply Bintang 3", type: "text",    default: DEFAULT_CONFIG.id_star3 },

  { key: "show_star4", label: "Tampilkan Bintang 4", type: "boolean", default: false },
  { key: "label_star4", label: "Label Bintang 4",    type: "text",    default: DEFAULT_CONFIG.label_star4 },
  { key: "id_star4",    label: "ID Reply Bintang 4", type: "text",    default: DEFAULT_CONFIG.id_star4 },

  { key: "show_star5", label: "Tampilkan Bintang 5", type: "boolean", default: true },
  { key: "label_star5", label: "Label Bintang 5",    type: "text",    default: DEFAULT_CONFIG.label_star5 },
  { key: "id_star5",    label: "ID Reply Bintang 5", type: "text",    default: DEFAULT_CONFIG.id_star5 },

  { key: "show_form", label: "Tampilkan Tombol Form", type: "boolean", default: true },
  { key: "form_text", label: "Label Tombol Form",     type: "text",    default: DEFAULT_CONFIG.form_text },
  { key: "form_url",  label: "URL Form Survey",       type: "url",     default: DEFAULT_CONFIG.form_url, placeholder: "https://forms.google.com/..." },
]

module.exports.onLoad = async function(ctx) {
  const saved = ctx.storage.get("config")
  if (saved) config = { ...DEFAULT_CONFIG, ...saved }
  ctx.log("Survey Buttons loaded")
}

module.exports.onUnload = async function(ctx) {
  ctx.log("Survey Buttons unloaded")
}

module.exports.onConfigChange = async function(newValues, ctx) {
  config = { ...DEFAULT_CONFIG, ...newValues }
  ctx.log("Config updated")
}

module.exports.onBeforeSend = async function(jid, payload, ctx) {
  if (!config.enabled) return payload

  const buttons = []

  // Bintang rating 1–5 — hanya yang show_starN = true
  const stars = [
    { show: config.show_star1, label: config.label_star1, id: config.id_star1 },
    { show: config.show_star2, label: config.label_star2, id: config.id_star2 },
    { show: config.show_star3, label: config.label_star3, id: config.id_star3 },
    { show: config.show_star4, label: config.label_star4, id: config.id_star4 },
    { show: config.show_star5, label: config.label_star5, id: config.id_star5 },
  ]

  for (const star of stars) {
    if (star.show && star.label) {
      buttons.push({
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: star.label,
          id:           star.id,
        }),
      })
    }
  }

  // Tombol buka form survey lengkap
  if (config.show_form && config.form_url) {
    buttons.push({
      name: "cta_url",
      buttonParamsJson: JSON.stringify({
        display_text: config.form_text || "Isi Form Lengkap",
        url:          config.form_url,
      }),
    })
  }

  if (buttons.length === 0) return payload

  payload.interactiveButtons = buttons
  if (config.title)  payload.title  = config.title
  if (config.footer) payload.footer = config.footer

  ctx.log(`Injected survey buttons (${buttons.length}) → ${jid}`)
  return payload
}
