export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: "forward" | "right";
  execute: () => void;
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

function boundedMove(value: number, offset: number) {
  return Math.min(4, Math.max(0, value + offset));
}

const forwardCommand: Command = {
  label: "forward",
  execute: () => {
    const facing = directions[direction];
    x = boundedMove(x, facing.dx);
    y = boundedMove(y, facing.dy);
  },
};

const rightCommand: Command = {
  label: "right",
  execute: () => {
    direction = (direction + 1) % directions.length;
  },
};

const commandQueue: Command[] = [];

function createQueueList(): HTMLOListElement {
  const list = document.createElement("ol");
  list.id = "rover-queue";
  readout.insertAdjacentElement("afterend", list);
  return list;
}

function getOrCreateButton(id: string, text: string): HTMLButtonElement {
  const existing = document.querySelector<HTMLButtonElement>(`#${id}`);
  if (existing !== null) {
    existing.disabled = false;
    return existing;
  }
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.textContent = text;
  const reset = document.querySelector<HTMLButtonElement>("#rover-reset");
  if (reset !== null) {
    reset.before(button);
  } else {
    document.body.appendChild(button);
  }
  return button;
}

const queueList = document.querySelector<HTMLOListElement>("#rover-queue") ??
  createQueueList();

function renderQueue() {
  queueList.replaceChildren();
  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    queueList.appendChild(item);
  }
}

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  renderQueue();
}

function runQueue() {
  while (commandQueue.length > 0) {
    commandQueue.shift()!.execute();
  }
  drawRover();
  renderQueue();
}

function clearQueue() {
  commandQueue.length = 0;
  renderQueue();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () =>
  enqueueCommand(forwardCommand);
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () =>
  enqueueCommand(rightCommand);
getOrCreateButton("rover-run", "Run").onclick = runQueue;
getOrCreateButton("rover-clear", "Clear").onclick = clearQueue;
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue.length = 0;
  drawRover();
  renderQueue();
};
drawRover();
renderQueue();
