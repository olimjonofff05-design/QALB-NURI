/* =========================================================
   QALB NURI — akkaunt: ro'yxatdan o'tish, kirish, progress sinxroni
   Firebase sozlangan bo'lsa — bulut; aks holda — shu qurilmada.
   ========================================================= */
(() => {
  const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
  const cfg = window.QN_FIREBASE;
  const digits = (p) => String(p || "").replace(/\D/g, "");
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
  const err = (m) => { const e = new Error(m); e.uz = m; return e; };

  const Auth = { mode: cfg ? "cloud" : "local", user: null };

  /* ---------------- Lokal rejim ---------------- */
  const LA = "qn_accounts", LS = "qn_session";
  const accounts = () => { try { return JSON.parse(localStorage.getItem(LA) || "{}"); } catch { return {}; } };
  const saveAccounts = (a) => localStorage.setItem(LA, JSON.stringify(a));
  const sha = async (s) => {
    if (crypto?.subtle) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
    let h = 5381; for (const c of s) h = (h * 33) ^ c.charCodeAt(0); return "x" + (h >>> 0).toString(16);
  };
  const pub = (uid, a) => ({ uid, name: a.name, phone: a.phone, email: a.email, created: a.created });

  /* ---------------- Bulut rejimi (Firebase) ---------------- */
  let fb = null;
  const loadFB = async () => {
    if (fb) return fb;
    const [app, auth, fs] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-firestore.js")]);
    const a = app.initializeApp(cfg);
    const au = auth.getAuth(a);
    await auth.setPersistence(au, auth.browserLocalPersistence).catch(() => {});
    fb = { auth, fs, au, db: fs.getFirestore(a) };
    return fb;
  };
  const fbErr = (e) => {
    const c = e?.code || "";
    if (c.includes("email-already-in-use")) return err("Bu email bilan akkaunt allaqachon mavjud. Kirish bo'limidan foydalaning.");
    if (c.includes("invalid-email")) return err("Email manzil noto'g'ri.");
    if (c.includes("weak-password")) return err("Parol kamida 6 belgidan iborat bo'lsin.");
    if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found")) return err("Login yoki parol noto'g'ri.");
    if (c.includes("too-many-requests")) return err("Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.");
    if (c.includes("network")) return err("Internet aloqasi yo'q.");
    return err(e?.uz || "Xatolik yuz berdi. Qayta urinib ko'ring.");
  };
  const profileOf = async (u) => {
    const { fs, db } = fb;
    const snap = await fs.getDoc(fs.doc(db, "users", u.uid));
    const d = snap.exists() ? snap.data() : {};
    return { uid: u.uid, name: d.name || u.displayName || "", phone: d.phone || "", email: u.email, created: d.created || "" };
  };

  /* ---------------- Ochiq API ---------------- */
  Auth.init = async () => {
    if (Auth.mode === "local") {
      const uid = localStorage.getItem(LS), a = accounts()[uid];
      Auth.user = a ? pub(uid, a) : null;
      return Auth.user;
    }
    try {
      await loadFB();
      const u = await new Promise((res) => { const off = fb.auth.onAuthStateChanged(fb.au, (x) => { off(); res(x); }); });
      Auth.user = u ? await profileOf(u) : null;
    } catch (e) { console.warn("Firebase:", e); Auth.user = null; }
    return Auth.user;
  };

  Auth.register = async ({ name, phone, email, password }) => {
    name = String(name || "").trim(); phone = digits(phone); email = String(email || "").trim().toLowerCase();
    if (name.length < 2) throw err("Ismingizni kiriting.");
    if (phone.length < 9 || phone.length > 15) throw err("Telefon raqamni to'liq kiriting (masalan: +998 90 123 45 67).");
    if (!isEmail(email)) throw err("Email manzil noto'g'ri.");
    if (String(password).length < 6) throw err("Parol kamida 6 belgidan iborat bo'lsin.");
    const created = new Date().toISOString();
    if (Auth.mode === "local") {
      const a = accounts();
      if (Object.values(a).some((x) => x.email === email)) throw err("Bu email bilan akkaunt allaqachon mavjud.");
      if (Object.values(a).some((x) => x.phone === phone)) throw err("Bu telefon raqam bilan akkaunt allaqachon mavjud.");
      const uid = "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const salt = Math.random().toString(36).slice(2);
      a[uid] = { name, phone, email, salt, hash: await sha(salt + password), created };
      saveAccounts(a); localStorage.setItem(LS, uid);
      return (Auth.user = pub(uid, a[uid]));
    }
    await loadFB();
    const { auth, fs, au, db } = fb;
    const ph = await fs.getDoc(fs.doc(db, "phones", phone)).catch(() => null);
    if (ph && ph.exists()) throw err("Bu telefon raqam bilan akkaunt allaqachon mavjud.");
    let cred;
    try { cred = await auth.createUserWithEmailAndPassword(au, email, password); } catch (e) { throw fbErr(e); }
    await auth.updateProfile(cred.user, { displayName: name }).catch(() => {});
    await fs.setDoc(fs.doc(db, "users", cred.user.uid), { name, phone, email, created });
    await fs.setDoc(fs.doc(db, "phones", phone), { uid: cred.user.uid, email }).catch(() => {});
    return (Auth.user = { uid: cred.user.uid, name, phone, email, created });
  };

  Auth.login = async (id, password) => {
    id = String(id || "").trim();
    if (!id || !password) throw err("Login va parolni kiriting.");
    if (Auth.mode === "local") {
      const a = accounts(), byEmail = isEmail(id), p = digits(id);
      const uid = Object.keys(a).find((k) => (byEmail ? a[k].email === id.toLowerCase() : a[k].phone === p || a[k].phone.endsWith(p) && p.length >= 9));
      if (!uid || a[uid].hash !== (await sha(a[uid].salt + password))) throw err("Login yoki parol noto'g'ri.");
      localStorage.setItem(LS, uid);
      return (Auth.user = pub(uid, a[uid]));
    }
    await loadFB();
    const { auth, fs, au, db } = fb;
    let email = id.toLowerCase();
    if (!isEmail(id)) {
      let p = digits(id); if (p.length === 9) p = "998" + p;
      const snap = await fs.getDoc(fs.doc(db, "phones", p)).catch(() => null);
      if (!snap || !snap.exists()) throw err("Bu telefon raqam bilan akkaunt topilmadi.");
      email = snap.data().email;
    }
    let cred;
    try { cred = await auth.signInWithEmailAndPassword(au, email, password); } catch (e) { throw fbErr(e); }
    return (Auth.user = await profileOf(cred.user));
  };

  Auth.logout = async () => {
    await Auth.flush();
    if (Auth.mode === "local") localStorage.removeItem(LS);
    else { await loadFB(); await fb.auth.signOut(fb.au); }
    Auth.user = null;
  };

  Auth.resetPassword = async (email) => {
    email = String(email || "").trim();
    if (!isEmail(email)) throw err("Avval email manzilingizni kiriting.");
    if (Auth.mode === "local") throw err("Bu qurilmadagi akkaunt uchun parolni tiklash imkoni yo'q. Yangi akkaunt oching yoki bulutli rejim yoqilishini kuting.");
    await loadFB();
    try { await fb.auth.sendPasswordResetEmail(fb.au, email); } catch (e) { throw fbErr(e); }
  };

  Auth.updateProfile = async ({ name, phone }) => {
    const u = Auth.user; if (!u) return;
    name = String(name || "").trim(); phone = digits(phone);
    if (name.length < 2) throw err("Ismingizni kiriting.");
    if (Auth.mode === "local") { const a = accounts(); Object.assign(a[u.uid], { name, phone }); saveAccounts(a); }
    else { await loadFB(); await fb.fs.setDoc(fb.fs.doc(fb.db, "users", u.uid), { name, phone }, { merge: true }); }
    Object.assign(u, { name, phone });
  };

  /* Progress sinxroni (bulut rejimida) */
  let pending = null, timer = null;
  Auth.pushState = (state) => {
    if (Auth.mode !== "cloud" || !Auth.user) return;
    pending = state; clearTimeout(timer); timer = setTimeout(Auth.flush, 1500);
  };
  Auth.flush = async () => {
    clearTimeout(timer);
    if (Auth.mode !== "cloud" || !Auth.user || !pending || !fb) return;
    const st = JSON.parse(JSON.stringify(pending)); pending = null;
    try { await fb.fs.setDoc(fb.fs.doc(fb.db, "users", Auth.user.uid), { state: st, updatedAt: new Date().toISOString() }, { merge: true }); Auth.lastSync = new Date(); }
    catch (e) { console.warn("Sinxron xatosi", e); }
  };
  Auth.pullState = async () => {
    if (Auth.mode !== "cloud" || !Auth.user) return null;
    try { await loadFB(); const s = await fb.fs.getDoc(fb.fs.doc(fb.db, "users", Auth.user.uid)); return s.exists() ? s.data().state || null : null; }
    catch { return null; }
  };
  window.addEventListener("pagehide", () => Auth.flush());
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Auth.flush(); });

  window.QNauth = Auth;
})();
