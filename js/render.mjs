function escapeHtml(value){
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseTag(rawTag){
  const [name, ...rest] = rawTag.split("=");
  return {
    name: name.trim(),
    value: rest.join("=").trim()
  };
}

function parseAlpha(value){
  const raw = String(value || "").replace(/^#/, "");
  const parsed = parseInt(raw.slice(0, 2), 16);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed / 255)) : 1;
}

function numericValue(value){
  const parsed = parseFloat(String(value || "").replace(/[%a-z]/gi, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function signedIndentStyle(value){
  const amount = numericValue(value);
  if (!amount) return "";
  return amount < 0 ? `transform:translateX(${amount}px);` : `padding-left:${amount}px;`;
}

function cssLength(value, fallbackUnit = "px"){
  const raw = String(value || "").trim();
  const parsed = numericValue(raw);
  if (parsed === null) return `0${fallbackUnit}`;
  if (/em$/i.test(raw)) return `${parsed}em`;
  if (/%$/i.test(raw)) return `${parsed}%`;
  if (/px$/i.test(raw)) return `${parsed}px`;
  return `${parsed}${fallbackUnit}`;
}

function renderTag(rawTag, color, closing = false){
  return `<span style="color:${color || "#fff"};opacity:.6">&lt;${closing ? "/" : ""}${escapeHtml(rawTag)}&gt;</span>`;
}

function renderVisibleSpace(label = "space"){
  return `<span class="output-space" title="${label}">&middot;</span>`;
}

function renderGeneratedGap(value){
  const length = cssLength(value, "em");
  return `<span class="output-generated-space" style="width:${length}" title="generated space ${escapeHtml(value)}"></span>`;
}

export function renderFormattedOutput(raw){
  let html = "";
  let color = null;
  let bold = false;
  let italic = false;
  let underline = false;
  let superscript = false;
  let subscript = false;
  let strike = false;
  let caseEffect = "";
  let cspace = "";
  let mspace = "";
  let align = "";
  let pos = "";
  let indent = "";
  let lineIndent = "";
  let margin = "";
  let contentWidth = "";
  let lineHeight = "";
  let rotate = "";
  let voffset = "";
  let mark = "";
  let alpha = "";
  let size = "";
  let fontWeight = "";
  const tagStyle = "opacity:.6";

  const regex = /<(#?[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?)>|<(\/?)([^>]+)>|(.)/g;
  let match;

  while((match = regex.exec(raw))){
    if(match[1]){
      color = match[1];
      html += `<span style="color:${color};${tagStyle}">&lt;${escapeHtml(color)}&gt;</span>`;
    } else if(match[3]){
      const closing = match[2] === "/";
      const { name: tagName, value } = parseTag(match[3]);

      if(tagName === "b") bold = !closing;
      if(tagName === "i") italic = !closing;
      if(tagName === "u") underline = !closing;
      if(tagName === "s") strike = !closing;
      if(tagName === "sup") superscript = !closing;
      if(tagName === "sub") subscript = !closing;
      if(["allcaps", "uppercase", "smallcaps", "lowercase"].includes(tagName)) caseEffect = closing ? "" : tagName;
      if(tagName === "cspace") cspace = closing ? "" : value;
      if(tagName === "mspace") mspace = closing ? "" : value;
      if(tagName === "align") align = closing ? "" : value;
      if(tagName === "pos") pos = closing ? "" : value;
      if(tagName === "indent") indent = closing ? "" : value;
      if(tagName === "line-indent") lineIndent = closing ? "" : value;
      if(tagName === "margin") margin = closing ? "" : value;
      if(tagName === "width") contentWidth = closing ? "" : value;
      if(tagName === "line-height") lineHeight = closing ? "" : value;
      if(tagName === "rotate") rotate = closing ? "" : value;
      if(tagName === "voffset") voffset = closing ? "" : value;
      if(tagName === "mark") mark = closing ? "" : value;
      if(tagName === "alpha") alpha = closing ? "" : value;
      if(tagName === "size") size = closing ? "" : value;
      if(tagName === "font-weight") fontWeight = closing ? "" : value;
      html += renderTag(match[3], color, closing);

      if(!closing && tagName === "space"){
        html += renderGeneratedGap(value);
      }

    } else {
      const decoration = [underline ? "underline" : "", strike ? "line-through" : ""].filter(Boolean).join(" ") || "none";
      const vertical = superscript
        ? "font-size:0.65em;vertical-align:super;"
        : subscript
          ? "font-size:0.65em;vertical-align:sub;"
          : "";
      const transform = rotate ? `transform:rotate(${numericValue(rotate) || 0}deg);` : "";
      const offset = voffset ? `position:relative;top:${-(numericValue(voffset) || 0)}em;` : "";
      const textTransform = caseEffect === "uppercase" || caseEffect === "allcaps"
        ? "uppercase"
        : caseEffect === "lowercase"
          ? "lowercase"
          : "none";
      const fontVariant = caseEffect === "smallcaps" ? "small-caps" : "normal";
      const spacing = cspace ? `letter-spacing:${numericValue(cspace) || 0}em;` : "";
      const monospace = mspace ? "font-family:monospace;" : "";
      const monoWidth = mspace ? `width:${numericValue(mspace) || 0}em;min-width:${numericValue(mspace) || 0}em;text-align:center;` : "";
      const line = lineHeight ? `line-height:${numericValue(lineHeight) || 100}%;` : "";
      const opacity = alpha ? `opacity:${parseAlpha(alpha)};` : "";
      const background = mark ? `background:${mark};` : "";
      const sizeStyle = size ? `font-size:${numericValue(size) || 100}%;` : "";
      const weight = fontWeight || (bold ? "700" : "400");
      const layout = `${transform}${offset}${monoWidth}display:inline-block;`;
      const blockStyle = [
        align || contentWidth || pos || indent || lineIndent || margin ? "display:inline-block;" : "",
        align ? `text-align:${align};` : "",
        contentWidth ? `width:${numericValue(contentWidth) || 100}%;` : "",
        pos ? `margin-left:${numericValue(pos) || 0}px;` : "",
        indent ? signedIndentStyle(indent) : "",
        lineIndent ? `text-indent:${numericValue(lineIndent) || 0}px;` : "",
        margin ? `margin-inline:${numericValue(margin) || 0}px;` : ""
      ].join("");
      const displayChar = match[4] === " " ? renderVisibleSpace() : escapeHtml(match[4]);
      html += `<span style="${blockStyle}"><span style="color:${color || "#fff"};font-weight:${weight};font-style:${italic ? "italic" : "normal"};text-decoration:${decoration};text-transform:${textTransform};font-variant:${fontVariant};${spacing}${monospace}${line}${opacity}${background}${sizeStyle}${vertical}${layout}">${displayChar}</span></span>`;
    }
  }

  return html;
}

export function renderPreview(preview, parts, styles = {}){
  preview.innerHTML = "";

  preview.style.fontWeight = styles.fontWeight || (styles.bold ? "700" : "400");
  preview.style.fontStyle = styles.italic ? "italic" : "normal";
  preview.style.textDecoration = [styles.underline ? "underline" : "", styles.strike ? "line-through" : ""].filter(Boolean).join(" ") || "none";
  preview.style.textTransform = styles.caseEffect === "uppercase" || styles.caseEffect === "allcaps"
    ? "uppercase"
    : styles.caseEffect === "lowercase"
      ? "lowercase"
      : "none";
  preview.style.fontVariant = styles.caseEffect === "smallcaps" ? "small-caps" : "normal";
  preview.style.letterSpacing = styles.cspace ? `${styles.cspace}px` : "";
  preview.style.lineHeight = styles.lineHeight ? `${styles.lineHeight}%` : "";
  preview.style.opacity = styles.alpha ? String(Math.min(1, Number(styles.alpha) / 255)) : "1";
  preview.style.background = styles.markEnabled ? styles.mark : "";
  preview.style.textAlign = styles.align || "left";
  preview.style.fontFamily = styles.mspace ? "monospace" : "";
  const position = Number(styles.pos) || 0;
  const indent = Number(styles.indent) || 0;
  const offset = position + Math.min(indent, 0);
  preview.style.marginLeft = "";
  preview.style.transform = "";
  preview.style.paddingLeft = indent > 0 ? `${indent}px` : "";
  preview.style.marginRight = styles.margin ? `${styles.margin}px` : "";
  preview.style.width = styles.width ? `${styles.width}%` : "";
  preview.style.textIndent = styles.lineIndent ? `${styles.lineIndent}px` : "";

  const content = document.createElement("span");
  content.className = "preview-text";
  content.style.transform = offset ? `translateX(${offset}px)` : "";

  if(styles.space){
    const gap = document.createElement("span");
    gap.className = "preview-generated-space";
    gap.style.width = `${Math.max(0, Number(styles.space) || 0)}em`;
    content.appendChild(gap);
  }

  for(const { ch, hex } of parts){
    const s = document.createElement("span");
    s.textContent = ch;

    if(hex) s.style.color = hex;

    if(styles.mspace){
      s.style.display = "inline-block";
      s.style.width = `${styles.mspace}px`;
      s.style.textAlign = "center";
    }

    if(styles.superscript){
      s.style.fontSize = "0.65em";
      s.style.verticalAlign = "super";
    }

    if(styles.subscript){
      s.style.fontSize = "0.65em";
      s.style.verticalAlign = "sub";
    }

    if(styles.size){
      s.style.fontSize = `${styles.size}%`;
    }

    if(styles.rotate){
      s.style.display = "inline-block";
      s.style.transform = `rotate(${styles.rotate}deg)`;
    }

    if(styles.voffset){
      s.style.position = "relative";
      s.style.top = `${-Number(styles.voffset)}em`;
    }

    content.appendChild(s);
  }

  preview.appendChild(content);
}
