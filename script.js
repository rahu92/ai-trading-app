const express = require("express");
const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(express.json());


// ======================
// 🚀 Strategy Generator
// ======================
app.get("/strategy", (req, res) => {
  const strategies = [
    {
      name: "RSI Strategy",
      entry: "RSI < 30",
      exit: "RSI > 70"
    },
    {
      name: "EMA Crossover",
      entry: "EMA20 > EMA50",
      exit: "EMA20 < EMA50"
    }
  ];

  const randomStrategy =
    strategies[Math.floor(Math.random() * strategies.length)];

  res.json(randomStrategy);
});


// ======================
// 📊 Backtest
// ======================
app.get("/backtest", (req, res) => {
  let balance = 1000;

  for (let i = 0; i < 10; i++) {
    balance += Math.random() * 100 - 50;
  }

  res.json({
    balance: balance.toFixed(2),
    accuracy: (Math.random() * 100).toFixed(2) + "%"
  });
});


// ======================
// 🤖 AI Signal
// ======================
app.get("/ai", (req, res) => {
  const signals = ["BUY", "SELL", "HOLD"];

  res.json({
    signal: signals[Math.floor(Math.random() * signals.length)],
    confidence: (Math.random() * 100).toFixed(2) + "%"
  });
});


// ======================
// 🌐 Start Server (IMPORTANT)
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
