import { Player } from "./gamers_world_wasm.js";

const myCanvas2D = document.getElementById('game2d');
const ctx = myCanvas2D.getContext('2d');

const info_dom = document.getElementById("info");


export const player = {
    player: new Player(),
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
    }
};


export function render(res, trans) {
    const ui = player.ui;

    // // Set up for 2D drawing
    // ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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

    // Draw the man
    ctx.resetTransform();
    if (res.man) {
        const scale = ui * 0.1 / (trans.scale + 0.05);
        ctx.translate(myCanvas2D.width / 2, myCanvas2D.height / 2);
        if (player.player.is_dashing()) {
            const imgw = 70 * scale;
            const imgh = 30 * scale;
            let ig = res.manDash;
            let deg = player.player.get_dash_deg();
            ctx.rotate(deg);
            ig && ctx.drawImage(ig, 0, -imgh / 2, imgw, imgh);
        } else {
            const imgw = 25 * scale;
            const imgh = 50 * scale;
            if (player.dir == 1) {
                ctx.scale(-1, 1);
            }
            let ig = res.man[player.step_list[Math.floor(player.step)]];
            ig && ctx.drawImage(ig, - imgw / 2, - imgh, imgw, imgh);
        }
    }

    // Restore the context to its original state
    // ctx.restore();

}

export function onResize() {
    myCanvas2D.width = window.innerWidth;
    myCanvas2D.height = window.innerHeight;
    player.ui = window.innerHeight / 150;
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