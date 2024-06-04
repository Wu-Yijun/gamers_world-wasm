import { player } from "./canvas.js";
import initSync, { World, Player, Enemies, Entities } from "./gamers_world_wasm.js"

const webgl = await import("./webgl.js");
const wasm = await initSync();
const canvas = await import("./canvas.js");

const myCanvas = document.getElementById('game');
const gl = myCanvas.getContext('webgl2');
// const myCanvas2D = document.getElementById('game2d');
// const ctx = myCanvas2D.getContext('2d');

const game_menu = document.getElementById('game-menu');

const key_hold_threadhold = 100000;


const fps_value = document.getElementById("fps-value");
const frames_value = document.getElementById("frames-value");
const info_dom = document.getElementById("info");

let lastTime = Date.now();
var framesValue = 0;
function renderLoop() {
    if (player.player.is_dashing()) {
        webgl.to_update_view();
    }

    setTransform();

    // update the fps
    fps_value.innerHTML = Math.round(1000 / (Date.now() - lastTime));
    lastTime = Date.now();
    frames_value.innerText = framesValue++;


    game.world.tick(player.player, player.entity, player.enemy);
    canvas.tick();
    if (game.world.to_update_map()) {
        webgl.updateVertex(game.cells);
    }
    if (game.world.to_update_index()) {
        webgl.updateIndex(game.indices);
    }


    canvas.render(trans.scale);

    webgl.draw();

    if (game.to_pause) {
        pauseGame();
        return;
    }
    requestAnimationFrame(renderLoop);
}

function onResize() {
    myCanvas.width = window.innerWidth * window.devicePixelRatio;
    myCanvas.height = window.innerHeight * window.devicePixelRatio;
    webgl.windowSizeChangeCallback();
    canvas.onResize();
    webgl.to_update_view();

    if (game.to_pause) {
        requestAnimationFrame(renderLoop);
    }
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
    // console.log(e.key);
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
        case "W":
            trans.keyw = 2;
            break;
        case "s":
        case "S":
            trans.keys = 2;
            break;
        case "a":
        case "A":
            trans.keya = 2;
            break;
        case "d":
        case "D":
            trans.keyd = 2;
            break;
        case "q":
        case "Q":
            trans.keyq = 1;
            break;
        case "e":
        case "E":
            trans.keye = 1;
        case "Escape":
            game.to_pause = true;
        default:
            return;
    }
    trans.dt = 60 * key_hold_threadhold / 1000;
});


window.addEventListener("keyup", (e) => {
    // move the canvas by wsad
    switch (e.key) {
        case "w":
        case "W":
            trans.keyw = 0;
            break;
        case "s":
        case "S":
            trans.keys = 0;
            break;
        case "a":
        case "A":
            trans.keya = 0;
            break;
        case "d":
        case "D":
            trans.keyd = 0;
            break;
        case "q":
        case "Q":
            trans.keyq = 0;
            break;
        case "e":
        case "E":
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

document.getElementById('startGame').onclick = startGame;
document.getElementById('resumeGame').onclick = resumeGame;
document.getElementById('settingGame').onclick = settingGame;
document.getElementById('aboutGame').onclick = aboutGame;
document.getElementById('exitGame').onclick = exitGame;

const game = {
    width: 100,
    height: 100,
    cells: null,
    colors: null,
    world: null,
    to_pause: true,

    res: {},
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
            console.log("All resources are loaded!");
            worker.terminate();
            return;
        }
    }
}

function pauseGame() {
    game_menu.style.display = 'flex';
}

function resumeGame() {
    game_menu.style.display = 'none';
    game.to_pause = false;
    requestAnimationFrame(renderLoop);
}

function startGame() {
    resumeGame();
    console.error("Not implemented yet!");
}
function settingGame() {
    console.error("Not implemented yet!");
}

function aboutGame() {
    window.open("https://github.com/Wu-Yijun/gamers_world-wasm", "_self");
}

function exitGame() {
    // window.open('about:blank',self').close();
    window.open('about:blank', '_self').close();
    try {
        window.opener = null;
        window.open("", "_self");
    } catch (e) {
        console.error(e);
    }
    try {
        window.location.href = "about:blank";
    } catch (e) {
        console.error(e);
    }
    window.close();
}

async function init() {
    console.clear();

    const player = Player.new();
    const enemy = Enemies.new();
    const entity = Entities.new();

    onResize();
    webgl.main(gl, player);
    loadResources();

    // let seed = BigInt(Math.round(Math.random() * 10000));
    let seed = BigInt(776);
    console.log("随机数种子: ", seed);
    const world = World.new(100, 100, seed);
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
    canvas.player.enemy = enemy;
    canvas.player.entity = entity;
    canvas.player.world = world;
    canvas.player.webgl = webgl;
    canvas.player.res = game.res;

    renderLoop();

    world.start();
    player.move_by(0, 0, world);
    webgl.setTransform(trans.scale, trans.rotate);
    webgl.to_update_view();


    // enemy.add_enemy(world, 10, 10, 1, 5);
}

await init();

