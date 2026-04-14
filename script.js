// =======================
// 📊 CREATE CHART
// =======================
const chart = LightweightCharts.createChart(
  document.getElementById("chart"),
  {
    width: window.innerWidth * 0.95,
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

const candleSeries = chart.addSeries(
  LightweightCharts.CandlestickSeries
);

// =======================
// 📡 LOAD INITIAL DATA
// =======================
let lastTime = 0;

async function loadChart() {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100"
  );

  const data = await res.json();

  const candles = data.map((c) => ({
    time: c[0] / 1000,
    open: +c[1],
    high: +c[2],
    low: +c[3],
    close: +c[4],
  }));

  lastTime = candles[candles.length - 1].time;

  candleSeries.setData(candles);
}

loadChart();

// =======================
// 🔴 LIVE UPDATE (SMART)
// =======================
setInterval(async () => {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1"
  );

  const data = await res.json();
  const c = data[0];

  const newCandle = {
    time: c[0] / 1000,
    open: +c[1],
    high: +c[2],
    low: +c[3],
    close: +c[4],
  };

  // Only update if new data
  if (newCandle.time >= lastTime) {
    candleSeries.update(newCandle);
    lastTime = newCandle.time;
  }

}, 2000);

// =======================
// 🚀 STRATEGY
// =======================
async function getStrategy() {
  const res = await fetch("/strategy");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<b>Strategy:</b> ${data.name}`;
}

// =======================
// 📊 BACKTEST
// =======================
async function runBacktest() {
  const res = await fetch("/backtest");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<b>Balance:</b> ${data.balance} <br>
     <b>Accuracy:</b> ${data.accuracy}`;
}

// =======================
// 🤖 AI SIGNAL
// =======================
async function getAI() {
  const res = await fetch("/ai");
  const data = await res.json();

  document.getElementById("output").innerHTML =
    `<b>Signal:</b> ${data.signal} <br>
     <b>Confidence:</b> ${data.confidence}`;
}
