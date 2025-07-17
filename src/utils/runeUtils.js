let cachedRuneMap = null;
let cachedStyleIconMap = null;

export async function loadRuneIconMap() {
  if (cachedRuneMap && cachedStyleIconMap) {
    return { runeMap: cachedRuneMap, styleIconMap: cachedStyleIconMap };
  }

  const res = await fetch("https://ddragon.leagueoflegends.com/cdn/15.13.1/data/ko_KR/runesReforged.json");
  const data = await res.json();

  const runeMap = {};
  const styleIconMap = {};

  data.forEach(style => {
    const styleId = style.id;
    styleIconMap[styleId] = `https://ddragon.canisback.com/img/${style.icon}`;

    style.slots.forEach(slot => {
      slot.runes.forEach(rune => {
        runeMap[rune.id] = `https://ddragon.canisback.com/img/${rune.icon}`;
      });
    });
  });

  cachedRuneMap = runeMap;
  cachedStyleIconMap = styleIconMap;

  return { runeMap, styleIconMap };
}

export function getRuneIcon(runeId, runeMap) {
  return runeMap?.[runeId] || null;
}
