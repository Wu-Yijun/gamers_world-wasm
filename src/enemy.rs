use wasm_bindgen::prelude::*;

use crate::player::{self, Player};

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Enemy {
    pub x: f32,
    pub y: f32,
    pub z: f32,

    // velocity
    v: (f32, f32),

    /// type
    pub tp: i32,
    /// level
    pub lv: u32,

    pub hp: f32,
    pub max_hp: f32,
    pub sp: f32,
    pub max_sp: f32,

    atk: f32,
    def: f32,
    int: f32,

    /// 移动速度, 最大速度
    /// (速度, 加速度)
    speed: (f32, f32),
    search_range: f32,
    pub attack_range: f32,

    /// 搜索 cd
    /// (当前计时，总计时，是否发现)
    search_tick: (i32, i32, bool),
    /// 攻击 cd
    /// (当前计时，总计时，是否触发攻击)
    attack_tick: (i32, i32, bool),
    /// 仇恨记录
    /// (当前仇恨, 标记敌人阈值)
    hate: (f32, f32),
    /// (是否进入暴怒, 暴怒下阈值, 暴怒上阈值)
    anger: (bool, f32, f32),
}

#[wasm_bindgen]
impl Enemy {
    pub fn new(x: f32, y: f32, z: f32, tp: i32, lv: u32) -> Self {
        Self {
            x,
            y,
            z,
            v: (0.0, 0.0),
            tp,
            lv,
            hp: 100.0,
            max_hp: 100.0,
            sp: 50.0,
            max_sp: 50.0,
            atk: 10.0,
            def: 10.0,
            int: 10.0,
            speed: (1.0, 0.1),
            search_range: 10.0,
            attack_range: 1.3,

            search_tick: (0, 30, false),
            attack_tick: (0, 40, false),
            hate: (0.0, 1.0),
            anger: (false, 30.0, 100.0),
        }
    }

    pub fn attack(&self) -> f32 {
        self.atk
    }

    pub fn take_damage(&mut self, damage: f32) {
        self.hp -= damage;
    }

    pub fn is_dead(&self) -> bool {
        self.hp <= 0.0
    }
}

impl Enemy {
    /// 怪物索敌机制
    /// 怪物索敌全部依赖怪物对玩家的仇恨，如果没有仇恨值，则不会追踪/攻击玩家
    /// 会有一个索敌 cd ，当计时到达时:
    /// 先参考基础半径和各种系数计算索敌半径， 当距离大于半径时，仇恨逐渐减小
    /// 当距离在半径内时，根据距离及幸运等参数计算概率，当概率大于随机数时，怪物发现玩家，产生仇恨
    /// 当玩家攻击怪物时，有几率强化怪物的仇恨。
    /// （怪物优先向高仇恨的玩家移动，并攻击该玩家，当仇恨值大于阈值时，会触发暴怒状态，产生增益）
    ///
    /// search 返回值 true 表示发现玩家
    pub fn search(&mut self, dx: f32, dy: f32, dz: f32, d2: f32, p: &Player) -> bool {
        self.search_tick.0 -= 1;
        if self.search_tick.0 <= 0 {
            // 触发索敌
            // 索敌半径
            let range = self.search_range * (20.0 / (10.0 + p.dex));
            let alpha = d2 / (range * range);
            if alpha > 1.0 {
                // 当距离大于半径时，仇恨逐渐减小
                // 减小幅度与距离成正比, 且受玩家幸运值影响
                self.hate.0 -= alpha.sqrt() * (1.0 + 0.1 * p.luk) * 0.1;
            } else {
                // 当距离小于半径时
                // 如果已经被标记, 则强制增加仇恨
                if self.search_tick.2 {
                    self.hate.0 += (2.0 - alpha) * (1.0 + self.lv as f32 / p.lv as f32) * 0.1;
                } else {
                    // 如果未被标记, 则根据距离幸运等参数决定被发现的概率
                    let p0 = 1.0 - alpha / (alpha + 0.1 * p.luk);
                    let rand = js_sys::Math::random() as f32;
                    if rand < p0 {
                        // 被发现, 产生仇恨
                        self.hate.0 += (2.0 - alpha) * (1 + self.lv / p.lv) as f32 * 0.1;
                        self.search_tick.2 = true;
                    }
                }
            }
        } else {
            self.search_tick.2 = false;
        }
        // 更新 hate, anger 等状态
        // self.hate.0 = 10.0;
        self.hate_tick();

        if self.search_tick.2 {
            // 向玩家移动
            // 处理加速度
            let d1 = (dx * dx + dy * dy).sqrt();
            let vx = self.speed.0 * dx / d1;
            let vy = self.speed.0 * dy / d1;
            let dvx = vx - self.v.0;
            let dvy = vy - self.v.1;
            let dv2 = dvx * dvx + dvy * dvy;
            if dv2 <= self.speed.1 * self.speed.1 {
                // 可以直接将速度变为期望速度
                self.v.0 = vx;
                self.v.1 = vy;
            } else {
                // 需要逐渐加速
                let r = self.speed.1 / dv2.sqrt();
                self.v.0 += dvx * r;
                self.v.1 += dvy * r;
            }
            // 速度和位移
            self.x += self.v.0 * 0.05;
            self.y += self.v.1 * 0.05;
        } else {
            // 随机移动
            self.v.0 += self.speed.1 * (js_sys::Math::random() as f32 - 0.5) * 0.5;
            self.v.1 += self.speed.1 * (js_sys::Math::random() as f32 - 0.5) * 0.5;
            // 速度和位移
            self.x += self.v.0 * 0.05;
            self.y += self.v.1 * 0.05;
        }

        crate::log(&format!("distance:{}, hate:{}, anger:{}", d2.sqrt().round(), self.hate.0.round(), self.anger.0));
        // 如果标记了敌人且进入攻击范围, 触发攻击

        // // attack
        // self.attack_tick.0 -= 1;
        // if self.attack_tick.0 <= 0 {
        //     if d2 < self.attack_range * self.attack_range {
        //         // able to attack
        //         self.attack_tick.0 = self.attack_tick.1;
        //         self.attack_tick.2 = true;
        //     }
        // }
        true
    }

    /// 每一tick更新hate
    /// 当它小于等于 观测阈值时, 丢失索敌
    /// 当它大于暴怒值时, 产生暴怒效果
    /// 然后每一tick自然衰减
    pub fn hate_tick(&mut self) {
        if self.anger.0 {
            self.hate.0 *= 0.98;
            if self.hate.0 < self.anger.1 {
                // 退出暴怒状态
                self.anger.0 = false;
            }
        }
        if self.hate.0 < 0.0 {
            self.hate.0 = 0.0;
        }
        if self.hate.0 > self.anger.2 {
            // 进入暴怒
            self.anger.0 = true;
        }
        self.hate.0 *= 0.99;
        if self.hate.0 < self.hate.1 {
            self.search_tick.2 = false;
        }
    }
}
