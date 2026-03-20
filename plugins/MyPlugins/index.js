/**
 * example-plugin — AuroraChat Plugin Template
 *
 * Drop this folder into electron/mods/plugins/ to test locally,
 * or push to your GitHub repo and install via Plugin Manager → Browse Repository.
 *
 * ctx API:
 *   ctx.log(...args)         → print to plugin console
 *   ctx.reply(msg, text)     → reply to a message
 *   ctx.send(jid, content)   → send to any JID
 *   ctx.getData()            → read data.json (returns object)
 *   ctx.setData(obj)         → persist data to data.json
 *   ctx.manifest             → parsed manifest.json
 *   ctx.pluginDir            → absolute path to this folder
 */

module.exports = {
  // ── Called once when the plugin is enabled or AuroraChat starts ──────────
  onLoad(ctx) {
    ctx.log(`[${ctx.manifest.name}] v${ctx.manifest.version} loaded`)

    // Example: load persisted config
    const data = ctx.getData()
    ctx.log("Saved data:", data)
  },

  // ── Called when the plugin is disabled or AuroraChat quits ───────────────
  onUnload(ctx) {
    ctx.log(`[${ctx.manifest.name}] unloaded`)
  },

  // ── Called for every incoming message ────────────────────────────────────
  onMessage(ctx, msg) {
    // msg.body        — text content
    // msg.sender_jid  — sender JID
    // msg.chat_jid    — chat/group JID
    // msg.from_me     — true if sent by you
    // msg.msg_type    — "text", "image", "video", "audio", etc.

    if (msg.from_me) return  // ignore your own messages

    if (msg.body === "!hello") {
      ctx.reply(msg, `Hello from ${ctx.manifest.name}! 👋`)
    }
  },

  // ── Called before a message is sent — MUST return the payload ────────────
  onBeforeSend(ctx, payload) {
    // Inspect or modify the outgoing message payload here.
    // Always return payload even if you don't modify it.
    return payload
  },
}
