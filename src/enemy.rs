use wasm_bindgen::prelude::*;

// #[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Enemy {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}
