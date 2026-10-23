export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

interface ShiftResults {
  producers: number;
  production: number;
  consumption: number;
  balance: number;
}

let curProducers = 2;

function updateUI() {
  const shift = computeShift(curProducers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducerBar(shift);
  drawProductionBar(shift);
  drawConsumptionBar(shift);

  readout.textContent =
    `Assigned: ${shift.producers}/6 · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

function drawProducerBar(shift: ShiftResults) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < shift.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < shift.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.producers} / 6`, 18, 76);
}

function drawProductionBar(shift: ShiftResults) {
  ctx.fillText(`Production: ${shift.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shift.production * 14, 20);
}

function drawConsumptionBar(shift: ShiftResults) {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shift.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shift.consumption * 14, 20);
}

function computeShift(producers: number): ShiftResults {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return {
    producers,
    production,
    consumption,
    balance,
  };
}

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  curProducers = clamp(curProducers - 1, 0, 6);
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  curProducers = clamp(curProducers + 1, 0, 6);
  updateUI();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    curProducers = 2;
    updateUI();
  };
updateUI();
