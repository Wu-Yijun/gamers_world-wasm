/* tslint:disable */
/* eslint-disable */
/**
*/
export class Cell {
  free(): void;
/**
*/
  b: number;
/**
*/
  g: number;
/**
*/
  r: number;
/**
*/
  x: number;
/**
*/
  y: number;
/**
*/
  z: number;
}
/**
*/
export class World {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {World}
*/
  static new(width: number, height: number): World;
/**
* @param {bigint} seed
*/
  start(seed: bigint): void;
/**
* @returns {number}
*/
  get_vec(): number;
/**
* @returns {number}
*/
  get_vec_len(): number;
/**
* @returns {number}
*/
  get_indices(): number;
/**
* @returns {number}
*/
  get_indices_len(): number;
/**
* @param {number} index
* @param {Function} printfn
*/
  print(index: number, printfn: Function): void;
/**
*/
  tick(): void;
/**
* @returns {boolean}
*/
  to_update_map(): boolean;
/**
* @returns {boolean}
*/
  to_update_index(): boolean;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_h(x: number, y: number): number;
/**
*/
  h: number;
/**
*/
  w: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_cell_free: (a: number) => void;
  readonly __wbg_get_cell_x: (a: number) => number;
  readonly __wbg_set_cell_x: (a: number, b: number) => void;
  readonly __wbg_get_cell_y: (a: number) => number;
  readonly __wbg_set_cell_y: (a: number, b: number) => void;
  readonly __wbg_get_cell_z: (a: number) => number;
  readonly __wbg_set_cell_z: (a: number, b: number) => void;
  readonly __wbg_get_cell_r: (a: number) => number;
  readonly __wbg_set_cell_r: (a: number, b: number) => void;
  readonly __wbg_get_cell_g: (a: number) => number;
  readonly __wbg_set_cell_g: (a: number, b: number) => void;
  readonly __wbg_get_cell_b: (a: number) => number;
  readonly __wbg_set_cell_b: (a: number, b: number) => void;
  readonly __wbg_world_free: (a: number) => void;
  readonly __wbg_get_world_h: (a: number) => number;
  readonly __wbg_set_world_h: (a: number, b: number) => void;
  readonly __wbg_get_world_w: (a: number) => number;
  readonly __wbg_set_world_w: (a: number, b: number) => void;
  readonly world_new: (a: number, b: number) => number;
  readonly world_start: (a: number, b: number) => void;
  readonly world_get_vec: (a: number) => number;
  readonly world_get_vec_len: (a: number) => number;
  readonly world_get_indices: (a: number) => number;
  readonly world_get_indices_len: (a: number) => number;
  readonly world_print: (a: number, b: number, c: number) => void;
  readonly world_tick: (a: number) => void;
  readonly world_to_update_map: (a: number) => number;
  readonly world_to_update_index: (a: number) => number;
  readonly world_get_h: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
