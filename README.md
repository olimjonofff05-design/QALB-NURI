# 🌿 Qalb Nuri — نُورُ الْقَلْب

**Arab alifbosidan Qur'on hifzigacha — 0% dan 100% gacha bepul o'quv sayti.**

Qalb Nuri — arab tilini noldan o'rganib, Qur'oni Karimni to'g'ri o'qish va yodlashni boshlamoqchi bo'lganlar uchun yaratilgan o'zbek tilidagi o'quv platformasi. Barcha islomiy bilimlar bitta joyda: alifbo, talaffuz, tajvid, Qur'on, hifz, namoz, duolar, hadislar va sunnatlar.

## ✨ Imkoniyatlar

| Bo'lim | Nima bor |
|---|---|
| **Alifbo** | 28 harf: talaffuz (ovozli), maxraj, 4 shakli, yozilish animatsiyasi, barmoq bilan chizish, harakatli bo'g'inlar |
| **Darslar** | Harf shakllari, fatha/kasra/zamma, sukun, shadda, tanvin, madd, «Alloh» lafzi, so'zlar, Fotiha |
| **Tajvid** | Maxrajlar, lom qamariya/shamsiya, nūn sokin 4 hukmi, g'unna, qalqala, madd turlari, rā, vaqf belgilari — har biri qori ovozidagi oyat misollari bilan |
| **Qur'on** | 114 sura: Usmoniy matn, transkripsiya, o'zbekcha ma'no tarjimasi, 4 qori, takror (1×–∞), tezlik |
| **Hifz** | Yodlash rejimi (so'zlarni yashirish), oyatma-oyat belgilash, 15 sura + Oyatal Kursi rejasi, kundalik takrorlash |
| **Talaffuz** | 🔊 tinglash + 🎙 o'z ovozingizni yozib olib solishtirish |
| **Namoz** | Iymon asoslari, tahorat, g'usl, tayammum, farz/vojiblar, qadam-baqadam namoz tartibi, vitr va qunut, azon, juma, zikrlar (Hanafiy mazhabi) |
| **Namoz vaqtlari** | O'zbekistonning 20 shahri yoki joylashuv bo'yicha, keyingi namozgacha taymer, qibla yo'nalishi, hijriy sana |
| **Duolar** | 35 ta sahih duo (kundalik, masjid, ertalab-kechqurun, Qur'oniy) |
| **Hadislar** | 41 ta tanlangan hadis — arabcha matn, ma'no va manba |
| **Asmaul Husna** | Allohning 99 ismi — ovoz va ma'no bilan |
| **Sunnatlar** | Kundalik sunnatlar ro'yxati |
| **Tasbeh** | Raqamli tasbeh (33/99/100) |
| **Sinovlar** | Harfni tanish, eshitib topish, harakat, Asmaul Husna, namoz va tajvid savollari |
| **Gamifikatsiya** | Umumiy progress 0–100%, ballar, ketma-ket kunlar, 12 ta nishon, kundalik maqsad |

Progress brauzerda saqlanadi, eksport/import qilish mumkin. Tungi rejim, arabcha shrift o'lchami, PWA (telefonga o'rnatish va oflayn ishlash).

## 🚀 Ishga tushirish

Hech qanday o'rnatish talab qilinmaydi — oddiy statik sayt:

```bash
python3 -m http.server 8000
# so'ng http://localhost:8000 ni oching
```

Yoki GitHub Pages orqali: **Settings → Pages → Branch: `main` / root**.

## 👤 Akkaunt va progress

Kirishda foydalanuvchi **ism, telefon raqam (login), email va parol** bilan ro'yxatdan o'tadi va telefon raqami yoki emaili bilan kiradi. Har bir foydalanuvchining progressi avtomatik saqlanadi, kirgach esa ismining ma'nosi (arabcha yozilishi bilan) ko'rsatiladi.

- **Hozirgi rejim:** akkaunt va progress foydalanuvchi qurilmasida saqlanadi.
- **Bulutli rejim (Firebase)** — istalgan qurilmadan kirish va progressni bulutda saqlash:
  1. [console.firebase.google.com](https://console.firebase.google.com) → yangi loyiha (`qalb-nuri`).
  2. **Authentication → Sign-in method → Email/Password** ni yoqing. *(Keyinchalik **Phone** ni yoqib SMS kod bilan kirish qo'shiladi.)*
  3. **Firestore Database** yarating va **Rules** bo'limiga `firestore.rules` faylidagi qoidalarni qo'ying.
  4. **Project settings → Your apps → Web app** qo'shing, `firebaseConfig` ni nusxalang.
  5. `assets/js/firebase-config.js` faylida `window.QN_FIREBASE = null;` o'rniga shu obyektni qo'ying.
  6. **Authentication → Settings → Authorized domains** ga `olimjonofff05-design.github.io` ni qo'shing.

## 📚 Manbalar

- Qur'on matni va transkripsiya — [AlQuran.cloud](https://alquran.cloud) (Islamic Network)
- Ma'nolar tarjimasi — Shayx Muhammad Sodiq Muhammad Yusuf
- Tilovat audiolari — `cdn.islamic.network` (Husariy, Afasiy, Minshoviy, Abdulbosit)
- Namoz vaqtlari — [AlAdhan API](https://aladhan.com)
- Fiqhiy masalalar Hanafiy mazhabi asosida berilgan. Shubhali masalalarda mahalla imomi yoki ishonchli ulamolarga murojaat qiling.

## 🤝 Ulashing

> «Kim bir yaxshilikka yo'l ko'rsatsa, unga uni qilganning ajricha ajr bor» — Imom Muslim rivoyati.

Saytni foydali deb topsangiz, yaqinlaringizga tavsiya qiling.
