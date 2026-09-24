const TOPIO_URL = 'https://topio.ch/dico.php';

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCharCode(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCharCode(parseInt(number, 16)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function normalize(value) {
  return stripTags(String(value))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[´’ʼʻ`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cleanHtml(html) {
  return decodeEntities(html.replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim());
}

function extractTable(html) {
  const contentMatch = /<div\b[^>]*\bid\s*=\s*(["'])contenu\1[^>]*>([\s\S]*?)<\/div\s*>/i.exec(html);
  const content = contentMatch?.[2] || html;
  return /<table\b[^>]*>([\s\S]*?)<\/table\s*>/i.exec(content)?.[1] || '';
}

export async function searchTopio(searchTerm) {
  const searchNormalized = normalize(searchTerm);
  if (!searchNormalized) return null;

  const response = await fetch(TOPIO_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SwissWordsSearchToolDev/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Impossible de télécharger le dictionnaire Topio (${response.status})`);

  const html = await response.text();
  const table = extractTable(html);
  const rowExpression = /<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi;
  let match;

  while ((match = rowExpression.exec(table))) {
    const cells = [...match[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td\s*>/gi)].map(cell => cell[1]);
    if (cells.length < 2) continue;

    // The first cell can contain an anchor used only for navigation.
    const term = stripTags(cells[0].replace(/<a\b[^>]*\bname\s*=\s*(["'])[^"']*\1[^>]*>[\s\S]*?<\/a\s*>/gi, ''));
    if (normalize(term) !== searchNormalized) continue;

    const definition = cleanHtml(cells[1]);
    if (!definition) continue;

    const followingContent = match[1].slice(match[1].indexOf(cells[1]) + cells[1].length);
    const exampleMatch = /<i\b[^>]*>([\s\S]*?)<\/i\s*>/i.exec(followingContent);

    return {
      term,
      category: 'Autre',
      definition,
      example: exampleMatch ? cleanHtml(exampleMatch[1]) || null : null,
      variants: [],
      source: TOPIO_URL,
      source_id: 'topio',
    };
  }

  return null;
}
