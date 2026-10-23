export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const state = {
  producers: 3,
  consumers: 2,
  production: 9,
  consumption: 6,
  balance: 3,
}

function updateUI() {
  updateState();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducerBar();
  drawProductionBar();
  drawConsumptionBar();

  readout.textContent =
    `Assigned: ${state.producers}/6 · Production: ${state.production} · Consumption: ${state.consumption} · Balance: ${
      state.balance > 0 ? "+" : ""
    }${state.balance}`;
}

function drawProducerBar() {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < state.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < state.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${state.producers} / 6`, 18, 76);
}

function drawProductionBar() {
  ctx.fillText(`Production: ${state.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, state.production * 14, 20);
}

function drawConsumptionBar() {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${state.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, state.consumption * 14, 20);
}

function updateState() {
  // Clamp producers between 0 - 6
  state.producers = Math.max(0, Math.min(6, state.producers));
  state.production = state.producers * 3;
  state.balance = state.production - state.consumption;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  state.producers -= 1;
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  state.producers += 1;
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    state.producers = 2;
    updateUI();
  };
updateUI();
