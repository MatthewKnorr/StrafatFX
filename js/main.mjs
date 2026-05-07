import { build, parts } from "./gradientEngine.mjs";
import { renderFormattedOutput, renderPreview } from "./render.mjs";
import { renderSaved } from "./saved.mjs";
import { getList, saveList } from "./storage.mjs";
import { state } from "./state.mjs";
import { applyStyles } from "./formatter.mjs";
import { initGuide } from "./guide.mjs";
import { initLogoAudio } from "./logoAudio.mjs";
import { initFloating } from "./floating.mjs";
import { hexToRgb, normalizeHex } from "./gradient.mjs";

window.addEventListener("DOMContentLoaded", () => {
  const el = id => document.getElementById(id);

  const input = el("textInput");
  const randomQuipsBody = el("randomQuipsBody");
  const randomQuipsList = el("randomQuipsList");
  const randomQuipCategories = el("randomQuipCategories");
  const toggleQuipsBtn = el("toggleQuipsBtn");
  const refreshQuipsBtn = el("refreshQuipsBtn");
  const output = el("output");
  const preview = el("preview");
  const outputDisplay = el("outputDisplay");

  const gradientBar = el("gradientBar");
  const gradientHandles = el("gradientHandles");
  const gradientToolbar = el("gradientToolbar");
  const recentGradients = el("recentGradients");
  const colorCountButtons = [...document.querySelectorAll(".color-count-btn")];
  const advancedTabs = [...document.querySelectorAll(".advanced-tab")];
  const advancedTabPanels = [...document.querySelectorAll(".advanced-tab-panel")];
  const advancedToggle = el("advancedToggle");
  const advancedContent = el("advancedContent");
  const advancedCurrent = el("advancedCurrent");
  const temperatureSlider = el("temperatureSlider");
  const temperatureValue = el("temperatureValue");
  const themeModeButtons = [...document.querySelectorAll(".theme-mode")];
  const intensityToggle = el("intensityToggle");
  const intensityContent = el("intensityContent");
  const intensityCurrent = el("intensityCurrent");
  const presetCategories = el("presetCategories");
  const presetThemes = el("presetThemes");
  const presetDetail = el("presetDetail");
  const presetDetailName = el("presetDetailName");
  const presetDetailPreview = el("presetDetailPreview");
  const presetDetailColors = el("presetDetailColors");
  const presetFavoriteBtn = el("presetFavoriteBtn");
  const presetApplyBtn = el("presetApplyBtn");
  const presetPopup = el("presetPopup");
  const presetCloseBtn = el("presetCloseBtn");

  const bold = el("bold");
  const italic = el("italic");
  const underline = el("underline");
  const strike = el("strike");
  const superscript = el("superscript");
  const subscript = el("subscript");
  const effectsToggle = el("effectsToggle");
  const effectsResetBtn = el("effectsResetBtn");
  const gradientResetBtn = el("gradientResetBtn");
  const effectsContent = el("effectsContent");
  const effectsCurrent = el("effectsCurrent");
  const caseEffect = el("caseEffect");
  const cspace = el("cspace");
  const mspace = el("mspace");
  const align = el("align");
  const pos = el("pos");
  const indent = el("indent");
  const lineIndent = el("lineIndent");
  const margin = el("margin");
  const widthEffect = el("widthEffect");
  const lineHeight = el("lineHeight");
  const rotate = el("rotate");
  const voffset = el("voffset");
  const mark = el("mark");
  const markEnabled = el("markEnabled");
  const highlightCustomBtn = el("highlightCustomBtn");
  const space = el("space");
  const highlightSwatches = [...document.querySelectorAll(".highlight-swatch")];
  const optionButtons = [...document.querySelectorAll(".option-effect")];

  const depth = el("depth");
  const stepValue = el("stepValue");
  const sliderGroup = el("sliderGroup");

  const charWarning = el("charWarning");

  const saveGradientBtn = el("saveGradientBtn");
  const saveQuipBtn = el("saveQuipBtn");
  const removeModeBtn = el("removeModeBtn");

  const gradientList = null;
  const quipList = el("quipList");

  const copyBtn = el("copyBtn");
  const autoCopyBtn = el("autoCopyBtn");

  const randomBtn = document.createElement("button");
  const swapBtn = document.createElement("button");
  const presetBtn = document.createElement("button");
  let pickrs = [];
  let desiredColorCount = 2;
  let paletteColors = [];
  let autoIntensityManaged = true;
  let autoCopyEnabled = localStorage.getItem("gd-auto-copy") === "1";
  let lastAutoCopied = "";
  let presetData = {};
  let activePresetCategory = "";
  let activePresetKey = "";
  let colorTemperature = +(localStorage.getItem("gd-color-temperature") || 0);
  let activeThemeMode = localStorage.getItem("gd-theme-mode") || "dark";
  const favoritePresetCategory = "Favorites";
  const userPresetCategory = "User Created";
  const gamerQuipCategories = {
    gg: ["gg", "ggs", "good round", "well played", "wp", "solid game", "run it back", "one more", "last game fr", "we're back", "comeback time"],
    ez: ["ez", "gg ez", "get stomped", "sit", "skill issue", "outplayed", "deleted", "cooked", "fried", "smoked", "rolled", "washed", "dogwater", "free", "too free", "hold that", "stay mad", "cope", "sent to lobby", "back to lobby", "lobby speedrun", "actual npc", "bot behavior"],
    niceShot: ["nice shot", "nice try", "nt", "that was nasty", "clean", "dirty", "filthy", "sheesh", "insane", "one tap", "beamed", "lasered", "melted", "cracked", "clipped", "squad wipe", "team wipe", "ace", "clutch", "ice in veins", "calculated", "big brain", "clip that"],
    comms: ["behind you", "on me", "push push", "full send", "send it", "rotate", "reset", "play slow", "flank", "third party", "RUN", "help", "he's one", "literally one", "I lied", "reloading", "no ammo", "peek me", "don't peek", "focus up", "lock in"],
    reactions: ["sad", "woah", "lmao", "no way", "WHAT", "tf", "bruh", "nahhh", "yikes", "rip", "unlucky", "tragic", "not like this", "ain't no way", "no shot", "goofy", "bro thought", "almost", "I'm dead", "I'm cooked", "we're cooked", "chalked", "hit reg?", "how did that miss", "how did that hit"],
    memes: ["I'm him", "you're not him", "built different", "throwing", "hard throwing", "sold", "my bad", "mb", "carry me", "team diff", "aim diff", "brain diff", "ping diff", "rank diff", "massive W", "big L", "caught lacking", "bro got erased", "jump scare", "tryhard", "sweat lobby", "bot lobby", "final boss", "side quest", "main character", "plot armor", "robbed", "scammed", "let me cook", "stop cooking", "we ball", "we do not ball", "vibes gone", "vibes restored", "absolute cinema", "peak gaming", "delete the clip", "never happened", "zero IQ", "aimbot", "reported", "walls?", "sus", "nerf him", "buff me", "OP", "broken", "balanced btw", "go next", "next", "it's over"]
  };
  const gamerQuipCategoryLabels = {
    all: "All",
    gg: "GG",
    ez: "EZ",
    niceShot: "Nice Shot",
    comms: "Comms",
    reactions: "Reacts",
    memes: "Memes"
  };
  const requiredQuipCategories = ["gg", "ez", "niceShot"];
  let activeQuipCategory = "all";

  function stripClosingTags(text) {
    return text.replace(/<\/(b|i|u|s|sup|sub|allcaps|uppercase|smallcaps|lowercase|cspace|mspace|align|pos|indent|line-indent|margin|width|line-height|rotate|voffset|mark|alpha|size|font-weight)>/g, "");
  }

  function showToast(text) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1200);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getQuipPool(category = activeQuipCategory) {
    if (category === "all") {
      return Object.values(gamerQuipCategories).flat();
    }

    return gamerQuipCategories[category] || [];
  }

  function pullRandomFromPool(pool) {
    if (!pool.length) return "";
    const index = randomInt(0, pool.length - 1);
    return pool.splice(index, 1)[0];
  }

  function pickRandomQuips(count = 10) {
    const pool = [...getQuipPool()];
    const picks = [];

    if (activeQuipCategory === "all") {
      requiredQuipCategories.forEach(category => {
        const pick = pullRandomFromPool([...(gamerQuipCategories[category] || [])]);
        if (pick && !picks.includes(pick)) picks.push(pick);
      });
    }

    while (pool.length && picks.length < count) {
      const pick = pullRandomFromPool(pool);
      if (!picks.includes(pick)) picks.push(pick);
    }

    return picks;
  }

  function renderRandomQuipCategories() {
    if (!randomQuipCategories) return;

    randomQuipCategories.innerHTML = "";

    Object.entries(gamerQuipCategoryLabels).forEach(([key, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "random-quip-category";
      button.classList.toggle("active", key === activeQuipCategory);
      button.textContent = label;
      button.dataset.category = key;
      randomQuipCategories.appendChild(button);
    });
  }

  function renderRandomQuips() {
    if (!randomQuipsList) return;

    randomQuipsList.innerHTML = "";

    pickRandomQuips().forEach(quip => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "random-quip";
      button.textContent = quip;
      button.dataset.quip = quip;
      randomQuipsList.appendChild(button);
    });
  }

  function scheduleRandomQuipRefresh() {
    window.clearTimeout(scheduleRandomQuipRefresh.timer);

    scheduleRandomQuipRefresh.timer = window.setTimeout(() => {
      renderRandomQuips();
      scheduleRandomQuipRefresh();
    }, randomInt(5000, 10000));
  }

  function updateRemoveModeUI() {
    const active = state.removeMode;
    document.body.classList.toggle("remove-mode", active);
    removeModeBtn.textContent = active ? "Done Removing" : "Remove";
    removeModeBtn.classList.toggle("active", active);
  }

  function copy(text, label = "Copied", { silent = false } = {}) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (!silent) showToast(label);
    }).catch(() => {
      if (!silent) showToast("Copy failed");
    });
  }

  function renderAutoCopyButton() {
    if (!autoCopyBtn) return;
    autoCopyBtn.textContent = autoCopyEnabled ? "Auto Copy On" : "Auto Copy Off";
    autoCopyBtn.classList.toggle("active", autoCopyEnabled);
  }

  function trackAutoCopy(action, text = "") {
    if (!window.gtag) return;

    window.gtag("event", action, {
      event_category: "engagement",
      event_label: autoCopyEnabled ? "enabled" : "disabled",
      value: text.length
    });
  }

  function formatPresetCategory(label) {
    if (label === favoritePresetCategory) return favoritePresetCategory;
    return label.replace(/_/g, " ");
  }

  function getFavoritePresets() {
    return getList("gd-preset-favorites")
      .filter(entry => entry && entry.name && Array.isArray(entry.colors) && entry.colors.length);
  }

  function getUserCreatedPresets() {
    return getList("gd-gradients")
      .map((entry, index) => {
        const colors = Array.isArray(entry?.colors) ? entry.colors : Array.isArray(entry) ? entry : [];
        if (!colors.length) return null;
        return {
          name: entry?.name || `Saved ${index + 1}`,
          colors: colors.map(normalizeHex),
          key: gradientSignature(colors)
        };
      })
      .filter(Boolean);
  }

  function saveFavoritePresets(list) {
    saveList("gd-preset-favorites", list);
  }

  function makePresetKey(entry) {
    return gradientSignature(entry.colors);
  }

  function getPresetCatalog() {
    const favorites = getFavoritePresets();
    const userCreated = getUserCreatedPresets();
    const builtInCatalog = Object.fromEntries(
      Object.entries(presetData).map(([category, entries]) => [
        category,
        entries.map(entry => ({
          name: entry.name,
          colors: entry.colors.map(normalizeHex),
          key: gradientSignature(entry.colors)
        }))
      ])
    );

    const catalog = {
      [userPresetCategory]: userCreated,
      ...builtInCatalog
    };

    if (!favorites.length) return catalog;

    return {
      [userPresetCategory]: userCreated,
      [favoritePresetCategory]: favorites.map(entry => ({
        name: entry.name,
        colors: entry.colors.map(normalizeHex),
        key: gradientSignature(entry.colors)
      })),
      ...builtInCatalog
    };
  }

  function getActivePresetEntry() {
    const list = getPresetCatalog()[activePresetCategory] || [];
    return list.find(entry => makePresetKey(entry) === activePresetKey) || null;
  }

  function getPresetCategories() {
    return Object.keys(getPresetCatalog());
  }

  function renderPresetCategories() {
    presetCategories.innerHTML = "";

    getPresetCategories().forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-category";
      button.dataset.category = category;
      button.textContent = formatPresetCategory(category);
      button.classList.toggle("active", category === activePresetCategory);
      presetCategories.appendChild(button);
    });
  }

  function renderPresetThemes() {
    presetThemes.innerHTML = "";

    const activeThemes = getPresetCatalog()[activePresetCategory] || [];

    if (!activeThemes.length) {
      presetThemes.innerHTML = `<div class="preset-empty">No presets in this tab yet.</div>`;
      return;
    }

    activeThemes.forEach(entry => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "preset-theme";
      button.dataset.signature = makePresetKey(entry);
      button.style.setProperty("--preset-theme-bg", entry.colors.length === 1
        ? entry.colors[0]
        : `linear-gradient(135deg, ${entry.colors.join(", ")})`);
      button.classList.toggle("active", makePresetKey(entry) === activePresetKey);
      const swatches = entry.colors.map(color => `
        <span class="preset-theme-swatch" style="background:${color}" title="${color}"></span>
      `).join("");
      button.innerHTML = `
        <span class="preset-theme-content">
          <span class="preset-theme-meta">
            <span class="preset-theme-name">${entry.name}</span>
            <span class="preset-theme-swatches">${swatches}</span>
          </span>
        </span>
      `;

      if (activePresetCategory === userPresetCategory && state.removeMode) {
        const removeButton = document.createElement("span");
        removeButton.className = "preset-theme-remove";
        removeButton.innerHTML = "&times;";
        button.appendChild(removeButton);
      }

      presetThemes.appendChild(button);
    });
  }

  function renderPresetDetail() {
    const preset = getActivePresetEntry();
    if (!preset) {
      presetFavoriteBtn.disabled = true;
      presetApplyBtn.disabled = true;
      presetDetailName.textContent = "No preset selected";
      presetDetailPreview.style.background = "linear-gradient(135deg, #2b2b2b, #121212)";
      presetDetail.style.background = "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)), linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(10, 10, 10, 0.84))";
      presetDetailColors.innerHTML = "";
      presetFavoriteBtn.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.18)";
      presetApplyBtn.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.22)";
      return;
    }

    presetFavoriteBtn.disabled = false;
    presetApplyBtn.disabled = false;

    presetDetailPreview.classList.add("is-updating");
    presetDetailName.textContent = preset.name;
    presetDetail.style.background = "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)), linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(10, 10, 10, 0.84))";
    presetDetailPreview.style.background = `linear-gradient(90deg, ${preset.colors.join(", ")})`;
    presetApplyBtn.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)), linear-gradient(90deg, ${preset.colors.join(", ")})`;
    const shadowColor = preset.colors[Math.floor(preset.colors.length / 2)] || preset.colors[0] || "#ffffff";
    presetFavoriteBtn.style.boxShadow = `0 12px 24px rgba(0, 0, 0, 0.22), 0 0 22px ${shadowColor}33`;
    presetApplyBtn.style.boxShadow = `0 16px 28px rgba(0, 0, 0, 0.26), 0 0 28px ${shadowColor}4d`;
    presetDetailColors.innerHTML = "";

    window.clearTimeout(renderPresetDetail.previewTimer);
    renderPresetDetail.previewTimer = window.setTimeout(() => {
      presetDetailPreview.classList.remove("is-updating");
    }, 220);

    preset.colors.forEach(color => {
      const chip = document.createElement("span");
      chip.className = "preset-color-chip";
      chip.textContent = color;
      presetDetailColors.appendChild(chip);
    });

    const isFavorite = getFavoritePresets().some(entry => entry.name === preset.name && gradientSignature(entry.colors) === gradientSignature(preset.colors));
    presetFavoriteBtn.textContent = isFavorite ? "Remove Favorite" : "Save Favorite";
    presetFavoriteBtn.classList.toggle("active", isFavorite);
  }

  function ensureActivePresetSelection() {
    const catalog = getPresetCatalog();
    const categories = Object.keys(catalog);

    if (!categories.length) {
      activePresetCategory = "";
      activePresetKey = "";
      return;
    }

    if (!catalog[activePresetCategory]?.length) {
      activePresetCategory = categories.find(category => (catalog[category] || []).length) || categories[0];
    }

    const currentList = catalog[activePresetCategory] || [];
    const hasActivePreset = currentList.some(entry => makePresetKey(entry) === activePresetKey);

    if (!hasActivePreset) {
      activePresetKey = currentList[0] ? makePresetKey(currentList[0]) : "";
    }
  }

  function toggleFavoritePreset() {
    const preset = getActivePresetEntry();
    if (!preset) return;

    const favorites = getFavoritePresets();
    const existingIndex = favorites.findIndex(entry =>
      entry.name === preset.name && gradientSignature(entry.colors) === gradientSignature(preset.colors)
    );

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      saveFavoritePresets(favorites);
      ensureActivePresetSelection();

      renderPresetCategories();
      renderPresetThemes();
      renderPresetDetail();
      showToast("Favorite removed");
      return;
    }

    favorites.push({
      name: preset.name,
      colors: preset.colors.map(normalizeHex)
    });
    saveFavoritePresets(favorites);
    activePresetCategory = favoritePresetCategory;
    activePresetKey = makePresetKey(preset);
    ensureActivePresetSelection();
    renderPresetCategories();
    renderPresetThemes();
    renderPresetDetail();
    showToast("Favorite saved");
  }

  function visibleChars(text) {
    return [...text].filter(ch => ch !== " ");
  }

  function visibleCount(text = input.value) {
    return visibleChars(text).length;
  }

  function gradientSignature(colors) {
    return colors.map(normalizeHex).join("|");
  }

  function maxColorStops(text = input.value) {
    const visible = visibleCount(text);
    if (visible <= 1) return 1;
    return Math.max(2, Math.min(4, Math.ceil(visible / 2)));
  }

  function modeLabel(mode) {
    if (mode === 1) return "1";
    if (mode === 2) return "1/2";
    if (mode === 3) return "1/3";
    if (mode === 4) return "1/4";
    if (mode === 5) return "Per Letter";
    if (mode === 6) return "Custom";
    return "Per Letter";
  }

  function setMode(mode, { track = false } = {}) {
    state.mode = mode;

    document.querySelectorAll(".mode").forEach(button => {
      button.classList.toggle("active", +button.dataset.mode === mode);
    });

    const textLen = visibleCount() || 1;

    if (mode === 6) {
      sliderGroup.classList.remove("hidden");
      depth.max = textLen;
      if (+depth.value > textLen) depth.value = textLen;
      stepValue.textContent = depth.value;
    } else {
      sliderGroup.classList.add("hidden");

      let steps = textLen;

      if (mode === 1) steps = 1;
      if (mode === 2) steps = Math.ceil(textLen / 2);
      if (mode === 3) steps = Math.ceil(textLen / 3);
      if (mode === 4) steps = Math.ceil(textLen / 4);
      if (mode === 5) steps = textLen;

      depth.value = steps;
      depth.max = textLen;
      stepValue.textContent = steps;
    }

    intensityCurrent.textContent = modeLabel(mode);
    updateGradientResetState();

    if (track && window.gtag) {
      window.gtag('event', 'mode_change', {
        event_category: 'feature',
        event_label: `mode_${mode}`
      });
    }
  }

  function syncShortTextDefaults(text = input.value) {
    const visible = visibleCount(text);

    if (visible <= 2) {
      autoIntensityManaged = true;
      setMode(visible <= 1 ? 1 : 2);
      return;
    }

    if (autoIntensityManaged && (state.mode === 1 || state.mode === 2)) {
      setMode(5);
    }

    autoIntensityManaged = false;
  }

  function rgbToHsl({ r, g, b }) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const lightness = (max + min) / 2;
    const delta = max - min;

    if (delta === 0) {
      return { h: 0, s: 0, l: lightness };
    }

    const saturation = lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

    let hue = 0;

    if (max === rn) hue = (gn - bn) / delta + (gn < bn ? 6 : 0);
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;

    return { h: hue * 60, s: saturation, l: lightness };
  }

  function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  function pickHueForTemperature() {
    const bias = colorTemperature / 100;
    const mixedHue = Math.random() * 360;
    const warmHue = Math.random() > 0.5
      ? randomInt(0, 54)
      : randomInt(320, 359);
    const coolHue = randomInt(165, 275);
    const chance = Math.abs(bias);

    if (bias > 0 && Math.random() < chance) return warmHue;
    if (bias < 0 && Math.random() < chance) return coolHue;
    return mixedHue;
  }

  function randColor(minDistance = 120) {
    function get() {
      return hslToRgb(
        pickHueForTemperature(),
        0.58 + Math.random() * 0.36,
        0.42 + Math.random() * 0.24
      );
    }

    function dist(a, b) {
      return Math.sqrt(
        (a.r - b.r) ** 2 +
        (a.g - b.g) ** 2 +
        (a.b - b.b) ** 2
      );
    }

    let next = get();

    if (Array.isArray(minDistance)) {
      const existing = minDistance.map(hex => {
        const rgb = hexToRgb(hex);
        return { rgb, hsl: rgbToHsl(rgb) };
      });

      function isTooSimilar(candidate) {
        const candidateHsl = rgbToHsl(candidate);

        return existing.some(({ rgb, hsl }) => {
          const hueGap = Math.min(Math.abs(hsl.h - candidateHsl.h), 360 - Math.abs(hsl.h - candidateHsl.h));
          const lightGap = Math.abs(hsl.l - candidateHsl.l);
          const satGap = Math.abs(hsl.s - candidateHsl.s);
          const rgbGap = dist(rgb, candidate);

          return rgbGap < 125 || (hueGap < 28 && lightGap < 0.18) || (hueGap < 20 && satGap < 0.22);
        });
      }

      let attempts = 0;

      while (isTooSimilar(next) && attempts < 80) {
        next = get();
        attempts++;
      }
    }

    return normalizeHex(
      "#" +
      next.r.toString(16).padStart(2, "0") +
      next.g.toString(16).padStart(2, "0") +
      next.b.toString(16).padStart(2, "0")
    );
  }

  function randColors(count) {
    const colors = [];

    while (colors.length < count) {
      const next = randColor(colors);
      colors.push(next);
    }

    return colors;
  }

  function activeColorCount(text = input.value) {
    return Math.max(1, Math.min(4, desiredColorCount));
  }

  function getHandlePosition(index, count) {
    if (count <= 1) return 50;

    const inset = count === 2 ? 16 : 10;
    return inset + ((100 - inset * 2) * index) / (count - 1);
  }

  function getGradientPreview(colors = state.colors) {
    if (!colors.length) {
      return "linear-gradient(90deg, #00FF9C, #FF7A00)";
    }

    if (colors.length === 1) {
      return `linear-gradient(90deg, ${colors[0]}, ${colors[0]})`;
    }

    return `linear-gradient(90deg, ${colors.join(", ")})`;
  }

  function ensurePaletteSize(targetCount) {
    const next = [...paletteColors];

    while (next.length < targetCount) {
      next.push(randColor(next));
    }

    return next;
  }

  function syncColorsToText(text = input.value) {
    const desired = activeColorCount(text);

    updateColorCountButtons();

    paletteColors = ensurePaletteSize(desiredColorCount);

    const nextColors = paletteColors.slice(0, desired);

    if (state.colors.length !== nextColors.length || state.colors.some((color, index) => color !== nextColors[index])) {
      state.colors = nextColors;
      return true;
    }

    return false;
  }

  function updateGradientBar() {
    const g = getGradientPreview();
    gradientBar.style.background = g;
    document.documentElement.style.setProperty("--slider-gradient", g);
  }

  function getRecentGradients() {
    return getList("gd-recent-gradients")
      .filter(entry => Array.isArray(entry?.colors) && entry.colors.length)
      .map(entry => ({ colors: entry.colors.map(normalizeHex) }));
  }

  function renderRecentGradients() {
    if (!recentGradients) return;

    const recent = getRecentGradients();
    recentGradients.innerHTML = "";
    recentGradients.classList.toggle("hidden", recent.length === 0);

    recent.slice(0, 7).forEach((entry, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "recent-gradient-swatch";
      button.dataset.index = String(index);
      button.title = entry.colors.join(", ");
      button.style.background = getGradientPreview(entry.colors);
      recentGradients.appendChild(button);
    });
  }

  function rememberRecentGradient(colors) {
    const normalized = colors.map(normalizeHex);
    if (!normalized.length) return;

    const signature = gradientSignature(normalized);
    const next = [
      { colors: normalized },
      ...getRecentGradients().filter(entry => gradientSignature(entry.colors) !== signature)
    ].slice(0, 7);

    saveList("gd-recent-gradients", next);
    renderRecentGradients();
  }

  function temperatureLabel(value) {
    if (value <= -60) return "Cool";
    if (value < -18) return "Cool Mix";
    if (value >= 60) return "Warm";
    if (value > 18) return "Warm Mix";
    return "Mixed";
  }

  function renderTemperatureControl() {
    if (!temperatureSlider || !temperatureValue) return;
    temperatureSlider.value = String(colorTemperature);
    temperatureValue.textContent = temperatureLabel(colorTemperature);
    updateGradientResetState();
  }

  function updateGradientResetState() {
    if (!gradientResetBtn) return;
    gradientResetBtn.disabled = colorTemperature === 0 && state.mode === 5;
  }

  function setThemeMode(mode) {
    activeThemeMode = mode === "light" ? "light" : "dark";
    document.body.classList.toggle("theme-light", activeThemeMode === "light");
    document.body.classList.toggle("theme-dark", activeThemeMode === "dark");
    localStorage.setItem("gd-theme-mode", activeThemeMode);

    themeModeButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.themeMode === activeThemeMode);
    });
  }

  function updateColorCountButtons() {
    colorCountButtons.forEach(button => {
      const count = +button.dataset.colorCount;
      button.disabled = false;
      button.classList.remove("hidden-option");
      button.classList.toggle("active", count === desiredColorCount);
    });
  }

  function destroyPickrs() {
    pickrs.forEach(pickr => pickr.destroyAndRemove());
    pickrs = [];
  }

  function renderColorHandles() {
    destroyPickrs();
    gradientHandles.innerHTML = "";

    const count = state.colors.length;

    state.colors.forEach((color, index) => {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "gradient-handle";
      handle.style.left = `${getHandlePosition(index, count)}%`;

      if (count > 1 && index === 0) handle.classList.add("edge-left");
      if (count > 1 && index === count - 1) handle.classList.add("edge-right");

      handle.innerHTML = `
        <div class="handle-inner">
          <div class="handle-line"></div>
          <div class="handle-hex">${color}</div>
        </div>
      `;

      gradientHandles.appendChild(handle);

      const pickr = Pickr.create({
        el: handle,
        theme: "nano",
        useAsButton: true,
        default: color,
        components: { preview: true, hue: true, interaction: { input: true } }
      });

      pickr.on("change", picked => {
        const hex = normalizeHex(picked.toHEXA().toString());
        handle.querySelector(".handle-hex").textContent = hex;
        setColorAt(index, hex, { rerender: false });
      });

      handle.addEventListener("click", () => pickr.show());
      pickrs.push(pickr);
    });
  }

  function setColors(colors, { rerender = true, track = true } = {}) {
    state.colors = colors.map(normalizeHex);
    paletteColors = ensurePaletteSize(Math.max(desiredColorCount, state.colors.length));

    state.colors.forEach((color, index) => {
      paletteColors[index] = color;
    });

    updateGradientBar();

    if (rerender) {
      renderColorHandles();
    }

    update();

    if (window.guide?.updateGuideExample) {
      window.guide.updateGuideExample();
    }

    updateUIGradient();

    if (track && window.gtag) {
      window.gtag('event', 'color_change', {
        event_category: 'feature'
      });
    }

    if (track) {
      rememberRecentGradient(state.colors);
    }
  }

  function setColorAt(index, color, options = {}) {
    paletteColors = ensurePaletteSize(Math.max(desiredColorCount, state.colors.length));
    paletteColors[index] = color;
    setColors(paletteColors.slice(0, state.colors.length), options);
  }

  function applySavedGradient(colors) {
    desiredColorCount = colors.length;
    paletteColors = ensurePaletteSize(colors.length);
    colors.forEach((color, index) => {
      paletteColors[index] = normalizeHex(color);
    });

    setColors(paletteColors.slice(0, desiredColorCount));
    return { ok: true };
  }

  function applyPresetGradient() {
    const preset = getActivePresetEntry();
    if (!preset) return false;

    if (!input.value.trim()) {
      input.value = preset.name;
      update();
    }

    const result = applySavedGradient(preset.colors);

    if (result?.ok === false) {
      showToast(result.message);
      return false;
    }

    showToast(`${preset.name} applied`);
    return true;
  }

  async function loadPresetGradients() {
    try {
      const response = await fetch("./gradients.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load preset gradients");

      const data = await response.json();
      presetData = data || {};

      ensureActivePresetSelection();

      renderPresetCategories();
      renderPresetThemes();
      renderPresetDetail();
    } catch {
      presetData = {};
      ensureActivePresetSelection();
      renderPresetCategories();
      renderPresetThemes();
      presetDetailName.textContent = "Presets unavailable";
      presetDetail.style.background = "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)), linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(10, 10, 10, 0.84))";
      presetDetailPreview.style.background = "linear-gradient(90deg, #333, #111)";
      presetDetailColors.innerHTML = "";
      presetFavoriteBtn.disabled = true;
      presetApplyBtn.disabled = true;
    }
  }

  function fitPreview() {
    const el = preview;
    if (!el) return;

    const textLength = input.value.length;

    const maxChars = 500;
    const minSize = 18;
    const maxSize = 72;

    const ratio = Math.min(textLength / maxChars, 1);
    const eased = Math.pow(ratio, 0.5);

    let size = maxSize - (maxSize - minSize) * eased;

    el.style.fontSize = size + "px";

    while (el.scrollWidth > el.clientWidth && size > 12) {
      size -= 1;
      el.style.fontSize = size + "px";
    }
  }

  function effectInputs() {
    return [
      bold, italic, underline, strike, superscript, subscript, caseEffect, cspace, mspace, align,
      pos, indent, lineIndent, margin, widthEffect, lineHeight, rotate, voffset, mark,
      markEnabled, space
    ].filter(Boolean);
  }

  function getEffects() {
    return {
      bold: bold?.checked || false,
      italic: italic?.checked || false,
      underline: underline?.checked || false,
      strike: strike?.checked || false,
      superscript: superscript?.checked || false,
      subscript: subscript?.checked || false,
      caseEffect: caseEffect?.value || "",
      cspace: cspace?.value || "",
      mspace: mspace?.value || "",
      align: align?.value || "",
      pos: pos?.value || "",
      indent: indent?.value || "",
      lineIndent: lineIndent?.value || "",
      margin: margin?.value || "",
      width: widthEffect?.value || "",
      lineHeight: lineHeight?.value || "",
      rotate: rotate?.value || "",
      voffset: voffset?.value || "",
      mark: mark?.value || "#ffff00",
      markEnabled: markEnabled?.checked || false,
      space: space?.value || ""
    };
  }

  function hasActiveEffect() {
    return getActiveEffectLabels().length > 0;
  }

  function getActiveEffectLabels() {
    const effects = getEffects();
    const labels = [];

    if (effects.bold) labels.push("Bold");
    if (effects.italic) labels.push("Italic");
    if (effects.underline) labels.push("Underline");
    if (effects.strike) labels.push("Strike");
    if (effects.superscript) labels.push("Sup");
    if (effects.subscript) labels.push("Sub");
    if (effects.caseEffect) labels.push(effects.caseEffect.replace("-", " "));
    if (effects.cspace) labels.push("Letter Space");
    if (effects.mspace) labels.push("Fixed Width");
    if (effects.align) labels.push(`Align ${effects.align}`);
    if (effects.pos) labels.push("Position");
    if (effects.indent) labels.push("Indent");
    if (effects.lineIndent) labels.push("Line Indent");
    if (effects.margin) labels.push("Margin");
    if (effects.width) labels.push("Width");
    if (effects.lineHeight) labels.push("Line Height");
    if (effects.rotate) labels.push("Rotate");
    if (effects.voffset) labels.push("V Offset");
    if (effects.markEnabled) labels.push("Color Block");
    if (effects.space) labels.push("Space");

    return labels;
  }

  function updateEffectsSummary() {
    const labels = getActiveEffectLabels();
    effectsCurrent.textContent = labels.length ? labels.slice(0, 3).join(", ") + (labels.length > 3 ? ` +${labels.length - 3}` : "") : "Off";
    effectsCurrent.title = labels.length ? labels.join(", ") : "No rich text effects";
    effectsResetBtn.disabled = labels.length === 0;
  }

  function updateHighlightUI() {
    const color = mark?.value || "#ffff00";

    document.documentElement.style.setProperty("--highlight-current", color);

    highlightSwatches.forEach(button => {
      button.classList.toggle("active", button.dataset.color.toLowerCase() === color.toLowerCase());
    });
  }

  function updateOptionButtons() {
    optionButtons.forEach(button => {
      const target = el(button.dataset.optionTarget);
      if (!target) return;

      button.classList.toggle("active", target.value === button.dataset.optionValue);
    });
  }

  function resetEffects() {
    effectInputs().forEach(control => {
      if (control.type === "checkbox") {
        control.checked = false;
      } else if (control.type === "range") {
        control.value = control.defaultValue;
      } else if (control.tagName === "SELECT") {
        control.value = "";
      } else if (control.type === "color") {
        control.value = control.defaultValue || "#ffff00";
      } else {
        control.value = "";
      }
    });

    updateHighlightUI();
    updateOptionButtons();
  }

  function resetGradientControls() {
    colorTemperature = 0;
    localStorage.setItem("gd-color-temperature", "0");
    autoIntensityManaged = false;
    setMode(5);
    renderTemperatureControl();
  }

  randomBtn.innerHTML = `<i class="fa-solid fa-shuffle"></i>`;
  swapBtn.innerHTML = `<i class="fa-solid fa-right-left"></i>`;
  presetBtn.innerHTML = `<i class="fa-solid fa-swatchbook"></i>`;

  randomBtn.setAttribute("aria-label", "Random");
  swapBtn.setAttribute("aria-label", "Swap");
  presetBtn.setAttribute("aria-label", "Preset Palettes");

  randomBtn.className = "gradient-btn";
  swapBtn.className = "gradient-btn";
  presetBtn.className = "gradient-btn";

  randomBtn.onclick = () => {
    paletteColors = randColors(Math.max(desiredColorCount, 1));
    setColors(paletteColors.slice(0, activeColorCount()));

    if (window.gtag) {
      window.gtag('event', 'random_used', {
        event_category: 'feature'
      });
    }
  };

  swapBtn.onclick = () => {
    const activeCount = activeColorCount();
    paletteColors = ensurePaletteSize(Math.max(desiredColorCount, activeCount));

    const swapped = [...paletteColors.slice(0, activeCount)].reverse();
    swapped.forEach((color, index) => {
      paletteColors[index] = color;
    });

    setColors(paletteColors.slice(0, activeCount));
  };
  gradientToolbar.appendChild(randomBtn);
  gradientToolbar.appendChild(swapBtn);
  gradientToolbar.appendChild(presetBtn);

  colorCountButtons.forEach(button => {
    button.onclick = () => {
      if (button.disabled) return;
      desiredColorCount = +button.dataset.colorCount;
      updateColorCountButtons();
      paletteColors = ensurePaletteSize(desiredColorCount);
      setColors(paletteColors.slice(0, activeColorCount()));
    };
  });

  advancedToggle.onclick = () => {
    advancedContent.classList.toggle("hidden");
    const open = !advancedContent.classList.contains("hidden");
    advancedToggle.classList.toggle("open", open);
    advancedCurrent.textContent = open ? "Open" : "Closed";

    if (open) {
      intensityContent?.classList.remove("hidden");
      intensityToggle?.classList.add("open");
    }
  };

  advancedTabs.forEach(tab => {
    tab.onclick = () => {
      const activeTab = tab.dataset.advancedTab;

      advancedTabs.forEach(button => {
        const active = button.dataset.advancedTab === activeTab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });

      advancedTabPanels.forEach(panel => {
        panel.classList.toggle("hidden", panel.dataset.advancedPanel !== activeTab);
      });
    };
  });

  intensityToggle.onclick = () => {
    intensityContent.classList.toggle("hidden");
    intensityToggle.classList.toggle("open", !intensityContent.classList.contains("hidden"));
  };

  effectsToggle.onclick = () => {
    effectsContent.classList.remove("hidden");
    effectsToggle.classList.add("open");
  };

  effectsResetBtn.onclick = () => {
    resetEffects();
    update();
    showToast("Text effects reset");
  };

  gradientResetBtn.onclick = () => {
    resetGradientControls();
    update();
    showToast("Gradient controls reset");
  };

  highlightSwatches.forEach(button => {
    button.onclick = () => {
      mark.value = button.dataset.color;
      markEnabled.checked = true;
      updateHighlightUI();
      update();
    };
  });

  if (highlightCustomBtn && mark) {
    highlightCustomBtn.onclick = () => {
      mark.click();
    };
  }

  mark?.addEventListener("input", () => {
    if (markEnabled) markEnabled.checked = true;
    updateHighlightUI();
    update();
  });

  optionButtons.forEach(button => {
    button.onclick = () => {
      const target = el(button.dataset.optionTarget);
      if (!target) return;

      const nextValue = button.dataset.optionValue || "";
      const canToggleOff = button.dataset.optionTarget === "caseEffect";
      target.value = canToggleOff && target.value === nextValue ? "" : nextValue;
      updateOptionButtons();
      update();
    };
  });

  randomQuipsList?.addEventListener("click", event => {
    const button = event.target.closest(".random-quip");
    if (!button) return;

    input.value = button.dataset.quip || button.textContent;
    update();
    input.focus();
    showToast("Random text applied");
  });

  randomQuipCategories?.addEventListener("click", event => {
    const button = event.target.closest(".random-quip-category");
    if (!button) return;

    activeQuipCategory = button.dataset.category || "all";
    renderRandomQuipCategories();
    renderRandomQuips();
    scheduleRandomQuipRefresh();
  });

  toggleQuipsBtn?.addEventListener("click", () => {
    randomQuipsBody?.classList.toggle("hidden");
    const open = !randomQuipsBody?.classList.contains("hidden");
    toggleQuipsBtn.classList.toggle("active", open);
    toggleQuipsBtn.setAttribute("aria-expanded", String(open));
    toggleQuipsBtn.setAttribute("aria-label", open ? "Collapse verbal arsenal" : "Expand verbal arsenal");
    refreshQuipsBtn?.classList.toggle("hidden", !open);
  });

  refreshQuipsBtn?.addEventListener("click", () => {
    if (randomQuipsBody?.classList.contains("hidden")) {
      randomQuipsBody.classList.remove("hidden");
      toggleQuipsBtn.classList.add("active");
      toggleQuipsBtn.setAttribute("aria-expanded", "true");
      toggleQuipsBtn.setAttribute("aria-label", "Collapse verbal arsenal");
      refreshQuipsBtn.classList.remove("hidden");
    }

    renderRandomQuips();
    scheduleRandomQuipRefresh();
  });

  recentGradients?.addEventListener("click", event => {
    const button = event.target.closest(".recent-gradient-swatch");
    if (!button) return;

    const entry = getRecentGradients()[+button.dataset.index];
    if (!entry) return;

    applySavedGradient(entry.colors);
    showToast("Recent gradient restored");
  });

  temperatureSlider?.addEventListener("input", () => {
    colorTemperature = +temperatureSlider.value;
    localStorage.setItem("gd-color-temperature", String(colorTemperature));
    renderTemperatureControl();
  });

  themeModeButtons.forEach(button => {
    button.onclick = () => setThemeMode(button.dataset.themeMode);
  });

  copyBtn.onclick = () => {
    const text = stripClosingTags(output.value);
    copy(text);

    if (window.gtag) {
      window.gtag('event', 'copy_text', {
        event_category: 'engagement',
        value: text.length
      });

      window.gtag('event', 'conversion_copy', {
        event_category: 'conversion',
        value: text.length
      });
    }
  };

  autoCopyBtn.onclick = () => {
    autoCopyEnabled = !autoCopyEnabled;
    localStorage.setItem("gd-auto-copy", autoCopyEnabled ? "1" : "0");
    renderAutoCopyButton();
    trackAutoCopy("auto_copy_toggle");

    if (autoCopyEnabled) {
      const text = stripClosingTags(output.value);
      if (text) {
        copy(text, "Auto copy enabled", { silent: false });
        lastAutoCopied = text;
        trackAutoCopy("auto_copy_trigger", text);
        return;
      }
    }

    showToast(autoCopyEnabled ? "Auto copy enabled" : "Auto copy disabled");
  };

  saveGradientBtn.onclick = () => {
    const colors = paletteColors.slice(0, desiredColorCount).map(normalizeHex);
    if (!colors.length) return;

    let list = getList("gd-gradients");
    const signature = gradientSignature(colors);
    const exists = list.some(entry => {
      const entryColors = Array.isArray(entry?.colors) ? entry.colors : Array.isArray(entry) ? entry : [];
      return gradientSignature(entryColors) === signature;
    });

    if (exists) {
      showToast("Gradient already saved");
      return;
    }

    list.push({ colors });
    saveList("gd-gradients", list);
    activePresetCategory = userPresetCategory;
    activePresetKey = signature;
    ensureActivePresetSelection();
    renderPresetCategories();
    renderPresetThemes();
    renderPresetDetail();
    renderSaved(quipList, gradientList, savedOptions);
    update();
    showToast("Gradient saved");
  };

  document.querySelectorAll(".mode").forEach(button => {
    button.onclick = () => {
      autoIntensityManaged = false;
      setMode(+button.dataset.mode, { track: true });
      update();
    };
  });

  depth.oninput = () => {
    stepValue.textContent = depth.value;
    update();
  };

  let lastTracked = "";
  let trackTimeout;

  function update() {
    const text = input.value;
    syncShortTextDefaults(text);
    const syncedColors = syncColorsToText(text);

    clearTimeout(trackTimeout);

    trackTimeout = setTimeout(() => {
      if (window.gtag && text !== lastTracked) {
        window.gtag('event', 'generate_text', {
          event_category: 'usage',
          value: text.length
        });

        const len = text.length;
        let bucket = "short";
        if (len > 10) bucket = "medium";
        if (len > 20) bucket = "long";
        if (len > 32) bucket = "steam_limit";

        window.gtag('event', 'text_length', {
          event_category: 'usage',
          event_label: bucket
        });

        lastTracked = text;
      }
    }, 400);

    const textLen = visibleCount(text) || 1;
    depth.max = textLen;

    if (+depth.value > textLen) {
      depth.value = textLen;
    }

    stepValue.textContent = depth.value;

    if (syncedColors) {
      renderColorHandles();
      updateGradientBar();
      updateUIGradient();
    }

    const built = build(text, depth);
    const effects = getEffects();

    const styled = applyStyles(built, effects);

    const clean = stripClosingTags(styled);

    if (clean.length > 500) {
      charWarning.classList.remove("hidden");
      output.value = "";
      outputDisplay.innerHTML = "";
      preview.innerHTML = "";
      return;
    } else {
      charWarning.classList.add("hidden");
    }

    output.value = clean;
    outputDisplay.innerHTML = renderFormattedOutput(clean);

    if (autoCopyEnabled && clean && clean !== lastAutoCopied) {
      lastAutoCopied = clean;
      copy(clean, "Copied", { silent: true });
      trackAutoCopy("auto_copy_trigger", clean);
    }

    renderPreview(preview, parts(text, depth), effects);

    if (window.gtag && text.length > 3) {
      window.gtag('event', 'active_use', {
        event_category: 'engagement',
        value: text.length
      });
    }

    fitPreview();
    updateCharCount();
    updateEffectsSummary();
  }

  saveQuipBtn.onclick = () => {
    const v = stripClosingTags(output.value.trim());
    if (!v) return;

    let list = getList("gd-quips");

    if (list.includes(v)) {
      showToast("Already added");
      return;
    }

    list.push(v);
    saveList("gd-quips", list);

    renderSaved(quipList, gradientList, savedOptions);
    showToast("Clipboard saved");

    if (window.gtag) {
      window.gtag('event', 'save_quip', {
        event_category: 'engagement'
      });
    }
  };

  removeModeBtn.onclick = () => {
    state.removeMode = !state.removeMode;
    updateRemoveModeUI();
    renderPresetThemes();
    renderSaved(quipList, gradientList, savedOptions);
  };

  [input, ...effectInputs()].forEach(e => e.oninput = () => {
    updateOptionButtons();
    update();
  });

  updateOptionButtons();

  const savedOptions = {
    onApplyGradient: applySavedGradient,
    onGradientError: showToast,
    onAfterChange: update
  };

  presetCategories.onclick = event => {
    const button = event.target.closest(".preset-category");
    if (!button) return;

    activePresetCategory = button.dataset.category;
    activePresetKey = getPresetCatalog()[activePresetCategory]?.[0]
      ? makePresetKey(getPresetCatalog()[activePresetCategory][0])
      : "";
    renderPresetCategories();
    renderPresetThemes();
    renderPresetDetail();
  };

  presetThemes.onclick = event => {
    const button = event.target.closest(".preset-theme");
    if (!button) return;

    if (event.target.closest(".preset-theme-remove") && activePresetCategory === userPresetCategory) {
      const signature = button.dataset.signature;
      const gradients = getList("gd-gradients");
      saveList("gd-gradients", gradients.filter(entry => {
        const colors = Array.isArray(entry?.colors) ? entry.colors : Array.isArray(entry) ? entry : [];
        return gradientSignature(colors) !== signature;
      }));
      ensureActivePresetSelection();
      renderPresetCategories();
      renderPresetThemes();
      renderPresetDetail();
      showToast("Gradient removed");
      return;
    }

    activePresetKey = button.dataset.signature;
    renderPresetThemes();
    renderPresetDetail();
  };

  presetApplyBtn.onclick = () => {
    if (applyPresetGradient()) {
      presetPopup.classList.add("hidden");
    }
  };

  presetFavoriteBtn.onclick = () => {
    toggleFavoritePreset();
  };

  presetBtn.onclick = () => {
    presetPopup.classList.remove("hidden");
  };

  presetCloseBtn.onclick = () => {
    presetPopup.classList.add("hidden");
  };

  presetPopup?.addEventListener("click", e => {
    if (e.target === presetPopup) {
      presetPopup.classList.add("hidden");
    }
  });

  requestAnimationFrame(async () => {
    paletteColors = randColors(4);
    setColors(paletteColors.slice(0, desiredColorCount), { track: false });

    updateRemoveModeUI();
    setMode(state.mode);
    await loadPresetGradients();
    renderSaved(quipList, gradientList, savedOptions);
    renderAutoCopyButton();
    renderRecentGradients();
    renderTemperatureControl();
    setThemeMode(activeThemeMode);
    updateHighlightUI();
    renderRandomQuipCategories();
    renderRandomQuips();
    scheduleRandomQuipRefresh();

    initFloating(20);

    window.guide = initGuide({
      depth,
      onOpen: () => {
        if (window.gtag) {
          window.gtag("event", "open_guide", {
            event_category: "navigation"
          });
        }
      }
    });

    updateCharCount();
    initLogoAudio();
  });

  function updateUIGradient() {
    const gradient = getGradientPreview();
    document.documentElement.style.setProperty("--guide-gradient", gradient);
  }

  function updateCharCount() {
    const totalPill = document.getElementById("totalCountPill");
    const steamPill = document.getElementById("steamCountPill");
    if (!totalPill || !steamPill) return;

    const text = input.value;

    const built = build(text, depth);

    const styled = applyStyles(built, getEffects());

    const clean = stripClosingTags(styled);
    const len = clean.length;
    const steamLimit = 32;

    totalPill.textContent = `${len} / 500`;
    steamPill.textContent = `${Math.min(len, steamLimit)} / ${steamLimit} Steam Limit`;

    if (len > 450) {
      totalPill.style.color = "#ff6b6b";
      totalPill.style.opacity = "1";
    } else if (len > 32) {
      totalPill.style.color = "#facc15";
      totalPill.style.opacity = "0.9";
    } else {
      totalPill.style.color = "#777";
      totalPill.style.opacity = "0.7";
    }

    if (len > steamLimit) {
      steamPill.style.color = "#ff8b5e";
      steamPill.style.opacity = "1";
      steamPill.classList.add("warn");
    } else {
      steamPill.style.color = "#8ad7a7";
      steamPill.style.opacity = "0.95";
      steamPill.classList.remove("warn");
    }
  }

});
