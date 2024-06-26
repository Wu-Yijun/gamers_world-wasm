use wasm_bindgen::prelude::*;

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Entity {
    pub to_remove: bool,
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub e: Ent,
    pub gold: u32,
    pub exp: f32,
    pub knife: Knife,
}

impl Default for Entity {
    fn default() -> Self {
        Self {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            e: Ent::Gold,
            gold: 5,
            exp: 2.0,
            knife: Knife::default(),
            to_remove: false,
        }
    }
}

#[wasm_bindgen]
impl Entity {
    pub fn new(x: f32, y: f32, z: f32) -> Self {
        Entity {
            x,
            y,
            z,
            e: Ent::Gold,
            gold: 5,
            exp: 2.0,
            knife: Knife::default(),
            to_remove: false,
        }
    }
    pub fn get_type(&self) -> i32 {
        self.e as i32
    }
}

impl Entity {
    pub fn get_entity(&self) -> &Ent {
        &self.e
    }
}

#[wasm_bindgen]
#[repr(isize)]
#[derive(Debug, Clone, Copy, Default)]
pub enum Ent {
    NULL = 0,
    #[default]
    Gold = 1,
    Knife = 2,
}

/// 近战武器
#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Knife {
    /// 伤害, 决定攻击的基础伤害
    pub damage: f32,
    /// 重量, 决定攻击的基础速度
    /// 还会影响体力的消耗
    pub weight: f32,
    /// 攻速, 决定攻击的频率
    /// 会受灵巧的影响
    pub speed: f32,
    /// 攻击距离
    pub radius: f32,
    /// 攻击角度范围
    pub angle: f32,

    /// 近战防御的基础格挡
    pub parry: f32,
    /// 弹射物(远程)防御的基础格挡
    pub block: f32,

    /// 附魔
    pub enchant: Enchant,
}

impl Default for Knife {
    fn default() -> Self {
        Knife {
            damage: 10.0,
            weight: 1.0,
            speed: 30.0,
            radius: 2.0,
            angle: 60.0,
            parry: 5.0,
            block: 2.0,
            enchant: Default::default(),
        }
    }
}

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Enchant {
    /// 附魔效率
    pub eff: f32,
}

impl Default for Enchant {
    fn default() -> Self {
        Enchant { eff: 1.0 }
    }
}
