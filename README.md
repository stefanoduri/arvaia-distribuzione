
# 🌾 AgroTrend Arvaia: Analisi Distribuzione 2025

Una dashboard avanzata per la visualizzazione e l'analisi dei dati di distribuzione dei prodotti agricoli della cooperativa Arvaia per l'anno 2025.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Funzionalità

- **Visualizzazione Dinamica**: Grafici interattivi (Recharts) che mostrano il volume totale e il peso per parte.
- **Analisi delle Settimane**: Distinzione visiva automatica tra settimane con singola o doppia distribuzione (Martedì/Venerdì).
- **Filtri Avanzati**: Ricerca per prodotto, tipo di parte (Intera/Mezza) e giorno specifico.
- **Data Detail**: Tabella analitica con tutti i log di movimentazione, inclusi pesi e numero di parti.
- **AI Insights**: Integrazione con Google Gemini API per l'analisi dei trend (richiede API Key).

## 🚀 Come iniziare

### Prerequisiti
- Un browser moderno (Chrome, Firefox, Edge).
- (Opzionale) Node.js installato per lo sviluppo locale.

### Installazione Locale
1. Clona il repository:
   ```bash
   git clone https://github.com/TUO_UTENTE/NOME_REPO.git
   cd NOME_REPO
   ```
2. Poiché il progetto utilizza **ESM nativo** e **Import Maps**, non è necessaria una fase di build complessa. Puoi servire i file direttamente:
   ```bash
   npx serve .
   ```

## 📊 Struttura dei Dati
Il sistema legge dati in formato TSV (Tab-Separated Values) situati in `constants/rawData.ts`. I campi supportati includono:
- Data, Prodotto, Tipo Parte, Peso, Numero Parti, Settimana e Giorno.

## 🛠️ Tecnologie utilizzate
- **React 19** (con Native ESM)
- **Tailwind CSS** per lo styling
- **Recharts** per la visualizzazione dati
- **Lucide React** per le icone
- **Google Gemini API** (@google/genai) per l'analisi intelligente

---
*Progetto sviluppato per supportare la trasparenza e l'analisi dei dati agricoli della comunità.*
