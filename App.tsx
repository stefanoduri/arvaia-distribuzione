
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Filter, 
  Info,
  LayoutDashboard,
  Box,
  CalendarDays
} from 'lucide-react';
import { AgriData, Filters } from './types';
import { parseAgriTSV } from './utils/dataParser';
import AgroChart from './components/AgroChart';
import { RAW_TSV_DATA } from './constants/rawData';

/**
 * Calcola la data del lunedì della settimana specificata per l'anno 2025.
 * Basato sulla richiesta: Settimana 2 = 06/01/2025.
 */
const getMondayDate = (week: number): string => {
  const isoWeek1Monday = new Date(2024, 11, 30); 
  const targetMonday = new Date(isoWeek1Monday);
  targetMonday.setDate(isoWeek1Monday.getDate() + (week - 1) * 7);
  
  return targetMonday.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatWeekLabel = (week: number): string => `S${week.toString().padStart(2, '0')}`;

const App: React.FC = () => {
  const [data, setData] = useState<AgriData[]>([]);
  const [filters, setFilters] = useState<Filters>({
    tipoParte: '',
    prodotto: '',
    giorno: ''
  });

  useEffect(() => {
    const parsed = parseAgriTSV(RAW_TSV_DATA);
    setData(parsed);
  }, []);

  const uniqueValues = useMemo(() => ({
    tipoParte: Array.from(new Set(data.map(d => d.tipoParte))).filter(Boolean).sort(),
    prodotto: Array.from(new Set(data.map(d => d.prodotto))).filter(Boolean).sort(),
    giorno: ["2", "5"]
  }), [data]);

  const productBaseData = useMemo(() => {
    if (!filters.prodotto || !filters.tipoParte) return [];
    return data.filter(item => {
      const matchProduct = item.prodotto === filters.prodotto;
      const matchType = filters.tipoParte === 'Totale' ? true : item.tipoParte === filters.tipoParte;
      return matchProduct && matchType;
    });
  }, [data, filters.prodotto, filters.tipoParte]);

  const filteredData = useMemo(() => {
    if (filters.giorno === '') return productBaseData;
    return productBaseData.filter(item => item.giorno === filters.giorno);
  }, [productBaseData, filters.giorno]);

  const showCharts = filters.prodotto !== '' && filters.tipoParte !== '';

  const typeLabel = useMemo(() => {
    if (filters.tipoParte === 'Totale') return "Totale (PI + MP)";
    if (filters.tipoParte === 'PI') return "Parte Intera";
    if (filters.tipoParte === 'MP') return "Mezza Parte";
    return filters.tipoParte;
  }, [filters.tipoParte]);

  const weeklyChartData = useMemo(() => {
    if (!showCharts || data.length === 0) return [];

    // Identifica il range di settimane presenti nel dataset intero (es. 2-51)
    const allWeekNums = data.map(d => Number(d.settimana)).filter(n => !isNaN(n));
    const minWeek = Math.min(...allWeekNums);
    const maxWeek = Math.max(...allWeekNums);

    const statsMap = new Map<number, { tot: number; partiSum: number; days: Set<string> }>();
    
    productBaseData.forEach(d => {
      const weekNum = Number(d.settimana);
      const current = statsMap.get(weekNum) || { tot: 0, partiSum: 0, days: new Set() };
      current.days.add(d.giorno);
      statsMap.set(weekNum, {
        tot: current.tot + d.pesoTotale,
        partiSum: current.partiSum + d.parti,
        days: current.days
      });
    });

    const results = [];
    // Cicliamo su tutte le settimane per garantire la continuità del grafico
    for (let w = minWeek; w <= maxWeek; w++) {
      const stats = statsMap.get(w) || { tot: 0, partiSum: 0, days: new Set() };
      const mondayStr = getMondayDate(w);
      const sLabel = formatWeekLabel(w);
      results.push({
        xLabel: sLabel,
        fullLabel: `${sLabel} (${mondayStr})`,
        weekNum: w,
        pesoTotale: Math.round(stats.tot * 100) / 100,
        pesoPerParte: stats.partiSum > 0 ? Math.round((stats.tot / stats.partiSum) * 1000) / 1000 : 0,
        distCount: stats.days.size 
      });
    }

    return results;
  }, [productBaseData, data, showCharts]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Database className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Arvaia <span className="text-emerald-600">Distribuzione 2025</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm italic">
            <Info className="w-4 h-4" />
            Calendario Distribuzione 2025
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Filtri Ricerca</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prodotto</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                    value={filters.prodotto}
                    onChange={(e) => setFilters(f => ({ ...f, prodotto: e.target.value }))}
                  >
                    <option value="">Scegli Prodotto...</option>
                    {uniqueValues.prodotto.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo Parte</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                    value={filters.tipoParte}
                    onChange={(e) => setFilters(f => ({ ...f, tipoParte: e.target.value }))}
                  >
                    <option value="">Scegli Tipo...</option>
                    <option value="Totale">Totale (PI + MP)</option>
                    {uniqueValues.tipoParte.map(v => <option key={v} value={v}>{v === 'PI' ? 'Parte Intera (PI)' : v === 'MP' ? 'Mezza Parte (MP)' : v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giorno Distribuzione</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                    value={filters.giorno}
                    onChange={(e) => setFilters(f => ({ ...f, giorno: e.target.value }))}
                  >
                    <option value="">Tutti i giorni (2 e 5)</option>
                    {uniqueValues.giorno.map(v => <option key={v} value={v}>{v === "2" ? "Martedì (2)" : v === "5" ? "Venerdì (5)" : v}</option>)}
                  </select>
                </div>
                
                <button 
                  onClick={() => setFilters({ tipoParte: '', prodotto: '', giorno: '' })}
                  className="w-full py-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Resetta filtri
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" />
                Legenda Grafici
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-emerald-700 shadow-sm"></div>
                   <p className="text-xs text-slate-600 font-medium">Distribuzione 2 giorni</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-emerald-400 shadow-sm"></div>
                   <p className="text-xs text-slate-600">Distribuzione 1 giorno</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded bg-slate-200 shadow-sm"></div>
                   <p className="text-xs text-slate-400 italic">Settimana senza distribuzione</p>
                 </div>
               </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-3">
              <span className="text-xl">📊</span>
              <p className="text-xs text-emerald-700 leading-relaxed">
                <strong>Nota:</strong> I grafici mostrano l'intero arco temporale (tutte le settimane). I vuoti indicano assenza di distribuzione.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {showCharts ? (
              <>
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                    Trend Settimanale: {filters.prodotto} ({typeLabel})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Peso Totale Filtrato</p>
                    <p className="text-2xl font-black text-slate-800">{Math.round(filteredData.reduce((acc, curr) => acc + curr.pesoTotale, 0)).toLocaleString('it-IT')} kg</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Media Peso per parte</p>
                    <p className="text-2xl font-black text-slate-800">
                      {(() => {
                        const totalW = filteredData.reduce((acc, curr) => acc + curr.pesoTotale, 0);
                        const totalP = filteredData.reduce((acc, curr) => acc + curr.parti, 0);
                        return totalP > 0 ? (totalW / totalP).toFixed(3) : "0.000";
                      })()} kg
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Giornate Distinte</p>
                    <p className="text-2xl font-black text-slate-800">{new Set(filteredData.map(d => d.data)).size}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <AgroChart 
                    data={weeklyChartData} 
                    dataKey="pesoTotale" 
                    title={`Volume Settimanale Totale - ${filters.prodotto} (${typeLabel})`} 
                    color="#059669" 
                  />
                  <AgroChart 
                    data={weeklyChartData} 
                    dataKey="pesoPerParte" 
                    title={`Peso per Parte Medio Settimanale - ${filters.prodotto} (${typeLabel})`} 
                    color="#2563eb" 
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Dettaglio Movimentazioni (Filtrato)</h3>
                  </div>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white text-slate-400 text-xs uppercase sticky top-0 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Data</th>
                          <th className="px-6 py-4">Settimana</th>
                          <th className="px-6 py-4">Giorno</th>
                          <th className="px-6 py-4 text-center">Parte</th>
                          <th className="px-6 py-4 text-right">Peso per parte (kg)</th>
                          <th className="px-6 py-4 text-right">Parti</th>
                          <th className="px-6 py-4 text-right">Peso Tot (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredData.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700">{row.data}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                              {formatWeekLabel(Number(row.settimana))} ({getMondayDate(Number(row.settimana))})
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-center font-bold">{row.giorno}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.tipoParte === 'PI' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {row.tipoParte}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-slate-600">{row.pesoPerParte.toFixed(3)}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-500">{row.parti}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-800">{row.pesoTotale.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[600px] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-10">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                  <Box className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Configurazione Analisi</h2>
                <p className="text-slate-500 max-w-sm">
                  Scegli un prodotto e un tipo di parte per caricare l'analisi storica delle distribuzioni Arvaia 2025. Seleziona "Totale" per vedere il volume combinato.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
