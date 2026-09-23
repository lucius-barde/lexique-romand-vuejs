const HSUTER_BASE = 'http://henrysuter.ch/glossaires';

const HSUTER_PAGE_BY_LETTER = {
  a: 'patoisA0.html', b: 'patoisB0.html', c: 'patoisC0.html', d: 'patoisD0.html',
  e: 'patoisD0.html', f: 'patoisF0.html', g: 'patoisF0.html', h: 'patoisH0.html',
  i: 'patoisH0.html', j: 'patoisH0.html', k: 'patoisH0.html', l: 'patoisH0.html',
  m: 'patoisH0.html', n: 'patoisN0.html', o: 'patoisN0.html', p: 'patoisN0.html',
  q: 'patoisQ0.html', r: 'patoisQ0.html', s: 'patoisQ0.html', t: 'patoisT0.html',
  u: 'patoisT0.html', v: 'patoisT0.html', w: 'patoisT0.html', x: 'patoisT0.html',
  y: 'patoisT0.html', z: 'patoisT0.html',
};

function normalize(str) {
  return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[´’ʼʻ`]/g, "'").replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function decodeEntities(str) {
  return str.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html) { return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()); }

function cleanDefinition(html) {
  let out = html.replace(/<\s*t\s*>/gi, '<mark>').replace(/<\s*\/\s*t\s*>/gi, '</mark>');
  out = out.replace(/<a\b[^>]*href\s*=\s*(["'])javascript:[\s\S]*?\1[^>]*>([\s\S]*?)<\/a>/gi, ' $2');
  out = out.replace(/<a\b[^>]*href\s*=\s*javascript:[^>]*>([\s\S]*?)<\/a>/gi, ' $1');
  return decodeEntities(out.replace(/&nbsp;/gi, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/[ \t]{2,}/g, ' ').trim());
}

function splitDefinitionAndExample(ddHtml) {
  // HSUTER entries use <BR><EM>example</EM>, optionally followed by text.
  const exampleMarker = /<br\s*\/?>\s*<em\b[^>]*>([\s\S]*?)<\/em>/i;
  const match = exampleMarker.exec(ddHtml);

  if (!match) {
    return { definition: cleanDefinition(ddHtml), example: null };
  }

  const definitionHtml = ddHtml.slice(0, match.index);
  const afterExample = ddHtml.slice(match.index + match[0].length);
  const exampleHtml = `${match[1]} ${afterExample}`;
  const example = cleanDefinition(exampleHtml) || null;

  return {
    definition: cleanDefinition(definitionHtml),
    example,
  };
}

function parseAnchors(dtHtml) {
  const anchors = []; const re = /<a\b[^>]*\bname\s*=\s*(["'])([^"']+)\1[^>]*>([\s\S]*?)<\/a>/gi; let match;
  while ((match = re.exec(dtHtml))) anchors.push({ name: decodeEntities(match[2]), text: stripTags(match[3]) });
  return anchors;
}

function extractCategory(dtHtml) {
  const copy = dtHtml.replace(/<a\b[\s\S]*?<\/a>/gi, ''); const start = copy.indexOf('['); const end = start === -1 ? -1 : copy.indexOf(']', start + 1);
  return start !== -1 && end !== -1 ? copy.slice(start, end + 1).replace(/\s+/g, ' ').trim() : stripTags(copy);
}

function matchingForms(display, name = '') {
  const forms = new Set();
  const add = (value) => {
    const normalizedValue = normalize(value);
    if (normalizedValue) forms.add(normalizedValue);
  };

  add(display);
  add(name.replace(/0$/, ''));
  add(name.replace(/[_-]/g, ' '));

  const base = display.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  add(base);

  const parenMatch = display.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const parenthetical = parenMatch[1];
    const parentheticalNormalized = normalize(parenthetical).replace(/\s+/g, '');
    add(`${base} ${parenthetical}`);
    add(`${parenthetical} ${base}`);

    if (parentheticalNormalized.startsWith("s'")) add(`s'${base}`);
    if (parentheticalNormalized.startsWith("d'")) {
      add(`d'${base}`);
      add(`${base} (d')`);
    }
    if (parentheticalNormalized.includes('avoir')) {
      add(`avoir ${base}`);
      add(`${base} (avoir)`);
    }
  }

  return forms;
}

function scoreMatch(searchNorm, display, name) {
  const forms = matchingForms(display, name); if (forms.has(searchNorm)) return 3;
  if ([...forms].some(form => form.startsWith(searchNorm) || searchNorm.startsWith(form))) return 1;
  if ([...forms].some(form => form.includes(searchNorm) && searchNorm.length >= 4)) return 1;
  return 0;
}

export async function searchHsuter(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') return null;
  const letter = normalize(searchTerm).replace(/[^a-z]/g, '').charAt(0);
  const file = HSUTER_PAGE_BY_LETTER[letter]; if (!file) return null;
  const searchNorm = normalize(searchTerm); if (!searchNorm) return null;
  const url = `${HSUTER_BASE}/${file}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SwissWordsSearchToolDev/1.0)', Accept: 'text/html,application/xhtml+xml' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Impossible de télécharger le lexique (${response.status}): ${url}`);
  const html = new TextDecoder('windows-1252').decode(await response.arrayBuffer());
  const entryRe = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi; let best = null; let match;
  while ((match = entryRe.exec(html))) {
    const anchors = parseAnchors(match[1]); if (!anchors.length) continue;
    let localBest = null;
    for (const anchor of anchors) { const score = scoreMatch(searchNorm, anchor.text, anchor.name); if (score > 0 && (!localBest || score > localBest.score)) localBest = { score, anchor }; }
    if (!localBest || (best && localBest.score < best.score)) continue;
    const term = localBest.anchor.text;
    const variants = anchors.map(anchor => anchor.text).filter(text => normalize(text) !== normalize(term));
    const { definition, example } = splitDefinitionAndExample(match[2]);
    best = { score: localBest.score, result: { term, category: extractCategory(match[1]), definition, example, variants, source_id: 'hsuter', source: `${url}#${encodeURIComponent(localBest.anchor.name)}` } };
    if (best.score === 3) break;
  }
  return best ? best.result : null;
}
