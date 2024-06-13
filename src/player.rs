use wasm_bindgen::prelude::*;

use crate::{alert, enemy::Enemy};

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
    /// 金币吸引半径
    pub attack_range: f32,
    attack_tick: (f32, f32),
    resting_tick: (f32, f32, bool),

    //--- Private field ---//
    /// 冲刺计数器
    dashing: (usize, f32, f32),
    // /// 武器列表
    // w
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
            def: 6.0,
            int: 8.0,
            str: 9.0,
            agi: 11.0,
            dex: 10.0,
            luk: 10.0,

            gold_attraction: 5.0,
            attack_range: 3.50,
            attack_tick: (0.0, 20.0),
            resting_tick: (0.0, 300.0, false),
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

        if self.resting_tick.2 {
            self.resting_tick.0 -= 1.0;
            if self.resting_tick.0 <= 0.0 {
                self.sp = self.sp_max * 0.8;
                self.resting_tick.2 = false;
            }
        } else {
            self.hp += 0.01;
            self.mp += 0.01;
            self.sp += 0.1;
            self.exp += 0.01;
            if self.sp < 0.0 {
                // 被击破, 损失 10 的血量
                // 5 秒内攻击频率减半,
                // 不能瞬移, 且移动速度减半
                // 之后恢复 80% 的 sp
                self.resting_tick.2 = true;
                self.resting_tick.0 = self.resting_tick.1;
                self.hp -= self.hp_max * 0.1;
            }
        }

        if self.hp < 0.0 {
            // alert("You died!");
            self.hp = 0.2 * self.hp_max;
        }

        self.clamp();
    }

    pub fn move_by(&mut self, dx: f32, dy: f32) -> String {
        let r = (0.007 * (1.0 + self.agi * 0.1 + self.str * 0.3)) as f32;
        if self.is_resting() {
            self.x += dx * r * 0.6;
            self.y += dy * r * 0.6;
        } else {
            self.x += dx * r;
            self.y += dy * r;
        }
        format!(
            "[Move] dx: {:?}, dy: {:?} to [Pos] x:{:?}, y:{:?}",
            dx * r,
            dy * r,
            self.x,
            self.y
        )
    }

    pub fn dash(&mut self, dir_x: f32, dir_y: f32) -> String {
        if self.is_resting() {
            return format!(
                "You can not dash with 0 sp. Restoring time: {}",
                (self.resting_tick.0 / 60.0).round()
            );
        }
        let dsp = 2.0 * (1.0 + self.agi * 0.15 + self.dex * 0.1) * (self.str * 0.1 + 1.0);
        if self.sp < dsp * 2.0 {
            return format!("[Dash] [SP] not enough, need at least {:?}", dsp * 2.0);
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

    pub fn get_attack_prog(&self) -> f32 {
        self.attack_tick.0 as f32 / self.attack_tick.1 as f32
    }
    pub fn is_resting(&self) -> bool {
        self.resting_tick.2
    }
    pub fn get_resting_progress(&self) -> f32 {
        self.resting_tick.0 as f32 / self.resting_tick.1 as f32
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

    pub fn interact(&mut self, enemy: &mut Enemy) -> f32 {
        let dx = self.x - enemy.x;
        let dy = self.y - enemy.y;
        let dz = self.z - enemy.z;
        let d2 = dx * dx + dy * dy + dz * dz;
        if d2 > 50.0 * 50.0 {
            enemy.to_remove = true;
            return d2;
        }
        enemy.search(dx, dy, dz, d2, self);
        if enemy.is_attack() && !self.is_dashing() {
            // 依等级差和幸运/敏捷等参数计算是否可以闪避
            let mut miss = 0.1 * 0.8f32.powf(enemy.lv as f32 + 1.0 - self.lv as f32).min(9.0);
            miss = 1.0 - (1.0 - miss) / (1.0 + self.luk * 0.01) / (1.0 + self.agi * 0.005);
            if (self.sp as u32) < enemy.lv || rand::random::<f32>() > miss {
                let mut is_crit = false;
                // 没有闪掉, 开始计算伤害
                // 有最小一点基础伤害, 暴怒时伤害翻倍
                let mut damage = (enemy.atk - self.def).max(1.0);
                damage *= if enemy.is_anger() { 2.0 } else { 1.0 };
                // 有一定几率暴击, 与等级差, 幸运, 灵巧有关
                let mut crit = 0.1 * 0.6f32.powf(self.lv as f32 - 1.0 - enemy.lv as f32).min(5.0);
                crit /= (1.0 + self.luk * 0.1 + self.dex * 0.05);
                if rand::random::<f32>() < crit {
                    // 暴击伤害增加与力量与防御力有关
                    damage *= 1.0 + 4.0 / (1.0 + self.str * 0.1) / (1.0 + self.def * 0.1);
                    // 消减大量sp
                    self.sp = (self.sp - damage * 0.8).max(0.0);
                    is_crit = true;
                }
                // 根据当前的 sp 决定减伤大小, 不低于 1
                damage = (damage - (1.0 + self.def * 0.1) * (0.2 + self.sp * 0.05)).max(1.0);
                // 根据等级之比决定伤害倍率
                damage *= (enemy.lv as f32 / self.lv as f32).sqrt();
                self.hp -= damage;
                self.sp -= damage * 0.4;

                crate::addScreenValue(
                    &format!("{:.1?}", damage),
                    (self.x + enemy.x) * 0.5,
                    (self.y + enemy.y) * 0.5,
                    (self.z + enemy.z) * 0.5,
                    15,
                    if is_crit { 4 } else { 3 },
                );
            } else {
                // 闪掉了攻击
                self.sp -= (enemy.lv as f32).sqrt();
                // 对方 sp 减少
                enemy.sp -= (enemy.lv as f32).sqrt() / 2.0 + (self.lv as f32).sqrt() + 5.0;

                crate::addScreenValue("Miss", self.x, self.y, self.z, 10, 2);
            }
        }
        return d2;
    }

    pub fn attack(&mut self, enemies: &mut Vec<Enemy>, id: usize) {
        self.attack_tick.0 -= if self.is_resting() { 0.5 } else { 1.0 };
        if id >= enemies.len() || self.is_dashing() {
            return;
        }
        let target = &mut enemies[id];
        // 近战
        let dx = self.x - target.x;
        let dy = self.y - target.y;
        // let dir =
        if dx * dx + dy * dy < self.attack_range * self.attack_range {
            if self.attack_tick.0 <= 0.0 {
                self.attack_tick.0 = self.attack_tick.1;
                // able to attack
                for e in enemies {
                    let dx = self.x - e.x;
                    let dy = self.y - e.y;
                    if dx * dx + dy * dy < self.attack_range * self.attack_range {
                        // e.hp -= 4.0 * ((self.lv as f32 + 5.0) / (e.lv as f32 + 7.0));
                        e.take_damage(4.0 * ((self.lv as f32 + 5.0) / (e.lv as f32 + 7.0)));
                        e.sp -= 6.0 * ((self.lv as f32 + 5.0) / (e.lv as f32 + 7.0));
                        e.add_hate(15.0);
                    }
                }
            }
        }
    }
}
