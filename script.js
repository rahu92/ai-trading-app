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
// RSI
function calculateRSI(data, period = 14) {
  let gains = 0, losses = 0;
  for (let i = data.length - period; i < data.length; i++) {
    let diff = data[i].close - data[i - 1].close;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  let rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

// EMA
function calculateEMA(data, period) {
  let k = 2 / (period + 1);
  let ema = data[0].close;
  for (let i = 1; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
  }
  return ema;
}

// MACD
function calculateMACD(data) {
  let ema12 = calculateEMA(data.slice(-50), 12);
  let ema26 = calculateEMA(data.slice(-50), 26);
  return ema12 - ema26;
}

// Bollinger
function calculateBB(data) {
  let closes = data.slice(-20).map(d => d.close);
  let avg = closes.reduce((a, b) => a + b, 0) / closes.length;

  let variance = closes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / closes.length;
  let std = Math.sqrt(variance);

  return {
    upper: avg + 2 * std,
    lower: avg - 2 * std,
    price: closes[closes.length - 1]
  };
}
function runStrategy() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  if (!window.chartData) return alert("Chart not loaded");

  let buyScore = 0;
  let sellScore = 0;

  checkboxes.forEach(cb => {
    if (cb.value === "rsi") {
      let rsi = calculateRSI(window.chartData);
      if (rsi < 30) buyScore++;
      if (rsi > 70) sellScore++;
    }

    if (cb.value === "ema") {
      let ema20 = calculateEMA(window.chartData.slice(-50), 20);
      let ema50 = calculateEMA(window.chartData.slice(-50), 50);

      if (ema20 > ema50) buyScore++;
      if (ema20 < ema50) sellScore++;
    }

    if (cb.value === "macd") {
      let macd = calculateMACD(window.chartData);
      if (macd > 0) buyScore++;
      if (macd < 0) sellScore++;
    }

    if (cb.value === "bb") {
      let bb = calculateBB(window.chartData);

      if (bb.price < bb.lower) buyScore++;
      if (bb.price > bb.upper) sellScore++;
    }
  });

  let signal = "HOLD";

  if (buyScore > sellScore) signal = "BUY";
  else if (sellScore > buyScore) signal = "SELL";

  document.getElementById("output").innerHTML =
    `<b>Signal:</b> ${signal}<br>
     Buy Score: ${buyScore} | Sell Score: ${sellScore}`;
}
