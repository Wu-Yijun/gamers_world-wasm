import initSync, { World } from "./gamers_world_wasm.js"

const webgl = await import("./canvas.js");
const wasm = await initSync();

const myCanvas = document.getElementById('game');
const gl = myCanvas.getContext('webgl2');
const myCanvas2D = document.getElementById('game2d');
const ctx = myCanvas2D.getContext('2d');

const fps_value = document.getElementById("fps-value");


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

    // Draw a image
    if (game.res.ready) {
        const imgw = 25;
        const imgh = 50;
        ctx.drawImage(game.res.img, myCanvas2D.width / 2 - imgw / 2, myCanvas2D.height / 2 - imgh / 2, imgw, imgh);
    }

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
        trans.keyq = 0;
        trans.keye = 0;
    } else {
        trans.dt--;
    }
    let dx = trans.keya - trans.keyd;
    let dy = trans.keys - trans.keyw;
    let dr = trans.keyq - trans.keye;
    trans.to_update |= dx != 0 || dy != 0 || dr != 0;
    if (trans.to_update) {
        trans.x += dx;
        trans.y += dy;
        trans.rotate += dr;
        trans.to_update = false;

        let ts = webgl.getTransform();
        trans.z = game.world.get_h(ts.x, ts.y);
        // console.log(ts.x, ts.y, trans.z);
        document.getElementById("info").innerText = `x: ${ts.x}, y: ${ts.y}, z: ${trans.z}`;
        webgl.setTransform(trans.x, trans.y, trans.z, trans.scale, trans.rotate);
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
        case "q":
            trans.keyq = 1;
            break;
        case "e":
            trans.keye = 1;
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
        case "q":
            trans.keyq = 0;
            break;
        case "e":
            trans.keye = 0;
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

    res: {
        ready: false,
        img: null,
    },
};
const trans = {
    keyw: 0,
    keys: 0,
    keya: 0,
    keyd: 0,
    keyq: 0,
    keye: 0,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rotate: 0,
    to_update: false,
};

function loadResources() {
    // const res = await fetch('./resources.json');
    // const data = await res.json();
    // game.res = data;

    const img = new Image();
    img.src = './man.png';
    img.onload = () => {
        game.res.img = img;
        game.res.ready = true;
    };
}

async function init() {

    onResize();
    webgl.main(gl);
    loadResources();

    const world = World.new(200, 200);
    // const world = World.new(4, 4);
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

    // let seed = BigInt(Math.round(Math.random() * 10000));
    let seed = BigInt(124);
    world.start(seed);
}

await init();