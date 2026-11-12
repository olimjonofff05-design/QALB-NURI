/* =========================================================
   QALB NURI — yadro: holat, progress, audio, yordamchilar
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arDigits = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dayOfYear = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------------- Holat (localStorage) ---------------- */
  const KEY = "qalbnuri_v1";
  const blank = () => ({
    letters: {}, lessons: {}, read: {}, hifz: {}, ibodat: {}, duo: {}, hadis: {}, names: {}, sunnat: {},
    xp: 0, streak: { n: 0, last: "" }, daily: { d: "", n: 0 }, badges: {}, quizBest: {}, tasbeh: 0,
    settings: { reciter: "ar.husary", arScale: 1, dark: false, city: 0, method: 3, tr: true, translit: true, rate: 1, repeat: 1, voice: "auto" },
    lastRoute: "",
  });
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); S.settings = Object.assign(blank().settings, S.settings); }
  catch { S = blank(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

  /* ---------------- Toast & confetti ---------------- */
  let toastT;
  const toast = (msg, ms = 2600) => {
    const t = $("#toast"); t.innerHTML = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms);
  };
  const confetti = (n = 60) => {
    const colors = ["#19a97b", "#0b6b50", "#c9a227", "#7fdcb8", "#f3d77a", "#ffffff"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = pick(colors);
      c.style.animationDuration = 1.8 + Math.random() * 2 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4500);
    }
  };

  /* ---------------- Progress ---------------- */
  const cnt = (o) => Object.values(o).filter(Boolean).length;
  const lessonsOf = (mod) => QN.lessons.filter((l) => l.mod === mod);
  const hifzUnits = () => QN.hifzPlan.map((p) => {
    const from = p.from || 1, to = p.to || QN.surahs[p.s - 1][2];
    let done = 0; for (let a = from; a <= to; a++) if (S.hifz[`${p.s}:${a}`]) done++;
    return { ...p, from, to, total: to - from + 1, done, name: p.name || QN.surahs[p.s - 1][1] };
  });
  const modPct = (id) => {
    switch (id) {
      case "alifbo": return cnt(S.letters) / 28;
      case "harf": case "harakat": case "oqish": case "tajvid": {
        const ls = lessonsOf(id); return ls.filter((l) => S.lessons[l.id]).length / ls.length;
      }
      case "quron": return QN.readPlan.filter((s) => S.read[s]).length / QN.readPlan.length;
      case "hifz": { const u = hifzUnits(); return u.reduce((a, x) => a + x.done / x.total, 0) / u.length; }
      case "ibodat": return QN.ibodatLessons.filter((l) => S.ibodat[l.id]).length / QN.ibodatLessons.length;
      case "duo": return Math.min(1, cnt(S.duo) / QN.duas.length);
      case "hadis": return Math.min(1, cnt(S.hadis) / QN.hadiths.length);
      case "asmo": return Math.min(1, cnt(S.names) / 99);
      case "sunnat": { const all = QN.sunnats.reduce((a, g) => a + g.items.length, 0); return Math.min(1, cnt(S.sunnat) / all); }
    }
    return 0;
  };
  const totalPct = () => Math.round(QN.modules.reduce((a, m) => a + m.w * modPct(m.id), 0) * 10) / 10;
  const levelName = (p) => p >= 100 ? "Qalb nuri ✨" : p >= 80 ? "Hifz yo'lida" : p >= 55 ? "Qori yo'lida" : p >= 30 ? "Qur'on o'quvchisi" : p >= 10 ? "Tolibi ilm" : "Mubtadi' (boshlovchi)";

  const badgesDef = [
    { id: "first", e: "🌱", t: "Ilk qadam", d: "Birinchi harfni o'rgandingiz", ok: () => cnt(S.letters) >= 1 },
    { id: "abc", e: "🔤", t: "Alifbo ustasi", d: "28 harfning hammasi", ok: () => cnt(S.letters) >= 28 },
    { id: "harakat", e: "◌َ", t: "Harakat bilimdoni", d: "Harakatlar moduli 100%", ok: () => modPct("harakat") >= 1 },
    { id: "fotiha", e: "📗", t: "Birinchi sura", d: "Fotihani o'qib chiqdingiz", ok: () => !!S.read[1] },
    { id: "hafiz1", e: "💚", t: "Ilk hifz", d: "Bitta surani to'liq yodladingiz", ok: () => hifzUnits().some((u) => u.done === u.total) },
    { id: "tajvid", e: "🎼", t: "Tajvidchi", d: "Tajvid moduli 100%", ok: () => modPct("tajvid") >= 1 },
    { id: "namoz", e: "🕌", t: "Namozxon", d: "Namoz darslari 100%", ok: () => modPct("ibodat") >= 1 },
    { id: "duo10", e: "🤲", t: "Duogo'y", d: "10 ta duo yodladingiz", ok: () => cnt(S.duo) >= 10 },
    { id: "streak7", e: "🔥", t: "7 kun ketma-ket", d: "Bir hafta uzluksiz", ok: () => S.streak.n >= 7 },
    { id: "streak30", e: "🏆", t: "30 kun ketma-ket", d: "Bir oy uzluksiz", ok: () => S.streak.n >= 30 },
    { id: "juz", e: "📚", t: "30-pora o'quvchisi", d: "O'qish rejasi 100%", ok: () => modPct("quron") >= 1 },
    { id: "full", e: "✨", t: "Qalb nuri", d: "Umumiy yo'l 100%", ok: () => totalPct() >= 100 },
  ];

  const touchStreak = () => {
    const t = todayStr(), y = todayStr(new Date(Date.now() - 864e5));
    if (S.streak.last !== t) { S.streak.n = S.streak.last === y ? S.streak.n + 1 : 1; S.streak.last = t; }
    if (S.daily.d !== t) S.daily = { d: t, n: 0 };
    S.daily.n++;
  };
  const checkBadges = () => {
    for (const b of badgesDef) if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = todayStr(); setTimeout(() => { toast(`${b.e} Yangi nishon: <b>${b.t}</b>`); confetti(90); }, 400); }
  };
  /* Har qanday yutuqni qayd etish */
  const award = (xp, msg) => {
    const before = totalPct();
    S.xp += xp; touchStreak(); checkBadges(); save(); refreshShell();
    if (msg) toast(`${msg} <b>+${xp} ⭐</b>`);
    const after = totalPct();
    if (Math.floor(after / 10) > Math.floor(before / 10)) setTimeout(() => { toast(`🎉 Tabriklaymiz! Umumiy progress: <b>${Math.floor(after)}%</b>`); confetti(); }, 900);
  };
  const toggle = (bucket, key, xp, msgOn) => {
    if (S[bucket][key]) { delete S[bucket][key]; save(); refreshShell(); return false; }
    S[bucket][key] = 1; award(xp, msgOn); return true;
  };

  const refreshShell = () => {
    const p = totalPct();
    $("#pctVal").textContent = Math.floor(p) + "%";
    $("#xpVal").textContent = S.xp;
    $("#streakVal").textContent = S.streak.n;
    const r = $("#sideRing"); r.style.setProperty("--p", p); r.innerHTML = `<span>${Math.floor(p)}%</span>`;
    $("#sideLevel").textContent = levelName(p);
  };

  /* ---------------- Sozlamalar qo'llash ---------------- */
  const applySettings = () => {
    document.body.classList.toggle("dark", !!S.settings.dark);
    document.documentElement.style.setProperty("--ar-scale", S.settings.arScale);
  };

  /* ---------------- Ovoz: TTS (arabcha) ---------------- */
  let arVoice = null, voiceWarned = false;
  const loadVoices = () => {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    arVoice = vs.find((v) => /^ar/i.test(v.lang) && /google/i.test(v.name)) || vs.find((v) => /^ar/i.test(v.lang)) || null;
  };
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  /* Onlayn arabcha ovoz (qurilmada arabcha ovoz bo'lmasa) */
  const ttsAudio = new Audio();
  const chunks = (text) => {
    const out = []; let cur = "";
    for (const w of text.replace(/[«»"()]/g, " ").split(/\s+/).filter(Boolean)) {
      if ((cur + " " + w).length > 170 && cur) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    }
    if (cur) out.push(cur); return out;
  };
  const cloudSpeak = (text, rate) => new Promise((res) => {
    const parts = chunks(text); let i = 0;
    const next = () => {
      if (i >= parts.length) return res(true);
      ttsAudio.src = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(parts[i++])}`;
      ttsAudio.playbackRate = rate < 0.8 ? 0.85 : 1;
      ttsAudio.onended = next;
      ttsAudio.onerror = () => res(false);
      ttsAudio.play().catch(() => res(false));
    };
    next();
  });
  const speak = (text, rate = 0.72) => new Promise(async (res) => {
    stopAll(true); ttsAudio.pause();
    loadVoices();
    const mode = S.settings.voice || "auto";
    const hasLocal = "speechSynthesis" in window && arVoice;
    if (mode === "cloud" || (mode === "auto" && !hasLocal)) {
      const ok = await cloudSpeak(text, rate);
      if (ok) return res();
      if (!hasLocal) { if (!voiceWarned) { voiceWarned = true; toast("⚠️ Ovoz yuklanmadi. Internet aloqasini tekshiring.", 4000); } return res(); }
    }
    if (!("speechSynthesis" in window)) return res();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA"; if (arVoice) u.voice = arVoice; u.rate = rate;
    u.onend = u.onerror = () => res();
    speechSynthesis.speak(u);
  });

  /* ---------------- Qur'on audio pleyeri ---------------- */
  const audio = new Audio();
  audio.preload = "auto";
  const P = { queue: [], i: 0, rep: 0, onAyah: null, onEnd: null, title: "" };
  const ayahUrl = (g, reciter = S.settings.reciter) => {
    const r = QN.reciters.find((x) => x.id === reciter) || QN.reciters[0];
    return `https://cdn.islamic.network/quran/audio/${r.br}/${r.id}/${g}.mp3`;
  };
  audio.addEventListener("error", () => {
    if (!audio.src.includes("ar.alafasy")) { const g = audio.src.match(/\/(\d+)\.mp3/); if (g) { audio.src = ayahUrl(+g[1], "ar.alafasy"); audio.play().catch(() => {}); return; } }
    toast("Audio yuklanmadi. Internet aloqasini tekshiring.");
  });
  const playItem = () => {
    const it = P.queue[P.i]; if (!it) return;
    audio.src = ayahUrl(QN.globalAyah(it.s, it.a));
    audio.playbackRate = S.settings.rate || 1;
    audio.play().catch(() => toast("Audio ijro etilmadi — sahifaga bir marta bosib, qayta urinib ko'ring."));
    $("#player").hidden = false;
    $("#plTitle").textContent = P.title || `${QN.surahs[it.s - 1][1]} surasi`;
    $("#plSub").textContent = `${it.s}:${it.a}${P.repTotal > 1 ? ` · takror ${P.rep + 1}/${P.repTotal === 99 ? "∞" : P.repTotal}` : ""}`;
    $("#plPlay").textContent = "⏸";
    P.onAyah && P.onAyah(it);
  };
  audio.addEventListener("ended", () => {
    if (!P.queue.length) return;
    P.rep++;
    if (P.rep < P.repTotal) return setTimeout(playItem, 350);
    P.rep = 0; P.i++;
    if (P.i < P.queue.length) return setTimeout(playItem, 250);
    $("#plPlay").textContent = "▶"; P.onEnd && P.onEnd();
  });
  const playAyahs = (items, opts = {}) => {
    stopAll();
    P.queue = items; P.i = 0; P.rep = 0; P.repTotal = opts.repeat || 1; P.onAyah = opts.onAyah || null; P.onEnd = opts.onEnd || null; P.title = opts.title || "";
    playItem();
  };
  const stopAll = (keepSpeech) => {
    audio.pause(); if (!keepSpeech) { ttsAudio.pause(); if ("speechSynthesis" in window) speechSynthesis.cancel(); }
  };
  $("#plPlay").onclick = () => { if (audio.paused) { audio.play(); $("#plPlay").textContent = "⏸"; } else { audio.pause(); $("#plPlay").textContent = "▶"; } };
  $("#plNext").onclick = () => { if (P.i < P.queue.length - 1) { P.i++; P.rep = 0; playItem(); } };
  $("#plPrev").onclick = () => { if (P.i > 0) { P.i--; P.rep = 0; playItem(); } };
  $("#plClose").onclick = () => { stopAll(); P.queue = []; $("#player").hidden = true; P.onAyah && P.onAyah(null); };

  /* ---------------- Ovoz yozib olish (talaffuzni solishtirish) ---------------- */
  const Rec = { mr: null, chunks: [], url: null, btn: null };
  const recToggle = async (btn, playBtn) => {
    if (Rec.mr && Rec.mr.state === "recording") { Rec.mr.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) return toast("Brauzeringiz mikrofonni qo'llamaydi.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      Rec.chunks = []; Rec.mr = new MediaRecorder(stream); Rec.btn = btn;
      Rec.mr.ondataavailable = (e) => Rec.chunks.push(e.data);
      Rec.mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (Rec.url) URL.revokeObjectURL(Rec.url);
        Rec.url = URL.createObjectURL(new Blob(Rec.chunks, { type: Rec.mr.mimeType || "audio/webm" }));
        btn.classList.remove("on"); btn.innerHTML = "🎙 Qayta yozish";
        if (playBtn) { playBtn.hidden = false; playBtn.onclick = () => { stopAll(); new Audio(Rec.url).play(); }; }
        toast("Yozildi! Endi o'z ovozingizni namuna bilan solishtiring.");
      };
      Rec.mr.start(); btn.classList.add("on"); btn.innerHTML = "⏹ To'xtatish";
      setTimeout(() => { if (Rec.mr && Rec.mr.state === "recording") Rec.mr.stop(); }, 20000);
    } catch { toast("Mikrofonga ruxsat berilmadi. Brauzer sozlamalarida ruxsat bering."); }
  };

  /* ---------------- Qur'on matnini yuklash ---------------- */
  const stripMarks = (s) => s.replace(/[ً-ٰٟۖ-ۭ]/g, "");
  const surahCache = {};
  const loadSurah = async (n) => {
    if (surahCache[n]) return surahCache[n];
    const ck = "qn_surah_" + n;
    try { const c = JSON.parse(localStorage.getItem(ck) || "null"); if (c) return (surahCache[n] = c); } catch {}
    const base = `https://api.alquran.cloud/v1/surah/${n}/editions/`;
    let j;
    try { j = await (await fetch(base + "quran-uthmani,en.transliteration,uz.sodik")).json(); if (j.code !== 200) throw 0; }
    catch { j = await (await fetch(base + "quran-uthmani,en.transliteration")).json(); }
    const [ar, tl, tr] = j.data;
    const ayahs = ar.ayahs.map((a, i) => {
      let text = a.text;
      if (i === 0 && n !== 1 && n !== 9) { const p = text.split(" "); if (stripMarks(p[0]).replace(/ٱ/g, "ا") === "بسم") text = p.slice(4).join(" "); }
      return { a: a.numberInSurah, g: a.number, ar: text, tl: tl ? tl.ayahs[i].text : "", tr: tr ? tr.ayahs[i].text : "" };
    });
    const data = { n, ayahs };
    surahCache[n] = data;
    try { localStorage.setItem(ck, JSON.stringify(data)); } catch {}
    return data;
  };

  /* ---------------- Eksport ---------------- */
  window.QNapp = { $, $$, esc, arDigits, todayStr, dayOfYear, shuffle, pick, S: () => S, save, toast, confetti, award, toggle, cnt,
    modPct, totalPct, levelName, badgesDef, hifzUnits, lessonsOf, refreshShell, applySettings, speak, playAyahs, stopAll, audio, P,
    recToggle, loadSurah, stopSpeech: () => { ttsAudio.pause(); if ("speechSynthesis" in window) speechSynthesis.cancel(); }, ayahUrl, reset: () => { S = blank(); save(); }, importState: (o) => { S = Object.assign(blank(), o); S.settings = Object.assign(blank().settings, o.settings || {}); save(); } };
})();
