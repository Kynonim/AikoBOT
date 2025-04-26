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
SESSION_PATH="/path/session"
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

## ENVIRONMENT VARIABLES

| Variable         | Description                          | Example Value                   |
|------------------|--------------------------------------|---------------------------------|
| `SESSION_PATH`   | Path to store session files          | `"/path/session"`             |
| `ADMIN_NUMBER`   | Admin WhatsApp number with country code | `"62xxxxxx@s.whatsapp.net"`    |
| `GEMINI_APIKEY`  | Google Gemini API key                | `"AIxxxxxxxx"`                 |
| `WAIFU_URL`      | Waifu image API endpoint             | `"https://xxxxxxxxx"`       |
| `HISTORY_PATH`   | Path to store chat history JSON      | `"/path/history"`     |
| `ASSETS_PATH`    | Path for storing temporary assets    | `"/path/assets"`               |
| `CMD`            | Command prefix for bot               | `"!"`                          |
| `ROLE_SYSTEM`    | AI personality prompt                | `"Kamu adalah my AI cewek imut cute gw i"`  |

## COMMANDS

| Command           | Description                          | Example Usage                |
|-------------------|--------------------------------------|------------------------------|
| `$PREFIX + riky [text]`    | Ask Gemini AI a question             | `For Grub My Self`     |
| `$PREFIX + tanya [text]`   | Ask question       | `For Grub Whatsapp`     |
| `? [text]`   | Ask question       | `For Grub Whatsapp`     |
| `Menu`   | Simple menu       | `how to use. etc`     


## NOTES
- First run requires QR code scan
- Admin commands restricted to specified number
- Keep your API keys secure