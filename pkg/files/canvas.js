import { Enemies, Entities, Player, World } from "./gamers_world_wasm.js";

const myCanvas2D = document.getElementById('game2d');
const ctx = myCanvas2D.getContext('2d');
const myCanvasShadow = document.getElementById('game2d_shadow');
const ctxS = myCanvasShadow.getContext('2d');

const info_dom = document.getElementById("info");

const data = {
    removed_entity: [],
};

export const player = {
    player: new Player(),
    world: new World(),
    entity: new Entities(),
    enemy: new Enemies(),
    res: null,
    webgl: null,
    dir: 1,
    step_list: ['s1', 's2', 's3', 's4'],
    step: 3.9,
    ui: 1.0,

    colors: {
        hp: '#e60012',
        hp_max: '#7d0000',
        mp: '#0f68e1',
        mp_max: '#2e3188',
        sp: '#f39800',
        sp_max: '#834e00',
        exp: '#00ff00',
        exp_max: '#00561f',
    },

    mobs: {
        '1': {
            res: 'm1',
            w: 40,
            h: 40,
        }
    }
};


export function render(trans_scale) {
    const scale = player.ui * 0.1 / (trans_scale + 0.05);

    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctxS.resetTransform();
    ctxS.clearRect(0, 0, ctxS.canvas.width, ctxS.canvas.height);
    ctxS.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);


    // Draw the entities
    drawEntity(scale);

    drawMobs(scale);

    drawPlayer(scale);

    drawUI();

}

function drawEntity(scale) {
    const mat1 = player.webgl.getModelViewMatrix();
    const mat2 = player.webgl.getProjectionMatrix();
    const hei = ctx.canvas.height / 2;
    const wei = ctx.canvas.width / 2;
    const gh = 17 * scale;
    const gw = 10 * scale;
    const kh = 13 * scale;
    const kw = 30 * scale;

    if (mat1 && mat2) {
        // 只需要 位置 和id 即可
        let num = player.entity.get_len();
        for (let i = 0; i < num; i++) {
            const entity = player.entity.get_i(i, player.player);
            let pos = glMatrix.vec4.fromValues(entity[0], entity[1], entity[2], 1.0);
            glMatrix.vec4.transformMat4(pos, pos, mat1);
            glMatrix.vec4.transformMat4(pos, pos, mat2);

            let x = pos[0] / pos[3] * wei;
            let y = -pos[1] / pos[3] * hei;
            let to_hide = pos[2] / pos[3];

            if (entity[4]) {
                data.removed_entity.push({ x: x, y: y, tick: 20, type: entity[3] });
                continue;
            }
            if (to_hide > 1 || to_hide < 0) {
                continue;
            }
            if (entity[3] == 1) { // Gold
                let img = player.res.gold;
                img && ctx.drawImage(img, x - gw / 2, y - gh, gw, gh);
                ctxS.beginPath();
                ctxS.ellipse(x, y, 6 * scale, 3 * scale, 0, 0, 2 * Math.PI);
                ctxS.fill();
            } else if (entity[3] == 2) { //Knife
                let img = player.res.knife.k1;
                img && ctx.drawImage(img, x - kw / 2, y - kh, kw, kh);
                ctxS.beginPath();
                ctxS.ellipse(x, y, 6 * scale, 3 * scale, 0, 0, 2 * Math.PI);
                ctxS.fill();
            }

        }
    }

    // draw removed entity
    for (let i = 0; i < data.removed_entity.length; i++) {
        let entity = data.removed_entity[i];
        if (entity.tick <= 0) {
            data.removed_entity.splice(i, 1);
            i--;
            continue;
        }
        entity.tick--;
        entity.x *= 0.9;
        entity.y *= 0.9;
        if (entity.type == 1) {
            let img = player.res.gold;
            img && ctx.drawImage(img, entity.x - gw / 2, entity.y - gh, gw, gh);
        } else if (entity.type == 2) {
            let img = player.res.knife.k1;
            img && ctx.drawImage(img, entity.x - kw / 2, entity.y - kh, kw, kh);
        }
    }
}


function drawMobs(scale) {
    const mat1 = player.webgl.getModelViewMatrix();
    const mat2 = player.webgl.getProjectionMatrix();
    const hei = ctx.canvas.height / 2;
    const wei = ctx.canvas.width / 2;

    if (mat1 && mat2) {
        // 只需要 位置 和id 即可
        let num = player.enemy.get_len();
        for (let i = 0; i < num; i++) {
            const mob = player.enemy.get_i(i);
            let pos = glMatrix.vec4.fromValues(mob.x, mob.y, mob.z, 1.0);
            glMatrix.vec4.transformMat4(pos, pos, mat1);
            glMatrix.vec4.transformMat4(pos, pos, mat2);

            let x = pos[0] / pos[3] * wei;
            let y = -pos[1] / pos[3] * hei;
            let to_hide = pos[2] / pos[3];

            if (to_hide > 1 || to_hide < 0) {
                continue;
            }
            const mob_type = player.mobs[mob.tp];
            let gh = mob_type.h * scale;
            let gw = mob_type.w * scale;
            let img = player.res.monster && player.res.monster[mob_type.res];
            // mob
            img && ctx.drawImage(img, x - gw / 2, y - gh, gw, gh);
            // shadow
            ctxS.beginPath();
            ctxS.ellipse(x, y, gw / 2.5, gh / 7, 0, 0, 2 * Math.PI);
            ctxS.fill();
        }
    }
}

function drawPlayer(scale) {
    // Draw shadow (an ellipse)
    ctxS.beginPath();
    ctxS.ellipse(0, 0, 18 * scale, 7 * scale, 0, 0, 2 * Math.PI);
    ctxS.fill();

    // Draw the man
    if (player.res.man) {
        if (player.player.is_dashing()) {
            const imgw = 70 * scale;
            const imgh = 30 * scale;
            let ig = player.res.manDash;
            let deg = player.player.get_dash_deg();
            ctx.rotate(deg);
            ig && ctx.drawImage(ig, 0, -imgh / 2, imgw, imgh);
        } else {
            const imgw = 25 * scale;
            const imgh = 50 * scale;
            if (player.dir == 1) {
                ctx.scale(-1, 1);
            }
            let ig = player.res.man[player.step_list[Math.floor(player.step)]];
            ig && ctx.drawImage(ig, - imgw / 2, - imgh, imgw, imgh);
        }
    }
}

function drawUI() {
    const ui = player.ui;
    ctx.resetTransform();

    // Draw hp
    ctx.translate(0, 5 * ui);
    const hp = player.player.hp;
    const hp_max = player.player.hp_max;
    ctx.fillStyle = player.colors.hp_max;
    ctx.font = Math.round(ui * 2.5) + "px sans-serif";
    ctx.fillText("HP", 5 * ui, 2 * ui);
    ctx.fillRect(10 * ui, 0, ui * hp_max / 4, 2 * ui);
    ctx.fillText(`${Math.round(hp)}/${Math.round(hp_max)}`, (14 + hp_max / 4) * ui, 2 * ui);
    ctx.fillStyle = player.colors.hp;
    ctx.fillRect(10.1 * ui, 0.1 * ui, ui * (hp / 4 - 0.2), 1.8 * ui);

    // Draw mp
    ctx.translate(0, 5 * ui);
    const mp = player.player.mp;
    const mp_max = player.player.mp_max;
    ctx.fillStyle = player.colors.mp_max;
    ctx.font = Math.round(ui * 2.5) + "px sans-serif";
    ctx.fillText("MP", 5 * ui, 2 * ui);
    ctx.fillRect(10 * ui, 0, ui * mp_max / 4, 2 * ui);
    ctx.fillText(`${Math.round(mp)}/${Math.round(mp_max)}`, (14 + mp_max / 4) * ui, 2 * ui);
    ctx.fillStyle = player.colors.mp;
    ctx.fillRect(10.1 * ui, 0.1 * ui, ui * (mp / 4 - 0.2), 1.8 * ui);

    // Draw sp
    ctx.translate(0, 5 * ui);
    const sp = player.player.sp;
    const sp_max = player.player.sp_max;
    ctx.fillStyle = player.colors.sp_max;
    ctx.font = Math.round(ui * 2.5) + "px sans-serif";
    ctx.fillText("SP", 5 * ui, 2 * ui);
    ctx.fillRect(10 * ui, 0, ui * sp_max / 4, 2 * ui);
    ctx.fillText(`${Math.round(sp)}/${Math.round(sp_max)}`, (14 + sp_max / 4) * ui, 2 * ui);
    ctx.fillStyle = player.colors.sp;
    ctx.fillRect(10.1 * ui, 0.1 * ui, ui * (sp / 4 - 0.2), 1.8 * ui);

    // Draw exp at the centre bottum of screen
    const level = player.player.lv;
    const exp = player.player.exp;
    const exp_max = player.player.exp_max;
    ctx.resetTransform();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(-80.2 * ui, -10.2 * ui, 160.4 * ui, ui * 1.4);
    ctx.fillStyle = player.colors.exp_max;
    ctx.fillRect(-80 * ui, -10 * ui, 160 * ui, ui);
    ctx.fillStyle = player.colors.exp;
    ctx.fillText(`Lv: ${level} (Exp: ${Math.floor(exp)})`, - 10 * ui, -12 * ui);
    ctx.fillRect(-80 * ui, -10 * ui, ui * 160 * exp / exp_max, ui);

}

export function onResize() {
    myCanvas2D.width = window.innerWidth;
    myCanvas2D.height = window.innerHeight;
    myCanvasShadow.width = window.innerWidth;
    myCanvasShadow.height = window.innerHeight;
    player.ui = window.innerHeight / 150;

    ctxS.fillStyle = "#00000033"
    ctxS.resetTransform();
    ctxS.translate(ctxS.canvas.width / 2, ctxS.canvas.height / 2);
}

export function setTransform(dx, dy, dr) {
    if (dx != 0) {
        player.dir = dx > 0 ? 1 : -1;
    }
    if (dx != 0 || dy != 0) {
        player.step += 0.12;
        if (player.step >= 4) {
            player.step = 0;
        }

        info_dom.innerText = player.player.move_by(dx, dy);
    }
}

export function tick() {
    player.step += 0.01;
    if (player.step >= 4) {
        player.step = 0;
    }

    player.player.tick(player.world);
}

export function dash(dx, dy) {
    if (dx == 0 && dy == 0) {
        dx = player.dir;
    }
    info_dom.innerText = player.player.dash(dx, dy);
}