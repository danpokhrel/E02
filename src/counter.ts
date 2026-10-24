export {};

const SHIELD_CAPACITY = 10;
let charge = 0;

interface ShieldSnapshot {
  charge: number;
  capacity: number;
  missing: number;
}

function shieldSnapshot(): ShieldSnapshot {
  return {
    charge,
    capacity: SHIELD_CAPACITY,
    missing: SHIELD_CAPACITY - charge,
  };
}

const shieldEvents = new EventTarget();
const SHIELD_CHANGE = "shield-change";

function announceShieldChange(shield: ShieldSnapshot) {
  shieldEvents.dispatchEvent(
    new CustomEvent(SHIELD_CHANGE, { detail: shield }),
  );
}

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function drawMeter(shield: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
}

function updateInspector(event: Event) {
  const shield = (event as CustomEvent<ShieldSnapshot>).detail;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(shield);
}

function renderStats(shield: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missing}`;
}

shieldEvents.addEventListener(SHIELD_CHANGE, (event) => {
  drawMeter((event as CustomEvent<ShieldSnapshot>).detail);
});

function setCharge(next: number) {
  const bounded = Math.max(0, Math.min(SHIELD_CAPACITY, next));
  if (bounded === charge) return;
  charge = bounded;
  announceShieldChange(shieldSnapshot());
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCharge(charge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCharge(charge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCharge(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(shieldSnapshot());
  shieldEvents.addEventListener(SHIELD_CHANGE, updateInspector);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldEvents.removeEventListener(SHIELD_CHANGE, updateInspector);
  panel.remove();
  panel = null;
};
drawMeter(shieldSnapshot());
