/* QALB NURI — darslar: harakatlar, o'qish, tajvid */

QN.lessons = [
  /* ===================== 2-BOSQICH: Harf shakllari ===================== */
  {
    id: "shakllar", mod: "harf", icon: "🔤", title: "Harflarning so'zdagi 4 shakli",
    intro: `<p>Arab yozuvi <b>o'ngdan chapga</b> yoziladi va harflar bir-biriga <b>ulanib</b> yoziladi. Shu sababli har bir harf so'zdagi o'rniga qarab 4 xil ko'rinishda bo'ladi: <b>alohida</b>, <b>boshida</b>, <b>o'rtasida</b> va <b>oxirida</b>.</p>
    <p>Faqat 6 ta harf — <span class="ar kbd">ا د ذ ر ز و</span> — o'zidan keyingi (chapdagi) harfga ulanmaydi. Ulardan keyingi harf yana «boshlang'ich» shaklda yoziladi.</p>`,
    blocks: [
      { type: "forms" },
      { type: "words", title: "Ulanishni ko'ring", items: [
        ["بَيْت", "bayt", "uy — ب boshida, ي o'rtada, ت oxirida"],
        ["قَلْب", "qalb", "qalb, yurak"],
        ["نُور", "nūr", "nur — و ulanmaydi, ر yakka"],
        ["دَار", "dār", "hovli — د va ا ulanmaydi"],
        ["مَسْجِد", "masjid", "masjid"],
        ["عَلِم", "ʿalima", "bildi"],
      ] },
    ],
  },
  {
    id: "belgilar", mod: "harf", icon: "✳️", title: "Qo'shimcha belgilar: hamza, tā marbūṭa…",
    intro: `<p>Asosiy 28 harfdan tashqari Qur'onda tez-tez uchraydigan bir nechta belgi bor. Ularni tanib olish o'qishni ancha osonlashtiradi.</p>`,
    blocks: [{ type: "extra" }, { type: "words", title: "Misollar", items: [
      ["سَمَاءٌ", "samā'un", "osmon — oxirida hamza"],
      ["رَحْمَةٌ", "raḥmatun", "rahmat — oxirida tā marbūṭa"],
      ["هُدًى", "hudan", "hidoyat — alif maqṣūra"],
      ["لَا", "lā", "yo'q — lām-alif"],
      ["آمَنَ", "āmana", "iymon keltirdi — madda"],
    ] }],
  },

  /* ===================== 3-BOSQICH: Harakatlar ===================== */
  {
    id: "fatha", mod: "harakat", icon: "◌َ", title: "Fatha — «a» tovushi",
    intro: `<p><b>Fatha</b> (<span class="ar">ـَ</span>) — harf <b>ustiga</b> qo'yiladigan kichik qiya chiziq. Harfni qisqa <b>«a»</b> bilan o'qitadi: <span class="ar kbd">بَ</span> = «ba».</p>
    <div class="info">💡 Qalin harflar (<span class="ar">خ ص ض ط ظ غ ق</span>) fatha bilan «o»ga yaqin, qalin eshitiladi: <span class="ar">صَ</span> ≈ «so», <span class="ar">قَ</span> ≈ «qo».</div>`,
    blocks: [{ type: "gen", kind: "fatha" }, { type: "words", title: "Faqat fathali so'zlar", items: [
      ["كَتَبَ", "kataba", "yozdi"], ["ذَهَبَ", "dhahaba", "ketdi"], ["خَلَقَ", "xalaqa", "yaratdi"], ["جَعَلَ", "jaʿala", "qildi"], ["نَصَرَ", "naṣara", "yordam berdi"], ["أَمَرَ", "amara", "buyurdi"],
    ] }],
  },
  {
    id: "kasra", mod: "harakat", icon: "◌ِ", title: "Kasra — «i» tovushi",
    intro: `<p><b>Kasra</b> (<span class="ar">ـِ</span>) — harf <b>ostiga</b> qo'yiladigan kichik qiya chiziq. Harfni qisqa <b>«i»</b> bilan o'qitadi: <span class="ar kbd">بِ</span> = «bi».</p>`,
    blocks: [{ type: "gen", kind: "kasra" }, { type: "words", title: "Fatha + kasra", items: [
      ["عَلِمَ", "ʿalima", "bildi"], ["سَمِعَ", "samiʿa", "eshitdi"], ["شَرِبَ", "shariba", "ichdi"], ["رَضِيَ", "raḍiya", "rozi bo'ldi"], ["بِكَ", "bika", "sen bilan"],
    ] }],
  },
  {
    id: "damma", mod: "harakat", icon: "◌ُ", title: "Zamma — «u» tovushi",
    intro: `<p><b>Zamma</b> (<span class="ar">ـُ</span>) — harf <b>ustiga</b> qo'yiladigan kichik «vāv»ga o'xshash belgi. Harfni qisqa <b>«u»</b> bilan o'qitadi: <span class="ar kbd">بُ</span> = «bu». Lablar biroz dumaloqlanadi.</p>`,
    blocks: [{ type: "gen", kind: "damma" }, { type: "words", title: "Uchala harakat birga", items: [
      ["كُتُبٌ", "kutubun", "kitoblar"], ["رُسُلٌ", "rusulun", "payg'ambarlar"], ["خُلِقَ", "xuliqa", "yaratildi"], ["كُتِبَ", "kutiba", "yozildi"], ["حَسُنَ", "ḥasuna", "go'zal bo'ldi"],
    ] }, { type: "mix" }],
  },
  {
    id: "sukun", mod: "harakat", icon: "◌ْ", title: "Sukun — harakatsiz harf",
    intro: `<p><b>Sukun</b> (<span class="ar">ـْ</span>) — harf ustidagi kichik doira. Bu harf <b>unlisiz</b> o'qiladi va oldingi harf bilan <b>bir bo'g'in</b> bo'lib qo'shiladi: <span class="ar kbd">أَبْ</span> = «ab».</p>`,
    blocks: [{ type: "gen", kind: "sukun" }, { type: "words", title: "Sukunli so'zlar", items: [
      ["قَلْبٌ", "qalbun", "qalb"], ["عِلْمٌ", "ʿilmun", "ilm"], ["صَبْرٌ", "ṣabrun", "sabr"], ["شُكْرٌ", "shukrun", "shukr"], ["يَعْلَمُ", "yaʿlamu", "biladi"], ["الْحَمْدُ", "al-ḥamdu", "hamd"],
    ] }],
  },
  {
    id: "shadda", mod: "harakat", icon: "◌ّ", title: "Shadda — qo'shaloq harf",
    intro: `<p><b>Shadda</b> (<span class="ar">ـّ</span>) — «w» shaklidagi belgi. Harf <b>ikki marta</b> o'qiladi: birinchisi sukunli, ikkinchisi harakatli. <span class="ar kbd">رَبَّ</span> = rab-ba.</p>
    <div class="info">💡 Shadda ustida fatha/zamma, ostida kasra bo'ladi: <span class="ar">بَّ بِّ بُّ</span>. Nūn va mīm shaddali bo'lsa, ikki harakat miqdori <b>g'unna</b> (burundan ovoz) qilinadi.</div>`,
    blocks: [{ type: "gen", kind: "shadda" }, { type: "words", title: "Shaddali so'zlar", items: [
      ["رَبِّ", "rabbi", "Robbim"], ["إِنَّ", "inna", "albatta"], ["ثُمَّ", "thumma", "so'ngra"], ["مُحَمَّدٌ", "Muḥammadun", "Muhammad"], ["الْحَقُّ", "al-ḥaqqu", "haq"], ["الْجَنَّةُ", "al-jannatu", "jannat"],
    ] }],
  },
  {
    id: "tanvin", mod: "harakat", icon: "◌ً", title: "Tanvin — «an, in, un»",
    intro: `<p><b>Tanvin</b> — qo'shaloq harakat. So'z oxirida keladi va oxiriga yashirin <b>«n»</b> qo'shadi:</p>
    <ul class="list"><li><span class="ar kbd">بً</span> — fathatan = «ban» (ko'pincha alif bilan: <span class="ar">بًا</span>)</li><li><span class="ar kbd">بٍ</span> — kasratan = «bin»</li><li><span class="ar kbd">بٌ</span> — zammatan = «bun»</li></ul>
    <div class="info">💡 To'xtalganda (vaqf) tanvin o'qilmaydi; fathatan esa «a» bo'lib cho'ziladi: <span class="ar">عَلِيمًا</span> → «ʿalīmā».</div>`,
    blocks: [{ type: "gen", kind: "tanvin" }, { type: "words", title: "Tanvinli so'zlar", items: [
      ["كِتَابٌ", "kitābun", "kitob"], ["رَسُولًا", "rasūlan", "payg'ambar"], ["نُورٍ", "nūrin", "nur"], ["أَحَدٌ", "aḥadun", "yagona"], ["غَفُورٌ رَحِيمٌ", "g'afūrun raḥīm", "kechiruvchi, rahmli"],
    ] }],
  },
  {
    id: "madd", mod: "harakat", icon: "〰️", title: "Madd — cho'ziq unlilar",
    intro: `<p>Uchta <b>madd harfi</b> bor. Ular oldingi harakatni <b>2 harakat</b> (ikki barmoq bukish vaqti) cho'zadi:</p>
    <ul class="list"><li>Fathadan keyin <b>alif</b>: <span class="ar kbd">بَا</span> = «baa»</li><li>Kasradan keyin <b>sukunli yā</b>: <span class="ar kbd">بِي</span> = «bii»</li><li>Zammadan keyin <b>sukunli vāv</b>: <span class="ar kbd">بُو</span> = «buu»</li></ul>
    <div class="note">⚠️ Qisqa va cho'ziq unlini farqlash juda muhim — ma'no o'zgaradi! <span class="ar">قَلَ</span> va <span class="ar">قَالَ</span> (dedi) har xil.</div>`,
    blocks: [{ type: "gen", kind: "madd" }, { type: "words", title: "Maddli so'zlar", items: [
      ["قَالَ", "qāla", "dedi"], ["كِتَابٌ", "kitābun", "kitob"], ["نُورٌ", "nūrun", "nur"], ["رَحِيمٌ", "raḥīmun", "rahmli"], ["يَقُولُونَ", "yaqūlūna", "aytishadi"], ["مَالِكِ", "māliki", "egasi"],
    ] }],
  },

  /* ===================== 4-BOSQICH: O'qish ===================== */
  {
    id: "lafz", mod: "oqish", icon: "🌟", title: "«Alloh» lafzi va lām qoidalari",
    intro: `<p><b>«Alloh»</b> (<span class="ar">اللّٰه</span>) so'zidagi lām:</p>
    <ul class="list"><li>Oldidan <b>fatha yoki zamma</b> kelsa — <b>qalin</b> o'qiladi: <span class="ar">قَالَ اللّٰهُ</span>, <span class="ar">رَسُولُ اللّٰهِ</span></li><li>Oldidan <b>kasra</b> kelsa — <b>ingichka</b> o'qiladi: <span class="ar">بِسْمِ اللّٰهِ</span>, <span class="ar">لِلّٰهِ</span></li></ul>`,
    blocks: [{ type: "words", title: "Tinglang va takrorlang", items: [
      ["اللّٰهُ أَكْبَرُ", "Allāhu akbar", "Alloh buyukdir"],
      ["بِسْمِ اللّٰهِ", "bismillāh", "Alloh nomi bilan"],
      ["الْحَمْدُ لِلّٰهِ", "al-ḥamdu lillāh", "Allohga hamd bo'lsin"],
      ["سُبْحَانَ اللّٰهِ", "subḥānallāh", "Alloh pokdir"],
      ["لَا إِلٰهَ إِلَّا اللّٰهُ", "lā ilāha illallāh", "Allohdan o'zga iloh yo'q"],
      ["أَسْتَغْفِرُ اللّٰهَ", "astag'firullāh", "Allohdan mag'firat so'rayman"],
      ["إِنْ شَاءَ اللّٰهُ", "in shā'allāh", "Alloh xohlasa"],
      ["مَا شَاءَ اللّٰهُ", "mā shā'allāh", "Alloh xohlagani bo'ldi"],
      ["جَزَاكَ اللّٰهُ خَيْرًا", "jazākallāhu xayran", "Alloh senga yaxshilik bilan mukofot bersin"],
      ["السَّلَامُ عَلَيْكُمْ", "as-salāmu ʿalaykum", "Sizga tinchlik bo'lsin"],
    ] }],
  },
  {
    id: "sozlar", mod: "oqish", icon: "📝", title: "Qur'oniy so'zlarni o'qish",
    intro: `<p>Endi barcha qoidalarni birlashtirib, Qur'onda eng ko'p uchraydigan so'zlarni o'qiymiz. Har bir so'zni avval <b>o'zingiz</b> o'qib ko'ring, so'ng tinglab tekshiring.</p>`,
    blocks: [{ type: "words", title: "Eng ko'p uchraydigan so'zlar", items: [
      ["رَبّ", "rabb", "Robb, Parvardigor"], ["كِتَاب", "kitāb", "kitob"], ["قُرْآن", "qur'ān", "Qur'on"], ["رَسُول", "rasūl", "payg'ambar"], ["نَبِيّ", "nabiyy", "nabiy"],
      ["الْجَنَّة", "al-janna", "jannat"], ["النَّار", "an-nār", "do'zax, olov"], ["الْأَرْض", "al-arḍ", "yer"], ["السَّمَاوَات", "as-samāwāt", "osmonlar"], ["يَوْم", "yawm", "kun"],
      ["الْقِيَامَة", "al-qiyāma", "qiyomat"], ["الصَّلَاة", "aṣ-ṣalāh", "namoz"], ["الزَّكَاة", "az-zakāh", "zakot"], ["الْمُؤْمِنُون", "al-mu'minūn", "mo'minlar"], ["عَذَاب", "ʿadhāb", "azob"],
      ["رَحْمَة", "raḥma", "rahmat"], ["هُدًى", "hudan", "hidoyat"], ["آيَات", "āyāt", "oyatlar"], ["عَلِيم", "ʿalīm", "biluvchi"], ["حَكِيم", "ḥakīm", "hikmatli"],
    ] }],
  },
  {
    id: "fotiha-oqish", mod: "oqish", icon: "📗", title: "Birinchi sura: Fotihani o'qish",
    intro: `<p>Tabriklaymiz! Endi siz Qur'onning birinchi surasini o'qishga tayyorsiz. Har bir oyatni qorining ovozida tinglang, so'ng <b>🎙 Yozib olish</b> tugmasi bilan o'zingizni yozib, solishtiring.</p>
    <div class="info">💡 Fotiha — har bir namoz rakatida o'qiladigan sura. Uni to'g'ri o'qish har bir musulmon uchun eng muhim vazifa.</div>`,
    blocks: [{ type: "ayahs", s: 1, from: 1, to: 7 }],
  },

  /* ===================== 5-BOSQICH: Tajvid ===================== */
  {
    id: "maxraj", mod: "tajvid", icon: "👄", title: "Maxrajlar — harflarning chiqish joyi",
    intro: `<p><b>Tajvid</b> — Qur'onni har bir harfni o'z o'rnidan (maxraj) va o'z sifati bilan to'g'ri o'qish ilmi. Asosiy 5 maxraj guruhi bor:</p>
    <table class="t"><tr><th>Guruh</th><th>Harflar</th></tr>
    <tr><td><b>Jawf</b> (og'iz-bo'g'iz bo'shlig'i)</td><td class="ar kbd">ا و ي (madd)</td></tr>
    <tr><td><b>Halq</b> (bo'g'iz)</td><td class="ar kbd">ء ه — ع ح — غ خ</td></tr>
    <tr><td><b>Lison</b> (til)</td><td class="ar kbd">ق ك ج ش ي ض ل ن ر ط د ت ص س ز ظ ذ ث</td></tr>
    <tr><td><b>Shafatayn</b> (lablar)</td><td class="ar kbd">ف و ب م</td></tr>
    <tr><td><b>Xayshum</b> (burun bo'shlig'i)</td><td>G'unna — ن va م</td></tr></table>
    <div class="note" style="margin-top:12px">⚠️ Eng ko'p xato qilinadigan juftliklar: <span class="ar">ح–ه</span>, <span class="ar">ع–ء</span>, <span class="ar">ص–س</span>, <span class="ar">ط–ت</span>, <span class="ar">ق–ك</span>, <span class="ar">ذ–ز–ظ</span>, <span class="ar">ث–س</span>. Ularni alifbo bo'limida qayta-qayta tinglang.</div>`,
    blocks: [{ type: "pairs" }],
  },
  {
    id: "lom", mod: "tajvid", icon: "☀️", title: "Lom qamariya va lom shamsiya",
    intro: `<p>So'z boshidagi <span class="ar">الْ</span> (al-) dagi lām:</p>
    <ul class="list"><li><b>Qamariya</b> (oy) harflaridan oldin — lām <b>o'qiladi</b>: <span class="ar">الْقَمَر</span> al-qamar. Harflar: <span class="ar">ا ب غ ح ج ك و خ ف ع ق ي م ه</span></li>
    <li><b>Shamsiya</b> (quyosh) harflaridan oldin — lām <b>o'qilmaydi</b>, keyingi harf shaddali bo'ladi: <span class="ar">الشَّمْس</span> ash-shams. Harflar: <span class="ar">ت ث د ذ ر ز س ش ص ض ط ظ ل ن</span></li></ul>`,
    blocks: [{ type: "words", title: "Farqni eshiting", items: [
      ["الْقَمَر", "al-qamar", "oy — qamariya"], ["الْكِتَاب", "al-kitāb", "kitob — qamariya"], ["الْحَمْدُ", "al-ḥamdu", "hamd — qamariya"],
      ["الشَّمْس", "ash-shams", "quyosh — shamsiya"], ["الرَّحْمٰن", "ar-raḥmān", "Rahmon — shamsiya"], ["النَّاس", "an-nās", "odamlar — shamsiya"],
    ] }, { type: "ayah", s: 1, a: 2, note: "«الْحَمْدُ» — lom qamariya (lām aniq eshitiladi)" }, { type: "ayah", s: 1, a: 3, note: "«الرَّحْمٰنِ الرَّحِيمِ» — lom shamsiya (lām yutiladi)" }],
  },
  {
    id: "nun", mod: "tajvid", icon: "ن", title: "Nūn sokin va tanvinning 4 hukmi",
    intro: `<p>Sukunli nūn (<span class="ar">نْ</span>) yoki tanvindan keyin keladigan harfga qarab 4 xil o'qiladi:</p>
    <ol class="list">
      <li><b>Izhor</b> (aniq o'qish) — bo'g'iz harflari <span class="ar">ء ه ع ح غ خ</span> oldidan: nūn aniq, g'unnasiz.</li>
      <li><b>Idg'om</b> (qo'shib yuborish) — <span class="ar">ي ر م ل و ن</span> («yarmalūn») oldidan: nūn keyingi harfga singib ketadi. <span class="ar">ي ن م و</span> da g'unna bilan.</li>
      <li><b>Iqlob</b> (almashtirish) — <span class="ar">ب</span> oldidan: nūn «m»ga aylanadi, g'unna bilan.</li>
      <li><b>Ixfo</b> (yashirish) — qolgan 15 harf oldidan: nūn yarim-yashirin, burundan g'unna bilan.</li>
    </ol>`,
    blocks: [
      { type: "ayah", s: 1, a: 7, note: "«أَنْعَمْتَ» — IZHOR: nūn sokindan keyin ع (bo'g'iz harfi)" },
      { type: "ayah", s: 99, a: 7, note: "«فَمَنْ يَعْمَلْ» — IDG'OM g'unna bilan: nūn ي ga singadi" },
      { type: "ayah", s: 104, a: 4, note: "«لَيُنْبَذَنَّ» — IQLOB: nūn ب dan oldin «m» bo'ladi" },
      { type: "ayah", s: 113, a: 2, note: "«مِنْ شَرِّ» — IXFO: nūn ش dan oldin yashirin g'unna bilan" },
    ],
  },
  {
    id: "gunna", mod: "tajvid", icon: "〽️", title: "G'unna va mīm sokin",
    intro: `<p><b>G'unna</b> — burundan chiqadigan yoqimli ovoz, <b>2 harakat</b> davom etadi. Shaddali <span class="ar">نّ</span> va <span class="ar">مّ</span> da doim bo'ladi: <span class="ar">إِنَّ</span>, <span class="ar">ثُمَّ</span>.</p>
    <p><b>Mīm sokin</b> (<span class="ar">مْ</span>) qoidalari:</p>
    <ul class="list"><li><span class="ar">ب</span> oldidan — <b>ixfo shafaviy</b> (lablar yengil yopiq, g'unna bilan): <span class="ar">تَرْمِيهِمْ بِحِجَارَةٍ</span></li><li><span class="ar">م</span> oldidan — <b>idg'om</b> g'unna bilan</li><li>Boshqa harflar oldidan — <b>izhor shafaviy</b> (aniq o'qiladi)</li></ul>`,
    blocks: [
      { type: "ayah", s: 108, a: 1, note: "«إِنَّا» — shaddali nūnda g'unna" },
      { type: "ayah", s: 105, a: 4, note: "«تَرْمِيهِمْ بِحِجَارَةٍ» — mīm sokindan keyin ب: ixfo shafaviy" },
    ],
  },
  {
    id: "qalqala", mod: "tajvid", icon: "💥", title: "Qalqala — tovushni «sakratish»",
    intro: `<p><b>Qalqala</b> harflari 5 ta: <span class="ar kbd">ق ط ب ج د</span> (eslab qolish uchun: <span class="ar">قُطْبُ جَدٍّ</span> — «qutbu jad»).</p>
    <p>Bu harflar <b>sukunli</b> bo'lganda yoki ularda <b>to'xtalganda</b>, tovush biroz «sakrab», aks-sado bilan chiqadi. So'z oxirida to'xtalganda qalqala kuchliroq bo'ladi.</p>`,
    blocks: [
      { type: "ayah", s: 113, a: 1, note: "«الْفَلَقِ» → to'xtalganda «al-falaq» — ق da kuchli qalqala" },
      { type: "ayah", s: 112, a: 1, note: "«أَحَدٌ» → to'xtalganda «aḥad» — د da qalqala" },
      { type: "ayah", s: 111, a: 1, note: "«تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ» — oxirgi ب da qalqala" },
    ],
  },
  {
    id: "madd-turlari", mod: "tajvid", icon: "📏", title: "Madd turlari — qancha cho'zish kerak",
    intro: `<table class="t"><tr><th>Madd</th><th>Qachon</th><th>Cho'zish</th></tr>
    <tr><td><b>Tabiiy</b></td><td>Madd harfidan keyin hamza yoki sukun yo'q</td><td>2 harakat</td></tr>
    <tr><td><b>Muttasil</b> (vojib)</td><td>Madd harfi va hamza <b>bir so'zda</b>: <span class="ar">جَاءَ</span></td><td>4–5 harakat</td></tr>
    <tr><td><b>Munfasil</b> (joiz)</td><td>Madd harfi bir so'z oxirida, hamza keyingi so'z boshida: <span class="ar">لَا أَعْبُدُ</span></td><td>2–5 harakat</td></tr>
    <tr><td><b>Lozim</b></td><td>Madd harfidan keyin doimiy sukun/shadda: <span class="ar">الضَّالِّينَ</span></td><td>6 harakat</td></tr>
    <tr><td><b>Oriz</b></td><td>Oyat oxirida to'xtalganda: <span class="ar">الرَّحِيمْ</span></td><td>2, 4 yoki 6</td></tr></table>`,
    blocks: [
      { type: "ayah", s: 1, a: 4, note: "«مَالِكِ» — madd tabiiy (2 harakat)" },
      { type: "ayah", s: 110, a: 1, note: "«جَاءَ» — madd muttasil (4–5 harakat)" },
      { type: "ayah", s: 109, a: 2, note: "«لَا أَعْبُدُ» — madd munfasil" },
      { type: "ayah", s: 1, a: 7, note: "«وَلَا الضَّالِّينَ» — madd lozim (6 harakat)" },
    ],
  },
  {
    id: "ra", mod: "tajvid", icon: "ر", title: "Rā harfini qalin va ingichka o'qish",
    intro: `<p><b>Qalin (tafxim)</b> o'qiladi: rā fatha yoki zammali bo'lsa (<span class="ar">رَ رُ</span>), yoki sukunli bo'lib oldida fatha/zamma bo'lsa (<span class="ar">مَرْ</span>).</p>
    <p><b>Ingichka (tarqiq)</b> o'qiladi: rā kasrali bo'lsa (<span class="ar">رِ</span>), yoki sukunli bo'lib oldida kasra bo'lsa (<span class="ar">فِرْعَوْن</span>).</p>
    <p>Doim <b>qalin</b> harflar (isti'lo): <span class="ar kbd">خ ص ض غ ط ق ظ</span> — og'iz to'la, til orqasi ko'tarilgan holda.</p>`,
    blocks: [{ type: "ayah", s: 97, a: 1, note: "«الْقَدْرِ» — ق qalin, ر to'xtalganda oldidagi sukun/fathaga qarab qalin" }, { type: "ayah", s: 108, a: 2, note: "«فَصَلِّ لِرَبِّكَ وَانْحَرْ» — «lirabbika»da ر fathali — qalin" }],
  },
  {
    id: "vaqf", mod: "tajvid", icon: "⛔", title: "Vaqf (to'xtash) belgilari",
    intro: `<p>Qur'on matnida oyat ichida to'xtash yoki to'xtamaslikni ko'rsatuvchi belgilar bor:</p>
    <table class="t"><tr><th>Belgi</th><th>Ma'nosi</th></tr>
    <tr><td class="ar kbd">۝</td><td>Oyat oxiri — to'xtash yaxshi</td></tr>
    <tr><td class="ar kbd">مـ</td><td>Lozim — albatta to'xtash kerak (aks holda ma'no buziladi)</td></tr>
    <tr><td class="ar kbd">لا</td><td>To'xtalmaydi (davom ettiriladi)</td></tr>
    <tr><td class="ar kbd">ج</td><td>Joiz — to'xtash ham, davom ettirish ham mumkin</td></tr>
    <tr><td class="ar kbd">صلى</td><td>Davom ettirish afzal</td></tr>
    <tr><td class="ar kbd">قلى</td><td>To'xtash afzal</td></tr>
    <tr><td class="ar kbd">∴ ∴</td><td>Mu'onaqa — ikkisidan biriga to'xtaladi, ikkalasiga emas</td></tr></table>
    <div class="info" style="margin-top:12px">💡 To'xtalganda so'z oxiridagi harakat o'qilmaydi (sukun qilinadi), tā marbūṭa «h» bo'ladi, fathatan «a» bo'lib cho'ziladi.</div>`,
    blocks: [],
  },
];

/* Ko'p adashtiriladigan juft harflar */
QN.pairs = [["ح", "ه"], ["ع", "ء"], ["ص", "س"], ["ط", "ت"], ["ق", "ك"], ["ذ", "ز"], ["ظ", "ض"], ["ث", "س"], ["غ", "خ"]];

/* O'quv modullari va ularning umumiy progressdagi og'irligi (jami 100) */
QN.modules = [
  { id: "alifbo", title: "Arab alifbosi", icon: "ا", w: 12, desc: "28 harf: ko'rinishi, talaffuzi, yozilishi", route: "#/alifbo" },
  { id: "harf", title: "Harf shakllari va belgilar", icon: "🔤", w: 4, desc: "So'zdagi 4 shakl, hamza, tā marbūṭa", route: "#/darslar" },
  { id: "harakat", title: "Harakatlar", icon: "◌َ", w: 10, desc: "Fatha, kasra, zamma, sukun, shadda, tanvin, madd", route: "#/darslar" },
  { id: "oqish", title: "O'qishni boshlash", icon: "📝", w: 6, desc: "Alloh lafzi, so'zlar, Fotiha", route: "#/darslar" },
  { id: "tajvid", title: "Tajvid asoslari", icon: "🎼", w: 10, desc: "Maxraj, nūn, g'unna, qalqala, madd, vaqf", route: "#/darslar" },
  { id: "quron", title: "Qur'on o'qish (30-pora)", icon: "📗", w: 14, desc: "Fotiha va 78–114 suralarni o'qib chiqish", route: "#/quron" },
  { id: "hifz", title: "Hifz — yodlash", icon: "💚", w: 16, desc: "Namoz uchun kerakli 15 sura + Oyatal Kursi", route: "#/hifz" },
  { id: "ibodat", title: "Iymon, tahorat va namoz", icon: "🕌", w: 12, desc: "Iymon asoslari, tahorat, namoz tartibi", route: "#/namoz" },
  { id: "duo", title: "Duolar", icon: "🤲", w: 7, desc: "Kundalik va Qur'oniy duolar", route: "#/duolar" },
  { id: "hadis", title: "Hadislar", icon: "📜", w: 5, desc: "40 ta tanlangan hadis", route: "#/hadislar" },
  { id: "asmo", title: "Asmaul Husna", icon: "✨", w: 2, desc: "Allohning 99 go'zal ismi", route: "#/asmaul-husna" },
  { id: "sunnat", title: "Sunnatlar", icon: "🌿", w: 2, desc: "Kundalik sunnat amallar", route: "#/sunnatlar" },
];

/* O'qish rejasi: Fotiha + 30-pora (78–114) */
QN.readPlan = [1, ...Array.from({ length: 37 }, (_, i) => 114 - i)];
/* Hifz rejasi — kichikdan kattaga, namoz uchun */
QN.hifzPlan = [
  { s: 1 }, { s: 112 }, { s: 113 }, { s: 114 }, { s: 108 }, { s: 103 }, { s: 110 }, { s: 109 },
  { s: 111 }, { s: 106 }, { s: 105 }, { s: 107 }, { s: 104 }, { s: 102 }, { s: 97 },
  { s: 2, from: 255, to: 255, name: "Oyatal Kursi" },
];
