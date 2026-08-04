import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const CONFIG_FILE = path.join(process.cwd(), 'telegram_config.json');

// --- SERVER GALLERY PERSISTENCE ---
const DEFAULT_SERVER_GALLERY = [
  {
    id: 1,
    title: "Citroën C4 Picasso - Widok z przodu 3/4",
    src: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=85&w=1600",
    category: "Nadwozie"
  },
  {
    id: 2,
    title: "Panoromiczna przednia szyba i kokpit",
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=85&w=1600",
    category: "Wnętrze"
  },
  {
    id: 3,
    title: "Stylistyka tyłu i reflektory LED",
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=85&w=1600",
    category: "Nadwozie"
  },
  {
    id: 4,
    title: "Luksusowe wykończenie deski rozdzielczej",
    src: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=85&w=1600",
    category: "Wnętrze"
  },
  {
    id: 5,
    title: "Alufelgi fabryczne Citroën",
    src: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=85&w=1600",
    category: "Detale"
  },
  {
    id: 6,
    title: "Kierownica z nieruchomym środkiem i tempomatem",
    src: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=85&w=1600",
    category: "Detale"
  }
];

let memoryGalleryConfig: { gallery: any[]; heroImage: string | null } = {
  gallery: [],
  heroImage: null
};

function loadInitialGalleryConfig() {
  const configFile = path.join(process.cwd(), 'gallery_config.json');
  try {
    if (fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed) {
        if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) {
          memoryGalleryConfig.gallery = parsed.gallery.map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            title: item.title || `Zdjęcie Citroën (${idx + 1})`,
            src: item.src,
            category: item.category || 'Nadwozie'
          })).filter((item: any) => Boolean(item.src));
        }
        if (parsed.heroImage) {
          memoryGalleryConfig.heroImage = parsed.heroImage;
        }
      }
    }
  } catch (err) {
    console.error('Błąd odczytu gallery_config.json przy starcie:', err);
  }

  if (!memoryGalleryConfig.gallery || memoryGalleryConfig.gallery.length === 0) {
    memoryGalleryConfig.gallery = DEFAULT_SERVER_GALLERY;
  }
}
loadInitialGalleryConfig();

function saveGalleryConfig(config: { gallery?: any[]; heroImage?: string | null }) {
  if (config.gallery !== undefined && Array.isArray(config.gallery)) {
    memoryGalleryConfig.gallery = config.gallery.map((item: any, idx: number) => ({
      id: item.id || idx + 1,
      title: item.title || `Zdjęcie Citroën (${idx + 1})`,
      src: item.src,
      category: item.category || 'Nadwozie'
    })).filter((item: any) => Boolean(item.src));
  }
  if (config.heroImage !== undefined) memoryGalleryConfig.heroImage = config.heroImage;

  const configFile = path.join(process.cwd(), 'gallery_config.json');
  try {
    fs.writeFileSync(configFile, JSON.stringify(memoryGalleryConfig, null, 2), 'utf-8');
    console.log('Zapisano galerię do:', configFile);
  } catch (err) {
    console.error('Błąd zapisu galerii do pliku:', err);
  }
}

// API: Odczyt galerii zdjęć z serwera
app.get('/api/gallery', (req, res) => {
  res.json({
    gallery: memoryGalleryConfig.gallery,
    heroImage: memoryGalleryConfig.heroImage
  });
});

// API: Zapis galerii zdjęć na serwerze
app.post('/api/gallery', (req, res) => {
  const { gallery, heroImage } = req.body || {};
  saveGalleryConfig({ gallery, heroImage });
  res.json({
    success: true,
    gallery: memoryGalleryConfig.gallery,
    heroImage: memoryGalleryConfig.heroImage
  });
});

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

  const filesToWrite = [
    path.join(process.cwd(), 'telegram_config.json'),
    path.join(process.cwd(), 'src/telegramDefaultConfig.json'),
    path.join(__dirname, 'telegram_config.json'),
    path.join(__dirname, 'src/telegramDefaultConfig.json')
  ];

  for (const filePath of filesToWrite) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(memoryConfig, null, 2), 'utf-8');
      console.log('Saved Telegram config to:', filePath, memoryConfig);
    } catch (err) {
      console.error('Error saving config to file:', filePath, err);
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
