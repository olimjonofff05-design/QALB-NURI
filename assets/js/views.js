/* =========================================================
   QALB NURI — sahifalar (views) va router
   ========================================================= */
(() => {
  const A = window.QNapp;
  const { $, $$, esc, arDigits, shuffle, pick, toast } = A;
  const S = () => A.S();
  const app = $("#app");
  const H = QN.harakat;
  const ZWJ = "‍";
  let cleanups = [];
  const onCleanup = (f) => cleanups.push(f);

  /* ---------------- Kichik komponentlar ---------------- */
  const bar = (p, cls = "") => `<div class="bar ${cls}"><i style="width:${Math.round(p * 100)}%"></i></div>`;
  const say = (text, cls = "play sm", label = "🔊") => `<button class="${cls}" data-say="${esc(text)}" title="Tinglash">${label}</button>`;
  const recPair = () => `<button class="btn rec sm" data-rec>🎙 Yozib olish</button><button class="btn ghost sm" data-recplay hidden>▶ Ovozim</button>`;
  const doneBtn = (on, attrs, onTxt = "✅ O'rgandim", offTxt = "☐ O'rgandim deb belgilash") => `<button class="btn sm ${on ? "done" : ""}" ${attrs}>${on ? onTxt : offTxt}</button>`;
  const back = (href, txt) => `<a class="btn ghost sm" href="${href}">← ${txt}</a>`;
  const forms = (L) => L.j ? [L.c, L.c + ZWJ, ZWJ + L.c + ZWJ, ZWJ + L.c] : [L.c, L.c, ZWJ + L.c, ZWJ + L.c];
  const formNames = ["Alohida", "Boshida", "O'rtasida", "Oxirida"];
  const vowel = (L) => (L.c === "ا" ? "" : L.t);
  const strip = (s) => String(s).replace(/<[^>]+>/g, "");

  /* Bo'g'inlar generatori */
  const genSyl = (kind, only) => {
    const out = [];
    QN.letters.forEach((L) => {
      if (only && L !== only) return;
      const isAlif = L.c === "ا", t = vowel(L), c = L.c;
      switch (kind) {
        case "fatha": out.push([(isAlif ? "أ" : c) + H.fatha, t + "a"]); break;
        case "kasra": out.push([(isAlif ? "إ" : c) + H.kasra, t + "i"]); break;
        case "damma": out.push([(isAlif ? "أ" : c) + H.damma, t + "u"]); break;
        case "sukun": if (!isAlif) out.push(["أَ" + c + H.sukun, "a" + t]); break;
        case "shadda": if (!isAlif) out.push(["أَ" + c + H.shadda + H.fatha, "a" + t + t + "a"]); break;
        case "tanvin": if (!isAlif) out.push([c + H.fathatan + "ا", t + "an"], [c + H.kasratan, t + "in"], [c + H.dammatan, t + "un"]); break;
        case "madd":
          if (isAlif) out.push(["آ", "ā"], ["إِي", "ī"], ["أُو", "ū"]);
          else out.push([c + H.fatha + "ا", t + "ā"], [c + H.kasra + "ي", t + "ī"], [c + H.damma + "و", t + "ū"]);
          break;
      }
    });
    return out;
  };
  const sylGrid = (items) => `<div class="syl-grid">${items.map(([a, t]) => `<div class="syl" data-say="${esc(a)}"><div class="a ar">${a}</div><div class="t">${esc(t)}</div></div>`).join("")}</div>`;

  const wordsList = (items) => `<div class="grid gauto">${items.map(([a, t, m]) => `
    <div class="card flat" style="padding:16px">
      <div class="row between"><div class="dua-ar" style="font-size:calc(2rem * var(--ar-scale))">${a}</div>${say(a)}</div>
      <div class="translit">${esc(t)}</div><div class="muted small">${esc(m)}</div>
    </div>`).join("")}</div>`;

  const ayahWords = (ar) => ar.split(" ").filter(Boolean).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");

  /* ---------------- Global hodisalar (delegatsiya) ---------------- */
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-say]");
    if (s) {
      s.classList.add("playing");
      A.speak(s.dataset.say, s.dataset.rate ? +s.dataset.rate : 0.72).then(() => s.classList.remove("playing"));
      return;
    }
    const r = e.target.closest("[data-rec]");
    if (r) { const pb = r.nextElementSibling?.matches("[data-recplay]") ? r.nextElementSibling : null; A.recToggle(r, pb); return; }
    const q = e.target.closest("[data-qa]");
    if (q) { const [s1, a1] = q.dataset.qa.split(":").map(Number); A.playAyahs([{ s: s1, a: a1 }], { repeat: +(q.dataset.rep || 1) }); return; }
  });

  /* Iz chizish (tracing) kanvasi */
  const initTrace = (wrap, text) => {
    const cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    let guide = true, drawing = false, last = null;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const size = () => { const r = cv.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint(); };
    const paint = () => {
      const w = cv.width / dpr, h = cv.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(11,107,80,.12)"; ctx.lineWidth = 1;
      for (let y = 40; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(201,162,39,.45)"; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(0, h * 0.66); ctx.lineTo(w, h * 0.66); ctx.stroke(); ctx.setLineDash([]);
      if (guide) {
        ctx.fillStyle = "rgba(11,107,80,.14)"; ctx.textAlign = "center"; ctx.direction = "rtl";
        const fs = Math.min(h * 0.62, (w / Math.max(1, text.replace(ZWJ, "").length)) * 1.1);
        ctx.font = `${fs}px Amiri, "Noto Naskh Arabic", serif`;
        ctx.fillText(text, w / 2, h * 0.66);
      }
    };
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
    cv.onpointerdown = (ev) => { drawing = true; last = pos(ev); cv.setPointerCapture(ev.pointerId); };
    cv.onpointermove = (ev) => {
      if (!drawing) return; const p = pos(ev);
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--g-700") || "#0b6b50";
      ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p;
    };
    cv.onpointerup = cv.onpointercancel = () => (drawing = false);
    document.fonts?.ready.then(size); size();
    window.addEventListener("resize", size); onCleanup(() => window.removeEventListener("resize", size));
    return { clear: paint, toggleGuide: () => { guide = !guide; paint(); }, set: (t) => { text = t; paint(); } };
  };
  const writeStage = (text, fs = 170) => `<div class="write-stage"><svg viewBox="0 0 400 260"><text x="200" y="180" text-anchor="middle" font-size="${fs}" direction="rtl">${esc(text)}</text></svg></div>`;
  const animate = (root) => { const t = root.querySelector(".write-stage text"); if (!t) return; t.classList.remove("go"); void t.getBBox(); t.classList.add("go"); };

  /* ---------------- Keyingi qadam ---------------- */
  const nextStep = () => {
    const s = S();
    for (const m of QN.modules) {
      if (A.modPct(m.id) >= 1) continue;
      switch (m.id) {
        case "alifbo": { const i = QN.letters.findIndex((_, k) => !s.letters[k]); return { m, route: `#/alifbo/${i}`, label: `«${QN.letters[i].n}» harfini o'rganish` }; }
        case "harf": case "harakat": case "oqish": case "tajvid": { const l = A.lessonsOf(m.id).find((x) => !s.lessons[x.id]); return { m, route: `#/dars/${l.id}`, label: l.title }; }
        case "quron": { const n = QN.readPlan.find((x) => !s.read[x]); return { m, route: `#/quron/${n}`, label: `${QN.surahs[n - 1][1]} surasini o'qish` }; }
        case "hifz": { const u = A.hifzUnits().find((x) => x.done < x.total); return { m, route: u.from > 1 || u.to < QN.surahs[u.s - 1][2] ? `#/quron/${u.s}/hifz/${u.from}/${u.to}` : `#/quron/${u.s}/hifz`, label: `${u.name} — yodlash` }; }
        case "ibodat": { const l = QN.ibodatLessons.find((x) => !s.ibodat[x.id]); return { m, route: `#/namoz/${l.id}`, label: l.title }; }
        default: return { m, route: m.route, label: m.title };
      }
    }
    return { m: null, route: "#/quron", label: "Qur'on tilovatini davom ettirish" };
  };

  /* =========================================================
     BOSH SAHIFA
     ========================================================= */
  const viewHome = () => {
    const s = S(), p = A.totalPct(), nx = nextStep();
    const hr = new Date().getHours();
    const greet = hr < 5 ? "Xayrli tun" : hr < 11 ? "Xayrli tong" : hr < 17 ? "Xayrli kun" : "Xayrli kech";
    const dh = QN.hadiths[A.dayOfYear() % QN.hadiths.length];
    const dd = QN.duas[(A.dayOfYear() * 7) % QN.duas.length];
    const dailyN = s.daily.d === A.todayStr() ? s.daily.n : 0;
    app.innerHTML = `<div class="view stack">
      <section class="hero"><div class="hero-grid">
        <div>
          <div class="pill gold">Assalomu alaykum! ${greet}</div>
          <h1 style="margin-top:12px">Qalbingizga Qur'on nurini olib kiring</h1>
          <p>Arab alifbosining birinchi harfidan boshlab, suralarni to'liq o'qish va yodlashgacha — qadam-baqadam, o'z tezligingizda. Har bir harf uchun ajr bor!</p>
          <div class="ar-big">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
          <p class="small" style="opacity:.85;margin-top:-4px">«Yaratgan Robbing nomi bilan o'qi!» — Alaq, 1</p>
          <div class="row" style="margin-top:14px">
            <a class="btn" href="${nx.route}">▶ ${p > 0 ? "Davom ettirish" : "O'qishni boshlash"}</a>
            <a class="btn ghost" href="#/yol">🧭 O'quv yo'li</a>
          </div>
          <p class="small" style="margin-top:10px;opacity:.9">Keyingi qadam: <b>${esc(nx.label)}</b></p>
        </div>
        <div class="center">
          <div class="ring" style="--p:${p}"><div><div class="pct">${Math.floor(p)}%</div><div class="small" style="opacity:.85">${A.levelName(p)}</div></div></div>
          <div class="row" style="justify-content:center;margin-top:16px">
            <span class="pill gold">🔥 ${s.streak.n} kun</span><span class="pill gold">⭐ ${s.xp} ball</span>
          </div>
        </div>
      </div></section>

      <div class="grid g3">
        <div class="card"><div class="row between"><h3>🎯 Bugungi maqsad</h3><span class="pill">${Math.min(dailyN, 5)}/5</span></div>
          <p class="small">Har kuni kamida 5 ta amal: harf, dars, oyat, duo yoki hadis. Oz bo'lsa ham — doimiy!</p>${bar(Math.min(1, dailyN / 5), "gold")}</div>
        <div class="card daily"><div class="row between"><h3>📜 Kun hadisi</h3>${say(dh.ar)}</div><div class="q">${dh.ar}</div><p class="small">${esc(dh.m)}</p><div class="src">${dh.src}</div></div>
        <div class="card daily"><div class="row between"><h3>🤲 Kun duosi</h3>${say(dd.ar)}</div><div class="small muted">${esc(dd.t)}</div><div class="q">${dd.ar}</div><p class="small translit">${esc(dd.tr)}</p></div>
      </div>

      <div class="sec"><h2>O'quv modullari</h2><a href="#/yol" class="small">Barchasini ko'rish →</a></div>
      <div class="grid g4">${QN.modules.map((m) => { const mp = A.modPct(m.id); return `
        <a class="card hover" href="${m.route}" style="color:inherit">
          <div class="row between"><span style="font-size:1.6rem" class="${m.icon.length < 3 ? "ar" : ""}">${m.icon}</span><span class="pill">${Math.round(mp * 100)}%</span></div>
          <h3 style="margin-top:10px">${m.title}</h3><p class="small">${m.desc}</p>${bar(mp)}
        </a>`; }).join("")}</div>

      <div class="sec"><h2>Nishonlar</h2><span class="muted small">${Object.keys(s.badges).length}/${A.badgesDef.length}</span></div>
      <div class="grid g4">${A.badgesDef.map((b) => `<div class="card flat badge-ach ${s.badges[b.id] ? "on" : ""}"><div class="e">${b.e}</div><b>${b.t}</b><div class="muted small">${b.d}</div></div>`).join("")}</div>

      <div class="card" style="margin-top:10px"><div class="row between"><div><h3>🤝 Yaxshilikka yo'l ko'rsating</h3><p class="small" style="margin:0">«Kim bir yaxshilikka yo'l ko'rsatsa, unga uni qilganning ajricha ajr bor» (Muslim). Saytni yaqinlaringizga ulashing.</p></div><button class="btn gold" data-share>Ulashish</button></div></div>
    </div>`;
  };

  /* =========================================================
     O'QUV YO'LI
     ========================================================= */
  const viewPath = () => {
    const nx = nextStep();
    app.innerHTML = `<div class="view stack">
      <div><h1>🧭 O'quv yo'li: 0% → 100%</h1><p>Har bir bosqich umumiy progressga ma'lum ulush qo'shadi. Tavsiya etilgan tartibda boring — har bir bosqich keyingisi uchun poydevor.</p></div>
      <div class="card"><div class="row between"><b>Umumiy progress</b><b>${A.totalPct().toFixed(1)}%</b></div><div style="margin-top:8px">${bar(A.totalPct() / 100)}</div></div>
      <div class="path">${QN.modules.map((m, i) => { const mp = A.modPct(m.id); const cur = nx.m && nx.m.id === m.id; return `
        <div class="card step ${mp >= 1 ? "done" : ""} ${cur ? "cur" : ""}">
          <div class="step-badge ${m.icon.length < 3 ? "ar" : ""}">${mp >= 1 ? "✓" : m.icon}</div>
          <div><div class="row"><span class="pill">${i + 1}-bosqich</span><span class="muted small">umumiy yo'lning ${m.w}%</span></div>
            <h3 style="margin:6px 0 2px">${m.title}</h3><p class="small" style="margin:0 0 8px">${m.desc}</p>${bar(mp)}</div>
          <a class="btn ${cur ? "" : "ghost"} sm" href="${cur ? nx.route : m.route}">${mp >= 1 ? "Takrorlash" : cur ? "Davom etish ▶" : "Ochish"}</a>
        </div>`; }).join("")}</div>
    </div>`;
  };

  /* =========================================================
     ALIFBO
     ========================================================= */
  const viewAlphabet = () => {
    const s = S();
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>Arab alifbosi</h1><p>28 harf. Har bir harfni bosing: ko'rinishi, talaffuzi, yozilishi va mashqlari.</p></div>
        <div class="card flat" style="padding:14px 18px"><b>${A.cnt(s.letters)}/28</b> harf o'rganildi<div style="width:180px;margin-top:6px">${bar(A.cnt(s.letters) / 28)}</div></div></div>
      <div class="info">💡 Arab yozuvi <b>o'ngdan chapga</b> o'qiladi va yoziladi. Harflar asosan undoshlarni bildiradi; unlilar esa <b>harakatlar</b> (kichik belgilar) bilan ko'rsatiladi.</div>
      <div class="grid gletters">${QN.letters.map((L, i) => `
        <a class="letter-card ${s.letters[i] ? "learned" : ""}" href="#/alifbo/${i}" style="color:inherit">
          ${s.letters[i] ? '<span class="tick">✓</span>' : ""}<div class="L">${L.c}</div><div class="n">${L.n}</div><div class="muted small">${i + 1}</div>
        </a>`).join("")}</div>
      <div class="row"><a class="btn" href="#/sinov/harf">🎯 Harflarni sinash</a><a class="btn ghost" href="#/dars/shakllar">Keyingi: harf shakllari →</a></div>
    </div>`;
  };

  const viewLetter = (i) => {
    i = +i; const L = QN.letters[i]; if (!L) return viewAlphabet();
    const s = S(), f = forms(L);
    const sylls = [...genSyl("fatha", L), ...genSyl("kasra", L), ...genSyl("damma", L), ...genSyl("sukun", L), ...genSyl("madd", L), ...genSyl("tanvin", L)];
    app.innerHTML = `<div class="view stack">
      <div class="row between">${back("#/alifbo", "Alifbo")}<div class="row">
        ${i > 0 ? `<a class="btn ghost sm" href="#/alifbo/${i - 1}">← ${QN.letters[i - 1].n}</a>` : ""}
        ${i < 27 ? `<a class="btn ghost sm" href="#/alifbo/${i + 1}">${QN.letters[i + 1].n} →</a>` : ""}</div></div>
      <div class="grid g2">
        <div class="card center">
          <span class="pill">${i + 1}/28-harf</span>
          <div class="big-letter">${L.c}</div>
          <h2>${L.n} <span class="ar" style="color:var(--g-600)">${L.ar}</span></h2>
          <div class="row" style="justify-content:center;margin:10px 0">
            ${say(L.ar, "btn", "🔊 Nomini tinglash")}
            ${say((L.c === "ا" ? "أ" : L.c) + H.fatha, "btn ghost", "🔊 Tovushi")}
          </div>
          <div class="row" style="justify-content:center">${recPair()}</div>
          <p class="small muted" style="margin-top:10px">Tinglang → o'zingizni yozib oling → solishtiring. 5–10 marta takrorlang.</p>
        </div>
        <div class="card stack">
          <div><h3>🗣 Talaffuz</h3><p>${esc(L.s)}</p></div>
          <div><h3>📍 Maxraj (chiqish joyi)</h3><p>${esc(L.mx)}</p></div>
          <div><h3>✍️ Qanday yoziladi</h3><p>${esc(L.w)}</p></div>
          <div class="row between"><div><div class="dua-ar" style="font-size:2.2rem">${L.ex[0]}</div><span class="translit">${L.ex[1]}</span> — <span class="muted">${L.ex[2]}</span></div>${say(L.ex[0])}</div>
        </div>
      </div>

      <div class="card"><h3>So'zdagi 4 shakli</h3><p class="small">${L.j ? "Bu harf ikki tomondan ulanadi." : "⚠️ Bu harf o'zidan keyingi (chapdagi) harfga <b>ulanmaydi</b>."}</p>
        <div class="forms">${f.map((x, k) => `<div class="form-box"><div class="f">${x}</div><div class="small muted">${formNames[k]}</div></div>`).join("")}</div></div>

      <div class="grid g2">
        <div class="card"><div class="row between"><h3>Yozilishini ko'ring</h3><button class="btn ghost sm" id="reAnim">↻ Qayta</button></div>${writeStage(L.c, 190)}
          <p class="small muted" style="margin-top:8px">Chiziq qayerdan boshlanib, qayerga borishini kuzating. Yozuv <b>o'ngdan chapga</b>, nuqtalar oxirida qo'yiladi.</p></div>
        <div class="card"><div class="row between"><h3>Barmoq bilan chizing</h3><div class="row"><button class="btn ghost sm" id="trG">👁 Namuna</button><button class="btn ghost sm" id="trC">🧽 Tozalash</button></div></div>
          <div class="trace-wrap" id="trace"><canvas></canvas></div>
          <div class="row" style="margin-top:8px">${f.map((x, k) => `<button class="btn ghost sm" data-tf="${k}">${formNames[k]}</button>`).join("")}</div></div>
      </div>

      <div class="card"><h3>Harakatlar bilan o'qing</h3><p class="small">Har birini bosib tinglang va ovoz chiqarib takrorlang.</p>${sylGrid(sylls)}</div>

      <div class="card"><div class="row between"><div><h3>📓 Daftar mashqi</h3><p class="small" style="margin:0">Daftaringizga bu harfni 4 shaklida kamida 3 qatordan yozing. Yozayotganda ovoz chiqarib nomini ayting.</p></div>
        ${doneBtn(s.letters[i], `id="learn"`, "✅ O'rganildi", "✔ O'rgandim")}</div></div>
    </div>`;
    const stage = app; setTimeout(() => animate(stage), 200);
    $("#reAnim").onclick = () => animate(stage);
    const tr = initTrace($("#trace"), L.c);
    $("#trC").onclick = tr.clear; $("#trG").onclick = tr.toggleGuide;
    $$("[data-tf]").forEach((b) => (b.onclick = () => tr.set(f[+b.dataset.tf])));
    $("#learn").onclick = () => {
      const on = A.toggle("letters", i, 10, `«${L.n}» o'rganildi!`);
      if (on && i < 27) setTimeout(() => (location.hash = `#/alifbo/${i + 1}`), 900); else viewLetter(i);
    };
  };

  /* =========================================================
     DARSLAR
     ========================================================= */
  const modTitles = { harf: "Harf shakllari va belgilar", harakat: "Harakatlar", oqish: "O'qishni boshlash", tajvid: "Tajvid asoslari" };
  const viewLessons = () => {
    const s = S();
    app.innerHTML = `<div class="view stack"><div><h1>📖 Darslar va tajvid</h1><p>Alifbodan keyin harakatlar, so'ng o'qish va tajvid. Har bir darsda tinglash, takrorlash va yozib olish bor.</p></div>
      ${Object.entries(modTitles).map(([mod, t]) => `
        <div class="sec"><h2>${t}</h2><span class="pill">${Math.round(A.modPct(mod) * 100)}%</span></div>
        <div class="grid gauto">${A.lessonsOf(mod).map((l) => `
          <a class="card hover" href="#/dars/${l.id}" style="color:inherit">
            <div class="row between"><span class="ar" style="font-size:1.8rem;color:var(--g-600)">${l.icon}</span>${s.lessons[l.id] ? '<span class="pill">✓ tugallandi</span>' : ""}</div>
            <h3 style="margin-top:8px">${l.title}</h3></a>`).join("")}</div>`).join("")}
    </div>`;
  };

  const renderAyahBlock = async (el, s, from, to, note) => {
    el.innerHTML = `<div class="spinner"></div>`;
    try {
      const d = await A.loadSurah(s);
      el.innerHTML = d.ayahs.filter((x) => x.a >= from && x.a <= to).map((x) => `
        <div class="ayah">
          <div class="ayah-tools"><span class="anum">${s}:${x.a}</span><button class="play sm" data-qa="${s}:${x.a}">▶</button><button class="btn ghost sm" data-qa="${s}:${x.a}" data-rep="3">🔁 3×</button>${recPair()}</div>
          ${note ? `<div class="info" style="margin-bottom:8px">${esc(note)}</div>` : ""}
          <div class="ar-text">${esc(x.ar)} <span class="end-mark">﴿${arDigits(x.a)}﴾</span></div>
          <div class="tr">${esc(strip(x.tl))}</div>${x.tr ? `<div class="mean">${esc(x.tr)}</div>` : ""}
        </div>`).join("");
    } catch { el.innerHTML = `<div class="note">Oyat matnini yuklab bo'lmadi (internet kerak). Audio baribir ishlaydi: <button class="play sm" data-qa="${s}:${from}">▶</button></div>`; }
  };

  const viewLesson = (id) => {
    const l = QN.lessons.find((x) => x.id === id); if (!l) return viewLessons();
    const s = S(), list = A.lessonsOf(l.mod), idx = list.indexOf(l);
    const all = QN.lessons, gi = all.indexOf(l), nextL = all[gi + 1];
    const blocks = l.blocks.map((b, k) => {
      switch (b.type) {
        case "forms": return `<div class="card"><h3>Barcha harflarning shakllari</h3><div style="overflow-x:auto"><table class="t"><tr><th>Nomi</th>${formNames.map((n) => `<th>${n}</th>`).join("")}<th></th></tr>
          ${QN.letters.map((L) => `<tr><td><b>${L.n}</b></td>${forms(L).map((x) => `<td class="ar" style="font-size:calc(2rem * var(--ar-scale))">${x}</td>`).join("")}<td>${say(L.ar)}</td></tr>`).join("")}</table></div></div>`;
        case "extra": return `<div class="grid g3">${QN.extraSigns.map((x) => `<div class="card flat"><div class="row between"><div class="ar" style="font-size:2.6rem;color:var(--g-700)">${x.c === "ٰ" || x.c === "ٓ" ? "ـ" + x.c : x.c}</div><span class="pill">${x.n}</span></div><p class="small">${x.d}</p></div>`).join("")}</div>`;
        case "gen": return `<div class="card"><h3>Tinglang va takrorlang</h3><p class="small">Avval o'zingiz o'qing, so'ng bosib tekshiring.</p>${sylGrid(genSyl(b.kind))}</div>`;
        case "words": return `<div><h3 style="margin:8px 0 12px">${esc(b.title || "So'zlar")}</h3>${wordsList(b.items)}</div>`;
        case "mix": { const items = shuffle([...genSyl("fatha"), ...genSyl("kasra"), ...genSyl("damma")]).slice(0, 12);
          return `<div class="card"><h3>🧩 Aralash mashq</h3><p class="small">O'qing, so'ng bosib to'g'ri javobni ko'ring.</p><div class="syl-grid">${items.map(([a, t]) => `<div class="syl" data-say="${esc(a)}" data-mix><div class="a ar">${a}</div><div class="t" style="visibility:hidden">${t}</div></div>`).join("")}</div></div>`; }
        case "pairs": return `<div class="card"><h3>Juft harflarni farqlash</h3><div class="grid gauto">${QN.pairs.map(([x, y]) => { const a = QN.letters.find((L) => L.c === x), bb = QN.letters.find((L) => L.c === y) || { c: y, ar: "هَمْزَة", n: "Hamza" };
          return `<div class="card flat row" style="justify-content:space-around">${[a, bb].map((L) => `<div class="center"><div class="ar" style="font-size:3rem;color:var(--g-700)">${L.c}</div><b class="small">${L.n}</b><div>${say(L.c + H.fatha)}</div></div>`).join('<span class="muted">vs</span>')}</div>`; }).join("")}</div></div>`;
        case "ayahs": return `<div class="card" id="blk${k}" data-s="${b.s}" data-f="${b.from}" data-t="${b.to}"></div>`;
        case "ayah": return `<div class="card" id="blk${k}" data-s="${b.s}" data-f="${b.a}" data-t="${b.a}" data-note="${esc(b.note || "")}"></div>`;
      }
      return "";
    }).join("");
    app.innerHTML = `<div class="view stack">
      <div class="row between">${back("#/darslar", "Darslar")}<span class="pill">${modTitles[l.mod]} · ${idx + 1}/${list.length}</span></div>
      <div class="card"><div class="row"><span class="ar" style="font-size:2.4rem;color:var(--g-600)">${l.icon}</span><h1 style="margin:0">${l.title}</h1></div><div style="margin-top:10px">${l.intro}</div></div>
      ${blocks}
      <div class="card row between"><div><b>Darsni tugatdingizmi?</b><div class="small muted">Barcha misollarni tinglab, takrorlagan bo'lsangiz — belgilang.</div></div>
        <div class="row">${doneBtn(s.lessons[id], 'id="ldone"', "✅ Tugallandi", "✔ Darsni tugatdim")}${nextL ? `<a class="btn ghost" href="#/dars/${nextL.id}">Keyingi dars →</a>` : `<a class="btn ghost" href="#/quron">Qur'onga o'tish →</a>`}</div></div>
    </div>`;
    $$("[id^=blk]").forEach((el) => renderAyahBlock(el, +el.dataset.s, +el.dataset.f, +el.dataset.t, el.dataset.note));
    $$("[data-mix]").forEach((el) => el.addEventListener("click", () => (el.querySelector(".t").style.visibility = "visible")));
    $("#ldone").onclick = () => { const on = A.toggle("lessons", id, 20, "Dars tugallandi!"); if (on && nextL) setTimeout(() => (location.hash = `#/dars/${nextL.id}`), 900); else viewLesson(id); };
  };

  /* =========================================================
     YOZUV MASHQI
     ========================================================= */
  const viewWriting = (i = 1) => {
    i = +i || 0; const L = QN.letters[i] || QN.letters[1], f = forms(L);
    app.innerHTML = `<div class="view stack">
      <div><h1>✍️ Yozuv mashqi</h1><p>Harfni tanlang → yozilishini kuzating → ekranda barmoq/sichqoncha bilan chizing → so'ng <b>daftaringizga</b> yozing.</p></div>
      <div class="card"><div class="row" style="gap:6px">${QN.letters.map((x, k) => `<a class="btn ${k === i ? "" : "ghost"} sm ar" style="font-size:1.3rem;min-width:46px" href="#/yozuv/${k}">${x.c}</a>`).join("")}</div></div>
      <div class="grid g2">
        <div class="card"><div class="row between"><h3>${L.n} — yozilishi</h3><button class="btn ghost sm" id="reAnim">↻ Qayta</button></div>${writeStage(L.c, 190)}<p class="small" style="margin-top:8px">${esc(L.w)}</p>
          <div class="forms" style="margin-top:10px">${f.map((x, k) => `<div class="form-box" data-tf="${k}" style="cursor:pointer"><div class="f">${x}</div><div class="small muted">${formNames[k]}</div></div>`).join("")}</div></div>
        <div class="card"><div class="row between"><h3>Chizish maydoni</h3><div class="row"><button class="btn ghost sm" id="trG">👁 Namuna</button><button class="btn ghost sm" id="trC">🧽 Tozalash</button></div></div>
          <div class="trace-wrap" id="trace"><canvas></canvas></div><p class="small muted" style="margin-top:8px">Shaklni o'zgartirish uchun chapdagi shakllardan birini bosing.</p></div>
      </div>
      <div class="card"><h3>📓 Daftar uchun maslahatlar</h3><ol class="list">
        <li>Katakli yoki chiziqli daftar oling. Har sahifaning <b>o'ng tomonidan</b> boshlang.</li>
        <li>Har bir harfni avval katta (3–4 katak), so'ng odatiy o'lchamda yozing.</li>
        <li>Ketma-ketlik: 1 qator alohida shakl → 1 qator boshlang'ich → 1 qator o'rta → 1 qator oxirgi shakl.</li>
        <li>Asosiy chiziqni avval, <b>nuqta va harakatlarni oxirida</b> qo'ying.</li>
        <li>Yozayotganda harf nomini va tovushini ovoz chiqarib ayting — ko'rish, eshitish va harakat birga xotirani kuchaytiradi.</li>
        <li>Kuniga 2–3 harf yetarli. Har kuni avvalgi harflarni 1 qatordan takrorlang.</li>
        <li>Alifbodan keyin so'zlarni ko'chiring: <span class="ar">بِسْمِ اللّٰهِ</span>, <span class="ar">الْحَمْدُ لِلّٰهِ</span>, so'ng Fotiha surasini.</li></ol></div>
      <div class="card"><h3>So'zlarni yozish</h3><div class="row">${["بِسْمِ", "اللّٰه", "الْحَمْدُ", "رَبِّ", "قَلْب", "نُور", "مُحَمَّد"].map((w) => `<button class="btn ghost" data-tw="${w}"><span class="ar" style="font-size:1.4rem">${w}</span></button>`).join("")}</div></div>
    </div>`;
    setTimeout(() => animate(app), 200);
    $("#reAnim").onclick = () => animate(app);
    const tr = initTrace($("#trace"), L.c);
    $("#trC").onclick = tr.clear; $("#trG").onclick = tr.toggleGuide;
    $$("[data-tf]").forEach((b) => (b.onclick = () => tr.set(f[+b.dataset.tf])));
    $$("[data-tw]").forEach((b) => (b.onclick = () => { tr.set(b.dataset.tw); const t = app.querySelector(".write-stage text"); t.textContent = b.dataset.tw; t.setAttribute("font-size", 110); animate(app); A.speak(b.dataset.tw); }));
  };

  /* =========================================================
     SINOVLAR
     ========================================================= */
  const ibodatBank = [
    ["Bomdod namozining farzi necha rakat?", "2", ["2", "3", "4", "1"]],
    ["Shom namozining farzi necha rakat?", "3", ["2", "3", "4", "5"]],
    ["Peshin namozining farzi necha rakat?", "4", ["2", "3", "4", "6"]],
    ["Hanafiy mazhabida tahoratning nechta farzi bor?", "4", ["3", "4", "5", "6"]],
    ["Hanafiy mazhabida g'uslning nechta farzi bor?", "3", ["2", "3", "4", "7"]],
    ["Vitr namozi necha rakat?", "3", ["1", "2", "3", "4"]],
    ["Ruku'da qaysi tasbeh aytiladi?", "Subhana robbiyal 'aziym", ["Subhana robbiyal 'aziym", "Subhana robbiyal a'la", "Sami'allohu liman hamidah", "Robbana lakal hamd"]],
    ["Sajdada qaysi tasbeh aytiladi?", "Subhana robbiyal a'la", ["Subhana robbiyal 'aziym", "Subhana robbiyal a'la", "Allohu akbar", "Astag'firulloh"]],
    ["Iymonning nechta arkoni bor?", "6", ["4", "5", "6", "7"]],
    ["Islomning nechta arkoni bor?", "5", ["4", "5", "6", "3"]],
    ["Qunut duosi qaysi namozda o'qiladi?", "Vitr", ["Bomdod", "Vitr", "Juma", "Shom"]],
    ["Qur'oni Karimda nechta sura bor?", "114", ["99", "110", "114", "120"]],
    ["Qalqala harflari qaysilar?", "ق ط ب ج د", ["ق ط ب ج د", "ي ر م ل و ن", "ء ه ع ح غ خ", "ف و ب م"]],
    ["Nūn sokin «ب» dan oldin kelsa, qaysi hukm?", "Iqlob", ["Izhor", "Idg'om", "Iqlob", "Ixfo"]],
    ["Nūn sokin bo'g'iz harflaridan oldin kelsa?", "Izhor", ["Izhor", "Idg'om", "Iqlob", "Ixfo"]],
    ["Madd lozim necha harakat cho'ziladi?", "6", ["2", "4", "6", "1"]],
    ["Lom shamsiyada «ال» dagi lām...", "o'qilmaydi", ["o'qiladi", "o'qilmaydi", "qalin o'qiladi", "cho'ziladi"]],
    ["Qaysi harflar chapdagi harfga ulanmaydi?", "ا د ذ ر ز و", ["ا د ذ ر ز و", "ب ت ث ن ي", "ج ح خ ع غ", "س ش ص ض"]],
    ["Namozdan keyin «Subhanalloh» necha marta aytiladi?", "33", ["10", "33", "40", "100"]],
    ["Juma namozining farzi necha rakat?", "2", ["2", "4", "3", "6"]],
  ];
  const quizzes = {
    harf: { t: "Harfni tanish", d: "Harfni ko'rib, nomini toping", e: "🔤", gen: () => shuffle(QN.letters).slice(0, 10).map((L) => ({ p: `<div class="big-letter" style="font-size:7rem">${L.c}</div>`, ok: L.n, opts: shuffle([L.n, ...shuffle(QN.letters.filter((x) => x !== L)).slice(0, 3).map((x) => x.n)]) })) },
    eshit: { t: "Eshitib topish", d: "Talaffuzni eshitib, harfni toping", e: "👂", gen: () => shuffle(QN.letters).slice(0, 10).map((L) => ({ p: `<div class="center"><button class="btn" data-say="${L.ar}">🔊 Qayta eshitish</button><p class="small muted" style="margin-top:10px">Qaysi harf aytildi?</p></div>`, say: L.ar, ok: L.c, ar: true, opts: shuffle([L.c, ...shuffle(QN.letters.filter((x) => x !== L)).slice(0, 3).map((x) => x.c)]) })) },
    harakat: { t: "Harakat bilan o'qish", d: "Bo'g'inni to'g'ri o'qing", e: "◌َ", gen: () => shuffle(QN.letters.filter((L) => L.c !== "ا")).slice(0, 10).map((L) => {
      const t = L.t, all = [[L.c + H.fatha, t + "a"], [L.c + H.kasra, t + "i"], [L.c + H.damma, t + "u"], [L.c + H.fatha + "ا", t + "ā"], [L.c + H.kasra + "ي", t + "ī"], [L.c + H.damma + "و", t + "ū"], [L.c + H.dammatan, t + "un"], [L.c + H.kasratan, t + "in"]];
      const c = pick(all); return { p: `<div class="big-letter" style="font-size:6.5rem">${c[0]}</div>`, ok: c[1], opts: shuffle([c[1], ...shuffle(all.filter((x) => x !== c)).slice(0, 3).map((x) => x[1])]), after: c[0] }; }) },
    asmo: { t: "Asmaul Husna", d: "Ismni ko'rib, ma'nosini toping", e: "✨", gen: () => shuffle(QN.names).slice(0, 10).map((N) => ({ p: `<div class="center"><div class="ar" style="font-size:3.4rem;color:var(--g-700)">${N[0]}</div><div class="translit">${N[1]}</div></div>`, ok: N[2], opts: shuffle([N[2], ...shuffle(QN.names.filter((x) => x !== N)).slice(0, 3).map((x) => x[2])]) })) },
    ibodat: { t: "Namoz va tajvid bilimlari", d: "Fiqh va tajvid savollari", e: "🕌", gen: () => shuffle(ibodatBank).slice(0, 10).map(([q, ok, o]) => ({ p: `<h2 class="center">${esc(q)}</h2>`, ok, opts: shuffle(o), ar: /[؀-ۿ]/.test(ok) })) },
  };
  const viewQuiz = (id) => {
    const s = S();
    if (!id || !quizzes[id]) {
      app.innerHTML = `<div class="view stack"><div><h1>🎯 Sinovlar</h1><p>O'rganganlaringizni mustahkamlang. Har bir to'g'ri javob uchun ball olasiz.</p></div>
        <div class="grid gauto">${Object.entries(quizzes).map(([k, q]) => `<a class="card hover" href="#/sinov/${k}" style="color:inherit"><div style="font-size:2rem" class="ar">${q.e}</div><h3 style="margin-top:8px">${q.t}</h3><p class="small">${q.d}</p>${s.quizBest[k] != null ? `<span class="pill">Eng yaxshi: ${s.quizBest[k]}/10</span>` : `<span class="pill gold">Yangi</span>`}</a>`).join("")}</div></div>`;
      return;
    }
    const qs = quizzes[id].gen(); let i = 0, score = 0;
    const render = () => {
      if (i >= qs.length) {
        const best = Math.max(score, s.quizBest[id] || 0); s.quizBest[id] = best;
        A.award(score * 2, `Natija: ${score}/${qs.length}`);
        if (score >= 9) A.confetti();
        app.innerHTML = `<div class="view stack"><div class="card center" style="padding:40px"><div style="font-size:4rem">${score >= 9 ? "🏆" : score >= 6 ? "🌟" : "💪"}</div>
          <h1>${score}/${qs.length}</h1><p>${score >= 9 ? "Mashaalloh! Ajoyib natija!" : score >= 6 ? "Yaxshi! Yana bir oz mashq qiling." : "Taslim bo'lmang — takrorlash bilimning onasi!"}</p>
          <div class="row" style="justify-content:center"><a class="btn" href="#/sinov/${id}" onclick="setTimeout(()=>dispatchEvent(new HashChangeEvent('hashchange')),0)">↻ Qayta</a><a class="btn ghost" href="#/sinov">Boshqa sinov</a></div></div></div>`;
        return;
      }
      const q = qs[i];
      app.innerHTML = `<div class="view stack" style="max-width:760px;margin:auto">
        <div class="row between">${back("#/sinov", "Sinovlar")}<b>${i + 1}/${qs.length}</b></div>${bar(i / qs.length)}
        <div class="card">${q.p}</div>
        <div class="grid g2">${q.opts.map((o) => `<button class="quiz-opt" data-o="${esc(o)}">${q.ar ? `<span class="ar">${esc(o)}</span>` : esc(o)}</button>`).join("")}</div></div>`;
      if (q.say) setTimeout(() => A.speak(q.say), 300);
      $$(".quiz-opt").forEach((b) => (b.onclick = () => {
        $$(".quiz-opt").forEach((x) => { x.disabled = true; if (x.dataset.o === q.ok) x.classList.add("ok"); });
        if (b.dataset.o === q.ok) score++; else b.classList.add("bad");
        if (q.after) A.speak(q.after);
        setTimeout(() => { i++; render(); }, 1100);
      }));
    };
    render();
  };

  /* =========================================================
     QUR'ON — suralar ro'yxati
     ========================================================= */
  const viewQuran = () => {
    const s = S();
    let filter = sessionStorage.getItem("qn_qf") || "plan", q = "";
    const draw = () => {
      let list = QN.surahs.map((x, k) => ({ n: k + 1, x }));
      if (filter === "plan") list = QN.readPlan.map((n) => ({ n, x: QN.surahs[n - 1] }));
      if (filter === "hifz") list = list.filter(({ n, x }) => Object.keys(s.hifz).some((k) => k.startsWith(n + ":")));
      if (q) list = list.filter(({ n, x }) => (x[1] + " " + x[0] + " " + n + " " + (QN.surahMeaning[n] || "")).toLowerCase().includes(q.toLowerCase()));
      $("#slist").innerHTML = list.length ? list.map(({ n, x }) => `
        <a class="card hover surah-item" href="#/quron/${n}" style="color:inherit">
          <div class="surah-num">${n}</div>
          <div><b>${x[1]}</b> ${s.read[n] ? '<span class="pill">✓ o\'qildi</span>' : ""}<div class="muted small">${QN.surahMeaning[n] ? QN.surahMeaning[n] + " · " : ""}${x[2]} oyat · ${x[3] === "M" ? "Makkiy" : "Madaniy"}</div></div>
          <div class="surah-ar">${x[0]}</div></a>`).join("") : `<div class="empty">Hech narsa topilmadi.</div>`;
      $$("[data-qf]").forEach((b) => b.classList.toggle("on", b.dataset.qf === filter));
    };
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>📗 Qur'oni Karim</h1><p>114 sura — arabcha matn, lotin transkripsiyasi, o'zbekcha ma'no tarjimasi va qori ovozida tilovat.</p></div>
        <div class="card flat" style="padding:14px 18px"><b>O'qish rejasi:</b> ${QN.readPlan.filter((n) => s.read[n]).length}/${QN.readPlan.length}<div style="width:200px;margin-top:6px">${bar(A.modPct("quron"))}</div></div></div>
      <div class="row between"><div class="tabs"><button data-qf="plan">O'qish rejasi (30-pora)</button><button data-qf="all">Barcha 114 sura</button><button data-qf="hifz">Yodlanayotganlar</button></div>
        <input type="search" id="sq" placeholder="🔎 Sura nomi yoki raqami…" style="min-width:240px" /></div>
      <div class="info">💡 O'qishni <b>Fotiha</b> va qisqa suralardan (Nos, Falaq, Ixlos…) boshlang — ular eng oson va namozda o'qiladi. Ma'no tarjimasi: Shayx Muhammad Sodiq Muhammad Yusuf.</div>
      <div class="grid g2" id="slist"></div></div>`;
    $$("[data-qf]").forEach((b) => (b.onclick = () => { filter = b.dataset.qf; sessionStorage.setItem("qn_qf", filter); draw(); }));
    $("#sq").oninput = (e) => { q = e.target.value.trim(); if (q && filter === "plan") filter = "all"; draw(); };
    draw();
  };

  /* =========================================================
     SURA O'QISH / HIFZ
     ========================================================= */
  const viewSurah = async (n, mode, from, to) => {
    n = +n; const meta = QN.surahs[n - 1]; if (!meta) return viewQuran();
    const s = S(), set = s.settings, hifz = mode === "hifz";
    from = +from || 1; to = +to || meta[2];
    const partial = from > 1 || to < meta[2];
    let hm = hifz ? (sessionStorage.getItem("qn_hm") || "first") : "open";
    app.innerHTML = `<div class="view stack">
      <div class="row between">${back(hifz ? "#/hifz" : "#/quron", hifz ? "Hifz" : "Suralar")}<div class="row">
        ${n > 1 ? `<a class="btn ghost sm" href="#/quron/${n - 1}${hifz ? "/hifz" : ""}">← ${QN.surahs[n - 2][1]}</a>` : ""}
        ${n < 114 ? `<a class="btn ghost sm" href="#/quron/${n + 1}${hifz ? "/hifz" : ""}">${QN.surahs[n][1]} →</a>` : ""}</div></div>
      <div class="hero" style="padding:26px"><div class="row between" style="position:relative;z-index:1">
        <div><span class="pill gold">${n}-sura · ${meta[2]} oyat · ${meta[3] === "M" ? "Makkiy" : "Madaniy"}</span><h1 style="margin:10px 0 4px">${meta[1]} surasi ${hifz ? "— yodlash" : ""}</h1><p style="margin:0">${QN.surahMeaning[n] || ""}${partial ? ` · ${from}–${to}-oyatlar` : ""}</p></div>
        <div class="ar-big" style="font-size:2.6rem">${meta[0]}</div></div>
        <div class="row" style="margin-top:14px;position:relative;z-index:1"><button class="btn" id="playAll">▶ Butun tilovat</button>
          ${hifz ? "" : doneBtn(s.read[n], 'id="readDone"', "✅ O'qib chiqildi", "✔ O'qib chiqdim")}
          ${hifz ? `<a class="btn ghost" href="#/quron/${n}">📖 Oddiy o'qish</a>` : `<a class="btn ghost" href="#/quron/${n}/hifz${partial ? `/${from}/${to}` : ""}">💚 Yodlash rejimi</a>`}
          ${partial ? `<a class="btn ghost" href="#/quron/${n}${hifz ? "/hifz" : ""}">Butun sura</a>` : ""}</div></div>
      <div class="toolbar">
        <label>Qori <select id="rc">${QN.reciters.map((r) => `<option value="${r.id}" ${r.id === set.reciter ? "selected" : ""}>${r.n}</option>`).join("")}</select></label>
        <label>Takror <select id="rp">${[1, 2, 3, 5, 7, 10, 99].map((x) => `<option value="${x}" ${x === (set.repeat || 1) ? "selected" : ""}>${x === 99 ? "∞" : x + "×"}</option>`).join("")}</select></label>
        <label>Tezlik <select id="rt">${[0.6, 0.75, 0.9, 1, 1.25].map((x) => `<option value="${x}" ${x === (set.rate || 1) ? "selected" : ""}>${x}×</option>`).join("")}</select></label>
        <label><input type="checkbox" id="cTl" ${set.translit ? "checked" : ""}/> Transkripsiya</label>
        <label><input type="checkbox" id="cTr" ${set.tr ? "checked" : ""}/> Tarjima</label>
        ${hifz ? `<label>Matn <select id="hm"><option value="open">Ochiq</option><option value="first">Faqat 1-so'z</option><option value="hide">To'liq yashirin</option></select></label>` : ""}
      </div>
      ${hifz ? `<div class="info">💚 <b>Yodlash usuli:</b> 1) Oyatni 5–7 marta tinglang (takror: 5×). 2) Ko'rib turib 3 marta o'qing. 3) «Faqat 1-so'z» rejimida eslab o'qing — unutsangiz so'zni bosing. 4) «To'liq yashirin»da ayting va o'zingizni yozib tekshiring. 5) Yodlangach ✓ belgilang va keyingi oyatga o'ting. Har kuni oldingi yodlaganlaringizni takrorlang!</div>` : ""}
      <div class="card" id="ayahs" style="padding:10px"><div class="spinner"></div></div>
      ${!hifz ? `<div class="card row between"><div><b>Surani o'qib chiqdingizmi?</b><div class="small muted">Tilovatni tinglab, o'zingiz ham o'qib chiqqan bo'lsangiz belgilang.</div></div>${doneBtn(s.read[n], 'id="readDone2"', "✅ O'qib chiqildi", "✔ O'qib chiqdim")}</div>` : ""}
    </div>`;
    const box = $("#ayahs");
    const applyView = () => {
      box.classList.toggle("hide-words", hm !== "open"); box.classList.toggle("first", hm === "first");
      $$(".tr", box).forEach((e) => (e.style.display = set.translit ? "" : "none"));
      $$(".mean", box).forEach((e) => (e.style.display = set.tr ? "" : "none"));
    };
    $("#rc").onchange = (e) => { set.reciter = e.target.value; A.save(); };
    $("#rp").onchange = (e) => { set.repeat = +e.target.value; A.save(); };
    $("#rt").onchange = (e) => { set.rate = +e.target.value; A.audio.playbackRate = set.rate; A.save(); };
    $("#cTl").onchange = (e) => { set.translit = e.target.checked; A.save(); applyView(); };
    $("#cTr").onchange = (e) => { set.tr = e.target.checked; A.save(); applyView(); };
    if (hifz) { $("#hm").value = hm; $("#hm").onchange = (e) => { hm = e.target.value; sessionStorage.setItem("qn_hm", hm); applyView(); }; }
    const markRead = () => { A.toggle("read", n, 30, `${meta[1]} surasi o'qildi!`); viewSurah(n, mode, from, to); };
    $("#readDone") && ($("#readDone").onclick = markRead);
    $("#readDone2") && ($("#readDone2").onclick = markRead);

    let data;
    try { data = await A.loadSurah(n); }
    catch { box.innerHTML = `<div class="note">Sura matnini yuklab bo'lmadi. Internet aloqasini tekshirib, sahifani yangilang. (Bir marta ochilgan suralar keyin internetsiz ham ochiladi.)</div>`; return; }
    if (location.hash.split("/")[2] != n) return;
    const ayahs = data.ayahs.filter((x) => x.a >= from && x.a <= to);
    const hk = (a) => `${n}:${a}`;
    box.innerHTML = (n !== 1 && n !== 9 && from === 1 ? `<div class="bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>` : "") + ayahs.map((x) => `
      <div class="ayah" id="ay-${x.a}" data-a="${x.a}">
        <div class="ayah-tools"><span class="anum">${x.a}</span>
          <button class="play sm" data-pa="${x.a}" title="Shu oyatdan boshlab tinglash">▶</button>
          ${recPair()}
          ${hifz ? `<button class="btn ghost sm" data-rv="${x.a}">👁 Ko'rsat</button>` : ""}
          <button class="btn sm ${s.hifz[hk(x.a)] ? "done" : "ghost"}" data-hz="${x.a}">${s.hifz[hk(x.a)] ? "💚 Yodlandi" : "♡ Yodladim"}</button>
        </div>
        <div class="ar-text">${ayahWords(x.ar)} <span class="end-mark">﴿${arDigits(x.a)}﴾</span></div>
        <div class="tr">${esc(strip(x.tl))}</div>${x.tr ? `<div class="mean">${esc(x.tr)}</div>` : ""}
      </div>`).join("");
    applyView();
    const hilite = (it) => { $$(".ayah.now", box).forEach((e) => e.classList.remove("now")); if (it && it.s === n) { const el = $("#ay-" + it.a); if (el) { el.classList.add("now"); el.scrollIntoView({ behavior: "smooth", block: "center" }); } } };
    const playFrom = (a) => A.playAyahs(ayahs.filter((x) => x.a >= a).map((x) => ({ s: n, a: x.a })), { repeat: set.repeat || 1, onAyah: hilite, title: `${meta[1]} surasi` });
    $("#playAll").onclick = () => playFrom(from);
    box.onclick = (e) => {
      const pa = e.target.closest("[data-pa]"); if (pa) return playFrom(+pa.dataset.pa);
      const rv = e.target.closest("[data-rv]"); if (rv) { rv.closest(".ayah").classList.toggle("reveal"); return; }
      const hz = e.target.closest("[data-hz]");
      if (hz) { const a = +hz.dataset.hz, on = A.toggle("hifz", hk(a), 5, "Oyat yodlandi!"); hz.className = `btn sm ${on ? "done" : "ghost"}`; hz.textContent = on ? "💚 Yodlandi" : "♡ Yodladim";
        const u = A.hifzUnits().find((x) => x.s === n && a >= x.from && a <= x.to); if (on && u && u.done === u.total) { A.confetti(120); toast(`🎉 Mashaalloh! <b>${u.name}</b> to'liq yodlandi!`, 4000); } return; }
      const w = e.target.closest(".w"); if (w && box.classList.contains("hide-words")) w.classList.toggle("show");
    };
  };

  /* =========================================================
     HIFZ REJASI
     ========================================================= */
  const viewHifz = () => {
    const units = A.hifzUnits(), done = units.filter((u) => u.done === u.total);
    const review = done.length ? done[A.dayOfYear() % done.length] : null;
    const totalA = Object.keys(S().hifz).length;
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>💚 Hifz — Qur'onni yodlash</h1><p>Namozda o'qish uchun eng zarur suralardan boshlaymiz. Har bir oyatni alohida yodlab, belgilab boring.</p></div>
        <div class="card flat center" style="padding:14px 22px"><div style="font-size:1.8rem;font-weight:800;color:var(--g-700)">${done.length}/${units.length}</div><div class="small muted">sura yodlandi · ${totalA} oyat</div></div></div>
      <div class="grid g3">
        <div class="card"><h3>🎧 1. Tinglash</h3><p class="small">Oyatni qori ovozida 5–7 marta takror tinglang. Husariy qiroati o'rganish uchun eng qulay.</p></div>
        <div class="card"><h3>👁 2. Ko'rib o'qish</h3><p class="small">Matnga qarab ovoz chiqarib 3 marta o'qing, o'zingizni yozib oling va solishtiring.</p></div>
        <div class="card"><h3>🧠 3. Yashirib aytish</h3><p class="small">Matnni yashiring, eslab ayting. Unutsangiz — so'zni bosib ko'ring. So'ng ✓ belgilang.</p></div>
      </div>
      ${review ? `<div class="card row between"><div><h3>🔁 Bugungi takrorlash</h3><p class="small" style="margin:0">Yodlanganlar unutilmasligi uchun: bugun <b>${review.name}</b> surasini takrorlang.</p></div><a class="btn" href="#/quron/${review.s}/hifz${review.from > 1 ? `/${review.from}/${review.to}` : ""}">Takrorlash</a></div>` : ""}
      <div class="grid g2">${units.map((u, k) => `
        <a class="card hover" href="#/quron/${u.s}/hifz${u.from > 1 || u.to < QN.surahs[u.s - 1][2] ? `/${u.from}/${u.to}` : ""}" style="color:inherit">
          <div class="row between"><div class="row"><span class="pill">${k + 1}</span><b>${u.name}</b></div><span class="surah-ar" style="font-size:1.3rem">${QN.surahs[u.s - 1][0]}</span></div>
          <div class="row between small muted" style="margin:8px 0">${u.done}/${u.total} oyat ${u.done === u.total ? '<span class="hifz-done">✓ Yodlandi</span>' : ""}</div>${bar(u.done / u.total)}</a>`).join("")}</div>
      <div class="note">📌 Yodlashda eng muhimi — <b>doimiylik</b>. «Allohga eng suyukli amal — oz bo'lsa ham doimiy qilinganidir» (Buxoriy, Muslim). Kuniga 3–5 oyat + eskilarini takrorlash yetarli. Yodlaganingizni namozda o'qing — shunda u mustahkamlanadi.</div>
      <div class="card"><h3>Keyingi bosqich</h3><p class="small">Ushbu rejani tugatgach, 30-poraning qolgan suralarini (Zuho, Sharh, Tiyn, A'lo, …) shu usulda yodlashni davom ettiring — ixtiyoriy suralarni <a href="#/quron">Qur'on</a> bo'limidan «Yodlash rejimi»da oching.</p></div>
    </div>`;
  };

  /* =========================================================
     NAMOZ
     ========================================================= */
  const textCard = (k) => { const x = QN.salahTexts[k]; return `<div class="card flat" style="padding:16px"><div class="row between"><b>${x.t}</b><div class="row">${say(x.ar)}${recPair()}</div></div><div class="dua-ar">${x.ar}</div><div class="translit">${esc(x.tr)}</div><p class="small" style="margin:6px 0 0">${esc(x.m)}</p></div>`; };
  const viewNamoz = (id) => {
    const s = S();
    if (!id) {
      app.innerHTML = `<div class="view stack">
        <div><h1>🕌 Namoz</h1><p>Iymon asoslaridan boshlab tahorat, namoz o'qish tartibi, duolari va vitrgacha. Hanafiy mazhabi asosida.</p></div>
        <div class="card"><div class="row between"><b>Ibodat darslari</b><span class="pill">${Math.round(A.modPct("ibodat") * 100)}%</span></div><div style="margin-top:8px">${bar(A.modPct("ibodat"))}</div></div>
        <div class="grid gauto">${QN.ibodatLessons.map((l, k) => `<a class="card hover" href="#/namoz/${l.id}" style="color:inherit"><div class="row between"><span style="font-size:1.8rem">${l.icon}</span>${s.ibodat[l.id] ? '<span class="pill">✓</span>' : `<span class="pill gold">${k + 1}</span>`}</div><h3 style="margin-top:8px">${l.title}</h3></a>`).join("")}</div>
        <div class="sec"><h2>Besh vaqt namoz rakatlari</h2><a href="#/vaqtlar">🕰️ Bugungi vaqtlar →</a></div>
        <div class="card" style="overflow-x:auto"><table class="t"><tr><th>Namoz</th><th>Tarkibi</th><th>Jami</th><th>Izoh</th></tr>
          ${QN.rakaat.map((r) => `<tr><td><b>${r.n}</b> <span class="ar muted">${r.ar}</span></td><td>${r.parts.map(([t, c]) => `<span class="pill" style="margin:2px">${t}: ${c}</span>`).join(" ")}</td><td><b>${r.parts.reduce((a, p) => a + p[1], 0)}</b></td><td class="small muted">${r.note}</td></tr>`).join("")}</table></div>
      </div>`;
      return;
    }
    const l = QN.ibodatLessons.find((x) => x.id === id); if (!l) return viewNamoz();
    const k = QN.ibodatLessons.indexOf(l), nextL = QN.ibodatLessons[k + 1];
    let body = l.html || "";
    if (l.special === "steps") body = `<div class="info">Quyida <b>2 rakatli</b> namoz (masalan, bomdod farzi) tartibi. 3 rakatli (shom) va 4 rakatli namozlarda 2-rakatdan keyin o'tirib faqat Attahiyyot o'qiladi, so'ng turib qolgan rakatlar o'qiladi (farzning 3–4-rakatlarida faqat Fotiha).</div>
      <ol class="steps-list" style="margin-top:14px">${QN.salahSteps.map((st) => `<li><b>${st.pos}</b><p style="margin:6px 0">${esc(st.d)}</p>${st.t.map((t) => { const x = QN.salahTexts[t]; return `<div class="row" style="margin:6px 0"><span class="ar" style="font-size:calc(1.5rem * var(--ar-scale))">${x.ar}</span>${say(x.ar)}<span class="translit small">${esc(x.tr)}</span></div>`; }).join("")}
        ${st.sura ? `<div class="row"><a class="btn ghost sm" href="#/quron/${st.sura}">📗 ${QN.surahs[st.sura - 1][1]} surasini ochish</a><button class="play sm" data-qa="${st.sura}:1">▶</button></div>` : ""}</li>`).join("")}</ol>
      <div class="note" style="margin-top:12px">Ayollar namozda qo'llarini ko'krak ustida bog'laydilar, ruku'da kamroq egiladilar, sajdada a'zolarini bir-biriga yaqin tutadilar. Batafsil — mahalla imomi yoki ishonchli ustozdan so'rang.</div>`;
    if (l.special === "texts") body = `<p>Namozda o'qiladigan barcha zikr va duolar. Har birini tinglang, yozib oling va yodlang.</p><div class="stack">${["takbir", "sano", "auzu", "basmala", "ruku", "tasmi", "tahmid", "sajda", "tashahhud", "salavot", "rabbana", "rabbij", "salom"].map(textCard).join("")}</div>
      <div class="row" style="margin-top:12px"><a class="btn ghost" href="#/quron/1/hifz">💚 Fotihani yodlash</a><a class="btn ghost" href="#/quron/112/hifz">💚 Ixlosni yodlash</a></div>`;
    if (l.special === "vitr") body = l.html + `<div style="margin-top:14px">${textCard("qunut")}</div>`;
    if (l.special === "azon") body = `<p>Azon — namozga chaqiriq. Uni eshitgan kishi muazzin aytganini takrorlaydi («Hayya 'ala...» da «La havla va la quvvata illa billah» deydi).</p>
      <div class="stack">${QN.azan.map(([a, t, c]) => `<div class="card flat row between" style="padding:14px"><div><div class="dua-ar" style="font-size:calc(1.6rem * var(--ar-scale))">${a}</div><div class="translit small">${esc(t)}</div></div><div class="row"><span class="pill">${c}</span>${say(a)}</div></div>`).join("")}</div>
      <div class="info" style="margin-top:12px"><b>Iqomat</b> — farz namozidan oldin aytiladi. Azon kabi, faqat «Hayya 'alal-falah»dan keyin 2 marta <span class="ar">قَدْ قَامَتِ الصَّلَاةُ</span> (Qod qomatis-solah — namoz boshlandi) qo'shiladi.</div>
      <h3 style="margin-top:16px">Azondan keyingi duo</h3><div class="card flat"><div class="row between"><span></span>${say(QN.azanDua.ar)}</div><div class="dua-ar">${QN.azanDua.ar}</div><div class="translit">${esc(QN.azanDua.tr)}</div><p class="small">${esc(QN.azanDua.m)}</p><div class="src">${QN.azanDua.src}</div></div>`;
    if (l.special === "after") body = `<p>Farz namozidan keyin o'qiladigan zikrlar. Payg'ambarimiz ﷺ: «Kim har namozdan keyin 33 marta Subhanalloh, 33 marta Alhamdulillah, 33 marta Allohu akbar desa va yuzni «La ilaha illallohu vahdahu...» bilan to'ldirsa, gunohlari dengiz ko'pigicha bo'lsa ham kechiriladi» (Muslim).</p>
      <div class="stack">${QN.salahAfter.map((x) => `<div class="card flat" style="padding:16px"><div class="row between"><b class="small">${esc(x.tr)}</b>${say(x.ar)}</div><div class="dua-ar">${x.ar}</div><p class="small" style="margin:4px 0 0">${esc(x.m)}</p><div class="src">${x.src}</div></div>`).join("")}</div>
      <div class="row" style="margin-top:12px"><a class="btn" href="#/tasbeh">📿 Tasbehni ochish</a><a class="btn ghost" href="#/quron/2/hifz/255/255">Oyatal Kursini yodlash</a></div>`;
    app.innerHTML = `<div class="view stack">
      <div class="row between">${back(id === "iymon" ? "#/" : "#/namoz", id === "iymon" ? "Bosh sahifa" : "Namoz")}<span class="pill">${k + 1}/${QN.ibodatLessons.length}</span></div>
      <div class="card"><div class="row"><span style="font-size:2.2rem">${l.icon}</span><h1 style="margin:0">${l.title}</h1></div><div style="margin-top:14px">${body}</div></div>
      <div class="card row between"><b>Mavzuni o'zlashtirdingizmi?</b><div class="row">${doneBtn(s.ibodat[id], 'id="idone"')}${nextL ? `<a class="btn ghost" href="#/namoz/${nextL.id}">Keyingi →</a>` : `<a class="btn ghost" href="#/duolar">Duolarga →</a>`}</div></div>
    </div>`;
    $$(".dua-ar", app).forEach((e) => { if (!e.closest(".card.flat") && !e.parentElement.classList.contains("card")) e.style.textAlign = "center"; });
    $("#idone").onclick = () => { const on = A.toggle("ibodat", id, 20, "Mavzu o'zlashtirildi!"); if (on && nextL) setTimeout(() => (location.hash = `#/namoz/${nextL.id}`), 900); else viewNamoz(id); };
  };

  /* =========================================================
     NAMOZ VAQTLARI + QIBLA
     ========================================================= */
  const cities = [
    ["Toshkent", 41.2995, 69.2401], ["Samarqand", 39.6542, 66.9597], ["Buxoro", 39.7681, 64.4556], ["Andijon", 40.7821, 72.3442], ["Namangan", 40.9983, 71.6726],
    ["Farg'ona", 40.3842, 71.7843], ["Qo'qon", 40.5286, 70.9425], ["Marg'ilon", 40.4724, 71.7246], ["Nukus", 42.4531, 59.6103], ["Urganch", 41.55, 60.6333],
    ["Xiva", 41.3783, 60.3639], ["Qarshi", 38.8606, 65.7891], ["Termiz", 37.2242, 67.2783], ["Jizzax", 40.1158, 67.8422], ["Guliston", 40.4897, 68.7842],
    ["Navoiy", 40.0844, 65.3792], ["Chirchiq", 41.4689, 69.5822], ["Angren", 41.0167, 70.1436], ["Olmaliq", 40.85, 69.6], ["Shahrisabz", 39.0578, 66.8342],
  ];
  const methods = [[3, "Musulmon olami ligasi (MWL)"], [1, "Karachi universiteti"], [2, "ISNA (Shimoliy Amerika)"], [13, "Diyanet (Turkiya)"], [4, "Ummul Quro (Makka)"]];
  const pNames = [["Fajr", "Bomdod", "🌄"], ["Sunrise", "Quyosh chiqishi", "☀️"], ["Dhuhr", "Peshin", "🌞"], ["Asr", "Asr", "🌤"], ["Maghrib", "Shom", "🌇"], ["Isha", "Xufton", "🌙"]];
  const hijriMonths = ["Muharram", "Safar", "Rabiul avval", "Rabiul oxir", "Jumodul avval", "Jumodul oxir", "Rajab", "Sha'bon", "Ramazon", "Shavvol", "Zulqa'da", "Zulhijja"];
  const qiblaDeg = (lat, lon) => { const r = Math.PI / 180, k = [21.4225 * r, 39.8262 * r], p = lat * r, d = k[1] - lon * r;
    return ((Math.atan2(Math.sin(d), Math.cos(p) * Math.tan(k[0]) - Math.sin(p) * Math.cos(d)) / r) + 360) % 360; };
  const viewTimes = () => {
    const set = S().settings;
    let loc = set.geo || { name: cities[set.city || 0][0], lat: cities[set.city || 0][1], lon: cities[set.city || 0][2] };
    app.innerHTML = `<div class="view stack">
      <div><h1>🕰️ Namoz vaqtlari</h1><p>Shahringizni tanlang. Vaqtlar Hanafiy mazhabi bo'yicha (Asr — soya ikki barobar bo'lganda) hisoblanadi.</p></div>
      <div class="card row">
        <label class="small"><b>Shahar</b><br><select id="city">${cities.map((c, k) => `<option value="${k}" ${!set.geo && k === (set.city || 0) ? "selected" : ""}>${c[0]}</option>`).join("")}${set.geo ? `<option selected>📍 ${esc(set.geo.name)}</option>` : ""}</select></label>
        <label class="small"><b>Hisoblash usuli</b><br><select id="meth">${methods.map(([v, t]) => `<option value="${v}" ${v === set.method ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <button class="btn ghost" id="geo" style="align-self:end">📍 Joylashuvim</button>
      </div>
      <div id="tbox"><div class="spinner"></div></div>
      <div class="grid g2">
        <div class="card center"><h3>🧭 Qibla yo'nalishi</h3><div class="qibla"><span class="n">Sh</span><div class="needle" id="needle"></div></div>
          <p style="margin-top:10px"><b id="qdeg"></b> — shimoldan soat mili bo'yicha</p><p class="small muted">Telefon kompasini shimolga to'g'rilab, shu burchak tomon buriling.</p></div>
        <div class="card"><h3>📌 Eslatma</h3><p class="small">Vaqtlar astronomik hisob asosida (AlAdhan xizmati) olinadi va O'zbekiston musulmonlari idorasi taqvimidan bir necha daqiqa farq qilishi mumkin. Aniq vaqtni mahallangiz masjidi taqvimi bilan tekshiring.</p>
          <p class="small"><b>Makruh vaqtlar:</b> quyosh chiqayotganda, zavol paytida (tik turganda) va botayotganda namoz o'qilmaydi.</p>
          <a class="btn ghost sm" href="#/namoz">Rakatlar jadvali →</a></div>
      </div></div>`;
    const showQ = () => { const q = qiblaDeg(loc.lat, loc.lon); $("#needle").style.transform = `rotate(${q}deg)`; $("#qdeg").textContent = Math.round(q) + "°"; };
    let timer;
    const load = async () => {
      showQ(); const box = $("#tbox"); box.innerHTML = `<div class="spinner"></div>`;
      try {
        const d = new Date(), ds = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
        const j = await (await fetch(`https://api.aladhan.com/v1/timings/${ds}?latitude=${loc.lat}&longitude=${loc.lon}&method=${set.method}&school=1`)).json();
        const t = j.data.timings, hj = j.data.date.hijri;
        const toDate = (hm) => { const [h, m] = hm.split(" ")[0].split(":").map(Number); const x = new Date(); x.setHours(h, m, 0, 0); return x; };
        const list = pNames.map(([k, n, e]) => ({ k, n, e, t: t[k].split(" ")[0], d: toDate(t[k]) }));
        const prayers = list.filter((x) => x.k !== "Sunrise");
        const tick = () => {
          const now = new Date(); let nx = prayers.find((x) => x.d > now), tomorrow = false;
          if (!nx) { nx = prayers[0]; tomorrow = true; }
          const target = new Date(nx.d.getTime() + (tomorrow ? 864e5 : 0)), diff = Math.max(0, target - now);
          const hh = Math.floor(diff / 36e5), mm = Math.floor((diff % 36e5) / 6e4), ss = Math.floor((diff % 6e4) / 1e3);
          const cd = $("#cd"); if (!cd) return;
          cd.textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
          $("#nxn").textContent = nx.n;
          $$(".prayer-card").forEach((c) => c.classList.toggle("next", c.dataset.k === nx.k));
        };
        box.innerHTML = `<div class="hero" style="padding:26px"><div class="row between" style="position:relative;z-index:1">
            <div><div class="pill gold">${esc(loc.name)} · ${hj.day} ${hijriMonths[hj.month.number - 1]} ${hj.year} h.</div><h2 style="margin:10px 0 0">Keyingi namoz: <span id="nxn"></span></h2></div>
            <div class="countdown" id="cd">--:--:--</div></div></div>
          <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:14px">${list.map((x) => `<div class="card prayer-card" data-k="${x.k}"><div style="font-size:1.6rem">${x.e}</div><div class="muted small">${x.n}</div><div class="pt">${x.t}</div></div>`).join("")}</div>`;
        tick(); clearInterval(timer); timer = setInterval(tick, 1000);
      } catch { box.innerHTML = `<div class="note">Namoz vaqtlarini yuklab bo'lmadi. Internet aloqasini tekshiring.</div>`; }
    };
    onCleanup(() => clearInterval(timer));
    $("#city").onchange = (e) => { const c = cities[+e.target.value]; if (!c) return; set.city = +e.target.value; delete set.geo; A.save(); loc = { name: c[0], lat: c[1], lon: c[2] }; load(); };
    $("#meth").onchange = (e) => { set.method = +e.target.value; A.save(); load(); };
    $("#geo").onclick = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition((p) => {
      set.geo = { name: "Mening joylashuvim", lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4) }; A.save(); viewTimes();
    }, () => toast("Joylashuvga ruxsat berilmadi.")) : toast("Brauzer joylashuvni qo'llamaydi.");
    load();
  };

  /* =========================================================
     DUOLAR / HADISLAR / ASMAUL HUSNA / SUNNATLAR
     ========================================================= */
  const viewDuas = () => {
    const s = S(); const groups = [...new Set(QN.duas.map((d) => d.g))]; let g = "", q = "";
    const draw = () => {
      const list = QN.duas.map((d, i) => ({ d, i })).filter(({ d }) => (!g || d.g === g) && (!q || (d.t + d.m + d.tr).toLowerCase().includes(q)));
      $("#dl").innerHTML = list.map(({ d, i }) => `
        <div class="card"><div class="row between"><div><span class="pill">${d.g}</span><h3 style="margin:8px 0 0">${esc(d.t)}</h3></div>
          <div class="row">${say(d.ar)}${d.q ? `<button class="btn ghost sm" data-qa="${d.q[0]}:${d.q[1]}" title="Qori ovozida (to'liq oyat)">📖 Qori</button>` : ""}</div></div>
          <div class="dua-ar" style="margin-top:8px">${d.ar}</div><div class="translit">${esc(d.tr)}</div><p class="small" style="margin:8px 0">${esc(d.m)}</p>
          <div class="row between"><span class="src">📚 ${esc(d.src)}</span><div class="row">${recPair()}<button class="btn sm ${s.duo[i] ? "done" : "ghost"}" data-du="${i}">${s.duo[i] ? "💚 Yodlandi" : "♡ Yodladim"}</button></div></div></div>`).join("") || `<div class="empty">Topilmadi</div>`;
      $$("[data-dg]").forEach((b) => b.classList.toggle("on", b.dataset.dg === g));
    };
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>🤲 Duolar</h1><p>Kundalik hayot va namozdan keyingi duolar — sahih manbalar asosida. «📖 Qori» tugmasi Qur'oniy duolarni oyat tilovati bilan eshittiradi.</p></div>
        <div class="card flat" style="padding:14px 18px"><b>${A.cnt(s.duo)}/${QN.duas.length}</b> duo yodlandi<div style="width:180px;margin-top:6px">${bar(A.modPct("duo"))}</div></div></div>
      <div class="row between"><div class="tabs"><button data-dg="">Barchasi</button>${groups.map((x) => `<button data-dg="${x}">${x}</button>`).join("")}</div><input type="search" id="dq" placeholder="🔎 Qidirish…" /></div>
      <div class="grid g2" id="dl"></div></div>`;
    $$("[data-dg]").forEach((b) => (b.onclick = () => { g = b.dataset.dg; draw(); }));
    $("#dq").oninput = (e) => { q = e.target.value.toLowerCase(); draw(); };
    $("#dl").onclick = (e) => { const b = e.target.closest("[data-du]"); if (!b) return; const on = A.toggle("duo", +b.dataset.du, 10, "Duo yodlandi!"); b.className = `btn sm ${on ? "done" : "ghost"}`; b.textContent = on ? "💚 Yodlandi" : "♡ Yodladim"; };
    draw();
  };

  const viewHadith = () => {
    const s = S(); const groups = [...new Set(QN.hadiths.map((d) => d.g))]; let g = "";
    const draw = () => {
      $("#hl").innerHTML = QN.hadiths.map((h, i) => ({ h, i })).filter(({ h }) => !g || h.g === g).map(({ h, i }) => `
        <div class="card"><div class="row between"><span class="pill">${h.g} · ${i + 1}</span>${say(h.ar)}</div>
          <div class="dua-ar" style="margin-top:8px">${h.ar}</div><p style="margin:8px 0">${esc(h.m)}</p>
          <div class="row between"><span class="src">📚 ${h.src}</span><button class="btn sm ${s.hadis[i] ? "done" : "ghost"}" data-hd="${i}">${s.hadis[i] ? "✅ O'qildi" : "☐ O'qidim"}</button></div></div>`).join("");
      $$("[data-hg]").forEach((b) => b.classList.toggle("on", b.dataset.hg === g));
    };
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>📜 Hadislar</h1><p>Payg'ambarimiz ﷺ ning ${QN.hadiths.length} ta tanlangan hadisi: niyat, ilm, Qur'on fazli, iymon, axloq va jamiyat haqida.</p></div>
        <div class="card flat" style="padding:14px 18px"><b>${A.cnt(s.hadis)}/${QN.hadiths.length}</b> hadis o'qildi<div style="width:180px;margin-top:6px">${bar(A.modPct("hadis"))}</div></div></div>
      <div class="tabs"><button data-hg="">Barchasi</button>${groups.map((x) => `<button data-hg="${x}">${x}</button>`).join("")}</div>
      <div class="grid g2" id="hl"></div>
      <p class="small muted">Hadislar ma'nosi o'zbek tilida mazmunan berilgan. Chuqurroq o'rganish uchun Imom Buxoriy va Imom Muslimning «Sahih» to'plamlarining o'zbekcha tarjimalariga murojaat qiling.</p></div>`;
    $$("[data-hg]").forEach((b) => (b.onclick = () => { g = b.dataset.hg; draw(); }));
    $("#hl").onclick = (e) => { const b = e.target.closest("[data-hd]"); if (!b) return; const on = A.toggle("hadis", +b.dataset.hd, 5, "Hadis o'qildi!"); b.className = `btn sm ${on ? "done" : "ghost"}`; b.textContent = on ? "✅ O'qildi" : "☐ O'qidim"; };
    draw();
  };

  const viewNames = () => {
    const s = S();
    app.innerHTML = `<div class="view stack">
      <div class="row between"><div><h1>✨ Asmaul Husna</h1><p>«Allohning 99 ismi bor. Kim ularni yod olsa (ma'nosini anglab amal qilsa), jannatga kiradi» (Buxoriy, Muslim). Yodlaganingizni bosib belgilang.</p></div>
        <div class="card flat" style="padding:14px 18px"><b id="nc">${A.cnt(s.names)}/99</b> ism<div style="width:180px;margin-top:6px" id="nb">${bar(A.modPct("asmo"))}</div></div></div>
      <div class="row"><a class="btn" href="#/sinov/asmo">🎯 Sinovdan o'tish</a></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))" id="nl">${QN.names.map((n, i) => `
        <div class="card flat name-card ${s.names[i] ? "learned" : ""}" style="${s.names[i] ? "border-color:var(--g-400);background:var(--g-50)" : ""}">
          <div class="row between"><span class="pill">${i + 1}</span>${say(n[0])}</div>
          <div class="ar">${n[0]}</div><b>${n[1]}</b><div class="muted small">${n[2]}</div>
          <button class="btn sm ${s.names[i] ? "done" : "ghost"}" data-nm="${i}" style="margin-top:8px">${s.names[i] ? "💚 Yodlandi" : "♡ Yodladim"}</button></div>`).join("")}</div></div>`;
    $("#nl").onclick = (e) => { const b = e.target.closest("[data-nm]"); if (!b) return; const on = A.toggle("names", +b.dataset.nm, 2); b.className = `btn sm ${on ? "done" : "ghost"}`; b.textContent = on ? "💚 Yodlandi" : "♡ Yodladim";
      const c = b.closest(".name-card"); c.style.borderColor = on ? "var(--g-400)" : ""; c.style.background = on ? "var(--g-50)" : ""; $("#nc").textContent = `${A.cnt(S().names)}/99`; $("#nb").innerHTML = bar(A.modPct("asmo")); };
  };

  const viewSunnah = () => {
    const s = S();
    app.innerHTML = `<div class="view stack">
      <div><h1>🌿 Kundalik sunnatlar</h1><p>Payg'ambarimiz ﷺ ning kundalik odatlari. Hayotingizga kiritgan har bir sunnatni belgilang — bu sizning «sunnat ro'yxatingiz».</p></div>
      <div class="card"><div class="row between"><b>Amalga kiritilgan sunnatlar</b><span class="pill">${Math.round(A.modPct("sunnat") * 100)}%</span></div><div style="margin-top:8px">${bar(A.modPct("sunnat"))}</div></div>
      ${QN.sunnats.map((g, gi) => `<div class="card"><h3>${g.g}</h3><div class="stack" style="gap:8px;margin-top:10px">${g.items.map(([t, src], ii) => { const k = `${gi}-${ii}`; return `
        <label class="row between" style="padding:10px 12px;border-radius:12px;border:1px solid var(--line);cursor:pointer;background:var(--card-solid)">
          <span class="row"><input type="checkbox" data-sn="${k}" ${s.sunnat[k] ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--g-600)"/> ${esc(t)}</span><span class="src">${src}</span></label>`; }).join("")}</div></div>`).join("")}
    </div>`;
    $$("[data-sn]").forEach((c) => (c.onchange = () => { A.toggle("sunnat", c.dataset.sn, 3, "Sunnat amalga kiritildi!"); }));
  };

  /* =========================================================
     TASBEH
     ========================================================= */
  const viewTasbeh = () => {
    const zikr = [["سُبْحَانَ اللّٰهِ", "Subhanalloh"], ["الْحَمْدُ لِلّٰهِ", "Alhamdulillah"], ["اللّٰهُ أَكْبَرُ", "Allohu akbar"], ["لَا إِلٰهَ إِلَّا اللّٰهُ", "La ilaha illalloh"], ["أَسْتَغْفِرُ اللّٰهَ", "Astag'firulloh"], ["اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", "Salavot"], ["سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", "Subhanallohi va bihamdihi"]];
    let zi = 0, n = 0, target = 33;
    app.innerHTML = `<div class="view stack" style="max-width:640px;margin:auto">
      <div class="center"><h1>📿 Tasbeh</h1><p>Zikrni tanlang va katta tugmani bosing. Maqsadga yetganda telefon titraydi.</p></div>
      <div class="tabs" style="margin:auto">${zikr.map((z, i) => `<button data-z="${i}">${z[1]}</button>`).join("")}</div>
      <div class="card center"><div class="dua-ar" style="text-align:center" id="zar"></div>
        <button class="tasbeh-btn" id="tb">0</button>
        <div class="row" style="justify-content:center"><span class="muted">Maqsad:</span>${[33, 99, 100].map((t) => `<button class="btn ghost sm" data-t="${t}">${t}</button>`).join("")}<button class="btn ghost sm" id="tr">↺ Nol</button></div>
        <div style="margin-top:14px">${bar(0)}</div><p class="small muted" style="margin-top:10px">Umumiy zikrlar soni: <b id="tt">${S().tasbeh}</b></p></div></div>`;
    const upd = () => { $("#tb").textContent = n; $("#zar").textContent = zikr[zi][0]; $$("[data-z]").forEach((b) => b.classList.toggle("on", +b.dataset.z === zi)); $$("[data-t]").forEach((b) => (b.className = `btn sm ${+b.dataset.t === target ? "" : "ghost"}`)); app.querySelector(".bar i").style.width = Math.min(100, (n / target) * 100) + "%"; };
    $$("[data-z]").forEach((b) => (b.onclick = () => { zi = +b.dataset.z; n = 0; upd(); }));
    $$("[data-t]").forEach((b) => (b.onclick = () => { target = +b.dataset.t; upd(); }));
    $("#tr").onclick = () => { n = 0; upd(); };
    $("#tb").onclick = () => {
      n++; const st = S(); st.tasbeh++; $("#tt").textContent = st.tasbeh;
      if (n === target) { navigator.vibrate?.([80, 60, 80]); A.award(3, `${target} marta ${zikr[zi][1]}!`); } else { navigator.vibrate?.(12); if (st.tasbeh % 10 === 0) A.save(); }
      upd();
    };
    upd();
  };

  /* =========================================================
     SOZLAMALAR
     ========================================================= */
  const viewSettings = () => {
    const s = S(), set = s.settings;
    app.innerHTML = `<div class="view stack" style="max-width:820px">
      <h1>⚙️ Sozlamalar</h1>
      <div class="card stack">
        <label class="row between"><b>🌙 Tungi rejim</b><input type="checkbox" id="dk" ${set.dark ? "checked" : ""} style="width:22px;height:22px;accent-color:var(--g-600)"/></label>
        <label class="stack" style="gap:6px"><b>🔠 Arabcha matn o'lchami: <span id="asv">${Math.round(set.arScale * 100)}%</span></b><input type="range" id="as" min="0.8" max="1.6" step="0.05" value="${set.arScale}"/>
          <div class="dua-ar" style="text-align:center">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div></label>
        <label class="row between"><b>🎙 Qori</b><select id="rc">${QN.reciters.map((r) => `<option value="${r.id}" ${r.id === set.reciter ? "selected" : ""}>${r.n}</option>`).join("")}</select></label>
        <div class="row between"><b>🔊 Arabcha ovozni sinash</b>${say("بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ", "btn ghost sm", "▶ Sinash")}</div>
      </div>
      <div class="card stack"><h3>💾 Progressni saqlash</h3><p class="small">Barcha yutuqlaringiz shu brauzerda saqlanadi. Boshqa qurilmaga o'tkazish uchun faylga eksport qiling.</p>
        <div class="row"><button class="btn" id="ex">⬇ Eksport</button><label class="btn ghost">⬆ Import<input type="file" id="im" accept="application/json" hidden/></label><button class="btn ghost" id="rs" style="color:#b03a2e">🗑 Hammasini o'chirish</button></div></div>
      <div class="card"><h3>📚 Manbalar</h3><ul class="list small">
        <li>Qur'on matni (Usmoniy rasm) va transkripsiya — AlQuran.cloud (Islamic Network)</li>
        <li>Ma'nolar tarjimasi — Shayx Muhammad Sodiq Muhammad Yusuf</li>
        <li>Tilovat audiolari — cdn.islamic.network (Husariy, Afasiy, Minshoviy, Abdulbosit)</li>
        <li>Namoz vaqtlari — AlAdhan API</li>
        <li>Fiqhiy masalalar — Hanafiy mazhabi asosida. Shubhali masalalarda mahalla imomi yoki ishonchli ulamolarga murojaat qiling.</li></ul></div>
    </div>`;
    $("#dk").onchange = (e) => { set.dark = e.target.checked; A.save(); A.applySettings(); };
    $("#as").oninput = (e) => { set.arScale = +e.target.value; $("#asv").textContent = Math.round(set.arScale * 100) + "%"; A.applySettings(); A.save(); };
    $("#rc").onchange = (e) => { set.reciter = e.target.value; A.save(); };
    $("#ex").onclick = () => { const b = new Blob([JSON.stringify(S(), null, 1)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `qalb-nuri-progress-${A.todayStr()}.json`; a.click(); };
    $("#im").onchange = async (e) => { try { A.importState(JSON.parse(await e.target.files[0].text())); A.applySettings(); A.refreshShell(); toast("Progress tiklandi!"); viewSettings(); } catch { toast("Fayl noto'g'ri."); } };
    $("#rs").onclick = () => { if (confirm("Barcha progress o'chiriladi. Ishonchingiz komilmi?")) { A.reset(); A.applySettings(); A.refreshShell(); toast("Progress tozalandi."); viewSettings(); } };
  };

  /* =========================================================
     ROUTER
     ========================================================= */
  const routes = [
    [/^#?\/?$/, viewHome, "home"],
    [/^#\/yol$/, viewPath, "yol"],
    [/^#\/alifbo$/, viewAlphabet, "alifbo"],
    [/^#\/alifbo\/(\d+)$/, viewLetter, "alifbo"],
    [/^#\/darslar$/, viewLessons, "darslar"],
    [/^#\/dars\/([\w-]+)$/, viewLesson, "darslar"],
    [/^#\/yozuv(?:\/(\d+))?$/, viewWriting, "yozuv"],
    [/^#\/sinov(?:\/(\w+))?$/, viewQuiz, "sinov"],
    [/^#\/quron$/, viewQuran, "quron"],
    [/^#\/quron\/(\d+)(?:\/(hifz))?(?:\/(\d+)\/(\d+))?$/, viewSurah, (m) => (m[2] ? "hifz" : "quron")],
    [/^#\/hifz$/, viewHifz, "hifz"],
    [/^#\/namoz(?:\/([\w-]+))?$/, viewNamoz, "namoz"],
    [/^#\/iymon$/, () => viewNamoz("iymon"), "iymon"],
    [/^#\/vaqtlar$/, viewTimes, "vaqtlar"],
    [/^#\/duolar$/, viewDuas, "duolar"],
    [/^#\/hadislar$/, viewHadith, "hadislar"],
    [/^#\/asmaul-husna$/, viewNames, "asmaul-husna"],
    [/^#\/sunnatlar$/, viewSunnah, "sunnatlar"],
    [/^#\/tasbeh$/, viewTasbeh, "tasbeh"],
    [/^#\/sozlamalar$/, viewSettings, "sozlamalar"],
  ];
  const route = () => {
    cleanups.forEach((f) => f()); cleanups = [];
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const h = location.hash || "#/";
    for (const [re, fn, nav] of routes) {
      const m = h.match(re);
      if (m) {
        const key = typeof nav === "function" ? nav(m) : nav;
        $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === key));
        document.body.classList.remove("menu");
        window.scrollTo({ top: 0 });
        fn(...m.slice(1));
        app.focus({ preventScroll: true });
        return;
      }
    }
    location.hash = "#/";
  };

  /* ---------------- Ishga tushirish ---------------- */
  A.applySettings(); A.refreshShell();
  window.addEventListener("hashchange", route);
  $("#menuBtn").onclick = () => document.body.classList.toggle("menu");
  $("#scrim").onclick = () => document.body.classList.remove("menu");
  const share = async () => {
    const data = { title: "Qalb Nuri", text: "Arab alifbosidan Qur'on hifzigacha — bepul o'quv sayti. Birga o'rganaylik!", url: location.origin + location.pathname };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); toast("Havola nusxalandi! Do'stlaringizga yuboring 🤝"); } } catch {}
  };
  $("#shareBtn").onclick = share;
  document.addEventListener("click", (e) => { if (e.target.closest("[data-share]")) share(); });
  route();
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
