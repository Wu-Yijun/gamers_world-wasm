mod map_gen;
mod player;
mod utils;

use wasm_bindgen::prelude::*;

mod entity;
use entity::Entity;
mod enemy;
use enemy::Enemy;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

// #[wasm_bindgen]
// pub fn greet(s: &str) {
//     alert(&format!("Hello, hello-wasm! {s}"));
//     panic!("Console log!");
// }

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

    entities: Vec<Entity>,
    enemies: Vec<Enemy>,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, height: usize) -> Self {
        use rand::prelude::*;
        let mut rng = rand::thread_rng();
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
                    // z: rng.gen_range(0.0..0.008),
                    z: rng.gen_range(0.0..0.8),
                    r: rng.gen_range(0.0..1.0),
                    g: rng.gen_range(0.0..1.0),
                    b: rng.gen_range(0.0..1.0),
                    // r: 111f32,
                    // g:222f32,
                    // b: 333f32,
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
            entities: Vec::new(),
            enemies: Vec::new(),
        }
    }
    pub fn start(&mut self, seed: u64) {
        let mut mpg = map_gen::MapGen::new(self.w as f64, self.h as f64);
        mpg.gen(seed);
        mpg.with_cell(&mut self.cells);

        self.map_changed = true;
        self.index_changed = true;
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

    pub fn tick(&mut self) {
        // use rand::prelude::*;
        // let mut rng = rand::thread_rng();
        // for i in 1..10000 {
        //     let index = rng.gen_range(0..self.cells.len());
        //     self.cells[index].z = rng.gen_range(0.0..0.8);
        // }
        // self.map_changed = true;
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

    pub fn add_entity(&mut self, x: f32, y: f32, z: f32) {
        self.entities.push(Entity::new(x, y, z));
    }
}
