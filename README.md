# AikoBot

A WhatsApp bot using Baileys library with Gemini AI integration

## SETUP

### PREREQUISITES:
- Bun runtime (v1.1.38 or newer) - https://bun.sh
- Active WhatsApp account
- Google Gemini API key

### INSTALLATION:
1. Clone this repository
```bash
git clone https://github.com/Kynonim/AikoBot.git
cd AikoBot
```

2. Install dependencies:
```bash
bun install
```

3. Create *.env* file with these variables:
```env
SESSION_PATH="/path/path2"
ADMIN_NUMBER="62xxxxxx@s.whatsapp.net" 
GEMINI_APIKEY="AIxxxxxxxx"
WAIFU_URL="https://xxxxxxx"
HISTORY_PATH="/path/history"
ASSETS_PATH="/path/assets" 
CMD="!"
ROLE_SYSTEM="Music my favorit gw"
```

## RUN THE BOT:
```bash
bun start
```
*Or run with debug mode*:
```bash
bun dev
```

## FEATURES
- Smart AI responses using Gemini
- Image recognition and analysis
- JSON conversation history
- Admin-only commands
- Waifu image generation

## ENV VARIABLES
|-----------------|--------------------------|-----------------------------|
| SESSION_PATH    | Session files location   | "/path/path2"               |
| ADMIN_NUMBER    | Admin WhatsApp number    | "62xxxxxx@s.whatsapp.net"   |
| GEMINI_APIKEY   | Google AI API key        | "AIxxxxxxxx"                |
| WAIFU_URL       | Waifu image API endpoint | "https://xxxxxxx"           |
| HISTORY_PATH    | Chat history storage     | "/path/history"             |
| ASSETS_PATH     | Temporary media storage  | "/path/assets"              |
| CMD             | Command prefix           | "!"                         |
| ROLE_SYSTEM     | AI personality setting   | "Music me my favorite i gw" |
|-----------------|--------------------------|-----------------------------|

## COMMANDS
- .riky [question]  - Ask Gemini a question (Grub)
- ? [question] - Ask Gemini a question (User)
- Menu - Show menu
- etc

## NOTES
- First run requires QR code scan
- Admin commands restricted to specified number
- Keep your API keys secure