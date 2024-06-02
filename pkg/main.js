import initSync, { World } from "./gamers_world_wasm.js"

const webgl = await import("./canvas.js");
const wasm = await initSync();

const myCanvas = document.getElementById('game');
const gl = myCanvas.getContext('webgl2');
const myCanvas2D = document.getElementById('game2d');
const ctx = myCanvas2D.getContext('2d');

const fps_value = document.getElementById("fps-value");


function drawTriangle(a, b, c, color) {
    ctx.fillStyle = '#' + (color + 0x1000000).toString(16).substr(-6);
    // ctx.setFillColor(color);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.fill();
}

function drawArray(trans, { cells, colors, width, height }) {
    const scale = trans.scale || 1;

    const cellSize = myCanvas.width / 100 * scale;
    const cellSizeY = cellSize * Math.sqrt(3) / 2;

    const move_x = (trans.x * scale || 0) + myCanvas.width / 2;
    const move_y = (trans.y * scale || 0) + myCanvas.height / 2;
    for (let y = 0; y < height; y++) {
        const ay = (y - height / 2) * cellSizeY + move_y;
        if (ay < -2 * cellSizeY || ay > myCanvas.height) {
            continue;
        }
        for (let x = 0; x < width; x++) {
            const ax = (x - width / 2) * cellSize + move_x;
            if (ax < -2 * cellSize || ax - cellSize > myCanvas.width) {
                continue;
            }
            const color1 = colors[(y * width + x) * 2] || 0;
            const color2 = colors[(y * width + x) * 2 + 1] || 0;
            let a = { x: ax, y: ay };
            let b = { x: ax + cellSize, y: ay };
            let c = { x: ax, y: ay + cellSizeY };
            let d = { x: ax + cellSize, y: ay + cellSizeY };
            const index = y * (width + 1) + x;
            a.y += cells[index] * cellSizeY;
            b.y += cells[index + 1] * cellSizeY;
            c.y += cells[index + width + 1] * cellSizeY;
            d.y += cells[index + width + 2] * cellSizeY;
            if (y % 2 == 0) {
                c.x += cellSize / 2;
                d.x += cellSize / 2;
                drawTriangle(a, b, c, color1);
                drawTriangle(b, c, d, color2);
            } else {
                a.x += cellSize / 2;
                b.x += cellSize / 2;
                drawTriangle(a, b, d, color1);
                drawTriangle(a, c, d, color2);
            }
        }
    }
}

let lastTime = Date.now();
function renderLoop() {
    setTransform();

    webgl.draw();
    // update the fps
    fps_value.innerHTML = Math.round(1000 / (Date.now() - lastTime));
    lastTime = Date.now();

    // // Set up for 2D drawing
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw a simple rectangle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(50, 50, 200, 200);

    // Restore the context to its original state
    ctx.restore();

    requestAnimationFrame(renderLoop);

    game.world.tick();
    if (game.world.to_update_map()) {
        webgl.updateVertex(game.cells);
    }
    if (game.world.to_update_index()) {
        webgl.updateIndex(game.indices);
    }
}

function onResize() {
    myCanvas.width = window.innerWidth * window.devicePixelRatio;
    myCanvas.height = window.innerHeight * window.devicePixelRatio;
    myCanvas2D.width = window.innerWidth;
    myCanvas2D.height = window.innerHeight;
    webgl.windowSizeChangeCallback();
}

function setTransform() {
    if (trans.dt < 0) {
        trans.keyw = 0;
        trans.keys = 0;
        trans.keya = 0;
        trans.keyd = 0;
    } else {
        trans.dt--;
    }
    let dx = trans.keya - trans.keyd;
    let dy = trans.keys - trans.keyw;
    trans.to_update |= dx != 0 || dy != 0;
    if (trans.to_update) {
        trans.x += dx;
        trans.y += dy;
        trans.to_update = false;

        webgl.setTransform(trans.x, trans.y, trans.z, trans.scale);
    }
}

// on window resize, resize the canvas
window.addEventListener("resize", onResize);


window.addEventListener("wheel", (e) => {
    // scale the canvas
    trans.scale *= 1 - e.deltaY / 1000;
    trans.to_update = true;
});

window.addEventListener("keydown", (e) => {
    // move the canvas by wsad
    switch (e.key) {
        case "w":
            trans.keyw = 2;
            break;
        case "s":
            trans.keys = 2;
            break;
        case "a":
            trans.keya = 2;
            break;
        case "d":
            trans.keyd = 2;
            break;
        default:
            return;
    }
    trans.dt = 60;
});

window.addEventListener("keyup", (e) => {
    // move the canvas by wsad
    switch (e.key) {
        case "w":
            trans.keyw = 0;
            break;
        case "s":
            trans.keys = 0;
            break;
        case "a":
            trans.keya = 0;
            break;
        case "d":
            trans.keyd = 0;
            break;
        default:
            return;
    }
});


const game = {
    width: 100,
    height: 100,
    cells: null,
    colors: null,
    world: null,
};
const trans = {
    keyw: 0,
    keys: 0,
    keya: 0,
    keyd: 0,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    to_update: false,
};

async function init() {

    onResize();
    webgl.main(gl);

    const world = World.new(200, 200);
    game.world = world;

    const cellsPtr = world.get_vec();
    const len = world.get_vec_len();
    const cells = new Float32Array(wasm.memory.buffer, cellsPtr, len);
    const indexPtr = world.get_indices();
    const ilen = world.get_indices_len();
    const indices = new Uint32Array(wasm.memory.buffer, indexPtr, ilen);

    game.cells = cells;
    game.indices = indices;
    game.height = world.h;
    game.width = world.w;

    renderLoop();
    world.start();
}

await init();