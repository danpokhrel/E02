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

interface ReportRow {
  label: string;
  value: number;
  color: string;
}

let curProducers = 2;

function updateUI() {
  const shift = computeShift(curProducers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProducerBar(shift);
  const rows = [
    { label: "Production", value: shift.production, color: "#27766b" },
    { label: "Consumption", value: shift.consumption, color: "#a44d23" },
  ];
  for (let i = 0; i < rows.length; i++) {
    drawRow(rows[i], 102 + i * 52);
  }

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

function drawRow(record: ReportRow, y: number) {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`${record.label}: ${record.value}`, 18, y);
  ctx.fillStyle = record.color;
  ctx.fillRect(18, y + 8, record.value * 14, 20);
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
