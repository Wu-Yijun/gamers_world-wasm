use std::vec;

use wasm_bindgen::prelude::*;

use crate::{Cell, World};

use rand::prelude::*;

#[derive(Debug, Clone, Default)]
struct Color(f32, f32, f32);

impl From<u32> for Color {
    fn from(hex: u32) -> Self {
        let r = ((hex >> 16) & 0xff) as f32 / 256.0;
        let g = ((hex >> 8) & 0xff) as f32 / 256.0;
        let b = (hex & 0xff) as f32 / 256.0;
        Self(r, g, b)
    }
}
impl Into<(f32, f32, f32)> for Color {
    fn into(self) -> (f32, f32, f32) {
        (self.0, self.1, self.2)
    }
}

// impl Color {
//     fn reflex(
//         &self,
//         roughness: f64,
//         (nx, ny, nz): (f64, f64, f64),
//         (lx, ly, lz): (f64, f64, f64),
//     ) -> (f32, f32, f32) {
//         let d = (nx * lx + ny * ly + nz * lz).max(0.0);
//         let dd = d.powf((1.0 - roughness) * 3.8 + 0.2);
//         let spec =
//         let d = d as f32 * 0.7 + 0.7;
//         (self.0 * d, self.1 * d, self.2 * d)
//     }
// }

#[derive(Debug, Clone, Default)]
enum Region {
    Ocean,
    Water,
    River,
    Grass,
    Bush,
    Tree,
    Soil,
    Rock,
    Highland,
    Snow,
    Ice,
    Sand,
    Mountain,
    Lava,
    #[default]
    Void,
}

impl Region {
    fn get_color(&self) -> Color {
        match self {
            Region::Ocean => 0x103893.into(),
            Region::Water => 0x006fff.into(),
            Region::River => 0x5dcafd.into(),
            Region::Grass => 0x91db39.into(),
            Region::Bush => 0x34da23.into(),
            Region::Tree => 0x04a226.into(),
            Region::Soil => 0x8a6b4b.into(),
            Region::Rock => 0x959390.into(),
            Region::Highland => 0xbb9100.into(),
            Region::Snow => 0xf8eaf8.into(),
            Region::Ice => 0x92faed.into(),
            Region::Sand => 0xfaf21e.into(),
            Region::Mountain => 0x009e77.into(),
            Region::Lava => 0xdf4718.into(),
            Region::Void => 0x580000.into(),
            _ => 0xcccccc.into(),
        }
    }
    fn get_roughness(&self) -> f32 {
        match self {
            Region::Ocean => 0.05,
            Region::Water => 0.05,
            Region::River => 0.05,
            Region::Grass => 0.3,
            Region::Bush => 0.4,
            Region::Tree => 0.5,
            Region::Soil => 0.6,
            Region::Rock => 0.7,
            Region::Highland => 0.8,
            Region::Snow => 0.2,
            Region::Ice => 0.1,
            Region::Sand => 0.5,
            Region::Mountain => 0.9,
            Region::Lava => 0.5,
            Region::Void => 0.5,
            _ => 0.5,
        }
    }
}

#[derive(Debug, Clone, Default)]
struct Point {
    pos: (f64, f64, f64),
    norm: (f64, f64, f64),
    region: Region,
}

pub struct MontainPt {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub dir: (f64, f64),
    pub sharp: (f64, f64),
    pub round: f64,
}
impl MontainPt {
    fn get_h(&self, x: f64, y: f64) -> f64 {
        let dx = self.x - x;
        let dy = self.y - y;
        let d1 = dx * self.dir.0 + dy * self.dir.1;
        let d2 = dx * self.dir.1 - dy * self.dir.0;
        let d = (self.sharp.0 * d1 * d1 + self.sharp.1 * d2 * d2).powf(self.round);
        1.0 / (1.0 + d)
    }
}

pub struct MapGen {
    x_range: (f64, f64),
    y_range: (f64, f64),

    montain_line: Vec<Vec<MontainPt>>,
    sea_line: Vec<Vec<MontainPt>>,
    sea_level: f64,
    ocean_level: f64,
    montain_level: f64,
    snow_level: f64,
}
impl MapGen {
    pub fn new(width: f64, height: f64) -> Self {
        MapGen {
            x_range: (-width / 2.0, width / 2.0),
            y_range: (-height / 2.0, height / 2.0),
            montain_line: vec![],
            sea_line: vec![],
            sea_level: 10.0,
            ocean_level: 1.0,
            montain_level: 30.0,
            snow_level: 60.0,
        }
    }

    pub fn gen(&mut self, seed: u64) {
        let mut rng = rand::rngs::StdRng::seed_from_u64(seed);
        let mt = self.gen_montain(
            &mut rng,
            GenMontainParams {
                num1: (10, 15),
                num2: (5, 15),
                z: (1.0, 2.0),
                dir: (-1.0, 1.0),
                sharp: (1.0, 50.0),
                round: (0.2, 3.0),
                // num1: (2, 3),
                // num2: (3, 20),
                // z: (10.0, 10.01),
                // dir: (-1.0, 1.0),
                // sharp: (100.0 - 0.1, 100.0),
                // round: (1.0, 1.05),
                xy_plus: (10.0, 100.0),
                z_plus: (-0.5, 0.5),
                dir_mul: (-0.2, 0.25),
                sharp_mul: (0.8, 1.25),
                round_mul: (0.9, 1.1),
                // xy_plus: (0.99, 1.0),
                // z_plus: (-0.01, 0.01),
                // dir_mul: (-0.01, 0.01),
                // sharp_mul: (0.99, 1.0),
                // round_mul: (1.0, 1.001),
            },
        );
        self.montain_line = mt;
        let mt = self.gen_montain(
            &mut rng,
            GenMontainParams {
                num1: (5, 10),
                num2: (3, 6),
                z: (-3.0, -1.0),
                dir: (-1.0, 1.0),
                sharp: (10.0, 50.0),
                round: (1.0, 3.0),

                xy_plus: (20.0, 100.0),
                z_plus: (-0.5, 0.5),
                dir_mul: (-0.2, 0.25),
                sharp_mul: (0.8, 1.25),
                round_mul: (0.9, 1.1),
            },
        );
        self.sea_line = mt;

        self.gen_sealevel(&mut rng);
    }

    pub fn with_cell(&self, cells: &mut Vec<Cell>) {
        let l = normalizef32(2.0, -5.0, 2.0); // light
        let v = normalizef32(0.0, -2.0, 3.0); // view
        let dir_s = normalizef32((l.0 + v.0) / 2.0, (l.1 + v.1) / 2.0, (l.2 + v.2) / 2.0); // spec dir
        for c in cells {
            let p = self.get_point(c.x as f64, c.y as f64);
            c.z = p.pos.2 as f32;
            // c.r = c.z / 20.0;
            let roughness = p.region.get_roughness();
            let norm = (p.norm.0 as f32, p.norm.1 as f32, p.norm.2 as f32);

            // phong-like model
            // diff: light-norm    roughness
            let diff =
                (l.0 * norm.0 + l.1 * norm.1 + l.2 * norm.2).max(0.0) * (roughness + 0.5) * 0.7
                    + 0.5;
            // spec: dir_s-norm
            let spec = (dir_s.0 * norm.0 + dir_s.1 * norm.1 + dir_s.2 * norm.2)
                .max(0.0)
                .powf(8.0 * (1.5 - roughness))
                // * 6.0
                * (1.2 - roughness);

            let color = p.region.get_color();
            c.r = color.0 * diff + spec;
            c.g = color.1 * diff + spec;
            c.b = color.2 * diff + spec;
        }
    }
}

struct GenMontainParams {
    pub num1: (usize, usize),
    pub num2: (usize, usize),
    pub z: (f64, f64),
    pub dir: (f64, f64),
    pub sharp: (f64, f64),
    pub round: (f64, f64),

    pub xy_plus: (f64, f64),
    pub z_plus: (f64, f64),
    pub dir_mul: (f64, f64),
    pub sharp_mul: (f64, f64),
    pub round_mul: (f64, f64),
}

impl MapGen {
    fn gen_montain(&self, rng: &mut StdRng, params: GenMontainParams) -> Vec<Vec<MontainPt>> {
        let mut res: Vec<_> = vec![];
        let montain_num = rng.gen_range(params.num1.0..params.num1.1);
        for _ in 0..montain_num {
            let montain = loop {
                let mut x = rng.gen_range(self.x_range.0..self.x_range.1);
                let mut y = rng.gen_range(self.y_range.0..self.y_range.1);
                let mut z = rng.gen_range(params.z.0..params.z.1);
                let mut dir: (f64, f64) = (
                    rng.gen_range(params.dir.0..params.dir.1),
                    rng.gen_range(params.dir.0..params.dir.1),
                );
                let mut sharp = (
                    1.0 / rng.gen_range(params.sharp.0..params.sharp.1),
                    1.0 / rng.gen_range(params.sharp.0..params.sharp.1),
                );
                let mut round = rng.gen_range(params.round.0..params.round.1);
                let num = rng.gen_range(params.num2.0..params.num2.1);
                let mut cnt = 0;
                let mut mt = vec![];
                for _ in 0..num {
                    // println!("dir {:?}", dir);
                    x += rng
                        .gen_range(dir.0.abs() * params.xy_plus.0..dir.0.abs() * params.xy_plus.1);
                    y += rng
                        .gen_range(dir.1.abs() * params.xy_plus.0..dir.1.abs() * params.xy_plus.1);
                    z += rng.gen_range(params.z_plus.0..params.z_plus.1);

                    let dd = (dir.0 * dir.0 + dir.1 * dir.1).sqrt();
                    dir.0 += rng.gen_range(params.dir_mul.0..params.dir_mul.1) * dd;
                    dir.1 += rng.gen_range(params.dir_mul.0..params.dir_mul.1) * dd;

                    sharp.0 *= rng.gen_range(params.sharp_mul.0..params.sharp_mul.1);
                    sharp.1 *= rng.gen_range(params.sharp_mul.0..params.sharp_mul.1);

                    round *= rng.gen_range(params.round_mul.0..params.round_mul.1);

                    let dir = dir.clone();
                    let sharp = sharp.clone();

                    if x < self.x_range.0
                        || x > self.x_range.1
                        || y < self.y_range.0
                        || y > self.y_range.1
                    {
                        cnt += 2;
                    }

                    let montain = MontainPt {
                        x,
                        y,
                        z,
                        dir,
                        sharp,
                        round,
                    };
                    mt.push(montain);
                }
                if cnt < num {
                    break mt;
                }
            };
            res.push(montain);
        }
        res
    }

    fn get_h(&self, x: f64, y: f64) -> f64 {
        let mut h = 0.0;
        for line in &self.montain_line {
            for pt in line {
                let dh = pt.get_h(x, y);
                h += pt.get_h(x, y);
            }
        }
        h
    }
    fn get_point(&self, x: f64, y: f64) -> Point {
        let z = self.get_h(x as f64, y as f64);
        let zx = self.get_h(x as f64 + 0.1, y as f64) - z;
        let zy = self.get_h(x as f64, y as f64 + 0.1) - z;
        let pos = (x, y, z - self.sea_level);
        let norm = normalizef64(-zx, -zy, 0.1f64);
        let region = if z < self.sea_level {
            if z < self.ocean_level {
                Region::Ocean
            } else {
                Region::Water
            }
        } else if z < self.montain_level {
            Region::Grass
        } else if z < self.snow_level {
            Region::Mountain
        } else {
            Region::Snow
        };
        Point { pos, norm, region }
    }

    fn gen_sealevel(&mut self, rng: &mut StdRng) {
        let num = 1000;
        let mut hs = vec![];
        for _ in 0..num {
            let x = rng.gen_range(self.x_range.0..self.x_range.1);
            let y = rng.gen_range(self.y_range.0..self.y_range.1);
            hs.push(self.get_h(x, y));
        }
        hs.sort_by(|x, y| x.total_cmp(y));
        self.sea_level = hs[300];
        self.ocean_level = hs[120];
        self.montain_level = hs[800];
        self.snow_level = hs[960];
    }
}

fn normalizef32(x: f32, y: f32, z: f32) -> (f32, f32, f32) {
    let l = (x * x + y * y + z * z).sqrt();
    (x / l, y / l, z / l)
}
fn normalizef64(x: f64, y: f64, z: f64) -> (f64, f64, f64) {
    let l = (x * x + y * y + z * z).sqrt();
    (x / l, y / l, z / l)
}

#[test]
fn test() {
    let mut wd = World::new(4, 4);
    wd.start(124);

    println!("{:#?}", wd.cells);

    // println!("{:#?}", wd.get_h(0.46, 0.0));
    // println!("{:#?}", wd.get_h(0.47, 0.0));
    // println!("{:#?}", wd.get_h(0.48, 0.0));
    // println!("{:#?}", wd.get_h(0.49, 0.0));
    // println!("{:#?}", wd.get_h(0.50, 0.0));
    // println!("{:#?}", wd.get_h(0.51, 0.0));
    // println!("{:#?}", wd.get_h(0.6, 0.0));
    // println!("{:#?}", wd.get_h(0.9, 0.0));
    // println!("{:#?}", wd.get_h(1.4, 0.0));
    println!("{:#?}", wd.get_h(-0.64, -0.82));
    println!("{:#?}", wd.get_h(-0.64, -0.84));
    println!("{:#?}", wd.get_h(-0.64, -0.86));
    println!("{:#?}", wd.get_h(-0.64, -0.865));
    println!("{:#?}", wd.get_h(-0.64, -0.87));
    println!("{:#?}", wd.get_h(-0.64, -0.875));
    println!("{:#?}", wd.get_h(-0.64, -0.88));
    println!("{:#?}", wd.get_h(-0.64, -0.90));
}
