
export interface AgriData {
  data: string;
  tipoParte: string;
  prodotto: string;
  pesoPerParte: number;
  parti: number;
  pesoTotale: number;
  settimana: string;
  giorno: string;
}

export interface Filters {
  tipoParte: string;
  prodotto: string;
  giorno: string;
}

export interface WeeklyChartData {
  settimana: string;
  pesoTotale: number;
  pesoPerParte: number;
}
