const loginCard = document.querySelector("#loginCard");
const adminApp = document.querySelector("#adminApp");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const passwordInput = document.querySelector("#passwordInput");
const statusBox = document.querySelector("#adminStatus");
const siteFields = document.querySelector("#siteFields");
const branchesEditor = document.querySelector("#branchesEditor");
const menuEditor = document.querySelector("#menuEditor");
const saveButton = document.querySelector("#saveButton");
const logoutButton = document.querySelector("#logoutButton");
const addBranchButton = document.querySelector("#addBranchButton");
const addCategoryButton = document.querySelector("#addCategoryButton");

let site = null;

const textFields = [
  ["brandName", "اسم المطعم"],
  ["tagline", "السطر الصغير تحت الاسم"],
  ["heroLocation", "موقع الهيرو"],
  ["heroDescription", "وصف الهيرو", "textarea"],
  ["logo", "رابط الشعار"],
  ["phone", "رقم الهاتف الظاهر"],
  ["phoneInternational", "رقم الاتصال الدولي"],
  ["whatsapp", "رقم واتساب الدولي بدون +"],
  ["instagram", "رابط إنستغرام"],
  ["facebook", "رابط فيسبوك"],
  ["mapUrl", "رابط الخريطة"],
  ["taxNote", "ملاحظة الضريبة"],
  ["dedication", "نص الإهداء"],
  ["sourceNote", "ملاحظة آخر الصفحة", "textarea"],
];

function setStatus(message, type = "neutral") {
  statusBox.textContent = message;
  statusBox.dataset.type = type;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "حدث خطأ غير متوقع");
  return data;
}

function makeField(label, value, onInput, type = "input") {
  const wrapper = document.createElement("label");
  wrapper.className = "admin-field";
  const control =
    type === "textarea" ? document.createElement("textarea") : document.createElement("input");
  control.value = value || "";
  control.addEventListener("input", () => onInput(control.value));
  wrapper.append(label, control);
  return wrapper;
}

function makeIconButton(icon, label, onClick, danger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = danger ? "admin-icon danger" : "admin-icon";
  button.title = label;
  button.innerHTML = `<i data-lucide="${icon}"></i>`;
  button.addEventListener("click", onClick);
  return button;
}

function renderSiteFields() {
  siteFields.innerHTML = "";
  textFields.forEach(([key, label, type]) => {
    siteFields.appendChild(makeField(label, site[key], (value) => {
      site[key] = value;
    }, type));
  });

  site.heroImages = site.heroImages || [];
  site.heroImages.forEach((image, index) => {
    siteFields.appendChild(makeField(`صورة الهيرو ${index + 1}`, image, (value) => {
      site.heroImages[index] = value;
    }));
  });
}

function renderBranches() {
  branchesEditor.innerHTML = "";
  site.branches = site.branches || [];

  site.branches.forEach((branch, index) => {
    const card = document.createElement("article");
    card.className = "admin-edit-card";
    card.innerHTML = `
      <div class="admin-edit-head">
        <strong>فرع ${index + 1}</strong>
      </div>
    `;
    card.querySelector(".admin-edit-head").appendChild(
      makeIconButton("trash-2", "حذف الفرع", () => {
        site.branches.splice(index, 1);
        renderBranches();
      }, true),
    );
    const fields = document.createElement("div");
    fields.className = "admin-grid three";
    fields.append(
      makeField("اسم الفرع", branch.title, (value) => {
        branch.title = value;
      }),
      makeField("العنوان", branch.address, (value) => {
        branch.address = value;
      }),
      makeField("رابط الخريطة", branch.mapUrl, (value) => {
        branch.mapUrl = value;
      }),
    );
    card.appendChild(fields);
    branchesEditor.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderMenu() {
  menuEditor.innerHTML = "";
  site.menu = site.menu || [];

  site.menu.forEach((category, categoryIndex) => {
    const section = document.createElement("article");
    section.className = "admin-edit-card category-editor";
    section.innerHTML = `
      <div class="admin-edit-head">
        <strong>${category.title || "قسم بدون اسم"}</strong>
        <span>${(category.items || []).length} صنف</span>
      </div>
    `;
    const head = section.querySelector(".admin-edit-head");
    head.appendChild(
      makeIconButton("trash-2", "حذف القسم", () => {
        site.menu.splice(categoryIndex, 1);
        renderMenu();
      }, true),
    );

    const categoryFields = document.createElement("div");
    categoryFields.className = "admin-grid two";
    categoryFields.append(
      makeField("اسم القسم", category.title, (value) => {
        category.title = value;
        head.querySelector("strong").textContent = value || "قسم بدون اسم";
      }),
      makeField("صورة القسم", category.image, (value) => {
        category.image = value;
      }),
    );
    section.appendChild(categoryFields);

    const items = document.createElement("div");
    items.className = "admin-items";
    category.items = category.items || [];
    category.items.forEach((item, itemIndex) => {
      const row = document.createElement("div");
      row.className = "admin-item-row";
      row.append(
        makeField("الاسم", item.name, (value) => {
          item.name = value;
        }),
        makeField("الوصف", item.description, (value) => {
          item.description = value;
        }),
        makeField("السعر", item.price, (value) => {
          item.price = value;
        }),
        makeField("الصورة", item.image, (value) => {
          item.image = value;
        }),
        makeIconButton("trash-2", "حذف الصنف", () => {
          category.items.splice(itemIndex, 1);
          renderMenu();
        }, true),
      );
      items.appendChild(row);
    });
    section.appendChild(items);

    const addItem = document.createElement("button");
    addItem.type = "button";
    addItem.className = "admin-secondary inline";
    addItem.innerHTML = `<i data-lucide="plus"></i> إضافة صنف داخل ${category.title || "القسم"}`;
    addItem.addEventListener("click", () => {
      category.items.push({ name: "صنف جديد", description: "", price: "0.00 JOD", image: "" });
      renderMenu();
    });
    section.appendChild(addItem);
    menuEditor.appendChild(section);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderAll() {
  renderSiteFields();
  renderBranches();
  renderMenu();
  if (window.lucide) window.lucide.createIcons();
}

async function loadAdmin() {
  setStatus("جاري تحميل البيانات...");
  site = await api("/api/site");
  loginCard.hidden = true;
  adminApp.hidden = false;
  renderAll();
  setStatus(`تم تحميل البيانات. آخر تحديث: ${site.updatedAt ? new Date(site.updatedAt).toLocaleString("ar-JO") : "غير معروف"}`);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "جاري الدخول...";
  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ password: passwordInput.value }),
    });
    loginMessage.textContent = "";
    await loadAdmin();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

saveButton.addEventListener("click", async () => {
  try {
    setStatus("جاري الحفظ...");
    site = await api("/api/site", {
      method: "PUT",
      body: JSON.stringify(site),
    });
    setStatus("تم حفظ كل التعديلات بنجاح.", "success");
    renderAll();
  } catch (error) {
    setStatus(error.message, "error");
  }
});

logoutButton.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST", body: "{}" });
  adminApp.hidden = true;
  loginCard.hidden = false;
});

addBranchButton.addEventListener("click", () => {
  site.branches.push({ title: "فرع جديد", address: "", mapUrl: "", featured: false });
  renderBranches();
});

addCategoryButton.addEventListener("click", () => {
  site.menu.push({ id: `category-${Date.now()}`, title: "قسم جديد", image: "", items: [] });
  renderMenu();
});

api("/api/me")
  .then((me) => {
    if (me.authenticated) return loadAdmin();
    if (window.lucide) window.lucide.createIcons();
  })
  .catch(() => {
    if (window.lucide) window.lucide.createIcons();
  });
