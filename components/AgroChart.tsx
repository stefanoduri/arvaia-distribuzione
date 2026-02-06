
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';

interface AgroChartProps {
  data: any[];
  dataKey: string;
  title: string;
  color: string;
}

const AgroChart: React.FC<AgroChartProps> = ({ data, dataKey, title, color }) => {
  // Funzione per determinare il colore della barra in base al numero di giorni
  const getBarColor = (distCount: number) => {
    // Se distCount è 2, usiamo un colore più scuro, altrimenti uno più chiaro
    if (color.includes('#059669')) { // Tema Smeraldo
        return distCount === 2 ? '#047857' : '#34d399'; 
    }
    if (color.includes('#2563eb')) { // Tema Blu
        return distCount === 2 ? '#1d4ed8' : '#60a5fa';
    }
    return color;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full h-[500px]">
      <h3 className="text-sm font-bold uppercase tracking-wide mb-10 text-slate-500">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => `${value} kg`}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ paddingTop: '0px', paddingBottom: '30px' }} 
          />
          <Bar 
            dataKey={dataKey} 
            radius={[4, 4, 0, 0]} 
            name={dataKey === "pesoTotale" ? "Peso Totale" : "Peso per parte"}
            barSize={25}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.distCount)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgroChart;
