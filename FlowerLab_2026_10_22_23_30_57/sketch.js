// ===== Flower types =====
let types = [
  { name: "Rose: Love, Passion",  file: "rose my gif.gif",  color: [230, 70, 100] },
  { name: "Tulip: Caring, Good wishes", file: "Turip.gif", color: [250, 150, 60] },
  { name: "Daisy: Purity, New beginnings", file: "Daisy.gif", color: [255, 255, 255] },
  { name: "Lily: Virtue, Devotion",  file: "Lily.gif",  color: [240, 180, 220] },
  { name: "Sunflower: Loyalty, Adoration",  file: "Sunflower.gif",  color: [240, 180, 220] },
  { name: "Lavender: Serenity, Calmness",  file: "Lavender.gif",  color: [90, 160, 90] },
  { name: "Leaf",  file: "leaf1.gif",  color: [90, 160, 90] },
  { name: "Leaf2",  file: "leaf2.gif",  color: [90, 160, 90] },
];


let flowers = [];
let currentType = 0;
let selected = null;
let dragging = null;
let offsetX = 0, offsetY = 0;
let bw = false;
let typeButtons = [];
let toInput, msgInput, fromInput;

function setup() {
  createCanvas(600, 750);
  angleMode(DEGREES);

  // Load images (show placeholder flowers if not found)
  for (let t of types) {
    t.img = null;
    loadImage(t.file, img => (t.img = img), () => {});
  }

  // Page style
  document.body.style.background = "#fdf6f0";
  document.body.style.fontFamily = "sans-serif";

  let help = createP("1. Choose a flower → 2. Click the canvas to place it → 3. Drag to move<br>Selected flower: +/− to resize, R to rotate, Delete to remove");
  help.style("font-size", "12px");

  // Flower buttons
  types.forEach((t, i) => {
    let b = createButton(t.name);
    b.style("margin", "4px");
    b.mousePressed(() => selectType(i));
    typeButtons.push(b);
  });
  selectType(0);
  createP("");

  // Message inputs
  toInput = createInput("");
  toInput.attribute("placeholder", "Dear ...");
  msgInput = createInput("");
  msgInput.attribute("placeholder", "Your message");
  fromInput = createInput("");
  fromInput.attribute("placeholder", "From ...");
  [toInput, msgInput, fromInput].forEach(inp => inp.style("margin", "4px"));
  createP("");

  // Control buttons
  let bwBtn = createButton("Black & White");
  bwBtn.mousePressed(() => (bw = !bw));

  let clearBtn = createButton("Clear All");
  clearBtn.mousePressed(() => { flowers = []; selected = null; });

  let saveBtn = createButton("Save as Image");
  saveBtn.mousePressed(saveBouquet);

  [bwBtn, clearBtn, saveBtn].forEach(b => b.style("margin", "4px"));
}

function selectType(i) {
  currentType = i;
  typeButtons.forEach((b, j) => {
    b.style("background", j === i ? "#e283d1" : "white");
    b.style("color", j === i ? "white" : "black");
  });
}

// ===== Draw every frame =====
function draw() {
  background(255, 245, 240);
  for (let f of flowers) drawFlower(f);
  drawWrap();
  drawCard();
  if (bw) filter(GRAY);
}

// ===== Draw one flower =====
function drawFlower(f) {
  let t = types[f.type];
  let s = f.size;
  push();
  translate(f.x, f.y);
  rotate(f.angle);

  if (t.img) {
    imageMode(CENTER);
    image(t.img, 0, 0, s, s);
  } else {
    //Simple placeholder circle just in case when the image is not found
    noStroke();
    fill(t.color);
ellipse(0, 0, s * 0.6);
    fill(255, 210, 80);
    ellipse(0, 0, s * 0.2);
  }

  // Selection outline
  if (f === selected) {
    noFill();
    stroke(100, 100, 255);
    strokeWeight(2);
    ellipse(0, 0, s + 10);
  }
  pop();
}

// ===== Wrapping paper =====
function drawWrap() {
  noStroke();
  fill(245, 225, 200);
  triangle(150, 380, 450, 380, 300, 580);
  fill(230, 205, 175);
  triangle(300, 380, 450, 380, 300, 580);
  // Ribbon
  fill(200, 80, 100);
  triangle(260, 500, 260, 540, 300, 520);
  triangle(340, 500, 340, 540, 300, 520);
  ellipse(300, 520, 18);
}

// ===== Message card =====
function drawCard() {
  fill(250);
  stroke(60);
  strokeWeight(1);
  rect(100, 600, 400, 130, 6);

  noStroke();
  fill(40);
  textSize(17);
  textAlign(LEFT, TOP);
  text("Dear " + (toInput.value() || "..."), 120, 615);

  textSize(14);
  text(msgInput.value(), 120, 645, 360, 50);

  textAlign(RIGHT, TOP);
  textSize(16);
  text("— " + (fromInput.value() || "..."), 480, 700);
}

// ===== Mouse controls =====
function mouseOnCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function mousePressed() {
  if (!mouseOnCanvas()) return;

  // Check if an existing flower was clicked (top one first)
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];
    if (dist(mouseX, mouseY, f.x, f.y) < f.size / 2) {
      selected = f;
      dragging = f;
      offsetX = f.x - mouseX;
      offsetY = f.y - mouseY;
      flowers.splice(i, 1);
      flowers.push(f);
      return;
    }
  }

  // Empty space → place a new flower
  let newFlower = {
    type: currentType,
    x: mouseX,
    y: mouseY,
    size: 120,
    angle: random(-20, 20),
  };
  flowers.push(newFlower);
  selected = newFlower;
}

function mouseDragged() {
  if (dragging) {
    dragging.x = mouseX + offsetX;
    dragging.y = mouseY + offsetY;
  }
}

function mouseReleased() {
  dragging = null;
}

// ===== Keyboard controls =====
function keyPressed() {
  // Ignore keys while typing in an input box
  if (document.activeElement.tagName === "INPUT") return;
  if (!selected) return;

  if (key === "+" || key === "=") selected.size = min(selected.size + 15, 300);
  if (key === "-") selected.size = max(selected.size - 15, 40);
  if (key === "r" || key === "R") selected.angle += 15;
  if (key === "Delete" || key === "Backspace") {
    flowers = flowers.filter(f => f !== selected);
    selected = null;
    return false;
  }
}

// ===== Save =====
function saveBouquet() {
  selected = null;
  setTimeout(() => saveCanvas("my-bouquet", "png"), 100);
}
