async function getStrategy() {
  const res = await fetch("/strategy");
  const data = await res.json();

  document.getElementById("output").innerHTML = `
    <h3>Strategy</h3>
    <p><b>${data.name}</b></p>
    <p>Entry: ${data.entry}</p>
    <p>Exit: ${data.exit}</p>
  `;
}

async function runBacktest() {
  const res = await fetch("/backtest");
  const data = await res.json();

  document.getElementById("output").innerHTML = `
    <h3>Backtest</h3>
    <p>Balance: ${data.balance}</p>
    <p>Accuracy: ${data.accuracy}</p>
  `;
}

async function getAI() {
  const res = await fetch("/ai");
  const data = await res.json();

  document.getElementById("output").innerHTML = `
    <h3>AI Signal</h3>
    <p>${data.signal}</p>
    <p>Confidence: ${data.confidence}</p>
  `;
}
