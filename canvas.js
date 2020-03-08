let canvas = document.querySelector('canvas');

let terminal = document.getElementById('terminal');

canvas.width = window.innerWidth;
canvas.height = window.innerWidth / 2;

let context = canvas.getContext('2d');

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    let eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    let rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth / 2;;
  init();
  drawTerminal();
});

function Bit(value, color, x, y, dx, dy) {
  this.value = value;
  this.color = color;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.width = 7;
  this.height = 7;

  this.draw = function() {
    context.font = "11px Arial ";
    context.fillStyle = this.color;
    context.fillText(this.value, this.x, this.y);
  }

  this.update = function() {
    if(this.x + this.width > canvas.width || this.x < 0) {
      this.dx = -this.dx;
    }

    if(this.y + this.height > canvas.height || this.y - this.height < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Make mouse position slightly random so that the bits don't cluster
    let mx = mouseX + (Math.random() - 0.5) * 25;
    let my = mouseY + (Math.random() - 0.5) * 25;

    let mdx = (mx - this.x);
    let mdy = (my - this.y);


    let dist = Math.sqrt(mdx*mdx + mdy*mdy);

    let acc = 1 / Math.pow(dist, 1.5) * 10;
    if (acc > 2) acc = 2;

    this.ddx = acc * mdx / Math.abs(mdx);
    this.ddy = acc * mdy / Math.abs(mdy);

    this.dx += this.ddx;
    this.dy += this.ddy;

    if(Math.abs(this.dx) > 2) this.dx = 2 * this.dx / Math.abs(this.dx);
    if(Math.abs(this.dy) > 2) this.dy = 2 * this.dy / Math.abs(this.dy);

    this.draw();
  }
}

let bitArray = [];

function init() {
  bitArray = [];

  let bitValueArray = ['0', '1'];
  let colorArray = ['rgb(0, 75, 98, 0.5)', 'rgb(0, 130, 143, 0.5)', 'rgb(129, 192, 197, 0.5)', 'rgb(242, 238, 237, 0.5)', 'rgb(249, 180, 1, 0.5)'];

  for (let i=0; i < 200; i++) {
    let bitValue = bitValueArray[Math.floor(Math.random() * bitValueArray.length)];
    let color = colorArray[Math.floor(Math.random() * colorArray.length)];

    let x = Math.random() * (canvas.width - 7 * 2) + 7;
    let y = Math.random() * (canvas.height - 7 * 2) + 7;
    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;
    let ddx = 0.000000001;
    let ddy = 0.000000001;

    bitArray.push(new Bit(bitValue, color, x, y, dx, dy));
  }
}

function drawTerminal() {
  //let img = new Image();
  let imgRatio = 516 / 319;
  let imgWidth = canvas.width / 3;
  let imgHeight = imgWidth / imgRatio;
  let scalingFactor = 1.5;
  let x = canvas.width / 4;
  let y = -4 * (canvas.height / 5);
  let w = imgWidth * scalingFactor;
  let h = imgHeight * scalingFactor;

  document.getElementById('terminal').setAttribute("transform","translate(" + 0 + " " + y + ")");

  document.getElementById('terminal').setAttribute("width", w);
  document.getElementById('terminal').setAttribute("height", h);
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, innerWidth, canvas.height);

  for (let i=0; i<bitArray.length; i++) {
    bitArray[i].update();
  }
  drawTerminal();
}

init();
animate();
