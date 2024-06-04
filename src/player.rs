use wasm_bindgen::prelude::*;

use crate::enemy::Enemy;

const DASHING_TICKS: usize = 5;

#[wasm_bindgen]
pub struct Player {
    /// x 位置
    pub x: f32,
    /// y 位置
    pub y: f32,
    /// z 位置
    pub z: f32,

    // /// 朝向 x 分量
    // pub dir_x: f32,
    // /// 朝向 y 分量
    // pub dir_y: f32,
    /// 等级
    pub lv: u32,
    /// 经验值
    pub exp: f32,
    /// 每一级升级所需经验
    /// 一般设置为 lv * 10
    pub exp_max: f32,
    /// 金钱
    pub gold: u32,

    /// 血量
    pub hp: f32,
    /// 最大血量
    pub hp_max: f32,
    /// 蓝量
    pub mp: f32,
    /// 最大蓝量
    pub mp_max: f32,
    /// 耐力
    pub sp: f32,
    /// 最大耐力
    pub sp_max: f32,

    /// 攻击力
    /// 攻击时伤害加成
    pub atk: f32,
    /// 防御力
    /// 受伤时减轻伤害
    pub def: f32,
    /// 智力
    /// 增强魔法伤害，增强魔法减伤，增加魔力回复速率
    pub int: f32,
    /// 力量
    /// 增加移动速度，负重，体力和血量回复速度
    /// 增加攻击速度
    pub str: f32,
    /// 敏捷
    /// 增加闪避率，增加暴击率
    /// 增加攻击速度
    /// 增加移动速度，增加闪现距离（同时增加体力消耗）
    pub agi: f32,
    /// 灵巧
    /// 增加命中率，增加暴击伤害
    /// 增加闪现距离（同时增加体力消耗）
    /// 降低被怪物发现的概率
    pub dex: f32,
    /// 幸运
    /// 增加掉落率，增加暴击率，增加抽卡命中率
    /// 降低被怪物发现的概率
    pub luk: f32,

    /// 金币吸引半径
    pub gold_attraction: f32,

    //--- Private field ---//
    /// 冲刺计数器
    dashing: (usize, f32, f32),
}

#[wasm_bindgen]
impl Player {
    pub fn new() -> Self {
        Player {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            // dir_x: 1.0,
            // dir_y: 0.0,
            lv: 1,
            exp: 0.0,
            exp_max: 10.0,
            gold: 0,
            hp: 80.0,
            hp_max: 100.0,
            mp: 80.0,
            mp_max: 100.0,
            sp: 80.0,
            sp_max: 100.0,
            atk: 10.0,
            def: 10.0,
            int: 10.0,
            str: 10.0,
            agi: 10.0,
            dex: 10.0,
            luk: 10.0,

            gold_attraction: 3.0,
            // private
            dashing: (0, 0.0, 0.0),
        }
    }

    pub fn tick(&mut self, world: &crate::World) {
        if self.dashing.0 != 0 {
            self.x += self.dashing.1;
            self.y += self.dashing.2;
            self.dashing.0 -= 1;
            if self.dashing.0 == 0 {
                self.dashing.1 = 0.0;
                self.dashing.2 = 0.0;
            }
        }
        self.z = world.get_h(self.x, self.y);

        self.hp += 0.01;
        self.mp += 0.01;
        self.sp += 0.2;
        self.exp += 0.01;

        self.clamp();
    }

    pub fn move_by(&mut self, dx: f32, dy: f32) -> String {
        let r = (0.005 * (1.0 + self.agi * 0.1 + self.str * 0.3)) as f32;
        self.x += dx * r;
        self.y += dy * r;
        format!(
            "[Move] dx: {:?}, dy: {:?} to [Pos] x:{:?}, y:{:?}",
            dx * r,
            dy * r,
            self.x,
            self.y
        )
    }

    pub fn dash(&mut self, dir_x: f32, dir_y: f32) -> String {
        let dsp = 2.0 * (1.0 + self.agi * 0.15 + self.dex * 0.1) * (self.str * 0.1 + 1.0);
        if self.sp < dsp {
            return format!("[Dash] [SP] not enough, need at least {:?}", dsp);
        }

        let r = (0.05 * (self.agi * 0.2 + self.dex * 0.1) * self.str) as f32
            / (dir_x * dir_x + dir_y * dir_y).sqrt();
        // self.x += dir_x * r;
        // self.y += dir_y * r;
        self.dashing.1 = dir_x * r;
        self.dashing.2 = dir_y * r;
        self.dashing.0 = DASHING_TICKS;

        self.sp -= dsp;
        format!(
            "[Dash] dx: {:?}, dy: {:?}, [Cost][SP] {:?}",
            dir_x * r,
            dir_y * r,
            dsp
        )
    }

    pub fn is_dashing(&self) -> bool {
        self.dashing.0 > 0
    }
    // deg to x axis
    pub fn get_dash_deg(&self) -> f32 {
        (-self.dashing.2).atan2(self.dashing.1)
    }
}

impl Player {
    fn clamp(&mut self) {
        if self.hp > self.hp_max {
            self.hp = self.hp_max;
        }
        if self.mp > self.mp_max {
            self.mp = self.mp_max;
        }
        if self.sp > self.sp_max {
            self.sp = self.sp_max;
        }
        if self.exp > self.exp_max {
            self.exp -= self.exp_max;
            self.lv += 1;
            self.exp_max = 10.0 * self.lv as f32;
        }
    }

    pub fn interact(&mut self, enemy: &mut Enemy) {
        let dx = self.x - enemy.x;
        let dy = self.y - enemy.y;
        let dz = self.z - enemy.z;
        let d2 = dx * dx + dy * dy + dz * dz;
        enemy.search(dx, dy, dz, d2, self);
    }
}
