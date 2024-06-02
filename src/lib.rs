mod utils;
mod map_gen;

use wasm_bindgen::prelude::*;

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
struct World {
    pub h: usize,
    pub w: usize,
    cells: Vec<Cell>,
    indices: Vec<usize>,
    map_changed: bool,
    index_changed: bool,
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
                if y %2 ==0 {
                    indices.push(y * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x);
                    indices.push(y * (w + 1) + x + 1);
                    indices.push(y * (w + 1) + x + 1);
                    indices.push((y + 1) * (w + 1) + x);
                    indices.push((y + 1) * (w + 1) + x + 1);
                }else{
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
}

impl World{
    fn get_h(){
        
    }
}