/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Ent {
  NULL = 0,
  Gold = 1,
  Knife = 2,
}
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
export class Enchant {
  free(): void;
/**
* 附魔效率
*/
  eff: number;
}
/**
*/
export class Enemies {
  free(): void;
/**
* @returns {Enemies}
*/
  static new(): Enemies;
/**
* @returns {number}
*/
  get_len(): number;
/**
* NOTE: this is a copied enemy, not a reference
* @param {number} index
* @returns {Enemy}
*/
  get_i(index: number): Enemy;
}
/**
*/
export class Enemy {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} tp
* @param {number} lv
* @returns {Enemy}
*/
  static new(x: number, y: number, z: number, tp: number, lv: number): Enemy;
/**
* @returns {boolean}
*/
  is_found(): boolean;
/**
* @returns {boolean}
*/
  is_attack(): boolean;
/**
* @returns {number}
*/
  get_attacking(): number;
/**
* @returns {boolean}
*/
  is_anger(): boolean;
/**
* @returns {boolean}
*/
  is_resting(): boolean;
/**
* @returns {number}
*/
  get_resting_progress(): number;
/**
* @param {number} damage
*/
  take_damage(damage: number): void;
/**
* @returns {boolean}
*/
  is_dead(): boolean;
/**
*/
  atk: number;
/**
*/
  attack_range: number;
/**
*/
  def: number;
/**
*/
  hp: number;
/**
*/
  hp_max: number;
/**
*/
  int: number;
/**
* level
*/
  lv: number;
/**
*/
  sp: number;
/**
*/
  sp_max: number;
/**
*/
  to_remove: boolean;
/**
* type
*/
  tp: number;
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
export class Entities {
  free(): void;
/**
* @returns {Entities}
*/
  static new(): Entities;
/**
* @returns {number}
*/
  get_len(): number;
/**
* @param {number} index
* @returns {Entity}
*/
  get_i(index: number): Entity;
/**
* @param {number} index
* @param {Player} player
* @returns {Entity_Represent}
*/
  get_remove(index: number, player: Player): Entity_Represent;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @param {number} e
*/
  add_entity(x: number, y: number, z: number, e: number): void;
}
/**
*/
export class Entity {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {Entity}
*/
  static new(x: number, y: number, z: number): Entity;
/**
*/
  e: Ent;
/**
*/
  exp: number;
/**
*/
  gold: number;
/**
*/
  knife: Knife;
/**
*/
  to_remove: boolean;
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
* Represents a single entity in the game.
* (x, y, z, type, to_remove)
*/
export class Entity_Represent {
  free(): void;
/**
*/
  0: number;
/**
*/
  1: number;
/**
*/
  2: number;
/**
*/
  3: number;
/**
*/
  4: boolean;
}
/**
* 近战武器
*/
export class Knife {
  free(): void;
/**
* 攻击角度范围
*/
  angle: number;
/**
* 弹射物(远程)防御的基础格挡
*/
  block: number;
/**
* 伤害, 决定攻击的基础伤害
*/
  damage: number;
/**
* 附魔
*/
  enchant: Enchant;
/**
* 近战防御的基础格挡
*/
  parry: number;
/**
* 攻击距离
*/
  radius: number;
/**
* 攻速, 决定攻击的频率
* 会受灵巧的影响
*/
  speed: number;
/**
* 重量, 决定攻击的基础速度
* 还会影响体力的消耗
*/
  weight: number;
}
/**
*/
export class Player {
  free(): void;
/**
* @returns {Player}
*/
  static new(): Player;
/**
* @param {World} world
*/
  tick(world: World): void;
/**
* @param {number} dx
* @param {number} dy
* @returns {string}
*/
  move_by(dx: number, dy: number): string;
/**
* @param {number} dir_x
* @param {number} dir_y
* @returns {string}
*/
  dash(dir_x: number, dir_y: number): string;
/**
* @returns {boolean}
*/
  is_dashing(): boolean;
/**
* @returns {number}
*/
  get_dash_deg(): number;
/**
* @returns {number}
*/
  get_attack_prog(): number;
/**
* @returns {boolean}
*/
  is_resting(): boolean;
/**
* @returns {number}
*/
  get_resting_progress(): number;
/**
* 敏捷
* 增加闪避率，增加暴击率
* 增加攻击速度
* 增加移动速度，增加闪现距离（同时增加体力消耗）
*/
  agi: number;
/**
* 攻击力
* 攻击时伤害加成
*/
  atk: number;
/**
* 金币吸引半径
*/
  attack_range: number;
/**
* 防御力
* 受伤时减轻伤害
*/
  def: number;
/**
* 灵巧
* 增加命中率，增加暴击伤害
* 增加闪现距离（同时增加体力消耗）
* 降低被怪物发现的概率
*/
  dex: number;
/**
* 经验值
*/
  exp: number;
/**
* 每一级升级所需经验
* 一般设置为 lv * 10
*/
  exp_max: number;
/**
* 金钱
*/
  gold: number;
/**
* 金币吸引半径
*/
  gold_attraction: number;
/**
* 血量
*/
  hp: number;
/**
* 最大血量
*/
  hp_max: number;
/**
* 智力
* 增强魔法伤害，增强魔法减伤，增加魔力回复速率
*/
  int: number;
/**
* 幸运
* 增加掉落率，增加暴击率，增加抽卡命中率
* 降低被怪物发现的概率
*/
  luk: number;
/**
* 等级
*/
  lv: number;
/**
* 蓝量
*/
  mp: number;
/**
* 最大蓝量
*/
  mp_max: number;
/**
* 耐力
*/
  sp: number;
/**
* 最大耐力
*/
  sp_max: number;
/**
* 力量
* 增加移动速度，负重，体力和血量回复速度
* 增加攻击速度
*/
  str: number;
/**
* x 位置
*/
  x: number;
/**
* y 位置
*/
  y: number;
/**
* z 位置
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
* @param {bigint} seed
* @returns {World}
*/
  static new(width: number, height: number, seed: bigint): World;
/**
*/
  start(): void;
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
* @param {Player} player
* @param {Entities} entity
* @param {Enemies} enemy
*/
  tick(player: Player, entity: Entities, enemy: Enemies): void;
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
  readonly world_new: (a: number, b: number, c: number) => number;
  readonly world_start: (a: number) => void;
  readonly world_get_vec: (a: number) => number;
  readonly world_get_vec_len: (a: number) => number;
  readonly world_get_indices: (a: number) => number;
  readonly world_get_indices_len: (a: number) => number;
  readonly world_print: (a: number, b: number, c: number) => void;
  readonly world_tick: (a: number, b: number, c: number, d: number) => void;
  readonly world_to_update_map: (a: number) => number;
  readonly world_to_update_index: (a: number) => number;
  readonly world_get_h: (a: number, b: number, c: number) => number;
  readonly __wbg_entities_free: (a: number) => void;
  readonly entities_get_i: (a: number, b: number) => number;
  readonly entities_get_remove: (a: number, b: number, c: number) => number;
  readonly entities_add_entity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_enemies_free: (a: number) => void;
  readonly enemies_new: () => number;
  readonly enemies_get_len: (a: number) => number;
  readonly enemies_get_i: (a: number, b: number) => number;
  readonly __wbg_entity_represent_free: (a: number) => void;
  readonly __wbg_get_entity_represent_3: (a: number) => number;
  readonly __wbg_set_entity_represent_3: (a: number, b: number) => void;
  readonly __wbg_get_entity_represent_4: (a: number) => number;
  readonly __wbg_set_entity_represent_4: (a: number, b: number) => void;
  readonly entities_get_len: (a: number) => number;
  readonly __wbg_get_entity_represent_0: (a: number) => number;
  readonly __wbg_get_entity_represent_1: (a: number) => number;
  readonly __wbg_get_entity_represent_2: (a: number) => number;
  readonly entities_new: () => number;
  readonly __wbg_set_entity_represent_0: (a: number, b: number) => void;
  readonly __wbg_set_entity_represent_1: (a: number, b: number) => void;
  readonly __wbg_set_entity_represent_2: (a: number, b: number) => void;
  readonly __wbg_player_free: (a: number) => void;
  readonly __wbg_get_player_x: (a: number) => number;
  readonly __wbg_set_player_x: (a: number, b: number) => void;
  readonly __wbg_get_player_y: (a: number) => number;
  readonly __wbg_set_player_y: (a: number, b: number) => void;
  readonly __wbg_get_player_z: (a: number) => number;
  readonly __wbg_set_player_z: (a: number, b: number) => void;
  readonly __wbg_get_player_lv: (a: number) => number;
  readonly __wbg_set_player_lv: (a: number, b: number) => void;
  readonly __wbg_get_player_exp: (a: number) => number;
  readonly __wbg_set_player_exp: (a: number, b: number) => void;
  readonly __wbg_get_player_exp_max: (a: number) => number;
  readonly __wbg_set_player_exp_max: (a: number, b: number) => void;
  readonly __wbg_get_player_gold: (a: number) => number;
  readonly __wbg_set_player_gold: (a: number, b: number) => void;
  readonly __wbg_get_player_hp: (a: number) => number;
  readonly __wbg_set_player_hp: (a: number, b: number) => void;
  readonly __wbg_get_player_hp_max: (a: number) => number;
  readonly __wbg_set_player_hp_max: (a: number, b: number) => void;
  readonly __wbg_get_player_mp: (a: number) => number;
  readonly __wbg_set_player_mp: (a: number, b: number) => void;
  readonly __wbg_get_player_mp_max: (a: number) => number;
  readonly __wbg_set_player_mp_max: (a: number, b: number) => void;
  readonly __wbg_get_player_sp: (a: number) => number;
  readonly __wbg_set_player_sp: (a: number, b: number) => void;
  readonly __wbg_get_player_sp_max: (a: number) => number;
  readonly __wbg_set_player_sp_max: (a: number, b: number) => void;
  readonly __wbg_get_player_atk: (a: number) => number;
  readonly __wbg_set_player_atk: (a: number, b: number) => void;
  readonly __wbg_get_player_def: (a: number) => number;
  readonly __wbg_set_player_def: (a: number, b: number) => void;
  readonly __wbg_get_player_int: (a: number) => number;
  readonly __wbg_set_player_int: (a: number, b: number) => void;
  readonly __wbg_get_player_str: (a: number) => number;
  readonly __wbg_set_player_str: (a: number, b: number) => void;
  readonly __wbg_get_player_agi: (a: number) => number;
  readonly __wbg_set_player_agi: (a: number, b: number) => void;
  readonly __wbg_get_player_dex: (a: number) => number;
  readonly __wbg_set_player_dex: (a: number, b: number) => void;
  readonly __wbg_get_player_luk: (a: number) => number;
  readonly __wbg_set_player_luk: (a: number, b: number) => void;
  readonly __wbg_get_player_gold_attraction: (a: number) => number;
  readonly __wbg_set_player_gold_attraction: (a: number, b: number) => void;
  readonly __wbg_get_player_attack_range: (a: number) => number;
  readonly __wbg_set_player_attack_range: (a: number, b: number) => void;
  readonly player_new: () => number;
  readonly player_tick: (a: number, b: number) => void;
  readonly player_move_by: (a: number, b: number, c: number, d: number) => void;
  readonly player_dash: (a: number, b: number, c: number, d: number) => void;
  readonly player_is_dashing: (a: number) => number;
  readonly player_get_dash_deg: (a: number) => number;
  readonly player_get_attack_prog: (a: number) => number;
  readonly player_is_resting: (a: number) => number;
  readonly player_get_resting_progress: (a: number) => number;
  readonly __wbg_enemy_free: (a: number) => void;
  readonly __wbg_get_enemy_x: (a: number) => number;
  readonly __wbg_set_enemy_x: (a: number, b: number) => void;
  readonly __wbg_get_enemy_y: (a: number) => number;
  readonly __wbg_set_enemy_y: (a: number, b: number) => void;
  readonly __wbg_get_enemy_z: (a: number) => number;
  readonly __wbg_set_enemy_z: (a: number, b: number) => void;
  readonly __wbg_get_enemy_tp: (a: number) => number;
  readonly __wbg_set_enemy_tp: (a: number, b: number) => void;
  readonly __wbg_get_enemy_lv: (a: number) => number;
  readonly __wbg_set_enemy_lv: (a: number, b: number) => void;
  readonly __wbg_get_enemy_to_remove: (a: number) => number;
  readonly __wbg_set_enemy_to_remove: (a: number, b: number) => void;
  readonly __wbg_get_enemy_hp: (a: number) => number;
  readonly __wbg_set_enemy_hp: (a: number, b: number) => void;
  readonly __wbg_get_enemy_hp_max: (a: number) => number;
  readonly __wbg_set_enemy_hp_max: (a: number, b: number) => void;
  readonly __wbg_get_enemy_sp: (a: number) => number;
  readonly __wbg_set_enemy_sp: (a: number, b: number) => void;
  readonly __wbg_get_enemy_sp_max: (a: number) => number;
  readonly __wbg_set_enemy_sp_max: (a: number, b: number) => void;
  readonly __wbg_get_enemy_atk: (a: number) => number;
  readonly __wbg_set_enemy_atk: (a: number, b: number) => void;
  readonly __wbg_get_enemy_def: (a: number) => number;
  readonly __wbg_set_enemy_def: (a: number, b: number) => void;
  readonly __wbg_get_enemy_int: (a: number) => number;
  readonly __wbg_set_enemy_int: (a: number, b: number) => void;
  readonly __wbg_get_enemy_attack_range: (a: number) => number;
  readonly __wbg_set_enemy_attack_range: (a: number, b: number) => void;
  readonly enemy_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly enemy_is_found: (a: number) => number;
  readonly enemy_is_attack: (a: number) => number;
  readonly enemy_get_attacking: (a: number) => number;
  readonly enemy_is_anger: (a: number) => number;
  readonly enemy_is_resting: (a: number) => number;
  readonly enemy_get_resting_progress: (a: number) => number;
  readonly enemy_take_damage: (a: number, b: number) => void;
  readonly enemy_is_dead: (a: number) => number;
  readonly __wbg_entity_free: (a: number) => void;
  readonly __wbg_get_entity_to_remove: (a: number) => number;
  readonly __wbg_set_entity_to_remove: (a: number, b: number) => void;
  readonly __wbg_get_entity_x: (a: number) => number;
  readonly __wbg_set_entity_x: (a: number, b: number) => void;
  readonly __wbg_get_entity_y: (a: number) => number;
  readonly __wbg_set_entity_y: (a: number, b: number) => void;
  readonly __wbg_get_entity_z: (a: number) => number;
  readonly __wbg_set_entity_z: (a: number, b: number) => void;
  readonly __wbg_get_entity_e: (a: number) => number;
  readonly __wbg_set_entity_e: (a: number, b: number) => void;
  readonly __wbg_get_entity_gold: (a: number) => number;
  readonly __wbg_set_entity_gold: (a: number, b: number) => void;
  readonly __wbg_get_entity_exp: (a: number) => number;
  readonly __wbg_set_entity_exp: (a: number, b: number) => void;
  readonly __wbg_get_entity_knife: (a: number) => number;
  readonly __wbg_set_entity_knife: (a: number, b: number) => void;
  readonly entity_new: (a: number, b: number, c: number) => number;
  readonly __wbg_knife_free: (a: number) => void;
  readonly __wbg_get_knife_angle: (a: number) => number;
  readonly __wbg_set_knife_angle: (a: number, b: number) => void;
  readonly __wbg_get_knife_block: (a: number) => number;
  readonly __wbg_set_knife_block: (a: number, b: number) => void;
  readonly __wbg_get_knife_enchant: (a: number) => number;
  readonly __wbg_set_knife_enchant: (a: number, b: number) => void;
  readonly __wbg_enchant_free: (a: number) => void;
  readonly __wbg_get_enchant_eff: (a: number) => number;
  readonly __wbg_set_enchant_eff: (a: number, b: number) => void;
  readonly __wbg_get_knife_weight: (a: number) => number;
  readonly __wbg_get_knife_speed: (a: number) => number;
  readonly __wbg_get_knife_radius: (a: number) => number;
  readonly __wbg_get_knife_parry: (a: number) => number;
  readonly __wbg_get_knife_damage: (a: number) => number;
  readonly __wbg_set_knife_weight: (a: number, b: number) => void;
  readonly __wbg_set_knife_speed: (a: number, b: number) => void;
  readonly __wbg_set_knife_radius: (a: number, b: number) => void;
  readonly __wbg_set_knife_parry: (a: number, b: number) => void;
  readonly __wbg_set_knife_damage: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
