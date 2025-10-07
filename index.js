import TelegramBot from "node-telegram-bot-api";
import translate from "@iamtraction/google-translate";
import keep_alive from "./keep_alive.js"
import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN .env faylida topilmadi!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const port = process.env.PORT || 4000

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `👋 Salom! Men sizning shaxsiy Tarjimon botingizman 🤖✨
    
📚 Rus tili 🇷🇺 va Ingliz tilidagi matnlarni 🇬🇧 siz uchun tez va aniq O‘zbek tiliga 🇺🇿 tarjima qilib beraman!

📝 Matningizni yuboring — men esa uni bir zumda tarjima qilib beraman ⚡️😊`
  );
});

// /help komandasi
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Agar xatolik yoki savollaringiz bo‘lsa, bemalol murojaat qiling:\n👉 @narzullayev_js`
  );
});

// Oddiy matnlarni tarjima qilish
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // komandalarni tarjimaga yubormaymiz
  if (!text || text.startsWith("/")) return;

  try {
    // Inglizcha → Uzbekcha
    if (/^[a-zA-Z0-9\s.,!?']+$/.test(text)) {
      const res = await translate(text, { to: "uz" });
      await bot.sendMessage(chatId, `🇬🇧 ➡️ 🇺🇿\n${res.text}`);
    }
    // Ruscha → Uzbekcha
    else if (/[а-яА-ЯёЁ]/.test(text)) {
      const res = await translate(text, { to: "uz" });
      await bot.sendMessage(chatId, `🇷🇺 ➡️ 🇺🇿\n${res.text}`);
    }
    // Boshqa tilda
    else {
      await bot.sendMessage(chatId, "❓ Faqat inglizcha yoki ruscha matn yuboring.");
    }
  } catch (err) {
    console.error("❌ Xato:", err.message);
    await bot.sendMessage(chatId, "⚠️ Tarjima qilishda xatolik yuz berdi.");
  }
});

console.log("🤖 Translate Bot ishga tushdi...");
