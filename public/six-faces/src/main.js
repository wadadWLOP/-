const IMAGE_SRCS = [
  "https://assets.codepen.io/573855/demo-raw-01.webp",
  "https://assets.codepen.io/573855/demo-raw-02.webp",
  "https://assets.codepen.io/573855/demo-raw-03.webp",
  "https://assets.codepen.io/573855/demo-raw-04.webp",
  "https://assets.codepen.io/573855/demo-raw-05.webp",
  "https://assets.codepen.io/573855/demo-raw-06.webp"
];

const CUSTOM_IMAGES_KEY = 'six-faces-custom-images';
const CUSTOM_IMAGES = [null, null, null, null, null, null];
const CUSTOM_TEXTS_KEY = 'six-faces-custom-texts';
const CUSTOM_TEXTS = [null, null, null, null, null, null];

const COMBOS_KEY = 'six-faces-combos';
const CURRENT_COMBO_KEY = 'six-faces-current-combo';
let COMBOS = [];
let CURRENT_COMBO_ID = null;

const COMBO_FOODIES = ['秋秋', '果汁'];

const cos = new COS({
  SecretId: window.VITE_TENCENT_SECRET_ID || 'YOUR_SECRET_ID',
  SecretKey: window.VITE_TENCENT_SECRET_KEY || 'YOUR_SECRET_KEY',
  Bucket: 'juiceqiuqiu-1420133198',
  Region: 'ap-shanghai'
});

const loadCombos = () => {
  try {
    const saved = localStorage.getItem(COMBOS_KEY);
    if (saved) {
      COMBOS = JSON.parse(saved);
    }
    CURRENT_COMBO_ID = localStorage.getItem(CURRENT_COMBO_KEY);
  } catch (e) {
    console.error('Failed to load combos:', e);
  }
};

const saveCombos = () => {
  localStorage.setItem(COMBOS_KEY, JSON.stringify(COMBOS));
};

const saveCurrentCombo = () => {
  if (CURRENT_COMBO_ID) {
    localStorage.setItem(CURRENT_COMBO_KEY, CURRENT_COMBO_ID);
  }
};

const createCombo = (name, foodie, rating) => {
  const id = Date.now().toString();
  const combo = {
    id,
    name,
    foodie,
    rating: rating || '',
    images: [null, null, null, null, null, null],
    texts: [null, null, null, null, null, null],
    createdAt: new Date().toISOString()
  };
  COMBOS.push(combo);
  saveCombos();
  return combo;
};

const getCurrentCombo = () => {
  return COMBOS.find(c => c.id === CURRENT_COMBO_ID) || null;
};

const switchCombo = (comboId) => {
  CURRENT_COMBO_ID = comboId;
  saveCurrentCombo();

  const combo = getCurrentCombo();
  if (combo) {
    for (let i = 0; i < 6; i++) {
      CUSTOM_IMAGES[i] = combo.images[i] || null;
      CUSTOM_TEXTS[i] = combo.texts[i] || null;
    }
  } else {
    for (let i = 0; i < 6; i++) {
      CUSTOM_IMAGES[i] = null;
      CUSTOM_TEXTS[i] = null;
    }
  }

  refreshFaceImages();
  restoreOverlays(true);
  restoreTexts();
  updateComboSelector();
  updateHUD(0);
};

loadCombos();

const loadCustomImages = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_IMAGES_KEY);
    if (saved) {
      const customImages = JSON.parse(saved);
      for (let i = 0; i < Math.min(customImages.length, CUSTOM_IMAGES.length); i++) {
        CUSTOM_IMAGES[i] = customImages[i];
      }
    }
  } catch (e) {
    console.error('Failed to load custom images:', e);
  }
};

loadCustomImages();

const loadCustomTexts = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_TEXTS_KEY);
    if (saved) {
      const customTexts = JSON.parse(saved);
      for (let i = 0; i < Math.min(customTexts.length, CUSTOM_TEXTS.length); i++) {
        CUSTOM_TEXTS[i] = customTexts[i];
      }
    }
  } catch (e) {
    console.error('Failed to load custom texts:', e);
  }
};

loadCustomTexts();

const restoreTexts = () => {
  for (let i = 0; i < CUSTOM_TEXTS.length; i++) {
    if (CUSTOM_TEXTS[i]) {
      const section = document.getElementById(`s${i}`);
      if (section) {
        const textCard = section.querySelector('.text-card');
        if (textCard) {
          const tag = textCard.querySelector('.tag');
          const heading = textCard.querySelector('h1') || textCard.querySelector('h2');
          const p = textCard.querySelector('.body-text');
          if (CUSTOM_TEXTS[i].tag && tag) tag.textContent = CUSTOM_TEXTS[i].tag;
          if (CUSTOM_TEXTS[i].title && heading) heading.innerHTML = CUSTOM_TEXTS[i].title.replace(/\n/g, '<br>');
          if (CUSTOM_TEXTS[i].body && p) p.textContent = CUSTOM_TEXTS[i].body;
        }
      }
    }
  }
};

const restoreOverlays = (clearExisting = false) => {
  if (clearExisting) {
    document.querySelectorAll('.custom-overlay').forEach(el => el.remove());
  }
  for (let i = 0; i < CUSTOM_IMAGES.length; i++) {
    if (CUSTOM_IMAGES[i]) {
      const face = dom.faces[i];
      if (face) {
        let overlay = face.querySelector('.custom-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'custom-overlay';
          face.appendChild(overlay);
        }
        overlay.style.backgroundImage = `url(${CUSTOM_IMAGES[i]})`;
      }
    }
  }
};

const saveCustomImage = (faceIndex, dataUrl, callback) => {
  const uploadBtn = document.querySelector(`.upload-btn[data-face="${faceIndex}"]`);
  if (uploadBtn) {
    uploadBtn.innerHTML = '<svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  }
  
  const base64Data = dataUrl.split(',')[1];
  const blob = base64ToBlob(base64Data, 'image/png');
  const key = `six-faces/face-${faceIndex}-${Date.now()}.png`;
  
  cos.putObject({
    Bucket: 'juiceqiuqiu-1420133198',
    Region: 'ap-shanghai',
    Key: key,
    StorageClass: 'STANDARD',
    Body: blob,
    onProgress: function(progressData) {
      console.log('上传进度:', progressData.percent);
    }
  }, function(err, data) {
    if (uploadBtn) {
      uploadBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>';
    }
    
    if (err) {
      console.error('上传失败:', err);
      alert('上传失败：' + err.message);
      callback(false, null);
    } else {
      const url = `https://${data.Location}`;
      console.log('上传成功:', url);

      try {
        if (CURRENT_COMBO_ID) {
          const combo = getCurrentCombo();
          if (combo) {
            combo.images[faceIndex] = url;
            saveCombos();
          }
        } else {
          const saved = localStorage.getItem(CUSTOM_IMAGES_KEY);
          const customImages = saved ? JSON.parse(saved) : new Array(6).fill(null);
          customImages[faceIndex] = url;
          localStorage.setItem(CUSTOM_IMAGES_KEY, JSON.stringify(customImages));
        }
        CUSTOM_IMAGES[faceIndex] = url;
        callback(true, url);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
        callback(false, null);
      }
    }
  });
};

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const showTextEditor = (faceIndex) => {
  const section = document.getElementById(`s${faceIndex}`);
  if (!section) return;

  const textCard = section.querySelector('.text-card');
  if (!textCard) return;

  const tag = textCard.querySelector('.tag');
  const heading = textCard.querySelector('h1') || textCard.querySelector('h2');
  const p = textCard.querySelector('.body-text');

  const currentTag = tag ? tag.textContent : '';
  const currentTitle = heading ? heading.textContent.replace(/<br>/g, '\n') : '';
  const currentBody = p ? p.textContent : '';

  const overlay = document.createElement('div');
  overlay.className = 'text-editor-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const editor = document.createElement('div');
  editor.className = 'text-editor';
  editor.style.cssText = `
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    color: #fff;
    font-family: var(--font-mono);
  `;

  editor.innerHTML = `
    <h3 style="margin: 0 0 20px 0; font-size: 16px; color: #888;">编辑文字 - 面 ${faceIndex + 1}</h3>
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 12px; color: #888; margin-bottom: 6px;">标签</label>
      <input type="text" id="edit-tag" value="${currentTag}" style="
        width: 100%;
        padding: 10px 12px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        box-sizing: border-box;
      " />
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 12px; color: #888; margin-bottom: 6px;">标题</label>
      <textarea id="edit-title" rows="3" style="
        width: 100%;
        padding: 10px 12px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        font-family: var(--font-mono);
        box-sizing: border-box;
        resize: vertical;
      ">${currentTitle}</textarea>
    </div>
    <div style="margin-bottom: 20px;">
      <label style="display: block; font-size: 12px; color: #888; margin-bottom: 6px;">正文</label>
      <textarea id="edit-body" rows="5" style="
        width: 100%;
        padding: 10px 12px;
        background: #0a0a0a;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        font-family: var(--font-mono);
        box-sizing: border-box;
        resize: vertical;
      ">${currentBody}</textarea>
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="edit-cancel" style="
        padding: 10px 20px;
        background: transparent;
        border: 1px solid #555;
        border-radius: 6px;
        color: #888;
        cursor: pointer;
        font-size: 14px;
      ">取消</button>
      <button id="edit-save" style="
        padding: 10px 20px;
        background: #4a9;
        border: none;
        border-radius: 6px;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      ">保存</button>
    </div>
  `;

  overlay.appendChild(editor);
  document.body.appendChild(overlay);

  const closeEditor = () => {
    document.body.removeChild(overlay);
  };

  editor.querySelector('#edit-cancel').addEventListener('click', closeEditor);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEditor();
  });

  editor.querySelector('#edit-save').addEventListener('click', () => {
    const newTag = editor.querySelector('#edit-tag').value;
    const newTitle = editor.querySelector('#edit-title').value;
    const newBody = editor.querySelector('#edit-body').value;

    if (CURRENT_COMBO_ID) {
      const combo = getCurrentCombo();
      if (combo) {
        combo.texts[faceIndex] = {
          tag: newTag,
          title: newTitle,
          body: newBody
        };
        saveCombos();
      }
    } else {
      CUSTOM_TEXTS[faceIndex] = {
        tag: newTag,
        title: newTitle,
        body: newBody
      };
      localStorage.setItem(CUSTOM_TEXTS_KEY, JSON.stringify(CUSTOM_TEXTS));
    }

    if (tag) tag.textContent = newTag;
    if (heading) heading.innerHTML = newTitle.replace(/\n/g, '<br>');
    if (p) p.textContent = newBody;

    closeEditor();
  });
};

const showUploadFeedback = (faceIndex, success) => {
  const uploadBtn = document.querySelector(`.upload-btn[data-face="${faceIndex}"]`);
  const feedback = document.createElement('div');
  feedback.className = 'upload-feedback';
  feedback.textContent = success ? '✓ 上传成功' : '✗ 上传失败';
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 24px;
    background: ${success ? 'rgba(58, 110, 0, 0.9)' : 'rgba(180, 60, 60, 0.9)'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-family: var(--font-mono);
    z-index: 9999;
    animation: fadeInOut 2s ease-in-out forwards;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(feedback);
  
  if (uploadBtn) {
    uploadBtn.style.background = success ? 'var(--accent)' : '#b43c3c';
    uploadBtn.style.color = 'var(--bg)';
    setTimeout(() => {
      uploadBtn.style.background = '';
      uploadBtn.style.color = '';
    }, 2000);
  }
  
  setTimeout(() => {
    feedback.remove();
    style.remove();
  }, 2000);
};

const IMAGE_ASPECTS = [1, 1, 1, 1, 1, 1];

const FACE_NAMES = [
  "DESCENT",
  "REBELLION",
  "MOO WALK",
  "BAD ART",
  "NO RULES",
  "SUPER"
];

const SWAP_RADIUS = 3;

const N = IMAGE_SRCS.length;
const STOPS = buildStops(N);

const stopIndex = (s) => Math.min(N - 1, Math.floor(s * (N - 1)));

function faceAtStop(i) {
  if (i < 6) return i;
  return 1 + ((i - 2) % 4);
}

function buildStops(n) {
  const base = [
    { rx: 90, ry: 0 },
    { rx: 0, ry: 0 },
    { rx: 0, ry: -90 },
    { rx: 0, ry: -180 },
    { rx: 0, ry: -270 },
    { rx: -90, ry: -360 }
  ];
  const out = base.slice(0, Math.min(n, 6));
  for (let i = 6; i < n; i++) {
    out.push({ rx: 0, ry: -360 - (i - 6) * 90 });
  }
  return out;
}

const dom = {
  cube: document.getElementById("cube"),
  faces: [...document.querySelectorAll(".face")],
  scrollEl: document.getElementById("scroll_container"),
  strip: document.getElementById("scene_strip"),
  hudPct: document.getElementById("hud_pct"),
  progFill: document.getElementById("prog_fill"),
  sceneName: document.getElementById("scene_name"),
  captionNum: document.getElementById("face_caption_num"),
  captionName: document.getElementById("face_caption_name"),
  themeToggle: document.getElementById("theme_toggle")
};

for (let i = dom.scrollEl.querySelectorAll("section").length; i < N; i++) {
  const sec = document.createElement("section");
  sec.id = `s${i}`;
  dom.scrollEl.appendChild(sec);
}

dom.strip.innerHTML = "";
for (let i = 0; i < N; i++) {
  const a = document.createElement("a");
  a.href = `#s${i}`;
  a.className = "scene-dot" + (i === 0 ? " active" : "");
  dom.strip.appendChild(a);
}

const sceneDots = [...document.querySelectorAll(".scene-dot")];
const sections = [...document.querySelectorAll("#scroll_container section")];

const faceImgIdx = new Array(6).fill(-1);
let currentStop = -1;

const imagePromises = new Map();

const isDark = () =>
  document.documentElement.getAttribute("data-theme") === "dark";

const getDarkSrc = (src) => src.replace(/\.webp$/, "-dark.webp");

const getActiveSrc = (imgIdx) => {
  const src = IMAGE_SRCS[imgIdx];
  return isDark() ? getDarkSrc(src) : src;
};

const preloadImage = (src) => {
  if (imagePromises.has(src)) return imagePromises.get(src);
  const p = (async () => {
    const img = new Image();
    img.src = src;
    await img.decode().catch(() => {});
    return img;
  })();
  imagePromises.set(src, p);
  return p;
};

IMAGE_SRCS.forEach((src) => {
  preloadImage(src);
  preloadImage(getDarkSrc(src));
});

async function setFaceImage(faceIdx, imgIdx, force = false) {
  if (!force && faceIdx === faceAtStop(currentStop)) return;
  if (!force && faceImgIdx[faceIdx] === imgIdx) return;
  faceImgIdx[faceIdx] = imgIdx;

  const src = getActiveSrc(imgIdx);
  const face = dom.faces[faceIdx];

  await preloadImage(src);

  if (faceImgIdx[faceIdx] !== imgIdx) return;

  let img = face.querySelector("img");
  if (!img) {
    img = new Image();
    face.appendChild(img);
  }
  img.alt = FACE_NAMES[imgIdx] ?? "";
  img.src = src;
  img.style.objectFit = (IMAGE_ASPECTS[imgIdx] ?? 1) !== 1 ? "contain" : "";
}

const refreshFaceImages = () => {
  const snapshot = [...faceImgIdx];
  faceImgIdx.fill(-1);
  snapshot.forEach((imgIdx, faceIdx) => {
    if (imgIdx !== -1) setFaceImage(faceIdx, imgIdx, true);
  });
};

for (let i = 0; i < Math.min(N, 6); i++) {
  if (IMAGE_SRCS[i]) setFaceImage(i, i, true);
}

function checkImageSwaps(smooth) {
  const base = stopIndex(smooth);
  for (let offset = -SWAP_RADIUS; offset <= SWAP_RADIUS; offset++) {
    if (offset === 0) continue;
    const si = base + offset;
    if (si < 0 || si >= N) continue;
    setFaceImage(faceAtStop(si), si);
  }
}

let lastFaceIdx = -1;

const updateHUD = (s) => {
  const p = Math.round(s * 100);
  const si = sectionIndexFromScroll(scrollY);
  currentStop = si;
  dom.hudPct.textContent = String(p).padStart(3, "0") + "%";
  dom.progFill.style.width = `${p}%`;
  if (si !== lastFaceIdx) {
    lastFaceIdx = si;
    const section = document.getElementById(`s${si}`);
    const tagEl = section?.querySelector('.tag');
    const displayName = tagEl ? tagEl.textContent?.toUpperCase() || '' : (FACE_NAMES[si] ?? "");
    dom.sceneName.textContent = displayName;
    dom.captionNum.textContent = String(si + 1).padStart(2, "0");
    dom.captionName.textContent = displayName;
    sceneDots.forEach((d, i) => d.classList.toggle("active", i === si));
  }
};

const easeIO = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const setCubeTransform = (s) => {
  if (N < 2 || STOPS.length < 2) return;
  const t = s * (N - 1);
  const i = Math.min(Math.floor(t), N - 2);
  const f = easeIO(t - i);
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const rx = a.rx + (b.rx - a.rx) * f;
  const ry = a.ry + (b.ry - a.ry) * f;
  dom.cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
};

let sectionTops = [];

const buildSectionTops = () => {
  sectionTops = sections.map(
    (s) => s.getBoundingClientRect().top + window.scrollY
  );
};

const sectionIndexFromScroll = (y) => {
  const mid = y + innerHeight * 0.5;
  let idx = 0;
  for (let i = 0; i < sectionTops.length; i++) {
    if (mid >= sectionTops[i]) idx = i;
  }
  return Math.min(idx, N - 1);
};

const mq = window.matchMedia("(prefers-color-scheme: dark)");
const getSystemTheme = () => (mq.matches ? "dark" : "light");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  refreshFaceImages();
};

const updateComboSelector = () => {
  const selector = document.getElementById('combo-selector');
  if (!selector) return;
  selector.innerHTML = '<option value="">选择美食组合...</option>';
  COMBOS.forEach(combo => {
    const option = document.createElement('option');
    option.value = combo.id;
    option.textContent = combo.name;
    if (combo.id === CURRENT_COMBO_ID) {
      option.selected = true;
    }
    selector.appendChild(option);
  });
};

const showCreateComboForm = () => {
  const overlay = document.createElement('div');
  overlay.className = 'combo-editor-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(20, 16, 13, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const form = document.createElement('div');
  form.className = 'combo-editor';
  form.style.cssText = `
    background: var(--card-bg);
    border: var(--hairline) solid var(--card-border);
    border-radius: 8px;
    padding: 2rem;
    width: 90%;
    max-width: 360px;
    color: var(--fg);
    font-family: var(--font-mono);
    backdrop-filter: blur(12px);
  `;

  form.innerHTML = `
    <h3 style="margin: 0 0 1.5rem 0; font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.08em; color: var(--muted);">NEW COMBO</h3>
    <div style="margin-bottom: 1rem;">
      <label style="display: block; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem;">Restaurant</label>
      <input type="text" id="combo-name" placeholder="Enter restaurant name" style="
        width: 100%;
        padding: 0.6rem 0.75rem;
        background: rgba(0, 0, 0, 0.4);
        border: var(--hairline) solid var(--card-border);
        border-radius: 4px;
        color: var(--fg);
        font-family: var(--font-mono);
        font-size: 0.85rem;
        box-sizing: border-box;
        transition: border-color 0.3s;
      " />
    </div>
    <div style="margin-bottom: 1rem;">
      <label style="display: block; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem;">Glutton</label>
      <div style="display: flex; gap: 0.75rem;">
        ${COMBO_FOODIES.map(f => `
          <label style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.6rem; background: rgba(0, 0, 0, 0.4); border: var(--hairline) solid var(--card-border); border-radius: 4px; cursor: pointer; transition: border-color 0.3s, background 0.3s;">
            <input type="radio" name="combo-foodie" value="${f}" style="display: none;" />
            <span style="font-size: 0.8rem; color: var(--muted);">${f}</span>
          </label>
        `).join('')}
      </div>
    </div>
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem;">Rating</label>
      <input type="text" id="combo-rating" placeholder="★★★★★" style="
        width: 100%;
        padding: 0.6rem 0.75rem;
        background: rgba(0, 0, 0, 0.4);
        border: var(--hairline) solid var(--card-border);
        border-radius: 4px;
        color: var(--fg);
        font-family: var(--font-mono);
        font-size: 0.85rem;
        box-sizing: border-box;
        transition: border-color 0.3s;
      " />
    </div>
    <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
      <button id="combo-cancel" style="
        padding: 0.6rem 1.25rem;
        background: transparent;
        border: var(--hairline) solid var(--card-border);
        border-radius: 4px;
        color: var(--muted);
        font-family: var(--font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition: border-color 0.3s, color 0.3s;
      ">Cancel</button>
      <button id="combo-save" style="
        padding: 0.6rem 1.25rem;
        background: var(--accent);
        border: none;
        border-radius: 4px;
        color: #000;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition: opacity 0.3s;
      ">Create</button>
    </div>
  `;

  overlay.appendChild(form);
  document.body.appendChild(overlay);

  const closeForm = () => {
    document.body.removeChild(overlay);
  };

  form.querySelector('#combo-cancel').addEventListener('click', closeForm);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeForm();
  });

  form.querySelector('#combo-save').addEventListener('click', () => {
    const name = form.querySelector('#combo-name').value.trim();
    const foodieRadio = form.querySelector('input[name="combo-foodie"]:checked');
    const foodie = foodieRadio ? foodieRadio.value : '';
    const rating = form.querySelector('#combo-rating').value.trim();

    if (!name) {
      alert('请输入饭店名称');
      return;
    }
    if (!foodie) {
      alert('请选择贪吃鬼');
      return;
    }

    const newCombo = createCombo(name, foodie, rating);
    CURRENT_COMBO_ID = newCombo.id;
    saveCurrentCombo();
    updateComboSelector();
    closeForm();
  });
};

const initComboUI = () => {
  updateComboSelector();

  const selector = document.getElementById('combo-selector');
  const createBtn = document.getElementById('create-combo-btn');

  if (selector) {
    selector.addEventListener('change', (e) => {
      const comboId = e.target.value;
      if (comboId) {
        switchCombo(comboId);
      } else {
        CURRENT_COMBO_ID = null;
        saveCurrentCombo();
        refreshFaceImages();
        restoreOverlays();
        restoreTexts();
      }
    });
  }

  if (createBtn) {
    createBtn.addEventListener('click', showCreateComboForm);
  }
};

const initComboData = () => {
  if (CURRENT_COMBO_ID) {
    const combo = getCurrentCombo();
    if (combo) {
      for (let i = 0; i < 6; i++) {
        CUSTOM_IMAGES[i] = combo.images[i] || null;
        CUSTOM_TEXTS[i] = combo.texts[i] || null;
      }
    }
  }
};

applyTheme(getSystemTheme());
initComboData();
restoreOverlays();
restoreTexts();
initComboUI();
mq.addEventListener("change", (e) => applyTheme(e.matches ? "dark" : "light"));

dom.themeToggle.addEventListener("click", () => {
  const cur =
    document.documentElement.getAttribute("data-theme") || getSystemTheme();
  applyTheme(cur === "dark" ? "light" : "dark");
});

const mqSmall = window.matchMedia("(max-width: 56.25em)");

let maxScroll = 1;
let lastScrollHeight = 0;
let lastInnerHeight = 0;

const resize = () => {
  const h = document.documentElement.scrollHeight;
  const vh = innerHeight;
  if (h === lastScrollHeight && vh === lastInnerHeight) return;
  lastScrollHeight = h;
  lastInnerHeight = vh;
  maxScroll = Math.max(1, h - vh);
  buildSectionTops();
};

resize();

let tgt = 0;
let smooth = 0;
let velocity = 0;

const ease = 0.1;
const dynamicFriction = (v) => (Math.abs(v) > 200 ? 0.8 : 0.9);

window.addEventListener("resize", () => {
  resize();
  tgt = maxScroll > 0 ? scrollY / maxScroll : 0;
  smooth = tgt;
});

let resizePending = false;
const ro = new ResizeObserver(() => {
  if (resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    resize();
    tgt = maxScroll > 0 ? scrollY / maxScroll : 0;
    smooth = tgt;
    resizePending = false;
  });
});
ro.observe(document.documentElement);

window.addEventListener(
  "scroll",
  () => {
    tgt = maxScroll > 0 ? scrollY / maxScroll : 0;
    tgt = Math.max(0, Math.min(1, tgt));
  },
  { passive: true }
);

window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const linePx = 16;
    const pagePx = innerHeight * 0.9;
    const delta =
      e.deltaMode === 1
        ? e.deltaY * linePx
        : e.deltaMode === 2
        ? e.deltaY * pagePx
        : e.deltaY;
    if (Math.abs(delta) < 5) return;
    stopAnchorAnim();
    velocity += delta;
    velocity = Math.max(-600, Math.min(600, velocity));
  },
  { passive: false }
);

const revealEls = [
  ...document.querySelectorAll(
    ".tag, h1, h2, .body-text, .stat-row, .cta, .cta-back, .h-line"
  )
];

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.1 }
);
revealEls.forEach((el) => io.observe(el));

let lastNow = performance.now();

const frame = (now) => {
  requestAnimationFrame(frame);

  if (document.hidden) {
    lastNow = now;
    return;
  }

  const dt = Math.min((now - lastNow) / 1000, 0.05);
  lastNow = now;

  velocity *= Math.pow(dynamicFriction(velocity), dt * 60);
  if (Math.abs(velocity) < 0.01) velocity = 0;

  if (Math.abs(velocity) > 0.2) {
    const next = Math.max(0, Math.min(scrollY + velocity * ease, maxScroll));
    window.scrollTo(0, next);
    tgt = next / maxScroll;
  }

  smooth += (tgt - smooth) * (1 - Math.exp(-dt * 8));
  smooth = Math.max(0, Math.min(1, smooth));

  updateHUD(smooth);
  checkImageSwaps(smooth);
  setCubeTransform(smooth);
};

requestAnimationFrame(frame);

let anchorAnim = null;
let isAnchorScrolling = false;

const stopAnchorAnim = () => {
  if (anchorAnim) {
    cancelAnimationFrame(anchorAnim);
    anchorAnim = null;
  }
  isAnchorScrolling = false;
};

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const smoothScrollToY = (targetY, duration = 900) => {
  stopAnchorAnim();
  velocity = 0;
  isAnchorScrolling = true;
  const startY = window.scrollY;
  const diff = targetY - startY;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const y = startY + diff * easeInOutCubic(p);
    window.scrollTo(0, y);
    tgt = y / maxScroll;
    smooth = tgt;
    if (p < 1) {
      anchorAnim = requestAnimationFrame(tick);
    } else {
      anchorAnim = null;
      isAnchorScrolling = false;
    }
  };
  anchorAnim = requestAnimationFrame(tick);
};

window.addEventListener("touchstart", stopAnchorAnim, { passive: true });
window.addEventListener("mousedown", stopAnchorAnim, { passive: true });
window.addEventListener("keydown", stopAnchorAnim);

document.addEventListener('click', (e) => {
  const uploadBtn = e.target.closest('.upload-btn');
  if (uploadBtn) {
    const faceIndex = parseInt(uploadBtn.dataset.face, 10);
    const fileInput = document.querySelector(`.upload-input[data-face="${faceIndex}"]`);
    if (fileInput) {
      fileInput.click();
    }
  }

  const editBtn = e.target.closest('.edit-text-btn');
  if (editBtn) {
    const faceIndex = parseInt(editBtn.dataset.face, 10);
    showTextEditor(faceIndex);
  }
});

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('upload-input')) {
    const fileInput = e.target;
    const faceIndex = parseInt(fileInput.dataset.face, 10);
    const file = fileInput.files[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        saveCustomImage(faceIndex, dataUrl, (success, url) => {
          if (success && url) {
            const face = dom.faces[faceIndex];
            
            let overlay = face.querySelector('.custom-overlay');
            if (!overlay) {
              overlay = document.createElement('div');
              overlay.className = 'custom-overlay';
              face.appendChild(overlay);
            }
            overlay.style.backgroundImage = `url(${url})`;
            
            showUploadFeedback(faceIndex, true);
          } else {
            showUploadFeedback(faceIndex, false);
          }
        });
      };
      reader.readAsDataURL(file);
    }
    
    fileInput.value = '';
  }
});

document.addEventListener('click', (e) => {
  const resetBtn = e.target.closest('.reset-btn');
  if (resetBtn) {
    if (confirm('确定要重置所有自定义图片吗？这将恢复默认图片。')) {
      if (CURRENT_COMBO_ID) {
        const combo = getCurrentCombo();
        if (combo) {
          combo.images = [null, null, null, null, null, null];
          combo.texts = [null, null, null, null, null, null];
          saveCombos();
        }
      } else {
        localStorage.removeItem(CUSTOM_IMAGES_KEY);
        localStorage.removeItem(CUSTOM_TEXTS_KEY);
      }
      location.reload();
    }
  }
});

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#s"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const isHero = a.getAttribute("href") === "#s0";
  const idx = sections.indexOf(target);
  const baseY =
    idx >= 0
      ? sectionTops[idx]
      : target.getBoundingClientRect().top + window.scrollY;
  const extraOffset =
    mqSmall.matches && !isHero
      ? Math.max(0, target.offsetHeight - innerHeight)
      : 0;
  smoothScrollToY(Math.max(0, baseY + extraOffset));
});