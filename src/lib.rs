mod map_gen;
mod player;
mod utils;

use rand::{rngs::StdRng, Rng, SeedableRng};
use wasm_bindgen::prelude::*;

mod entity;
use entity::Entity;
mod enemy;
use enemy::Enemy;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    // console log
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
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
        // if self.rng.gen_range(0..100) < 0 {
        //     let x = (self.w - 1) as f32 / 4.0;
        //     let y = (self.h - 1) as f32 / 4.0;
        //     let x = self.rng.gen_range(-x..x);
        //     let y = self.rng.gen_range(-y..y);

        //     // self.add_entity(x, y, z, e);
        //     enemy.add_enemy(self, x, y, 1);
        // }

        // update entities
        entity.get().retain(|e| !e.to_remove);

        // player and mobs
        log("player and mobs");
        for e in enemy.get() {
            player.interact(e);
            e.z = self.get_h(e.x, e.y)
        }
        enemy.get().retain(|e| e.hp >= 0.0);
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
}
#[wasm_bindgen]
impl Entities {
    pub fn new()->Self{
        Self(vec![])
    }
    pub fn get_len(&self) -> usize {
        self.0.len()
    }
    pub fn get_i(&self, index: usize) -> Entity {
        self.0[index].clone()
    }
    pub fn get_remove(&mut self, index: usize, player: &mut player::Player) -> Entity_Represent {
        let e = &mut self.0[index];
        let dx = e.x - player.x;
        let dy = e.y - player.y;
        let dz = e.z - player.z;
        if dx * dx + dy * dy + dz * dz < player.gold_attraction * player.gold_attraction {
            e.to_remove = true;
            player.gold += e.gold;
            player.exp += e.exp;
        }
        Entity_Represent(e.x, e.y, e.z, e.e as isize, e.to_remove)
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
}
#[wasm_bindgen]
impl Enemies {
    pub fn new()->Self{
        Self(vec![])
    }
    pub fn add_enemy(&mut self, world: &World, x: f32, y: f32, tp: i32, lv: u32) {
        let z = world.get_h(x, y);
        let mut em = Enemy::new(x, y, z, tp, lv);
        self.0.push(em);
    }
    pub fn get_len(&self) -> usize {
        self.0.len()
    }
    /// NOTE: this is a copied enemy, not a reference
    pub fn get_i(&self, index: usize) -> Enemy {
        self.0[index]
    }
}

/// Represents a single entity in the game.
/// (x, y, z, type, to_remove)
#[wasm_bindgen]
pub struct Entity_Represent(pub f32, pub f32, pub f32, pub isize, pub bool);

#[test]
fn test() {
    let mut wd = World::new(4, 4, 123);
    wd.start();
    let h = wd.get_h(0.0, 0.0);
}
