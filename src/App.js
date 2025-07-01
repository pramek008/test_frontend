import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import './App.css';

// URL API data populasi
const API_URL = 'https://datausa.io/api/data?drilldowns=Nation&measures=Population';

function App() {
  const [data, setData] = useState([]);
  const [nation, setNation] = useState('');
  const [range, setRange] = useState({ from: 2010, to: 2020 });

  // Ambil data ketika pertama kali load
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        const result = res.data.data;
        setData(result);
        if (result.length > 0) {
          setNation(result[0].Nation);
        }
      })
      .catch((err) => {
        console.error('Gagal fetch data:', err);
      });
  }, []);

  // Filter data sesuai range tahun
  const filtered = data.filter(item => {
    const year = parseInt(item.Year);
    return year >= range.from && year <= range.to;
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

  return (
    <div className="container">
      <h1>Data Populasi USA</h1>

      {/* Info sumber data */}
      <div>
        <p><b>Organisasi:</b> {nation}</p>
        <p><b>Sumber API:</b> <a href={API_URL} target="_blank" rel="noreferrer">{API_URL}</a></p>
      </div>

      {/* Filter tahun */}
      <div className="filter">
        <label>Dari Tahun:</label>
        <input
          type="number"
          value={range.from}
          onChange={(e) => setRange({ ...range, from: parseInt(e.target.value) })}
        />
        <label>Sampai Tahun:</label>
        <input
          type="number"
          value={range.to}
          onChange={(e) => setRange({ ...range, to: parseInt(e.target.value) })}
        />
      </div>

      {/* Line Chart */}
      <h2>Grafik Garis Populasi</h2>
      <div className="chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Population" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <h2>Grafik Pie Populasi</h2>
      <div className="chart">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filtered}
              dataKey="Population"
              nameKey="Year"
              outerRadius={100}
              label
            >
              {filtered.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
