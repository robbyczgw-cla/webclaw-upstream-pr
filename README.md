# OpenCami 🦎

> **Web chat client for [OpenClaw](https://github.com/openclaw/openclaw)** — AI chat interface with PWA support, smart titles, follow-ups & more.

Forked from [WebClaw](https://github.com/ibelick/webclaw).

[![OpenCami](https://img.shields.io/badge/OpenCami-🦎-green)](https://opencami.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

### Core (from WebClaw)
- 💬 Multi-session chat with sidebar
- 🎨 Theme support (light/dark/system)
- ⚙️ Settings dialog
- 📝 Markdown rendering with syntax highlighting
- 📱 Mobile-responsive design

### OpenCami Additions

#### 📱 PWA — Install as App
Full Progressive Web App support for Android & iOS:
- **Install to Home Screen** — native app feel, no browser chrome
- **Offline Support** — cached shell loads even without internet
- **Auto-Update** — service worker updates seamlessly in background
- **Smart Caching** — cache-first for assets, network-first for API calls
- Works on Android (Chrome) and iOS (Safari)

#### 🖼️ Image Attachments
Upload and send images directly in chat:
- Drag & drop, clipboard paste, or file picker
- Auto-compression (fits 512KB WebSocket limit)
- Supports PNG, JPG, GIF, WebP (max 10MB input)
- Preview before sending

#### 🔍 Conversation Search
Find anything across all your conversations:
- `⌘F` — Search current conversation
- `⌘⇧F` — Global search across all sessions
- Instant results with highlighted matches

#### 🏷️ Smart Session Titles
AI-generated titles that actually describe your conversations:
- Powered by LLM (gpt-4.1-nano with fallback chain)
- Replaces generic "Feb 5 - hello..." titles
- Heuristic fallback when LLM is disabled

#### 💡 Smart Follow-ups
Context-aware suggestions for what to ask next:
- Instant heuristic suggestions appear immediately
- LLM analyzes context in background for smarter suggestions
- One click to send any suggestion
- Seamless transition from heuristic → AI suggestions

#### 🦎 Chameleon Theme
Nature-inspired color scheme — because why not 🌿

#### ⌨️ Keyboard Shortcuts
Power-user navigation:

| Shortcut | Action |
|----------|--------|
| `⌘K` | New chat |
| `⌘/` | Focus input |
| `⌘F` | Search current chat |
| `⌘⇧F` | Global search |
| `⌘⇧C` | Copy last response |
| `Esc` | Close dialogs |
| `?` | Show shortcuts help |

#### 📥 Conversation Export
Export any conversation in the format you need:
- 📝 Markdown (.md)
- 📋 JSON (.json)
- 📄 Plain Text (.txt)

#### 🎨 Model Selector
Switch models on the fly (UI ready, Gateway integration pending)

#### 💬 Slash Commands
Built-in `/help` shows available commands

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/robbyczgw-cla/opencami.git
cd opencami

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your Gateway URL and token

# Run
npm run dev
```

Open http://localhost:3001

### 📱 Install as PWA
1. Open OpenCami in your browser
2. **Android:** Tap ⋮ menu → "Install app" or "Add to Home Screen"
3. **iOS:** Tap Share → "Add to Home Screen"

## ⚙️ Configuration

### Gateway Connection
Create `.env.local`:
```bash
CLAWDBOT_GATEWAY_URL=ws://127.0.0.1:18789
CLAWDBOT_GATEWAY_TOKEN=YOUR_TOKEN_HERE
```

### LLM Features (Optional)
1. Go to Settings (⚙️)
2. Enable "Smart Titles" and/or "Smart Follow-ups"
3. API key options:
   - Set `OPENAI_API_KEY` environment variable (recommended)
   - Or enter manually in Settings

Model fallback chain: `gpt-4.1-nano → gpt-4o-mini → gpt-3.5-turbo`

## 🔄 Upstream Contributions

PRs submitted to [ibelick/webclaw](https://github.com/ibelick/webclaw):
- ✅ [PR #1](https://github.com/ibelick/webclaw/pull/1) — Locale fix (MERGED)
- ⏳ [PR #4](https://github.com/ibelick/webclaw/pull/4) — Image attachments (pending)

## 🗺️ Roadmap

- [ ] 🔔 Push Notifications (PWA)
- [ ] 🎤 Voice Messages (Whisper transcription)
- [ ] 📎 File Uploads (PDFs, docs, code)
- [ ] 🤖 Model Switcher (Gateway integration)
- [ ] 🔊 TTS Playback (ElevenLabs)
- [ ] 📊 Usage Dashboard

## 🙏 Credits

- **[WebClaw](https://github.com/ibelick/webclaw)** by [Julien Thibeaut](https://github.com/ibelick) — Original project
- **[OpenClaw](https://github.com/openclaw/openclaw)** — The gateway that powers it all

## 📄 License

MIT — See [LICENSE](LICENSE)

---

🌐 **[opencami.xyz](https://opencami.xyz)** · Built with 💚 by the OpenCami community
