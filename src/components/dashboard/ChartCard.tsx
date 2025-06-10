
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * Props pour le composant ChartCard
 */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'pie';
  data: any[];
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  className?: string;
}

/**
 * Composant ChartCard - Carte avec graphique pour le tableau de bord
 * 
 * Supporte les graphiques en barres et en secteurs
 */
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  type,
  data,
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#0077bc', '#d3d92b', '#339fce', '#e6ed5f', '#005c8f'],
  className
}) => {
  /**
   * Rendu du graphique en barres
   */
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={nameKey} 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar 
          dataKey={dataKey} 
          fill={colors[0]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  /**
   * Rendu du graphique en secteurs (camembert)
   */
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {type === 'bar' ? renderBarChart() : renderPieChart()}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
