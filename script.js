/* ═══════════════════════════════════════════════════════════
   غماس بلدي — Ultra-Luxury Script
   Preloader, Particle canvas, Follower Cursor, Sparkles, Magnetic Buttons
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
  dedication: "إهداء من المسار الذهبي بسبب وقتهم من النشامى",
  sourceNote:
    "بيانات المنيو والصور والأسعار مبنية على صفحة المطعم الأصلية، ويجب مراجعة الأسعار قبل النشر النهائي.",
  branches: [],
  menu: fallbackMenu,
};

let menu = fallbackMenu;
let activeCategory = "all";
let searchTerm = "";
let revealObserver = null;

/* ─── Preloader ─── */
function initPreloader() {
  const preloader = document.getElementById("luxuryPreloader");
  if (!preloader) return;

  // Fade out preloader when loading is finished
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 800);
    }, 1000);
  });

  // Fallback in case load event takes too long
  setTimeout(() => {
    if (!preloader.classList.contains("fade-out")) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 800);
    }
  }, 3000);
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

/* ─── Apply Site Content ─── */
function applySiteContent() {
  menu = Array.isArray(site.menu) && site.menu.length ? site.menu : fallbackMenu;

  document.title = `${site.brandName} | منيو وتجربة فاخرة`;
  updateText(".brand-lockup strong, .footer-brand strong", site.brandName);
  updateText(".brand-lockup small", site.tagline);
  updateText(".hero h1", site.brandName);
  updateText(".hero-content p", site.heroDescription);
  const dedicationEl = document.querySelector(".dedication");
  if (dedicationEl) {
    dedicationEl.innerHTML = site.dedication;
  }
  updateText(".site-footer small", site.sourceNote);
  updateText(".panel-top strong", `${countItems()} صنف`);

  const taxNote = document.querySelector(".tax-note");
  if (taxNote) taxNote.innerHTML = `<i data-lucide="receipt-text"></i>${site.taxNote || ""}`;

  const eyebrow = document.querySelector(".eyebrow");
  if (eyebrow) eyebrow.innerHTML = `<span></span>${site.heroLocation || ""}`;

  document.querySelectorAll(".brand-lockup img, .footer-brand img").forEach((image) => {
    image.src = site.logo;
    image.alt = site.brandName;
  });

  updateHref('a[href^="tel:"]', `tel:${site.phoneInternational || site.phone || ""}`);
  updateHref('a[href*="wa.me"]', `https://wa.me/${site.whatsapp || ""}`);
  updateHref('a[href*="instagram.com"]', site.instagram || "#");
  updateHref('a[href*="facebook.com"]', site.facebook || "#");

  const phoneButton = document.querySelector(".contact-actions .primary-btn");
  if (phoneButton) {
    phoneButton.href = `tel:${site.phoneInternational || site.phone || ""}`;
    phoneButton.innerHTML = `<i data-lucide="phone-call"></i>${site.phone || ""}`;
  }

  const mapButtons = document.querySelectorAll('a[href*="maps.app"], a[href*="google.com/maps"]');
  mapButtons.forEach((button) => {
    button.href = site.mapUrl || "#branches";
  });

  const heroImages = document.querySelectorAll(".hero-media img");
  heroImages.forEach((image, index) => {
    if (site.heroImages?.[index]) image.src = site.heroImages[index];
  });

  const heroBackground = site.heroImages?.[0] || "";
  if (heroBackground) {
    document.documentElement.style.setProperty("--hero-image", `url("${heroBackground}")`);
  }

  const featured = menu.flatMap((category) => category.items || [])[0];
  if (featured) {
    updateText(".featured-dish strong", featured.name);
    updateText(".featured-dish span", `من ${featured.price}`);
    const featuredImage = document.querySelector(".featured-dish img");
    if (featuredImage) {
      featuredImage.src = featured.image;
      featuredImage.alt = featured.name;
    }
  }

  renderBranches();
}

/* ─── Branches ─── */
function renderBranches() {
  if (!branchGrid) return;
  branchGrid.innerHTML = "";
  const branches = Array.isArray(site.branches) ? site.branches : [];

  branches.forEach((branch, index) => {
    const article = document.createElement("article");
    article.className =
      branch.featured || index === 0
        ? "branch-card primary reveal-ready"
        : "branch-card reveal-ready";
    article.innerHTML = `
      <i data-lucide="${index === 0 ? "map-pin" : index === 1 ? "building-2" : "navigation"}"></i>
      <strong>${branch.title || "فرع"}</strong>
      <span>${branch.address || ""}</span>
      ${
        branch.mapUrl
          ? `<a href="${branch.mapUrl}" target="_blank" rel="noreferrer">الموقع على الخريطة</a>`
          : ""
      }
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
  allButton.innerHTML = `<span>الكل</span><small>${countItems()}</small>`;
  tabs.appendChild(allButton);

  menu.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tab";
    button.dataset.category = category.id;
    button.innerHTML = `
      ${category.image ? `<img src="${category.image}" alt="" loading="lazy" />` : ""}
      <span>${category.title}</span>
      <small>${(category.items || []).length}</small>
    `;
    tabs.appendChild(button);
  });
}

/* ─── Filtering ─── */
function getVisibleItems() {
  const query = normalize(searchTerm);

  return menu
    .filter((category) => activeCategory === "all" || category.id === activeCategory)
    .map((category) => ({
      ...category,
      items: (category.items || []).filter((item) => {
        if (!query) return true;
        return normalize(`${item.name} ${item.description} ${category.title}`).includes(query);
      }),
    }))
    .filter((category) => category.items.length > 0);
}

/* ─── Create Dish Card ─── */
function createDishCard(item, categoryTitle) {
  const article = document.createElement("article");
  article.className = "dish-card reveal-ready";
  const message = encodeURIComponent(`مرحبا، بدي اسأل عن ${item.name}`);
  article.innerHTML = `
    <div class="dish-image">
      <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
    </div>
    <div class="dish-content">
      <span class="dish-category">${categoryTitle}</span>
      <h3>${item.name}</h3>
      ${item.description ? `<p>${item.description}</p>` : `<p class="muted">طبق من قائمة غماس بلدي.</p>`}
      <div class="dish-footer">
        <strong>${item.price}</strong>
        <a href="https://wa.me/${site.whatsapp || ""}?text=${message}" target="_blank" rel="noreferrer" aria-label="اسأل عن ${item.name}">
          <i data-lucide="message-circle"></i>
        </a>
      </div>
    </div>
  `;
  return article;
}

/* ─── Render Menu ─── */
function renderMenu() {
  grid.innerHTML = "";
  const visible = getVisibleItems();

  visible.forEach((category) => {
    const group = document.createElement("section");
    group.className = "menu-category reveal-ready";
    group.innerHTML = `
      <div class="category-heading">
        <div>
          <span>${category.items.length} صنف</span>
          <h3>${category.title}</h3>
        </div>
        ${category.image ? `<img src="${category.image}" alt="" loading="lazy" />` : ""}
      </div>
    `;

    const cards = document.createElement("div");
    cards.className = "dish-grid";
    category.items.forEach((item) => cards.appendChild(createDishCard(item, category.title)));
    group.appendChild(cards);
    grid.appendChild(group);
  });

  emptyState.hidden = visible.length > 0;
  if (window.lucide) window.lucide.createIcons();
  watchRevealElements(grid);
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
