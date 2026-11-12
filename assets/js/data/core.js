/* QALB NURI — asosiy ma'lumotlar: alifbo va suralar */
window.QN = window.QN || {};

/* 28 harf. j = qo'shiladimi (chapdagi harfga ulanadimi). */
QN.letters = [
  { c: "ا", n: "Alif", ar: "أَلِف", t: "a", j: false, s: "O'zi tovushsiz — harakat (a, i, u) yoki cho'ziq «aa» tovushini tashiydi. Ustida hamza (أ) bo'lsa — qisqa to'xtash bilan «a».", mx: "Ichki bo'shliq (jawf) — cho'ziq tovush sifatida", w: "Yuqoridan pastga bitta tik chiziq. Chapdagi harfga ulanmaydi.", ex: ["أَسَد", "asad", "sher"] },
  { c: "ب", n: "Bā", ar: "بَاء", t: "b", j: true, s: "O'zbekcha «b» kabi, lablar yopilib ochiladi.", mx: "Ikki lab", w: "O'ngdan chapga yassi qayiqsimon chiziq tortiladi, so'ng ostiga BITTA nuqta qo'yiladi.", ex: ["بَاب", "bāb", "eshik"] },
  { c: "ت", n: "Tā", ar: "تَاء", t: "t", j: true, s: "O'zbekcha «t» kabi, ammo yumshoqroq.", mx: "Til uchi va yuqori old tishlar milki", w: "«Bā» shakli, lekin ustiga IKKITA nuqta qo'yiladi.", ex: ["تُفَّاح", "tuffāḥ", "olma"] },
  { c: "ث", n: "Sā (Thā)", ar: "ثَاء", t: "th", j: true, s: "Til uchi old tishlar orasiga chiqarib aytiladigan «s» (inglizcha think so'zidagi «th»).", mx: "Til uchi va yuqori old tishlar uchi", w: "«Bā» shakli, ustiga UCHTA nuqta (uchburchak shaklida).", ex: ["ثَمَر", "thamar", "meva"] },
  { c: "ج", n: "Jīm", ar: "جِيم", t: "j", j: true, s: "O'zbekcha «j» (jo'ja so'zidagi kabi).", mx: "Til o'rtasi va tanglay o'rtasi", w: "Yuqorida qisqa chiziq, so'ng chapga egilib pastga katta yarim doira, ichiga (o'rtasiga) bitta nuqta.", ex: ["جَبَل", "jabal", "tog'"] },
  { c: "ح", n: "Ḥā", ar: "حَاء", t: "ḥ", j: true, s: "Bo'g'izning O'RTASIDAN chiqadigan qattiq, xirillamaydigan «h». Ko'zoynakni «ha» deb hovurlatgandek, lekin chuqurroq.", mx: "Bo'g'iz o'rtasi", w: "«Jīm» shakli, lekin nuqtasiz.", ex: ["حَلِيب", "ḥalīb", "sut"] },
  { c: "خ", n: "Xā", ar: "خَاء", t: "x", j: true, s: "O'zbekcha «x» (xat, xabar) kabi.", mx: "Bo'g'izning eng yuqori qismi", w: "«Jīm» shakli, nuqta USTIGA qo'yiladi.", ex: ["خُبْز", "xubz", "non"] },
  { c: "د", n: "Dāl", ar: "دَال", t: "d", j: false, s: "O'zbekcha «d» kabi.", mx: "Til uchi va yuqori old tishlar milki", w: "Yuqoridan qiya tushib, pastda o'ngga qaytuvchi kichik burchak. Chapdagi harfga ulanmaydi.", ex: ["دَرْس", "dars", "dars"] },
  { c: "ذ", n: "Zāl (Dhāl)", ar: "ذَال", t: "dh", j: false, s: "Til uchi tishlar orasida turib aytiladigan «z» (inglizcha this so'zidagi «th»).", mx: "Til uchi va yuqori old tishlar uchi", w: "«Dāl» shakli, ustiga bitta nuqta.", ex: ["ذَهَب", "dhahab", "oltin"] },
  { c: "ر", n: "Rā", ar: "رَاء", t: "r", j: false, s: "O'zbekcha «r», bir marta titratiladi. Fatha va zammada qalin, kasrada ingichka.", mx: "Til uchi va tanglay old qismi", w: "Yuqoridan pastga, chapga egilgan kichik yoy (satr ostiga tushadi). Ulanmaydi.", ex: ["رَجُل", "rajul", "erkak"] },
  { c: "ز", n: "Zāy", ar: "زَاي", t: "z", j: false, s: "O'zbekcha «z» kabi.", mx: "Til uchi va pastki old tishlar", w: "«Rā» shakli, ustiga bitta nuqta.", ex: ["زَيْتُون", "zaytūn", "zaytun"] },
  { c: "س", n: "Sīn", ar: "سِين", t: "s", j: true, s: "O'zbekcha «s» kabi, yengil (ingichka).", mx: "Til uchi va pastki old tishlar", w: "Uchta kichik «tish» o'ngdan chapga, so'ng kenga yarim doira.", ex: ["سَمَاء", "samā'", "osmon"] },
  { c: "ش", n: "Shīn", ar: "شِين", t: "sh", j: true, s: "O'zbekcha «sh» kabi.", mx: "Til o'rtasi va tanglay o'rtasi", w: "«Sīn» shakli, ustiga UCHTA nuqta.", ex: ["شَمْس", "shams", "quyosh"] },
  { c: "ص", n: "Ṣād", ar: "صَاد", t: "ṣ", j: true, s: "QALIN «s» — til orqasi ko'tarilib, og'iz to'la aytiladi. «So» ga yaqin eshitiladi.", mx: "Til uchi va pastki old tishlar (qalin sifat bilan)", w: "Cho'zinchoq halqa (tuxumsimon), kichik tish, so'ng keng yarim doira.", ex: ["صَبْر", "ṣabr", "sabr"] },
  { c: "ض", n: "Ḍād", ar: "ضَاد", t: "ḍ", j: true, s: "QALIN «d» — til yon tomonlari yuqori jag' tishlariga tegadi. Arab tilining o'ziga xos harfi.", mx: "Til yon cheti va yuqori oziq tishlar", w: "«Ṣād» shakli, ustiga bitta nuqta.", ex: ["ضَوْء", "ḍaw'", "yorug'lik"] },
  { c: "ط", n: "Ṭā", ar: "طَاء", t: "ṭ", j: true, s: "QALIN «t» — og'iz to'la, til orqasi ko'tarilgan.", mx: "Til uchi va yuqori milk (qalin)", w: "Cho'zinchoq halqa va uning ustidan tik chiziq (alif kabi).", ex: ["طَالِب", "ṭālib", "talaba"] },
  { c: "ظ", n: "Ẓā", ar: "ظَاء", t: "ẓ", j: true, s: "QALIN tishlararo «z» — «dhāl»ning qalin shakli.", mx: "Til uchi va yuqori old tishlar uchi (qalin)", w: "«Ṭā» shakli, halqa ustiga bitta nuqta.", ex: ["ظِلّ", "ẓill", "soya"] },
  { c: "ع", n: "ʿAyn", ar: "عَيْن", t: "ʿ", j: true, s: "Bo'g'iz o'rtasini siqib chiqariladigan tovush. O'zbek tilida yo'q — ustoz yoki audio orqali ko'p takrorlang.", mx: "Bo'g'iz o'rtasi", w: "Yuqorida kichik ochiq yarim halqa («c» ga o'xshash), so'ng pastga katta yarim doira.", ex: ["عِلْم", "ʿilm", "ilm"] },
  { c: "غ", n: "G'ayn", ar: "غَيْن", t: "g'", j: true, s: "O'zbekcha «g'» (g'isht, bog') kabi.", mx: "Bo'g'izning eng yuqori qismi", w: "«ʿAyn» shakli, ustiga bitta nuqta.", ex: ["غَيْم", "g'aym", "bulut"] },
  { c: "ف", n: "Fā", ar: "فَاء", t: "f", j: true, s: "O'zbekcha «f» kabi.", mx: "Pastki lab ichi va yuqori old tishlar", w: "Kichik halqa, ostidan o'ngdan chapga uzun yassi chiziq, halqa ustiga bitta nuqta.", ex: ["فِيل", "fīl", "fil"] },
  { c: "ق", n: "Qāf", ar: "قَاف", t: "q", j: true, s: "O'zbekcha «q» (qalam) kabi — tilning eng orqa qismidan.", mx: "Til orqasi va yumshoq tanglay", w: "Halqa va pastga chuqur yarim doira, ustiga IKKITA nuqta.", ex: ["قَلَم", "qalam", "qalam"] },
  { c: "ك", n: "Kāf", ar: "كَاف", t: "k", j: true, s: "O'zbekcha «k» kabi, yengil.", mx: "Til orqasi (qāfdan sal oldinroq) va tanglay", w: "Tik chiziq, pastda chapga yassi asos; ichiga kichik «hamza»ga o'xshash belgi.", ex: ["كِتَاب", "kitāb", "kitob"] },
  { c: "ل", n: "Lām", ar: "لَام", t: "l", j: true, s: "O'zbekcha «l» kabi. Faqat «Alloh» so'zida (fatha/zammadan keyin) qalin aytiladi.", mx: "Til uchi chetlari va milk", w: "Tik baland chiziq, pastda chapga yarim doira.", ex: ["لَيْل", "layl", "tun"] },
  { c: "م", n: "Mīm", ar: "مِيم", t: "m", j: true, s: "O'zbekcha «m» kabi.", mx: "Ikki lab", w: "Kichik dumaloq halqa, ostidan pastga tushuvchi dum.", ex: ["مَسْجِد", "masjid", "masjid"] },
  { c: "ن", n: "Nūn", ar: "نُون", t: "n", j: true, s: "O'zbekcha «n» kabi.", mx: "Til uchi va milk (+ burun bo'shlig'i — g'unna)", w: "Chuqurroq yarim doira, ustiga bitta nuqta.", ex: ["نُور", "nūr", "nur"] },
  { c: "ه", n: "Hā", ar: "هَاء", t: "h", j: true, s: "Yengil «h» — o'zbekcha «hayot» so'zidagi kabi, bo'g'izning eng chuqur qismidan.", mx: "Bo'g'izning eng pastki qismi", w: "Alohida holatda kichik halqa; so'z boshida «ھ» ko'rinishida, o'rtada «ـهـ».", ex: ["هِلَال", "hilāl", "hilol"] },
  { c: "و", n: "Vāv", ar: "وَاو", t: "w", j: false, s: "Lablar dumaloqlanib aytiladigan «v/w» (inglizcha water). Cho'ziq «uu» ham bo'ladi.", mx: "Ikki lab (dumaloq)", w: "Kichik halqa va pastga chapga egilgan dum. Ulanmaydi.", ex: ["وَرْدَة", "wardah", "gul"] },
  { c: "ي", n: "Yā", ar: "يَاء", t: "y", j: true, s: "O'zbekcha «y» kabi. Cho'ziq «ii» ham bo'ladi.", mx: "Til o'rtasi va tanglay", w: "Yuqoridan boshlanib, pastda orqaga qaytuvchi «s» simon egri, ostiga IKKITA nuqta.", ex: ["يَد", "yad", "qo'l"] },
];

/* Qo'shimcha belgilar */
QN.extraSigns = [
  { c: "ء", n: "Hamza", d: "Qisqa to'xtash (bo'g'iz yopilib ochilishi). Alif, vāv yoki yā ustida/ostida yoki alohida keladi: أ إ ؤ ئ ء" },
  { c: "ة", n: "Tā marbūṭa", d: "So'z oxiridagi «t». Vaqf qilinganda (to'xtalganda) «h» deb o'qiladi: رَحْمَة → raḥmah" },
  { c: "ى", n: "Alif maqṣūra", d: "Nuqtasiz yā ko'rinishidagi alif — cho'ziq «a»: عَلَى ʿalā, مُوسَى Mūsā" },
  { c: "لا", n: "Lām-alif", d: "Lām va alif birikkanda maxsus shaklda yoziladi: لَا — «lā» (yo'q)" },
  { c: "ٰ", n: "Tik fatha (xanjariya alif)", d: "Harf ustidagi kichik tik alif — cho'ziq «a»: اللّٰه, الرَّحْمٰن" },
  { c: "ٓ", n: "Madda", d: "Cho'zish belgisi — 4-6 harakat cho'ziladi: آ, جَآءَ" },
];

/* Harakatlar */
QN.harakat = {
  fatha: "َ", kasra: "ِ", damma: "ُ", sukun: "ْ", shadda: "ّ",
  fathatan: "ً", kasratan: "ٍ", dammatan: "ٌ",
};

/* 114 sura: [arabcha nom, o'zbekcha nom, oyatlar soni, M=Makkiy/D=Madaniy] */
QN.surahs = [
  ["الفاتحة","Fotiha",7,"M"],["البقرة","Baqara",286,"D"],["آل عمران","Oli Imron",200,"D"],["النساء","Niso",176,"D"],["المائدة","Moida",120,"D"],
  ["الأنعام","An'om",165,"M"],["الأعراف","A'rof",206,"M"],["الأنفال","Anfol",75,"D"],["التوبة","Tavba",129,"D"],["يونس","Yunus",109,"M"],
  ["هود","Hud",123,"M"],["يوسف","Yusuf",111,"M"],["الرعد","Ra'd",43,"D"],["إبراهيم","Ibrohim",52,"M"],["الحجر","Hijr",99,"M"],
  ["النحل","Nahl",128,"M"],["الإسراء","Isro",111,"M"],["الكهف","Kahf",110,"M"],["مريم","Maryam",98,"M"],["طه","Toha",135,"M"],
  ["الأنبياء","Anbiyo",112,"M"],["الحج","Haj",78,"D"],["المؤمنون","Mu'minun",118,"M"],["النور","Nur",64,"D"],["الفرقان","Furqon",77,"M"],
  ["الشعراء","Shu'aro",227,"M"],["النمل","Naml",93,"M"],["القصص","Qasos",88,"M"],["العنكبوت","Ankabut",69,"M"],["الروم","Rum",60,"M"],
  ["لقمان","Luqmon",34,"M"],["السجدة","Sajda",30,"M"],["الأحزاب","Ahzob",73,"D"],["سبأ","Saba'",54,"M"],["فاطر","Fotir",45,"M"],
  ["يس","Yosin",83,"M"],["الصافات","Soffot",182,"M"],["ص","Sod",88,"M"],["الزمر","Zumar",75,"M"],["غافر","G'ofir",85,"M"],
  ["فصلت","Fussilat",54,"M"],["الشورى","Shuro",53,"M"],["الزخرف","Zuxruf",89,"M"],["الدخان","Duxon",59,"M"],["الجاثية","Josiya",37,"M"],
  ["الأحقاف","Ahqof",35,"M"],["محمد","Muhammad",38,"D"],["الفتح","Fath",29,"D"],["الحجرات","Hujurot",18,"D"],["ق","Qof",45,"M"],
  ["الذاريات","Zoriyot",60,"M"],["الطور","Tur",49,"M"],["النجم","Najm",62,"M"],["القمر","Qamar",55,"M"],["الرحمن","Rahmon",78,"D"],
  ["الواقعة","Voqi'a",96,"M"],["الحديد","Hadid",29,"D"],["المجادلة","Mujodala",22,"D"],["الحشر","Hashr",24,"D"],["الممتحنة","Mumtahana",13,"D"],
  ["الصف","Sof",14,"D"],["الجمعة","Jumu'a",11,"D"],["المنافقون","Munofiqun",11,"D"],["التغابن","Tag'obun",18,"D"],["الطلاق","Taloq",12,"D"],
  ["التحريم","Tahrim",12,"D"],["الملك","Mulk",30,"M"],["القلم","Qalam",52,"M"],["الحاقة","Hoqqa",52,"M"],["المعارج","Ma'orij",44,"M"],
  ["نوح","Nuh",28,"M"],["الجن","Jin",28,"M"],["المزمل","Muzzammil",20,"M"],["المدثر","Muddassir",56,"M"],["القيامة","Qiyoma",40,"M"],
  ["الإنسان","Inson",31,"D"],["المرسلات","Mursalot",50,"M"],["النبأ","Naba'",40,"M"],["النازعات","Nozi'ot",46,"M"],["عبس","Abasa",42,"M"],
  ["التكوير","Takvir",29,"M"],["الانفطار","Infitor",19,"M"],["المطففين","Mutaffifin",36,"M"],["الانشقاق","Inshiqoq",25,"M"],["البروج","Buruj",22,"M"],
  ["الطارق","Toriq",17,"M"],["الأعلى","A'lo",19,"M"],["الغاشية","G'oshiya",26,"M"],["الفجر","Fajr",30,"M"],["البلد","Balad",20,"M"],
  ["الشمس","Shams",15,"M"],["الليل","Layl",21,"M"],["الضحى","Zuho",11,"M"],["الشرح","Sharh",8,"M"],["التين","Tiyn",8,"M"],
  ["العلق","Alaq",19,"M"],["القدر","Qadr",5,"M"],["البينة","Bayyina",8,"D"],["الزلزلة","Zalzala",8,"D"],["العاديات","Odiyot",11,"M"],
  ["القارعة","Qori'a",11,"M"],["التكاثر","Takosur",8,"M"],["العصر","Asr",3,"M"],["الهمزة","Humaza",9,"M"],["الفيل","Fil",5,"M"],
  ["قريش","Quraysh",4,"M"],["الماعون","Mo'un",7,"M"],["الكوثر","Kavsar",3,"M"],["الكافرون","Kofirun",6,"M"],["النصر","Nasr",3,"D"],
  ["المسد","Masad",5,"M"],["الإخلاص","Ixlos",4,"M"],["الفلق","Falaq",5,"M"],["الناس","Nos",6,"M"],
];

/* Sura ma'nolari (qisqacha) — o'quvchiga qiziqarli bo'lishi uchun */
QN.surahMeaning = {
  1: "Ochuvchi", 2: "Sigir", 3: "Imron oilasi", 4: "Ayollar", 5: "Dasturxon", 6: "Chorva", 7: "A'rof", 8: "O'ljalar", 9: "Tavba", 10: "Yunus a.s.",
  12: "Yusuf a.s.", 13: "Momaqaldiroq", 14: "Ibrohim a.s.", 16: "Asalari", 17: "Tungi sayr", 18: "G'or", 19: "Maryam", 20: "Toha", 21: "Payg'ambarlar",
  24: "Nur", 25: "Furqon", 27: "Chumolilar", 29: "O'rgimchak", 30: "Rum", 31: "Luqmon", 36: "Yosin", 55: "Rahmon", 56: "Voqea", 62: "Juma", 67: "Mulk",
  71: "Nuh a.s.", 72: "Jinlar", 78: "Xabar", 87: "Oliy", 89: "Tong", 91: "Quyosh", 92: "Tun", 93: "Choshgoh", 94: "Ko'krakni kengaytirish", 95: "Anjir",
  96: "Laxta qon", 97: "Qadr", 99: "Zilzila", 100: "Chopqir otlar", 101: "Qoqiluvchi", 102: "Ko'paytirish", 103: "Asr (zamon)", 104: "G'iybatchi",
  105: "Fil", 106: "Quraysh", 107: "Mayda yordam", 108: "Kavsar (ko'p yaxshilik)", 109: "Kofirlar", 110: "Nusrat", 111: "Palma tolasi", 112: "Ixlos (sof tavhid)",
  113: "Tong", 114: "Odamlar",
};

/* Qorilar (cdn.islamic.network) */
QN.reciters = [
  { id: "ar.husary", n: "Mahmud Xalil al-Husariy (o'rganish uchun tavsiya)", br: 128 },
  { id: "ar.alafasy", n: "Mishari Roshid al-Afasiy", br: 128 },
  { id: "ar.minshawi", n: "Muhammad Siddiq al-Minshoviy", br: 128 },
  { id: "ar.abdulbasitmurattal", n: "Abdulbosit Abdussamad (murattal)", br: 192 },
];

/* Har bir suraning global oyat raqami boshlanishi */
QN.ayahOffset = (() => { const o = [0]; let s = 0; for (const x of QN.surahs) { o.push(s); s += x[2]; } return o; })();
QN.globalAyah = (s, a) => QN.ayahOffset[s] + a;
