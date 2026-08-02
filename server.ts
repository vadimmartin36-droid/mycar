import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const CONFIG_FILE = path.join(process.cwd(), 'telegram_config.json');

let memoryConfig = {
  token: (process.env.TELEGRAM_BOT_TOKEN || '').trim(),
  chatId: (process.env.TELEGRAM_CHAT_ID || '').trim()
};

function getTelegramConfig() {
  const configPaths = [
    path.join(process.cwd(), 'telegram_config.json'),
    path.join(process.cwd(), 'src/telegramDefaultConfig.json'),
    path.join(__dirname, 'telegram_config.json'),
    path.join(__dirname, 'src/telegramDefaultConfig.json'),
    path.join(__dirname, '../telegram_config.json'),
    path.join(__dirname, '../src/telegramDefaultConfig.json')
  ];

  for (const configPath of configPaths) {
    try {
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(data);
        if (parsed.token && !memoryConfig.token) memoryConfig.token = parsed.token.trim();
        if (parsed.chatId && !memoryConfig.chatId) memoryConfig.chatId = parsed.chatId.trim();
        // If file has valid credentials, override memoryConfig
        if (parsed.token) memoryConfig.token = parsed.token.trim();
        if (parsed.chatId) memoryConfig.chatId = parsed.chatId.trim();
      }
    } catch (err) {
      console.error('Błąd odczytu telegram_config.json:', err);
    }
  }

  if (!memoryConfig.token && process.env.TELEGRAM_BOT_TOKEN) {
    memoryConfig.token = process.env.TELEGRAM_BOT_TOKEN.trim();
  }
  if (!memoryConfig.chatId && process.env.TELEGRAM_CHAT_ID) {
    memoryConfig.chatId = process.env.TELEGRAM_CHAT_ID.trim();
  }

  return memoryConfig;
}

function saveTelegramConfig(config: { token?: string; chatId?: string }) {
  if (config.token !== undefined && config.token.trim()) memoryConfig.token = config.token.trim();
  if (config.chatId !== undefined && config.chatId.trim()) memoryConfig.chatId = config.chatId.trim();

  const configPaths = [
    path.join(process.cwd(), 'telegram_config.json'),
    path.join(process.cwd(), 'src/telegramDefaultConfig.json'),
    path.join(__dirname, 'telegram_config.json'),
    path.join(__dirname, 'src/telegramDefaultConfig.json'),
    path.join(__dirname, '../telegram_config.json'),
    path.join(__dirname, '../src/telegramDefaultConfig.json')
  ];

  for (const configPath of configPaths) {
    try {
      const dir = path.dirname(configPath);
      if (fs.existsSync(dir)) {
        fs.writeFileSync(configPath, JSON.stringify(memoryConfig, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Błąd zapisu config file:', err);
    }
  }
}

// API: Odczyt konfiguracji Telegram
app.get('/api/telegram/config', (req, res) => {
  const config = getTelegramConfig();
  res.json({
    token: config.token,
    chatId: config.chatId,
    isReady: Boolean(config.token && config.chatId)
  });
});

// API: Zapis konfiguracji Telegram (z admina)
app.post('/api/telegram/config', (req, res) => {
  const { token, chatId } = req.body || {};
  const current = getTelegramConfig();
  const updated = {
    token: token !== undefined ? String(token).trim() : current.token,
    chatId: chatId !== undefined ? String(chatId).trim() : current.chatId
  };
  saveTelegramConfig(updated);
  res.json({
    success: true,
    config: updated,
    isReady: Boolean(updated.token && updated.chatId)
  });
});

// API: Определение Chat ID через Telegram getUpdates
app.post('/api/telegram/detect-chat-id', async (req, res) => {
  const { token: reqToken } = req.body || {};
  const serverConfig = getTelegramConfig();
  const token = (reqToken || serverConfig.token || process.env.TELEGRAM_BOT_TOKEN || '').trim();

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Укажите Bot Token для поиска Chat ID.'
    });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/getUpdates`;
    const response = await fetch(telegramUrl);
    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: `Telegram API: ${data.description || 'Неверный Token'}`
      });
    }

    const updates = data.result || [];
    if (updates.length === 0) {
      return res.json({
        success: false,
        error: 'Бот пока не получил ни одного сообщения. Откройте вашего бота в Telegram, нажмите кнопку START (или напишите ему любое слово), после чего снова нажмите эту кнопку!'
      });
    }

    // Собираем уникальные чаты
    const chatMap = new Map<string, { id: string; name: string; username?: string; lastMsg?: string }>();

    for (const update of updates) {
      const msg = update.message || update.edited_message || update.callback_query?.message;
      const chat = msg?.chat || update.my_chat_member?.chat;
      if (chat && chat.id) {
        const idStr = String(chat.id);
        const name = [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.title || 'Пользователь';
        const username = chat.username ? `@${chat.username}` : undefined;
        const lastMsg = msg?.text || 'Сообщение';
        chatMap.set(idStr, { id: idStr, name, username, lastMsg });
      }
    }

    const chats = Array.from(chatMap.values());
    if (chats.length === 0) {
      return res.json({
        success: false,
        error: 'Не удалось извлечь Chat ID. Отправьте боту команду /start и повторите попытку.'
      });
    }

    // Последний активный чат
    const latestChat = chats[chats.length - 1];

    // Автоматически сохраняем найденный chatId если токен был передан
    if (latestChat && latestChat.id) {
      saveTelegramConfig({ token, chatId: latestChat.id });
    }

    return res.json({
      success: true,
      chats,
      latestChatId: latestChat.id,
      latestChat
    });
  } catch (err: any) {
    console.error('Error in detect-chat-id:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Ошибка соединения с сервером Telegram'
    });
  }
});

// API: Wysyłanie powiadomienia do Telegrama przez serwer
app.post('/api/telegram/send', async (req, res) => {
  const { text, token: reqToken, chatId: reqChatId } = req.body || {};
  const serverConfig = getTelegramConfig();

  const token = (reqToken && String(reqToken).trim()) || serverConfig.token || (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (reqChatId && String(reqChatId).trim()) || serverConfig.chatId || (process.env.TELEGRAM_CHAT_ID || '').trim();

  // Zapisujemy w pamięci serwera, если токен и чат id были переданы
  if (reqToken && reqChatId) {
    saveTelegramConfig({ token, chatId });
  }

  if (!token || !chatId) {
    return res.status(400).json({
      success: false,
      error: 'Brak skonfigurowanego Bot Token lub Chat ID na serwerze.'
    });
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await telegramResponse.json();
    if (data.ok) {
      return res.json({ success: true });
    } else {
      let errDetails = data.description || 'Błąd Telegram API';
      if (data.error_code === 401) {
        errDetails = 'Nieprawidłowy Bot Token (401 Unauthorized)';
      } else if (data.error_code === 400) {
        errDetails = `Błąd 400: ${data.description}. Убедитесь, что вы запустили бота (/start в Telegram)!`;
      }
      return res.status(400).json({ success: false, error: errDetails });
    }
  } catch (err: any) {
    console.error('Telegram send error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Błąd połączenia z serwerem Telegram' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serwer uruchomiony na portie ${PORT}`);
  });
}

startServer();
