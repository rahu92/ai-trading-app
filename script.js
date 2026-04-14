// =======================
// 📊 CREATE CHART
// =======================
const chart = LightweightCharts.createChart(
  document.getElementById("chart"),
  {
    width: window.innerWidth * 0.9,
    height: 400,
    layout: {
      background: { color: "#0f172a" },
      textColor: "#ffffff",
    },
    grid: {
      vertLines: { color: "#334155" },
      horzLines: { color: "#334155" },
    },
  }
);

// FIXED NEW API
const candleSeries = chart.addSeries(
  LightweightCharts.CandlestickSeries
);

// =======================
// 📡 LOAD LIVE DATA (BTC)
// =======================
async function loadChart() {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100"
  );

  const data = await res.json();

  const candles = data.map((c) => ({
    time: c[0] / 1000,
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
  }));

  candleSeries.setData(candles);
}

loadChart();


// =======================
// 🚀 STRATEGY
// =======================
async function getStrategy() {
  const res = await fetch("/strategy");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<h3>Strategy</h3><p>${data.name}</p>`;
}

// =======================
// 📊 BACKTEST
// =======================
async function runBacktest() {
  const res = await fetch("/backtest");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<h3>Backtest</h3>
     <p>Balance: ${data.balance}</p>
     <p>Accuracy: ${data.accuracy}</p>`;
}

// =======================
// 🤖 AI SIGNAL
// =======================
async function getAI() {
  const res = await fetch("/ai");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<h3>AI Signal</h3>
     <p>${data.signal}</p>
     <p>${data.confidence}</p>`;
}
