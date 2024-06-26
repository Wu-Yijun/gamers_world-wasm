mod map_gen;
mod player;
mod utils;

use rand::{rngs::StdRng, Rng, SeedableRng};
use wasm_bindgen::prelude::*;

mod entity;
use entity::{Ent, Entity, Knife};
mod enemy;
use enemy::{Enemy, EnemyInfo};

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    // console log
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    /// 在屏幕上输出信息
    /// tp = 0 黑色正常字符
    /// tp = 1 蓝色,怪物扣血
    /// tp = 2 绿色, Miss
    /// tp = 3 浅红色, 正常扣血
    /// tp = 4 深红色大字, 暴击扣血
    fn addScreenValue(value: &str, x: f32, y: f32, z: f32, ticks: isize, tp: isize);
}

#[derive(Debug)]
#[wasm_bindgen]
struct Cell {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub r: f32,
    pub g: f32,
    pub b: f32,
}

#[wasm_bindgen]
pub struct World {
    pub h: usize,
    pub w: usize,
    cells: Vec<Cell>,
    indices: Vec<usize>,
    map_changed: bool,
    index_changed: bool,

    rng: StdRng,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, height: usize, seed: u64) -> Self {
        let mut rng = rand::rngs::StdRng::seed_from_u64(seed);
        let w = width;
        let h = height;
        let mut cells = Vec::new();
        for y0 in 0..(h as i32 + 1) {
            let y = (y0 - h as i32 / 2) as f32 * 0.75f32.sqrt();
            for x0 in 0..(w as i32 + 1) {
                let mut x = (x0 - w as i32 / 2) as f32;
                if y0 % 2 == 0 {
                    x -= 0.5;
                }
                // alert(&format!("x:{x},y:{y}"));
                cells.push(Cell {
                    x,
                    y,
                    z: 0.0,
                    r: 111f32,
                    g: 222f32,
                    b: 333f32,
                    // z: rng.gen_range(0.0..0.8),
                    // r: rng.gen_range(0.0..1.0),
                    // g: rng.gen_range(0.0..1.0),
                    // b: rng.gen_range(0.0..1.0),
                });
            }
        }
        let mut indices = Vec::new();
        for y in 0..h {
            for x in 0..w {
                if y % 2 == 0 {
                    indices.push(y * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x);
                    indices.push(y * (w + 1) + x + 1);
                    indices.push(y * (w + 1) + x + 1);
                    indices.push((y + 1) * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x + 1);
                } else {
                    indices.push(y * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x + 1);
                    indices.push(y * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x + 1);
                    indices.push(y * (w + 1) + x + 1);
                }
            }
        }
        Self {
            w,
            h,
            cells,
            indices,
            map_changed: false,
            index_changed: false,
            rng: rng,
        }
    }
    pub fn start(&mut self) {
        let mut mpg = map_gen::MapGen::new(self.w as f64, self.h as f64);
        mpg.gen(&mut self.rng);
        mpg.with_cell(&mut self.cells);

        self.map_changed = true;
        self.index_changed = true;

        // let w = (self.w / 3) as f32;
        // let h = (self.h / 3) as f32;
        // self.add_entity(w, h, self.get_h(w, h));
        // self.add_entity(-w, h, self.get_h(-w, h));
        // self.add_entity(w, -h, self.get_h(w, -h));
        // self.add_entity(-w, -h, self.get_h(-w, -h));
    }

    pub fn get_vec(&self) -> *const f32 {
        self.cells.as_ptr() as *const f32
    }
    pub fn get_vec_len(&self) -> usize {
        self.cells.len() * 6
    }
    pub fn get_indices(&self) -> *const usize {
        self.indices.as_ptr()
    }
    pub fn get_indices_len(&self) -> usize {
        self.indices.len()
    }
    pub fn print(&self, index: usize, printfn: js_sys::Function) {
        let this = JsValue::NULL;
        let value = JsValue::from(self.cells[index].z);
        printfn.call1(&this, &value).unwrap();
    }

    pub fn tick(
        &mut self,
        player: &mut player::Player,
        entity: &mut Entities,
        enemy: &mut Enemies,
    ) {
        // randomly generate an entity
        // let mut rng = rand::thread_rng();
        if self.rng.gen_range(0..100) < 100 {
            let x = self.rng.gen_range(-10.0..10.0) + player.x;
            let y = self.rng.gen_range(-10.0..10.0) + player.y;
            let lv = self.rng.gen_range(player.lv / 2 + 1..player.lv + 5);

            // self.add_entity(x, y, z, e);
            enemy.add_enemy(self, x, y, 1, lv);
            let x = self.rng.gen_range(-10.0..10.0) + player.x;
            let y = self.rng.gen_range(-10.0..10.0) + player.y;
            let lv = self.rng.gen_range(player.lv / 2 + 1..player.lv + 5);

            // self.add_entity(x, y, z, e);
            enemy.add_enemy(self, x, y, 1, lv);
            let x = self.rng.gen_range(-10.0..10.0) + player.x;
            let y = self.rng.gen_range(-10.0..10.0) + player.y;
            let lv = self.rng.gen_range(player.lv / 2 + 1..player.lv + 5);

            // self.add_entity(x, y, z, e);
            enemy.add_enemy(self, x, y, 1, lv);
        }

        // update entities
        entity.get().retain(|e| !e.to_remove);

        // player and mobs
        // log("player and mobs");
        let (mut distance2, mut id, mut cnt) = (100.0 * 100.0, 0, 0);
        for e in enemy.get() {
            let d2 = player.interact(e);
            e.z = self.get_h(e.x, e.y);

            if d2 < distance2 {
                id = cnt;
                distance2 = d2;
            }
            cnt += 1;
        }
        player.attack(enemy.get(), id);
        enemy.get().retain(|e| {
            if e.to_remove {
                return false;
            }
            if e.hp >= 0.0 {
                return true;
            }
            // 怪物死亡, 计算掉落物
            // 经验加 1 * lv
            // 金币加 2 * lv
            // 血量加 1.5 * lv
            player.exp += 1.0 * e.lv as f32;
            player.gold += 2 * e.lv;
            player.hp += 1.5 * e.lv as f32;
            player.hp_max += 0.5 * (e.lv as f32).sqrt();
            // 掉落金币
            let gold = Entity {
                to_remove: false,
                x: e.x,
                y: e.y,
                z: e.z,
                e: Ent::Gold,
                gold: 5 * e.lv,
                exp: 0.5 * e.lv as f32,
                knife: Knife::default(),
            };
            entity.push(gold);
            log("Kiled");
            false
        });
    }

    pub fn to_update_map(&mut self) -> bool {
        if self.map_changed {
            self.map_changed = false;
            true
        } else {
            false
        }
    }
    pub fn to_update_index(&mut self) -> bool {
        if self.index_changed {
            self.index_changed = false;
            true
        } else {
            false
        }
    }
    pub fn get_h(&self, x: f32, y: f32) -> f32 {
        let x0 = x;
        let y0 = y;
        let w = self.w as i32;
        let h = self.h as i32;
        let y = y / 0.75f32.sqrt();
        let j = y.floor() as i32 + h / 2;
        let dy = y - y.floor();
        let x = if j % 2 == 0 {
            x + 0.5 - dy / 2.0
        } else {
            x + dy / 2.0
        };
        let i = x.floor() as i32 + w / 2;
        let dx = x - x.floor();
        // alert(&format!("x0:{x0},y0:{y0},x:{},y:{},i:{},j:{},dx:{},dy:{}", x, y, i, j, dx, dy));
        if i < 0 || i >= w || j < 0 || j >= h {
            return 0.0;
        }
        if j % 2 == 0 {
            if dx + dy < 1.0 {
                // triangle 0 w 1
                self.cells[(j * (w + 1) + i) as usize].z * (1.0 - dx - dy)
                    + self.cells[((j + 1) * (w + 1) + i) as usize].z * dy
                    + self.cells[(j * (w + 1) + i + 1) as usize].z * dx
            } else {
                // triangle 1 w w+1
                self.cells[(j * (w + 1) + i + 1) as usize].z * (1.0 - dy)
                    + self.cells[((j + 1) * (w + 1) + i) as usize].z * (1.0 - dx)
                    + self.cells[((j + 1) * (w + 1) + i + 1) as usize].z * (dx + dy - 1.0)
            }
        } else {
            if dx < dy {
                // triangle 0 w w+1
                self.cells[(j * (w + 1) + i) as usize].z * (1.0 - dy)
                    + self.cells[((j + 1) * (w + 1) + i) as usize].z * (dy - dx)
                    + self.cells[((j + 1) * (w + 1) + i + 1) as usize].z * dx
            } else {
                // triangle 0 1 w+1
                self.cells[(j * (w + 1) + i) as usize].z * (1.0 - dx)
                    + self.cells[(j * (w + 1) + i + 1) as usize].z * (dx - dy)
                    + self.cells[((j + 1) * (w + 1) + i + 1) as usize].z * dy
            }
        }
    }
}

#[wasm_bindgen]
pub struct Entities(Vec<Entity>);
impl Entities {
    pub fn get(&mut self) -> &mut Vec<Entity> {
        &mut self.0
    }
    pub fn push(&mut self, e: Entity) {
        self.0.push(e);
    }
}
#[wasm_bindgen]
impl Entities {
    pub fn new() -> Self {
        Self(vec![])
    }
    pub fn get_len(&self) -> usize {
        self.0.len()
    }
    pub fn get_i(&self, index: usize) -> Entity {
        self.0[index].clone()
    }
    pub fn get_remove(&mut self, index: usize, player: &mut player::Player) -> Entity {
        let e = &mut self.0[index];
        let dx = e.x - player.x;
        let dy = e.y - player.y;
        let dz = e.z - player.z;
        if dx * dx + dy * dy + dz * dz < player.gold_attraction * player.gold_attraction {
            e.to_remove = true;
            player.gold += e.gold;
            player.exp += e.exp;
        }
        e.clone()
    }
    pub fn add_entity(&mut self, x: f32, y: f32, z: f32, e: isize) {
        let mut et = Entity::new(x, y, z);
        et.e = if e == 1 {
            entity::Ent::Gold
        } else {
            entity::Ent::Knife
        };
        self.0.push(et);
    }
}

#[wasm_bindgen]
pub struct Enemies(Vec<Enemy>);
impl Enemies {
    pub fn get(&mut self) -> &mut Vec<Enemy> {
        &mut self.0
    }
    pub fn add_enemy(&mut self, world: &mut World, x: f32, y: f32, tp: i32, lv: u32) {
        let z = world.get_h(x, y);
        let mut em = Enemy::new(x, y, z, tp, lv);
        em.atk *= world.rng.gen_range(0.8..1.2);
        em.def *= world.rng.gen_range(0.8..1.2);
        let s = em.get_speed();
        s.0 *= world.rng.gen_range(0.8..1.2);
        s.1 *= world.rng.gen_range(0.8..1.2);
        self.0.push(em);
    }
}
#[wasm_bindgen]
impl Enemies {
    pub fn new() -> Self {
        Self(vec![])
    }

    pub fn get_len(&self) -> usize {
        self.0.len()
    }
    /// NOTE: this is a copied enemy, not a reference
    pub fn get_i(&self, index: usize) -> EnemyInfo {
        self.0[index].get_info()
    }
}

// /// Represents a single entity in the game.
// /// (x, y, z, type, to_remove)
// #[wasm_bindgen]
// pub struct Entity_Represent(pub f32, pub f32, pub f32, pub isize, pub bool);

#[test]
fn test() {
    let mut wd = World::new(4, 4, 123);
    wd.start();
    let h = wd.get_h(0.0, 0.0);
}
