/* ═══════════════════════════════════════════════════════════
   غماس بلدي — Ultra-Luxury Script
   Preloader, Particle canvas, Follower Cursor, Sparkles, Magnetic Buttons
   Bilingual AR/EN Support
   ═══════════════════════════════════════════════════════════ */

const fallbackMenu = window.GHMAAS_MENU || [];

const tabs = document.querySelector("#categoryTabs");
const grid = document.querySelector("#menuGrid");
const searchInput = document.querySelector("#menuSearch");
const emptyState = document.querySelector("#emptyState");
const header = document.querySelector("[data-header]");
const branchGrid = document.querySelector(".branch-grid");

let site = {
  brandName: "غماس بلدي",
  tagline: "أكل على الشوارب",
  heroLocation: "عمان - شارع المدينة المنورة",
  heroDescription:
    "شغلتنا و عملتنا الاكل الي على الشوارب. منيو عربي فخم للأطباق البلدية، المشاوي، الصواني، الساندويشات، والمشروبات بأسعار واضحة وصور حقيقية.",
  heroImages: [
    "https://amenomenu.com/images/products_images/1855308504936711.webp",
    "https://amenomenu.com/images/products_images/1849153101176320.webp",
    "https://amenomenu.com/images/products_images/1855308643606587.webp",
  ],
  logo: "https://amenomenu.com/images/users_logos/417_1763249008.png",
  phone: "0798181200",
  phoneInternational: "+962798181200",
  whatsapp: "962798181200",
  instagram: "https://www.instagram.com/ghmaas.baladi_jordan/",
  facebook: "https://www.facebook.com/profile.php?id=61568075303841",
  mapUrl: "https://maps.app.goo.gl/UJLZoKhrjdQJPzec7?g_st=ic",
  taxNote: "يضاف 8% ضريبة مبيعات على الأسعار.",
  dedication: "إهداء من <a href=\"https://www.dahabweb.com\" target=\"_blank\" rel=\"noreferrer\" class=\"gold-link\" style=\"color: var(--gold); text-decoration: underline; font-weight: 800;\">مؤسسة المسار الذهبي</a> تقديرًا لموقفهم مع النشامى",
  sourceNote: "",
  branches: [],
  menu: fallbackMenu,
};

let menu = fallbackMenu;
let activeCategory = "all";
let searchTerm = "";
let revealObserver = null;
let currentLang = localStorage.getItem("ghmaas_lang") || "ar";

/* ─── Translations Object ─── */
const uiTranslations = {
  ar: {
    story: "قصتنا",
    menu: "المنيو",
    branches: "الفروع",
    contact: "تواصل",
    brandName: "غماس بلدي",
    tagline: "أكل على الشوارب",
    heroLocation: "عمان - شارع المدينة المنورة",
    heroDescription: "شغلتنا و عملتنا الاكل الي على الشوارب. منيو عربي فخم للأطباق البلدية، المشاوي، الصواني، الساندويشات، والمشروبات بأسعار واضحة وصور حقيقية.",
    exploreMenu: "شوف المنيو",
    openMap: "افتح الخريطة",
    todaysMenu: "منيو اليوم",
    taxNote: "يضاف 8% ضريبة مبيعات على الأسعار.",
    mostPopular: "الأكثر حضوراً",
    from: "من",
    items: "صنف",
    plateHighlight: "أطباق بلدية",
    plateHighlightDesc: "صاجية، كباب، صواني، وسندويشات بروح أردنية واضحة.",
    photoHighlight: "صور حقيقية",
    photoHighlightDesc: "كل بطاقة طعام تعرض الطبق بوضوح لتسهيل اختيار الزبون.",
    priceHighlight: "أسعار مباشرة",
    priceHighlightDesc: "الأسعار بالدينار الأردني مرتبة ومقروءة داخل كل صنف.",
    heritageEyebrow: "أصالة وتراث",
    heritageTitle: "قصة الأكل الي على الشوارب",
    heritageP1: "من قلب عمان النابض، انطلقنا لنحيي تراث الطهي البلدي الأردني الأصيل. في غماس بلدي، لسنا مجرد مطعم؛ نحن حراس النكهة والوصفات المتوارثة التي تصنع بكل كرم ونخوة تليق بالنشامى.",
    heritageP2: "نختار لحومنا ومكوناتنا البلدية الطازجة بعناية فائقة، ونطهوها بشغف لتقدم لكم الصاجيات الفواحة، الكباب البلدي، والصواني الفاخرة بطعم ينقش في الذاكرة.",
    heritageSignature: "النشامى في خدمتكم دائمًا",
    heritageBadge: "كرم أردني أصيل",
    menuTitle: "اختار مزاجك",
    menuSubtitle: "ابحث باسم الطبق أو تنقل بين الأقسام بسرعة.",
    searchPlaceholder: "ابحث عن كباب، صاجية، عصير...",
    emptyState: "ما لقينا صنف بهذا الاسم. جرب كلمة ثانية.",
    branchesTitle: "غماس بلدي في عمان",
    branchesSubtitle: "اختار أقرب فرع وتواصل مباشرة مع غماس بلدي.",
    orderReady: "جاهز تطلب؟",
    contactAction: "اتصل أو ابعث واتساب",
    contactNote: "الطلب والتفاصيل عبر أرقام التواصل المعتمدة لغماس بلدي.",
    instagram: "إنستغرام",
    facebook: "فيسبوك",
    dedication: "إهداء من <a href=\"https://www.dahabweb.com\" target=\"_blank\" rel=\"noreferrer\" class=\"gold-link\" style=\"color: var(--gold); text-decoration: underline; font-weight: 800;\">مؤسسة المسار الذهبي</a> تقديرًا لموقفهم مع النشامى",
    sourceNote: ""
  },
  en: {
    story: "Our Story",
    menu: "Menu",
    branches: "Branches",
    contact: "Contact",
    brandName: "Ghmaas Baladi",
    tagline: "Authentic Jordanian Grills",
    heroLocation: "Amman - Al-Madina Al-Munawarah St.",
    heroDescription: "Our specialty is authentic premium Jordanian grills, Sajiah, and traditional oven trays served with true local hospitality.",
    exploreMenu: "Explore Menu",
    openMap: "Open Map",
    todaysMenu: "Today's Menu",
    taxNote: "8% sales tax is added to prices.",
    mostPopular: "Most Popular",
    from: "From",
    items: "items",
    plateHighlight: "Traditional Grills",
    plateHighlightDesc: "Sajiah, kebab, trays, and wraps with an authentic Jordanian spirit.",
    photoHighlight: "Real Photos",
    photoHighlightDesc: "Clear dish photos help guests choose quickly and confidently.",
    priceHighlight: "Direct Prices",
    priceHighlightDesc: "All prices are in Jordanian Dinars (JOD) exactly as listed.",
    heritageEyebrow: "Heritage & Passion",
    heritageTitle: "The Story of Grills for the Proud",
    heritageP1: "From the heart of Amman, we set out to revive the authentic Jordanian culinary heritage. At Ghmaas Baladi, we are not just a restaurant; we are the guardians of traditional flavors and recipes passed down with true local generosity.",
    heritageP2: "We carefully select our fresh local meat and ingredients, cooking them with passion to serve you aromatic Sajiahs, traditional Kebabs, and premium trays.",
    heritageSignature: "Always at your service with authentic hospitality",
    heritageBadge: "Authentic Jordanian Generosity",
    menuTitle: "Select Your Mood",
    menuSubtitle: "Search by dish name or navigate categories quickly.",
    searchPlaceholder: "Search for kebab, sajiah, juice...",
    emptyState: "No items found matching this name. Try another keyword.",
    branchesTitle: "Ghmaas Baladi in Amman",
    branchesSubtitle: "Choose the nearest branch and contact Ghmaas Baladi directly.",
    orderReady: "Ready to Order?",
    contactAction: "Call Us or Send WhatsApp",
    contactNote: "Order directly through the official restaurant numbers.",
    instagram: "Instagram",
    facebook: "Facebook",
    dedication: "Presented by <a href=\"https://www.dahabweb.com\" target=\"_blank\" rel=\"noreferrer\" class=\"gold-link\" style=\"color: var(--gold); text-decoration: underline; font-weight: 800;\">Al-Masar Al-Dahabi Institution</a> in appreciation of their support with the Nashama",
    sourceNote: ""
  }
};

const menuTranslations = {
  // Categories
  "plates": { title: "Ghmaas Baladi Plates" },
  "trays": { title: "Trays" },
  "sandwiches": { title: "Sandwiches" },
  "appetizers": { title: "Appetizers" },
  "cold-drinks": { title: "Cold Drinks" },
  "hot-drinks": { title: "Hot Drinks" },
  
  // Dishes
  "مشكل غماس": { name: "Ghmaas Mixed Grill", desc: "1.5 KG" },
  "كيلو كباب": { name: "1 KG Kebab", desc: "" },
  "نص كيلو كباب": { name: "0.5 KG Kebab", desc: "" },
  "صاجيه لحمه": { name: "Meat Sajiah", desc: "" },
  "صاجيه معلاق": { name: "Ma'alaq Sajiah", desc: "" },
  "صاجيه دجاج": { name: "Chicken Sajiah", desc: "" },
  "قلايه بندوره باللحمه": { name: "Tomato Pan with Meat", desc: "" },
  "حمص باللحمه": { name: "Hummus with Meat", desc: "" },
  "كفته بالبندوره": { name: "Kofta with Tomato", desc: "" },
  "كفته بطحينيه": { name: "Kofta with Tahini", desc: "" },
  "صينيه زهره و لحمه مفرومه بالطحينيه": { name: "Cauliflower & Minced Meat with Tahini", desc: "" },
  "فوارغ": { name: "Fawaregh", desc: "" },
  "سلطيه": { name: "Saltiah Sandwich", desc: "Two skewers liver, one skewer lamb fat" },
  "شيش طاووق": { name: "Shish Taouk", desc: "" },
  "لف غمس دجاج": { name: "Ghmaas Chicken Wrap", desc: "" },
  "لف غماس لحم": { name: "Ghmaas Meat Wrap", desc: "" },
  "روسيه": { name: "Russian Sandwich", desc: "Two skewers kebab, one skewer lamb fat" },
  "كباب لحمه": { name: "Meat Kebab", desc: "" },
  "كباب بالباذنجان": { name: "Eggplant Kebab", desc: "" },
  "كباب دجاج بالجبنه": { name: "Chicken Kebab with Cheese", desc: "" },
  "معلاق": { name: "Ma'alaq (Liver)", desc: "" },
  "ليّة": { name: "Liyah (Lamb Fat)", desc: "" },
  "سلطه نار": { name: "Fire Salad", desc: "" },
  "بطاطا": { name: "French Fries", desc: "" },
  "بقدونسيه": { name: "Parsley Salad", desc: "" },
  "صحن حمص": { name: "Hummus Plate", desc: "" },
  "صحن متبل": { name: "Mutabbal Plate", desc: "" },
  "سلطه خيار بلبن": { name: "Cucumber Yogurt Salad", desc: "" },
  "صحن رز ابيض": { name: "White Rice Plate", desc: "" },
  "برغل": { name: "Bulgur", desc: "" },
  "سلطه طحينيه": { name: "Tahini Salad", desc: "" },
  "سلطه حاره": { name: "Spicy Salad", desc: "" },
  "سلطه جرجير": { name: "Arugula Salad", desc: "" },
  "سلطه عربيه": { name: "Arabic Salad", desc: "" },
  "سلطه غماس": { name: "Ghmaas Salad", desc: "" },
  "رشوف": { name: "Rashouf", desc: "" },
  "سلطه فتوش": { name: "Fattoush Salad", desc: "" },
  "بصلية": { name: "Basliyah", desc: "" },
  "حمص بيروتي": { name: "Beiruti Hummus", desc: "" },
  "عصير برتقال": { name: "Orange Juice", desc: "" },
  "عصير فراوله": { name: "Strawberry Juice", desc: "" },
  "عصير منجا": { name: "Mango Juice", desc: "" },
  "عصير منجا فراوله": { name: "Mango Strawberry Juice", desc: "" },
  "عصير كيوي": { name: "Kiwi Juice", desc: "" },
  "عصير ليمون ونعنع": { name: "Lemon Mint Juice", desc: "" },
  "عصير افوكادو": { name: "Avocado Juice", desc: "" },
  "مكس فروت": { name: "Mixed Fruit Juice", desc: "" },
  "عصير رمان": { name: "Pomegranate Juice", desc: "" },
  "سموذي": { name: "Smoothie", desc: "(Passion Fruit / Passion Mango / Mixed Berry / Strawberry / Peach)" },
  "موهيتو": { name: "Mojito", desc: "(Classic / Passion Fruit / Strawberry / Raspberry / Blue Ocean / Watermelon / Mixed Berry)" },
  "قهوه تركية": { name: "Turkish Coffee", desc: "" },
  "هوت شوكليت": { name: "Hot Chocolate", desc: "" }
};

const descTranslations = {
  "كيلو و نص": "1.5 KG",
  "نص كيلو": "0.5 KG",
  "سيخين معلاق و سيخ ليه": "Two skewers liver, one skewer lamb fat",
  "سيخين كباب و سيخ ليه": "Two skewers kebab, one skewer lamb fat",
  "(باشن فروت\\باشن فروت منجا \\مكس بيري\\فروله \\خوخ)": "(Passion Fruit / Passion Mango / Mixed Berry / Strawberry / Peach)",
  "(كلاسك\\باشن فروت\\فراوله\\رازبيري\\بلواوشن\\بطيخ\\ميكس بيري)": "(Classic / Passion Fruit / Strawberry / Raspberry / Blue Ocean / Watermelon / Mixed Berry)"
};

const categoryDisplayOrder = ["plates", "trays", "sandwiches", "appetizers", "cold-drinks", "hot-drinks"];

const categoryDisplayMeta = {
  plates: {
    icon: "flame",
    ar: { kicker: "الأطباق الرئيسية", subtitle: "مشاوي وصاجيات غماس البلدي للطلب المباشر." },
    en: { kicker: "Main plates", subtitle: "Signature grills and sajiah dishes ready to order." },
  },
  trays: {
    icon: "chef-hat",
    ar: { kicker: "الصواني", subtitle: "صواني فاخرة للمشاركة واللمة." },
    en: { kicker: "Trays", subtitle: "Premium shared trays for gatherings." },
  },
  sandwiches: {
    icon: "wrap-text",
    ar: { kicker: "السندويش", subtitle: "خيارات سريعة ومشبعة بطابع غماس." },
    en: { kicker: "Sandwiches", subtitle: "Fast, filling wraps with Ghmaas character." },
  },
  appetizers: {
    icon: "salad",
    ar: { kicker: "المقبلات", subtitle: "سلطات، حمص، ومقبلات تكمّل السفرة." },
    en: { kicker: "Appetizers", subtitle: "Salads, hummus, and sides to complete the table." },
  },
  "cold-drinks": {
    icon: "cup-soda",
    ar: { kicker: "مشروبات باردة", subtitle: "عصائر ومشروبات منعشة مع الوجبة." },
    en: { kicker: "Cold drinks", subtitle: "Fresh juices and chilled drinks for the meal." },
  },
  "hot-drinks": {
    icon: "coffee",
    ar: { kicker: "مشروبات ساخنة", subtitle: "قهوة ومشروبات ساخنة بعد الأكل." },
    en: { kicker: "Hot drinks", subtitle: "Coffee and warm drinks after the meal." },
  },
};

/* ─── Preloader with Smooth Percent Counter ─── */
function initPreloader() {
  const preloader = document.getElementById("luxuryPreloader");
  const percentEl = document.querySelector(".preloader-percent");
  if (!preloader) return;

  let currentPercent = 0;
  const interval = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 15) + 5;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, 300);
    }
    if (percentEl) percentEl.textContent = `${currentPercent}%`;
  }, 60);

  // Fallback in case loading gets stuck
  window.addEventListener("load", () => {
    // Ensures preloader fades out when load event occurs if progress bar hasn't triggered it yet
    setTimeout(() => {
      if (!preloader.classList.contains("fade-out")) {
        clearInterval(interval);
        if (percentEl) percentEl.textContent = "100%";
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }
    }, 600);
  });
}

/* ─── Particle System Background ─── */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId = null;
  const PARTICLE_COUNT = Math.min(45, Math.floor(window.innerWidth / 30));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p) {
    const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 168, 83, ${currentOpacity})`;
    ctx.fill();

    // Subtle golden glow around larger particles
    if (p.size > 1.5) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 168, 83, ${currentOpacity * 0.08})`;
      ctx.fill();
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 168, 83, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap boundaries
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      drawParticle(p);
    });

    connectParticles();
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
  });

  init();
  animate();
}

/* ─── Magnetic Button Physics Effect ─── */
function initMagneticButtons() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
  
  const buttons = document.querySelectorAll(".magnetic-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull slightly towards cursor
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
    });
  });
}

/* ─── Active Navigation Link Tracker on Scroll ─── */
function initActiveNavTracker() {
  const sections = document.querySelectorAll("main > section");
  const navLinks = document.querySelectorAll(".desktop-nav a");

  function trackActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active-nav");
      }
    });
  }

  window.addEventListener("scroll", trackActiveLink);
  trackActiveLink();
}

/* ─── Utility Functions ─── */
function countItems() {
  return menu.reduce((total, category) => total + (category.items || []).length, 0);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0600-\u06ff\w\s.]/g, " ")
    .trim();
}

function getOrderedMenu(sourceMenu = []) {
  const orderIndex = new Map(categoryDisplayOrder.map((id, index) => [id, index]));
  return [...sourceMenu].sort((a, b) => {
    const aIndex = orderIndex.has(a.id) ? orderIndex.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.has(b.id) ? orderIndex.get(b.id) : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

function getCategoryMeta(category) {
  const fallback =
    currentLang === "ar"
      ? { icon: "utensils", kicker: "قسم من المنيو", subtitle: "أصناف مختارة من قائمة غماس بلدي." }
      : { icon: "utensils", kicker: "Menu section", subtitle: "Selected items from the Ghmaas Baladi menu." };
  const meta = categoryDisplayMeta[category.id];
  if (!meta) return fallback;
  return { icon: meta.icon, ...(meta[currentLang] || meta.ar || fallback) };
}

function updateText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function updateHref(selector, href) {
  document.querySelectorAll(selector).forEach((element) => {
    element.href = href;
  });
}

/* ─── Apply Bilingual Site Content ─── */
function applySiteContent() {
  menu = getOrderedMenu(Array.isArray(site.menu) && site.menu.length ? site.menu : fallbackMenu);

  // Toggle layout states
  document.documentElement.classList.toggle("lang-en", currentLang === "en");
  document.documentElement.classList.toggle("lang-ar", currentLang === "ar");
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;

  const t = uiTranslations[currentLang];

  // Document Title
  document.title = currentLang === "ar" ? `${site.brandName} | منيو وتجربة فاخرة` : `${t.brandName} | Luxury Menu Experience`;

  // Header Nav Links
  const navLinks = document.querySelectorAll(".desktop-nav a");
  if (navLinks.length >= 4) {
    navLinks[0].textContent = t.story;
    navLinks[1].textContent = t.menu;
    navLinks[2].textContent = t.branches;
    navLinks[3].textContent = t.contact;
  }

  // Brand identity
  updateText(".brand-lockup strong, .footer-brand strong", currentLang === "ar" ? site.brandName : t.brandName);
  updateText(".brand-lockup small", currentLang === "ar" ? site.tagline : t.tagline);
  document.querySelectorAll(".shemagh-tag").forEach((tag) => {
    tag.textContent = currentLang === "ar" ? "مهدّب 🇯🇴" : "Shemagh 🇯🇴";
  });
  updateText(".hero h1", currentLang === "ar" ? site.brandName : t.brandName);
  updateText(".hero-content p", currentLang === "ar" ? site.heroDescription : t.heroDescription);
  const footerNote = document.querySelector(".site-footer small");
  if (footerNote) {
    const note = currentLang === "ar" ? site.sourceNote : t.sourceNote;
    footerNote.textContent = note || "";
    footerNote.hidden = !note;
  }
  updateText(".panel-top strong", `${countItems()} ${t.items}`);

  // Dedication HTML rendering
  const dedicationEl = document.querySelector(".dedication");
  if (dedicationEl) {
    dedicationEl.innerHTML = currentLang === "ar" ? site.dedication : t.dedication;
  }

  // Tax note
  const taxNote = document.querySelector(".tax-note");
  if (taxNote) {
    taxNote.innerHTML = `<i data-lucide="receipt-text"></i>${currentLang === "ar" ? (site.taxNote || "") : t.taxNote}`;
  }

  // Location Eyebrow
  const eyebrow = document.querySelector(".hero-content .eyebrow");
  if (eyebrow) {
    eyebrow.innerHTML = `<span></span>${currentLang === "ar" ? (site.heroLocation || "") : t.heroLocation}`;
  }

  // Logos and links
  document.querySelectorAll(".brand-lockup img, .footer-brand img").forEach((image) => {
    image.src = site.logo;
    image.alt = currentLang === "ar" ? site.brandName : t.brandName;
  });

  updateHref('a[href^="tel:"]', `tel:${site.phoneInternational || site.phone || ""}`);
  updateHref('a[href*="wa.me"]', `https://wa.me/${site.whatsapp || ""}`);
  updateHref('a[href*="instagram.com"]', site.instagram || "#");
  updateHref('a[href*="facebook.com"]', site.facebook || "#");

  // Translate Contact Band details
  const contactEyebrow = document.querySelector(".contact-band .eyebrow-badge");
  if (contactEyebrow) contactEyebrow.textContent = currentLang === "ar" ? "جاهز تطلب؟" : "Ready to order?";

  const contactTitle = document.querySelector(".contact-band h2");
  if (contactTitle) contactTitle.textContent = currentLang === "ar" ? "اتصل أو ابعث واتساب" : "Call or Send WhatsApp";

  const contactDesc = document.querySelector(".contact-band p");
  if (contactDesc) {
    contactDesc.textContent = t.contactNote;
  }

  // Translate Social button labels in Contact Band
  const whatsappButtonText = document.querySelector(".contact-actions a[href*='wa.me'] .btn-text");
  if (whatsappButtonText) whatsappButtonText.textContent = currentLang === "ar" ? "واتساب" : "WhatsApp";

  const instagramButtonText = document.querySelector(".contact-actions a[href*='instagram'] .btn-text");
  if (instagramButtonText) instagramButtonText.textContent = currentLang === "ar" ? "إنستغرام" : "Instagram";

  const facebookButtonText = document.querySelector(".contact-actions a[href*='facebook'] .btn-text");
  if (facebookButtonText) facebookButtonText.textContent = currentLang === "ar" ? "فيسبوك" : "Facebook";

  // Phone Call Action Button
  const phoneButton = document.querySelector(".contact-actions .primary-btn");
  if (phoneButton) {
    phoneButton.href = `tel:${site.phoneInternational || site.phone || ""}`;
    phoneButton.innerHTML = `<i data-lucide="phone-call"></i>${site.phone || ""}`;
  }

  // Map Buttons
  const mapButtons = document.querySelectorAll('a[href*="maps.app"], a[href*="google.com/maps"]');
  mapButtons.forEach((button) => {
    button.href = site.mapUrl || "#branches";
  });

  // Hero CTAs
  const heroPrimary = document.querySelector(".hero-actions .primary-btn");
  if (heroPrimary) {
    heroPrimary.innerHTML = `<i data-lucide="utensils"></i>${t.exploreMenu}`;
  }
  const heroSecondary = document.querySelector(".hero-actions .secondary-btn");
  if (heroSecondary) {
    heroSecondary.innerHTML = `<i data-lucide="map-pin"></i>${t.openMap}`;
  }

  // Hero Images
  const heroImages = document.querySelectorAll(".hero-media img");
  heroImages.forEach((image, index) => {
    if (site.heroImages?.[index]) image.src = site.heroImages[index];
  });

  const heroBackground = site.heroImages?.[0] || "";
  if (heroBackground) {
    document.documentElement.style.setProperty("--hero-image", `url("${heroBackground}")`);
  }

  // Featured Dish Side Card
  const featured = menu.flatMap((category) => category.items || [])[0];
  if (featured) {
    const featuredTitle = currentLang === "ar" ? featured.name : (menuTranslations[featured.name]?.name || featured.name);
    updateText(".featured-dish strong", featuredTitle);
    updateText(".featured-dish span", `${t.from} ${featured.price}`);
    updateText(".panel-top span", t.todaysMenu);
    updateText(".featured-dish small", t.mostPopular);
    const featuredImage = document.querySelector(".featured-dish img");
    if (featuredImage) {
      featuredImage.src = featured.image;
      featuredImage.alt = featuredTitle;
    }
  }

  // Highlights Section
  const highlightArticles = document.querySelectorAll(".highlights article");
  if (highlightArticles.length >= 3) {
    highlightArticles[0].querySelector("strong").textContent = t.plateHighlight;
    highlightArticles[0].querySelector("span").textContent = t.plateHighlightDesc;
    highlightArticles[1].querySelector("strong").textContent = t.photoHighlight;
    highlightArticles[1].querySelector("span").textContent = t.photoHighlightDesc;
    highlightArticles[2].querySelector("strong").textContent = t.priceHighlight;
    highlightArticles[2].querySelector("span").textContent = t.priceHighlightDesc;
  }

  // Heritage Section
  const heritageSec = document.querySelector(".heritage");
  if (heritageSec) {
    heritageSec.querySelector(".eyebrow").innerHTML = `<span></span>${t.heritageEyebrow}`;
    heritageSec.querySelector("h2").textContent = t.heritageTitle;
    const paras = heritageSec.querySelectorAll("p");
    if (paras.length >= 2) {
      paras[0].textContent = t.heritageP1;
      paras[1].textContent = t.heritageP2;
    }
    heritageSec.querySelector(".heritage-signature span").textContent = t.heritageSignature;
    heritageSec.querySelector(".heritage-badge span").textContent = t.heritageBadge;
  }

  // Menu Search Heading
  const menuShell = document.querySelector(".menu-shell");
  if (menuShell) {
    menuShell.querySelector(".section-heading span").textContent = t.menu;
    menuShell.querySelector(".section-heading h2").textContent = t.menuTitle;
    menuShell.querySelector(".section-heading p").textContent = t.menuSubtitle;
    document.getElementById("menuSearch").placeholder = t.searchPlaceholder;
    document.getElementById("emptyState").textContent = t.emptyState;
  }

  // Branches Section
  const branchesSec = document.querySelector(".branches");
  if (branchesSec) {
    branchesSec.querySelector(".section-heading span").textContent = t.branches;
    branchesSec.querySelector(".section-heading h2").textContent = t.branchesTitle;
    branchesSec.querySelector(".section-heading p").textContent = t.branchesSubtitle;
  }

  // Contact Band
  const contactBand = document.querySelector(".contact-band");
  if (contactBand) {
    const contactEyebrow = contactBand.querySelector(".eyebrow-badge");
    if (contactEyebrow) contactEyebrow.textContent = currentLang === "ar" ? "جاهز تطلب؟" : "Ready to order?";
    
    const contactTitle = contactBand.querySelector("h2");
    if (contactTitle) contactTitle.textContent = currentLang === "ar" ? "اتصل أو ابعث واتساب" : "Call or Send WhatsApp";
    
    const contactDesc = contactBand.querySelector("p");
    if (contactDesc) {
      contactDesc.textContent = t.contactNote;
    }

    const whatsappBtnText = contactBand.querySelector(".whatsapp-btn .btn-text");
    if (whatsappBtnText) whatsappBtnText.textContent = currentLang === "ar" ? "واتساب" : "WhatsApp";

    const instagramBtnText = contactBand.querySelector(".instagram-btn .btn-text");
    if (instagramBtnText) instagramBtnText.textContent = currentLang === "ar" ? "إنستغرام" : "Instagram";

    const facebookBtnText = contactBand.querySelector(".facebook-btn .btn-text");
    if (facebookBtnText) facebookBtnText.textContent = currentLang === "ar" ? "فيسبوك" : "Facebook";
  }

  // Translate shopping cart labels
  const cartTitleLabel = document.getElementById("cartTitleLabel");
  if (cartTitleLabel) cartTitleLabel.textContent = currentLang === "ar" ? "سلة طلباتك" : "Your Cart";

  const cartSubtotalLabel = document.getElementById("cartSubtotalLabel");
  if (cartSubtotalLabel) cartSubtotalLabel.textContent = currentLang === "ar" ? "المجموع الفرعي:" : "Subtotal:";

  const cartTaxLabel = document.getElementById("cartTaxLabel");
  if (cartTaxLabel) cartTaxLabel.textContent = currentLang === "ar" ? "الضريبة (8%):" : "Tax (8%):";

  const cartTotalLabel = document.getElementById("cartTotalLabel");
  if (cartTotalLabel) cartTotalLabel.textContent = currentLang === "ar" ? "المجموع الكلي:" : "Total Amount:";

  const sendOrderBtnLabel = document.getElementById("sendOrderBtnLabel");
  if (sendOrderBtnLabel) sendOrderBtnLabel.textContent = currentLang === "ar" ? "إرسال الطلب عبر الواتساب" : "Send Order to WhatsApp";

  const cartBadgeLabel = document.getElementById("cartBadgeLabel");
  if (cartBadgeLabel) cartBadgeLabel.textContent = currentLang === "ar" ? "الطلبات" : "Orders";

  const branchSelectLabel = document.getElementById("branchSelectLabel");
  if (branchSelectLabel) {
    branchSelectLabel.textContent = currentLang === "ar" ? "اختر فرع الاستلام / الطلب:" : "Select Pickup Branch:";
  }
  const branchContainer = document.getElementById("cartBranchButtons");
  if (branchContainer) branchContainer.innerHTML = ""; // Clear so it regenerates in correct language

  if (typeof updateCartUI === "function") updateCartUI();

  // Switch button visual toggle
  const langBtn = document.getElementById("langSwitcher");
  if (langBtn) {
    langBtn.querySelector("span").textContent = currentLang === "ar" ? "EN" : "AR";
    langBtn.setAttribute("aria-label", currentLang === "ar" ? "Switch to English" : "تغيير للغة العربية");
  }

  // Reinitialize lucide icons for translated buttons
  if (window.lucide) window.lucide.createIcons();

  renderBranches();
}

/* ─── Branches ─── */
function renderBranches() {
  if (!branchGrid) return;
  branchGrid.innerHTML = "";
  const branches = Array.isArray(site.branches) ? site.branches : [];
  const t = uiTranslations[currentLang];

  branches.forEach((branch, index) => {
    const article = document.createElement("article");
    article.className =
      branch.featured || index === 0
        ? "branch-card primary reveal-ready"
        : "branch-card reveal-ready";

    // Translate branch titles if English
    let branchTitle = branch.title || "فرع";
    let branchAddress = branch.address || "";
    if (currentLang === "en") {
      if (branchTitle.includes("المدينة المنورة")) {
        branchTitle = "Al-Madina Al-Munawarah St.";
        branchAddress = "Amman - Jordan";
      } else if (branchTitle.includes("مكة")) {
        branchTitle = "Mecca Street";
        branchAddress = "Al-Dawood Complex - Amman";
      } else if (branchTitle.includes("طبربور")) {
        branchTitle = "Tabarbour";
        branchAddress = "Tank Roundabout - Amman";
      }
    }

    let imageSrc = branch.image || (index === 0 ? "./branch_madina.png" : index === 1 ? "./branch_mecca.png" : "./branch_tabarbour.png");

    article.innerHTML = `
      <div class="branch-image-container">
        <img src="${imageSrc}" alt="${branchTitle}" loading="lazy" />
      </div>
      <div class="branch-info-container">
        <div class="branch-header-row">
          <i data-lucide="${index === 0 ? "map-pin" : index === 1 ? "building-2" : "navigation"}"></i>
          <strong>${branchTitle}</strong>
        </div>
        <span>${branchAddress}</span>
        ${
          branch.mapUrl
            ? `<a href="${branch.mapUrl}" target="_blank" rel="noreferrer">${currentLang === "ar" ? "الموقع على الخريطة" : "Location on Map"}</a>`
            : ""
        }
      </div>
    `;
    branchGrid.appendChild(article);
  });

  watchRevealElements(branchGrid);
}

/* ─── Menu Tabs ─── */
function renderTabs() {
  tabs.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "category-tab active";
  allButton.dataset.category = "all";
  allButton.innerHTML = `<i data-lucide="layout-grid"></i><span>${currentLang === "ar" ? "الكل" : "All"}</span><small>${countItems()}</small>`;
  tabs.appendChild(allButton);

  menu.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tab";
    button.dataset.category = category.id;

    const translatedTitle = currentLang === "ar" ? category.title : (menuTranslations[category.id]?.title || category.title);
    const meta = getCategoryMeta(category);

    button.innerHTML = `
      <i data-lucide="${meta.icon}"></i>
      <span>${translatedTitle}</span>
      <small>${(category.items || []).length}</small>
    `;
    tabs.appendChild(button);
  });

  if (window.lucide) window.lucide.createIcons();
}

/* ─── Filtering & Search ─── */
function getVisibleItems() {
  const query = normalize(searchTerm);

  return menu
    .filter((category) => activeCategory === "all" || category.id === activeCategory)
    .map((category) => ({
      ...category,
      items: (category.items || []).filter((item) => {
        if (!query) return true;
        // In English mode, check English names/descriptions
        if (currentLang === "en") {
          const itemTrans = menuTranslations[item.name] || {};
          const engName = normalize(itemTrans.name || item.name);
          const engDesc = normalize(itemTrans.desc || item.description);
          const catTrans = menuTranslations[category.id] || {};
          const engCat = normalize(catTrans.title || category.title);
          return `${engName} ${engDesc} ${engCat}`.includes(query);
        }
        return normalize(`${item.name} ${item.description} ${category.title}`).includes(query);
      }),
    }))
    .filter((category) => category.items.length > 0);
}

/* ─── Create Dish Card ─── */
function createDishCard(item, categoryTitle) {
  const article = document.createElement("article");
  article.className = "dish-card reveal-ready";

  const trans = menuTranslations[item.name] || {};
  const dishName = currentLang === "ar" ? item.name : (trans.name || item.name);
  
  let dishDesc = item.description;
  if (currentLang === "en") {
    dishDesc = trans.desc || descTranslations[item.description] || item.description;
    if (!dishDesc) {
      dishDesc = "A premium dish from Ghmaas Baladi menu.";
    }
  } else if (!dishDesc) {
    dishDesc = "طبق من قائمة غماس بلدي.";
  }
  
  article.innerHTML = `
    <div class="dish-image">
      <img src="${item.image}" alt="${dishName}" loading="lazy" decoding="async" />
    </div>
    <div class="dish-content">
      <span class="dish-category">${categoryTitle}</span>
      <h3>${dishName}</h3>
      <p>${dishDesc}</p>
      <div class="dish-footer">
        <strong>${item.price}</strong>
        <div class="cart-control" data-item-name="${item.name.replace(/'/g, "\\'")}">
          <button class="add-btn" onclick="window.addToCart('${item.name.replace(/'/g, "\\'")}', '${item.price}', '${item.image}')">
            <span>${currentLang === 'ar' ? 'إضافة +' : 'Add +'}</span>
          </button>
          <div class="qty-adjust" style="display: none;">
            <button class="minus-btn" onclick="window.updateQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
            <span class="qty-val">0</span>
            <button class="plus-btn" onclick="window.updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return article;
}

/* ─── Render Menu with Cascading Stagger delays ─── */
function renderMenu() {
  grid.innerHTML = "";
  const visible = getVisibleItems();

  visible.forEach((category) => {
    const group = document.createElement("section");
    group.className = "menu-category reveal-ready";
    
    const translatedCategoryTitle = currentLang === "ar" ? category.title : (menuTranslations[category.id]?.title || category.title);
    const meta = getCategoryMeta(category);

    group.innerHTML = `
      <div class="category-heading">
        <div class="category-title-block">
          <span class="category-kicker"><i data-lucide="${meta.icon}"></i>${meta.kicker}</span>
          <h3>${translatedCategoryTitle}</h3>
          <p>${meta.subtitle}</p>
        </div>
        <div class="category-count" aria-label="${category.items.length} ${currentLang === "ar" ? "صنف" : "items"}">
          <strong>${category.items.length}</strong>
          <span>${currentLang === "ar" ? "صنف" : "items"}</span>
        </div>
      </div>
    `;

    const cards = document.createElement("div");
    cards.className = "dish-grid";
    
    category.items.forEach((item, itemIndex) => {
      const card = createDishCard(item, translatedCategoryTitle);
      // Cascading stagger delay
      card.style.animationDelay = `${itemIndex * 40}ms`;
      cards.appendChild(card);
    });

    group.appendChild(cards);
    grid.appendChild(group);
  });

  emptyState.hidden = visible.length > 0;
  if (window.lucide) window.lucide.createIcons();
  watchRevealElements(grid);
  if (typeof updateCartUI === "function") updateCartUI();
}

/* ─── Category Selection ─── */
function setActiveCategory(categoryId) {
  activeCategory = categoryId;
  document.querySelectorAll(".category-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === categoryId);
  });
  renderMenu();
}

/* ─── Event Bindings ─── */
function bindEvents() {
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest(".category-tab");
    if (!button) return;
    setActiveCategory(button.dataset.category);
  });

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderMenu();
  });

  // Sticky header scroll effect
  let lastScrollY = 0;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > 16);
    lastScrollY = scrollY;
  });

  // Smooth parallax on hero images
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const heroMedia = document.querySelector(".hero-media");
    if (heroMedia) {
      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        if (scrollY < 800) {
          heroMedia.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
      }, { passive: true });
    }
  }

  // Language Switcher Button Click
  const langBtn = document.getElementById("langSwitcher");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "ar" ? "en" : "ar";
      localStorage.setItem("ghmaas_lang", currentLang);
      
      // Instantly swap content
      applySiteContent();
      renderTabs();
      setActiveCategory(activeCategory);
    });
  }
}

/* ─── Reveal Observer ─── */
function createRevealObserver() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.06,
    },
  );
}

function watchRevealElements(root = document) {
  const targets = root.querySelectorAll(
    ".highlights article, .heritage, .section-heading, .menu-category, .dish-card, .branch-card, .contact-band, .site-footer",
  );

  targets.forEach((target, index) => {
    target.classList.add("reveal-ready");
    target.style.transitionDelay = `${Math.min(index % 8, 7) * 50}ms`;

    if (!revealObserver) {
      target.classList.add("is-visible");
      return;
    }

    if (target.dataset.revealObserved === "true") return;
    target.dataset.revealObserved = "true";
    revealObserver.observe(target);
  });
}

/* ─── Card Hover Tilt (subtle 3D) ─── */
function initCardTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 768) return;

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".dish-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      translateY(-6px)
      perspective(600px)
      rotateX(${y * -3}deg)
      rotateY(${x * 3}deg)
    `;
  });

  document.addEventListener("mouseleave", (e) => {
    const card = e.target.closest?.(".dish-card");
    if (card) {
      card.style.transform = "";
    }
  }, true);
}

/* ─── Load Site Data ─── */
async function loadSite() {
  initPreloader();
  try {
    const response = await fetch("/api/site", { cache: "no-store" });
    if (response.ok) {
      site = { ...site, ...(await response.json()) };
    }
  } catch {
    // Opening index.html directly still works with the static fallback menu.
  }

  applySiteContent();
  revealObserver = createRevealObserver();
  renderTabs();
  renderMenu();
  bindEvents();
  watchRevealElements(document);
  initParticles();
  initCardTilt();
  initMagneticButtons();
  initActiveNavTracker();
}

loadSite();

window.addEventListener("load", () => {
  if (window.lucide) window.lucide.createIcons();
});

/* ─── Shopping Cart Logic ─── */
let cart = {};
let selectedBranch = "";

window.addToCart = function (name, priceString, image) {
  // Extract number from price (e.g., "6.50 JOD" -> 6.5)
  const priceFloat = parseFloat(priceString.replace(/[^\d.]/g, "")) || 0;
  cart[name] = {
    name,
    priceString,
    priceFloat,
    image,
    qty: 1
  };
  updateCartUI();
  
  // Show pop animation for the cart badge
  const floatingCart = document.getElementById("floatingCart");
  if (floatingCart) {
    floatingCart.classList.add("cart-pop");
    setTimeout(() => floatingCart.classList.remove("cart-pop"), 400);
  }
};

window.updateQty = function (name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) {
    delete cart[name];
  }
  updateCartUI();
};

window.toggleCartModal = function (show) {
  const backdrop = document.getElementById("cartBackdrop");
  const drawer = document.getElementById("cartDrawer");
  if (backdrop && drawer) {
    if (show) {
      backdrop.classList.add("visible");
      drawer.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      backdrop.classList.remove("visible");
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    }
  }
};

window.sendOrderToWhatsApp = function () {
  const items = Object.values(cart);
  if (items.length === 0) return;

  const isAr = currentLang === "ar";

  if (!selectedBranch) {
    alert(isAr ? "الرجاء اختيار فرع الاستلام قبل إرسال الطلب!" : "Please select the pickup branch before sending the order!");
    return;
  }
  
  let msg = isAr 
    ? `*🇯🇴 طلب جديد من غماس بلدي 🇯🇴*\n`
    : `*🇯🇴 New Order from Ghmaas Baladi 🇯🇴*\n`;

  msg += isAr
    ? `*الفرع المختص:* ${selectedBranch}\n`
    : `*Selected Branch:* ${selectedBranch}\n`;
    
  msg += `-------------------------------------\n`;
  
  let subtotal = 0;
  items.forEach((item) => {
    const trans = menuTranslations[item.name] || {};
    const itemName = isAr ? item.name : (trans.name || item.name);
    const itemTotal = item.priceFloat * item.qty;
    subtotal += itemTotal;
    
    msg += `• ${item.qty} × ${itemName} (${item.priceString})\n`;
  });
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  msg += `-------------------------------------\n`;
  msg += isAr 
    ? `*المجموع الفرعي:* ${subtotal.toFixed(2)} JOD\n`
    : `*Subtotal:* ${subtotal.toFixed(2)} JOD\n`;
  msg += isAr
    ? `*الضريبة (8%):* ${tax.toFixed(2)} JOD\n`
    : `*Tax (8%):* ${tax.toFixed(2)} JOD\n`;
  msg += isAr
    ? `*المجموع الكلي:* ${total.toFixed(2)} JOD\n`
    : `*Grand Total:* ${total.toFixed(2)} JOD\n`;
  msg += `-------------------------------------\n`;
  msg += isAr
    ? `بانتظار تأكيد الطلب يا غالي وشكراً لكم! 🙏`
    : `Waiting for order confirmation, thank you! 🙏`;

  const url = `https://wa.me/${site.whatsapp || "962798181200"}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
};

function updateCartUI() {
  const isAr = currentLang === "ar";
  const items = Object.values(cart);
  
  // 1. Sync visible card controls
  document.querySelectorAll(".cart-control").forEach((div) => {
    const itemName = div.dataset.itemName;
    const addBtn = div.querySelector(".add-btn");
    const qtyAdjust = div.querySelector(".qty-adjust");
    const qtyVal = div.querySelector(".qty-val");
    
    if (cart[itemName]) {
      if (addBtn) addBtn.style.display = "none";
      if (qtyAdjust) qtyAdjust.style.display = "flex";
      if (qtyVal) qtyVal.textContent = cart[itemName].qty;
    } else {
      if (addBtn) addBtn.style.display = "block";
      if (qtyAdjust) qtyAdjust.style.display = "none";
    }
  });
  
  // 2. Calculate totals
  let totalQty = 0;
  let subtotal = 0;
  items.forEach((item) => {
    totalQty += item.qty;
    subtotal += item.priceFloat * item.qty;
  });
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  // 3. Update floating badge
  const floatingCart = document.getElementById("floatingCart");
  if (floatingCart) {
    if (totalQty > 0) {
      floatingCart.classList.remove("hidden");
      const badgeCount = document.getElementById("cartBadgeCount");
      if (badgeCount) badgeCount.textContent = totalQty;
      const badgeTotal = document.getElementById("cartBadgeTotal");
      if (badgeTotal) badgeTotal.textContent = `${total.toFixed(2)} JOD`;
    } else {
      floatingCart.classList.add("hidden");
    }
  }
  
  // 4. Update drawer summary
  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} JOD`;
  const taxEl = document.getElementById("cartTax");
  if (taxEl) taxEl.textContent = `${tax.toFixed(2)} JOD`;
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} JOD`;
  
  // 5. Render drawer items
  const drawerItems = document.getElementById("cartDrawerItems");
  if (drawerItems) {
    if (items.length === 0) {
      drawerItems.innerHTML = `
        <div class="cart-empty-state">
          <i data-lucide="shopping-bag" style="width: 48px; height: 48px; opacity: 0.3; margin-bottom: 12px;"></i>
          <p>${isAr ? "سلة طلباتك فارغة حالياً" : "Your cart is currently empty"}</p>
        </div>
      `;
    } else {
      drawerItems.innerHTML = items.map((item) => {
        const trans = menuTranslations[item.name] || {};
        const itemName = isAr ? item.name : (trans.name || item.name);
        return `
          <div class="cart-item">
            <img src="${item.image}" alt="${itemName}" />
            <div class="cart-item-info">
              <h4>${itemName}</h4>
              <span>${item.priceString}</span>
            </div>
            <div class="cart-item-qty">
              <button onclick="window.updateQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="window.updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
            </div>
            <div class="cart-item-total">
              <strong>${(item.priceFloat * item.qty).toFixed(2)} JOD</strong>
            </div>
          </div>
        `;
      }).join("");
    }
  }
  
  // 6. Render branch selector buttons
  const branchContainer = document.getElementById("cartBranchButtons");
  if (branchContainer) {
    if (items.length === 0) {
      const selectorWrapper = document.querySelector(".cart-branch-selector");
      if (selectorWrapper) selectorWrapper.style.display = "none";
      selectedBranch = ""; // Reset selection if cart is empty
    } else {
      const selectorWrapper = document.querySelector(".cart-branch-selector");
      if (selectorWrapper) selectorWrapper.style.display = "block";
      
      if (branchContainer.children.length === 0 && site && Array.isArray(site.branches)) {
        branchContainer.innerHTML = "";
        site.branches.forEach((branch) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cart-branch-btn";
          btn.dataset.branch = branch.title;
          
          const title = isAr ? branch.title : (branch.title === "شارع المدينة المنورة" ? "Al-Madinah Al-Munawwarah St." : (branch.title === "شارع مكة" ? "Mecca St." : "Tabarbour"));
          
          btn.innerHTML = `
            <i data-lucide="map-pin"></i>
            <span>${title}</span>
          `;
          
          btn.addEventListener("click", () => {
            document.querySelectorAll(".cart-branch-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            selectedBranch = branch.title;
          });
          
          if (selectedBranch === branch.title) {
            btn.classList.add("active");
          }
          
          branchContainer.appendChild(btn);
        });
      } else {
        document.querySelectorAll(".cart-branch-btn").forEach((btn) => {
          if (btn.dataset.branch === selectedBranch) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }
    }
  }

  if (window.lucide) window.lucide.createIcons();
}
