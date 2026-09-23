const HSUTERNAMES_BASE = 'http://henrysuter.ch/glossaires';

export function getHsuternamesPageByLetters(term) {
  if (!term || typeof term !== 'string') {
    return null;
  }

  // Nettoyage du mot
  term = term.trim();

  if (term.length === 0) {
    return null;
  }

  const firstLetter = term.charAt(0).toUpperCase();
  const firstLetters =
    firstLetter + term.charAt(1).toLowerCase();

  let page = null;

  // A
  if (['Aa', 'Ab', 'Ac', 'Ad', 'Ae', 'Af', 'Ag'].includes(firstLetters)) {
    page = 'A0';
  } else if (['Ai', 'Aj', 'Al', 'Am', 'An', 'Ao', 'Ap'].includes(firstLetters)) {
    page = 'A1';
  } else if (['Ar', 'As'].includes(firstLetters)) {
    page = 'A2';
  } else if (['At', 'Au', 'Av', 'Ay', 'Az'].includes(firstLetters)) {
    page = 'A3';

  // B
  } else if (['Ba'].includes(firstLetters)) {
    page = 'B0';
  } else if (['Be'].includes(firstLetters)) {
    page = 'B1';
  } else if (['Bi', 'Bl'].includes(firstLetters)) {
    page = 'B2';
  } else if (['Bo'].includes(firstLetters)) {
    page = 'B3';
  } else if (['Br', 'Bu'].includes(firstLetters)) {
    page = 'B4';

  // C
  } else if (['Ca', 'Ce'].includes(firstLetters)) {
    page = 'C0';
  } else if (['Ch'].includes(firstLetters)) {
    page = 'C1';
  } else if (['Ci', 'Cl'].includes(firstLetters)) {
    page = 'C2';
  } else if (['Co'].includes(firstLetters)) {
    page = 'C3';
  } else if (['Cp', 'Cr', 'Cu', 'Cy'].includes(firstLetters)) {
    page = 'C4';

  // D
  } else if (['Da', 'De'].includes(firstLetters)) {
    page = 'D0';
  } else if (['Dg', 'Di', 'Dj', 'Do', 'Dr', 'Du', 'Dy', 'Dz'].includes(firstLetters)) {
    page = 'D1';

  // E
  } else if (['Ea', 'Eb', 'Ec', 'Ed'].includes(firstLetters)) {
    page = 'E0';
  } else if (
    ['Ef', 'Eg', 'Eh', 'Ei', 'El', 'Em', 'En', 'Eo', 'Ep', 'Eq', 'Er']
      .includes(firstLetters)
  ) {
    page = 'E1';
  } else if (['Es', 'Et', 'Eu', 'Ev', 'Ex', 'Ey', 'Ez'].includes(firstLetters)) {
    page = 'E2';

  // F
  } else if (['Fa', 'Fe', 'Fi'].includes(firstLetters)) {
    page = 'F0';
  } else if (['Fl', 'Fo', 'Fr', 'Fu'].includes(firstLetters)) {
    page = 'F1';

  // G
  } else if (['Ga', 'Ge', 'Gi'].includes(firstLetters)) {
    page = 'G0';
  } else if (['Gl', 'Go', 'Gr', 'Gu', 'Gy'].includes(firstLetters)) {
    page = 'G1';

  // Lettres avec une seule lettre de contrôle
  } else if (['H', 'I', 'J', 'K'].includes(firstLetter)) {
    page = `${firstLetter}0`;

  // L
  } else if (['La'].includes(firstLetters)) {
    page = 'L0';
  } else if (['Le', 'Lh', 'Li', 'Lo', 'Lu', 'Ly'].includes(firstLetters)) {
    page = 'L1';

  // M
  } else if (['Ma'].includes(firstLetters)) {
    page = 'M0';
  } else if (['Me', 'Mi'].includes(firstLetters)) {
    page = 'M1';
  } else if (['Mo', 'Mu', 'My'].includes(firstLetters)) {
    page = 'M2';

  // N, O
  } else if (['N', 'O'].includes(firstLetter)) {
    page = `${firstLetter}0`;

  // P
  } else if (['Pa'].includes(firstLetters)) {
    page = 'P0';
  } else if (['Pe', 'Pf', 'Ph'].includes(firstLetters)) {
    page = 'P1';
  } else if (['Pi', 'Pl'].includes(firstLetters)) {
    page = 'P2';
  } else if (['Po', 'Pr', 'Pu', 'Py'].includes(firstLetters)) {
    page = 'P3';

  // Q
  } else if (firstLetter === 'Q') {
    page = 'Q0';

  // R
  } else if (['Ra', 'Rb', 'Re', 'Rh'].includes(firstLetters)) {
    page = 'R0';
  } else if (['Ri', 'Ro', 'Ru'].includes(firstLetters)) {
    page = 'R1';

  // S
  } else if (['Sa'].includes(firstLetters)) {
    page = 'S0';
  } else if (
    ['Sc', 'Se', 'Si', 'So', 'Sp', 'St', 'Su', 'Sy']
      .includes(firstLetters)
  ) {
    page = 'S1';

  // T
  } else if (['Ta', 'Tc', 'Te'].includes(firstLetters)) {
    page = 'T0';
  } else if (['Th', 'Ti', 'To'].includes(firstLetters)) {
    page = 'T1';
  } else if (['Tr', 'Ts', 'Tu', 'Ty', 'Tz'].includes(firstLetters)) {
    page = 'T2';

  // U
  } else if (firstLetter === 'U') {
    page = 'U0';

  // V
  } else if (['Va'].includes(firstLetters)) {
    page = 'V0';
  } else if (['Ve'].includes(firstLetters)) {
    page = 'V1';
  } else if (['Vi', 'Vo', 'Vu', 'Vy'].includes(firstLetters)) {
    page = 'V2';

  // W, X, Y, Z
  } else if (['W', 'X', 'Y', 'Z'].includes(firstLetter)) {
    page = `${firstLetter}0`;
  }

  // Aucun classement trouvé
  if (!page) {
    return null;
  }

  return `${HSUTERNAMES_BASE}/topo${page}.html`;
}

function normalize(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[´’ʼʻ`]/g, "'").replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function decodeEntities(value) {
  return value.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, number) => String.fromCharCode(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCharCode(parseInt(number, 16)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function cleanDefinition(html) {
  let output = html.replace(/<\s*t\s*>/gi, '<mark>').replace(/<\s*\/\s*t\s*>/gi, '</mark>');
  output = output.replace(/<a\b[^>]*href\s*=\s*(["'])javascript:[\s\S]*?\1[^>]*>([\s\S]*?)<\/a>/gi, ' $2');
  output = output.replace(/<a\b[^>]*href\s*=\s*javascript:[^>]*>([\s\S]*?)<\/a>/gi, ' $1');
  return decodeEntities(output.replace(/&nbsp;/gi, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/[ \t]{2,}/g, ' ').trim());
}

function parseAnchors(dtHtml) {
  const anchors = [];
  const anchorExpression = /<a\b[^>]*\bname\s*=\s*(["'])([^"']+)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorExpression.exec(dtHtml))) {
    anchors.push({ name: decodeEntities(match[2]), text: stripTags(match[3]) });
  }
  return anchors;
}

function scoreMatch(searchNormalized, display, anchorName) {
  const displayNormalized = normalize(display);
  const nameNormalized = normalize(anchorName.replace(/0$/, '').replace(/[_-]/g, ' '));
  if (searchNormalized === displayNormalized || searchNormalized === nameNormalized) return 3;
  if (displayNormalized.startsWith(searchNormalized) || nameNormalized.startsWith(searchNormalized)) return 1;
  if (searchNormalized.length >= 4 && (displayNormalized.includes(searchNormalized) || nameNormalized.includes(searchNormalized))) return 1;
  return 0;
}

export async function searchHsuternames(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') return null;
  const url = getHsuternamesPageByLetters(searchTerm);
  const searchNormalized = normalize(searchTerm);
  if (!url || !searchNormalized) return null;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SwissWordsSearchToolDev/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Impossible de télécharger le lexique (${response.status}): ${url}`);

  const html = new TextDecoder('windows-1252').decode(await response.arrayBuffer());
  const entryExpression = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
  let best = null;
  let match;

  while ((match = entryExpression.exec(html))) {
    const anchors = parseAnchors(match[1]);
    if (!anchors.length) continue;

    let localBest = null;
    for (const anchor of anchors) {
      const score = scoreMatch(searchNormalized, anchor.text, anchor.name);
      if (score > 0 && (!localBest || score > localBest.score)) localBest = { score, anchor };
    }
    if (!localBest || (best && localBest.score < best.score)) continue;

    const term = localBest.anchor.text;
    const variants = anchors.map(anchor => anchor.text).filter(text => normalize(text) !== normalize(term));
    best = {
      score: localBest.score,
      result: {
        term,
        category: '[n. pr.]',
        definition: cleanDefinition(match[2]),
        example: null,
        variants,
        source_id: 'hsuternames',
        source: `${url}#${encodeURIComponent(localBest.anchor.name)}`,
      },
    };
    if (best.score === 3) break;
  }

  return best ? best.result : null;
}
