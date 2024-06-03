import { player } from "./canvas.js";
import initSync, { World, Player } from "./gamers_world_wasm.js"

const webgl = await import("./webgl.js");
const wasm = await initSync();
const canvas = await import("./canvas.js");

const myCanvas = document.getElementById('game');
const gl = myCanvas.getContext('webgl2');
// const myCanvas2D = document.getElementById('game2d');
// const ctx = myCanvas2D.getContext('2d');

const key_hold_threadhold = 100000;


const fps_value = document.getElementById("fps-value");
const info_dom = document.getElementById("info");

let lastTime = Date.now();
function renderLoop() {
    setTransform();

    // update the fps
    fps_value.innerHTML = Math.round(1000 / (Date.now() - lastTime));
    lastTime = Date.now();

    game.world.tick();
    canvas.tick();
    if (game.world.to_update_map()) {
        webgl.updateVertex(game.cells);
    }
    if (game.world.to_update_index()) {
        webgl.updateIndex(game.indices);
    }

    if(player.player.is_dashing()){
        webgl.to_update_view();
    }

    canvas.render(game.res, trans);

    webgl.draw();
    requestAnimationFrame(renderLoop);
}

function onResize() {
    myCanvas.width = window.innerWidth * window.devicePixelRatio;
    myCanvas.height = window.innerHeight * window.devicePixelRatio;
    webgl.windowSizeChangeCallback();
    canvas.onResize();
    webgl.to_update_view();
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
    let dx = trans.keyd - trans.keya;
    let dy = trans.keyw - trans.keys;
    let dr = trans.keyq - trans.keye;
    if (dr != 0) {
        trans.rotate += dr;
        webgl.setTransform(trans.scale, trans.rotate);
        webgl.to_update_view();
    }
    canvas.setTransform(dx, dy, dr);
    if (dx != 0 || dy != 0 || dr != 0) {
        webgl.to_update_view();
    }
}

// on window resize, resize the canvas
window.addEventListener("resize", onResize);


window.addEventListener("wheel", (e) => {
    // scale the canvas
    trans.scale *= 1 - e.deltaY / 1000;
    webgl.setTransform(trans.scale, trans.rotate);
    webgl.to_update_view();
});

window.addEventListener("keydown", (e) => {
    console.log(e.key);
    // move the canvas by wsad
    switch (e.key) {
        case "Shift":
            e.preventDefault(); // 阻止默认的右键菜单显示
            // towards current direction
            let dx = trans.keyd - trans.keya;
            let dy = trans.keyw - trans.keys;
            canvas.dash(dx, dy);
            webgl.to_update_view();
            break;
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
    trans.dt = 60 * key_hold_threadhold / 1000;
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

document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // 阻止默认的右键菜单显示
    // towards the mouse
    let dx = e.clientX - window.innerWidth / 2;
    let dy = e.clientY - window.innerHeight / 2;
    canvas.dash(dx, -dy);
    webgl.to_update_view();
});

const game = {
    width: 100,
    height: 100,
    cells: null,
    colors: null,
    world: null,

    res: {
        ready: false,
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
    scale: .3,
    rotate: 0,
    to_update: false,
};


function loadResources() {
    // const res = await fetch('./resources.json');
    // const data = await res.json();
    // game.res = data;

    var worker = new Worker('./files/load_resources.js');
    worker.onmessage = (e) => {
        if (e.data.error) {
            console.error(e.data.error);
            return;
        }
        game.res[e.data.key] = e.data.val;
        if (e.data.is_ready) {
            game.res.ready = true;
            worker.terminate();
            return;
        }
    }
}

async function init() {

    const player = Player.new();

    onResize();
    webgl.main(gl, player);
    loadResources();

    const world = World.new(200, 200);
    // const world = World.new(20, 20);
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

    canvas.player.player = player;
    canvas.player.world = world;

    renderLoop();

    let seed = BigInt(Math.round(Math.random() * 10000));
    // let seed = BigInt(124);
    world.start(seed);
    player.move_by(0, 0, world);
    webgl.setTransform(trans.scale, trans.rotate);
    webgl.to_update_view();
}

await init();