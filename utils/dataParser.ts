
import { AgriData } from '../types';

/**
 * Converts Italian formatted strings (e.g. "1.234,56" or "10,5") to numbers
 */
const parseItalianNumber = (val: string): number => {
  if (!val) return 0;
  // Remove thousand separator (.) and replace decimal separator (,) with (.)
  const cleaned = val.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const parseAgriTSV = (tsvContent: string): AgriData[] => {
  const lines = tsvContent.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
  
  // Mapping headers to indices
  const getIndex = (key: string) => headers.findIndex(h => h.includes(key));

  const idxData = getIndex('data');
  const idxTipoParte = getIndex('tipo parte');
  const idxProdotto = getIndex('prodotto');
  const idxPesoPerParte = getIndex('peso per parte');
  const idxParti = getIndex('parti');
  const idxPesoTotale = getIndex('peso totale');
  const idxSettimana = getIndex('settimana');
  const idxGiorno = getIndex('giorno');

  return lines.slice(1).map(line => {
    const cols = line.split('\t');
    return {
      data: cols[idxData] || '',
      tipoParte: cols[idxTipoParte] || '',
      prodotto: cols[idxProdotto] || '',
      pesoPerParte: parseItalianNumber(cols[idxPesoPerParte]),
      parti: parseItalianNumber(cols[idxParti]),
      pesoTotale: parseItalianNumber(cols[idxPesoTotale]),
      settimana: cols[idxSettimana] || '',
      giorno: cols[idxGiorno] || '',
    };
  });
};
