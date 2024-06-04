/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_cell_free(a: number): void;
export function __wbg_get_cell_x(a: number): number;
export function __wbg_set_cell_x(a: number, b: number): void;
export function __wbg_get_cell_y(a: number): number;
export function __wbg_set_cell_y(a: number, b: number): void;
export function __wbg_get_cell_z(a: number): number;
export function __wbg_set_cell_z(a: number, b: number): void;
export function __wbg_get_cell_r(a: number): number;
export function __wbg_set_cell_r(a: number, b: number): void;
export function __wbg_get_cell_g(a: number): number;
export function __wbg_set_cell_g(a: number, b: number): void;
export function __wbg_get_cell_b(a: number): number;
export function __wbg_set_cell_b(a: number, b: number): void;
export function __wbg_world_free(a: number): void;
export function __wbg_get_world_h(a: number): number;
export function __wbg_set_world_h(a: number, b: number): void;
export function __wbg_get_world_w(a: number): number;
export function __wbg_set_world_w(a: number, b: number): void;
export function world_new(a: number, b: number, c: number): number;
export function world_start(a: number): void;
export function world_get_vec(a: number): number;
export function world_get_vec_len(a: number): number;
export function world_get_indices(a: number): number;
export function world_get_indices_len(a: number): number;
export function world_print(a: number, b: number, c: number): void;
export function world_tick(a: number, b: number, c: number, d: number): void;
export function world_to_update_map(a: number): number;
export function world_to_update_index(a: number): number;
export function world_get_h(a: number, b: number, c: number): number;
export function __wbg_entities_free(a: number): void;
export function entities_get_i(a: number, b: number): number;
export function entities_get_remove(a: number, b: number, c: number): number;
export function entities_add_entity(a: number, b: number, c: number, d: number, e: number): void;
export function __wbg_enemies_free(a: number): void;
export function enemies_new(): number;
export function enemies_get_len(a: number): number;
export function enemies_get_i(a: number, b: number): number;
export function __wbg_entity_represent_free(a: number): void;
export function __wbg_get_entity_represent_3(a: number): number;
export function __wbg_set_entity_represent_3(a: number, b: number): void;
export function __wbg_get_entity_represent_4(a: number): number;
export function __wbg_set_entity_represent_4(a: number, b: number): void;
export function entities_get_len(a: number): number;
export function __wbg_get_entity_represent_0(a: number): number;
export function __wbg_get_entity_represent_1(a: number): number;
export function __wbg_get_entity_represent_2(a: number): number;
export function entities_new(): number;
export function __wbg_set_entity_represent_0(a: number, b: number): void;
export function __wbg_set_entity_represent_1(a: number, b: number): void;
export function __wbg_set_entity_represent_2(a: number, b: number): void;
export function __wbg_player_free(a: number): void;
export function __wbg_get_player_x(a: number): number;
export function __wbg_set_player_x(a: number, b: number): void;
export function __wbg_get_player_y(a: number): number;
export function __wbg_set_player_y(a: number, b: number): void;
export function __wbg_get_player_z(a: number): number;
export function __wbg_set_player_z(a: number, b: number): void;
export function __wbg_get_player_lv(a: number): number;
export function __wbg_set_player_lv(a: number, b: number): void;
export function __wbg_get_player_exp(a: number): number;
export function __wbg_set_player_exp(a: number, b: number): void;
export function __wbg_get_player_exp_max(a: number): number;
export function __wbg_set_player_exp_max(a: number, b: number): void;
export function __wbg_get_player_gold(a: number): number;
export function __wbg_set_player_gold(a: number, b: number): void;
export function __wbg_get_player_hp(a: number): number;
export function __wbg_set_player_hp(a: number, b: number): void;
export function __wbg_get_player_hp_max(a: number): number;
export function __wbg_set_player_hp_max(a: number, b: number): void;
export function __wbg_get_player_mp(a: number): number;
export function __wbg_set_player_mp(a: number, b: number): void;
export function __wbg_get_player_mp_max(a: number): number;
export function __wbg_set_player_mp_max(a: number, b: number): void;
export function __wbg_get_player_sp(a: number): number;
export function __wbg_set_player_sp(a: number, b: number): void;
export function __wbg_get_player_sp_max(a: number): number;
export function __wbg_set_player_sp_max(a: number, b: number): void;
export function __wbg_get_player_atk(a: number): number;
export function __wbg_set_player_atk(a: number, b: number): void;
export function __wbg_get_player_def(a: number): number;
export function __wbg_set_player_def(a: number, b: number): void;
export function __wbg_get_player_int(a: number): number;
export function __wbg_set_player_int(a: number, b: number): void;
export function __wbg_get_player_str(a: number): number;
export function __wbg_set_player_str(a: number, b: number): void;
export function __wbg_get_player_agi(a: number): number;
export function __wbg_set_player_agi(a: number, b: number): void;
export function __wbg_get_player_dex(a: number): number;
export function __wbg_set_player_dex(a: number, b: number): void;
export function __wbg_get_player_luk(a: number): number;
export function __wbg_set_player_luk(a: number, b: number): void;
export function __wbg_get_player_gold_attraction(a: number): number;
export function __wbg_set_player_gold_attraction(a: number, b: number): void;
export function __wbg_get_player_attack_range(a: number): number;
export function __wbg_set_player_attack_range(a: number, b: number): void;
export function player_new(): number;
export function player_tick(a: number, b: number): void;
export function player_move_by(a: number, b: number, c: number, d: number): void;
export function player_dash(a: number, b: number, c: number, d: number): void;
export function player_is_dashing(a: number): number;
export function player_get_dash_deg(a: number): number;
export function player_get_attack_prog(a: number): number;
export function player_is_resting(a: number): number;
export function player_get_resting_progress(a: number): number;
export function __wbg_enemy_free(a: number): void;
export function __wbg_get_enemy_x(a: number): number;
export function __wbg_set_enemy_x(a: number, b: number): void;
export function __wbg_get_enemy_y(a: number): number;
export function __wbg_set_enemy_y(a: number, b: number): void;
export function __wbg_get_enemy_z(a: number): number;
export function __wbg_set_enemy_z(a: number, b: number): void;
export function __wbg_get_enemy_tp(a: number): number;
export function __wbg_set_enemy_tp(a: number, b: number): void;
export function __wbg_get_enemy_lv(a: number): number;
export function __wbg_set_enemy_lv(a: number, b: number): void;
export function __wbg_get_enemy_to_remove(a: number): number;
export function __wbg_set_enemy_to_remove(a: number, b: number): void;
export function __wbg_get_enemy_hp(a: number): number;
export function __wbg_set_enemy_hp(a: number, b: number): void;
export function __wbg_get_enemy_hp_max(a: number): number;
export function __wbg_set_enemy_hp_max(a: number, b: number): void;
export function __wbg_get_enemy_sp(a: number): number;
export function __wbg_set_enemy_sp(a: number, b: number): void;
export function __wbg_get_enemy_sp_max(a: number): number;
export function __wbg_set_enemy_sp_max(a: number, b: number): void;
export function __wbg_get_enemy_atk(a: number): number;
export function __wbg_set_enemy_atk(a: number, b: number): void;
export function __wbg_get_enemy_def(a: number): number;
export function __wbg_set_enemy_def(a: number, b: number): void;
export function __wbg_get_enemy_int(a: number): number;
export function __wbg_set_enemy_int(a: number, b: number): void;
export function __wbg_get_enemy_attack_range(a: number): number;
export function __wbg_set_enemy_attack_range(a: number, b: number): void;
export function enemy_new(a: number, b: number, c: number, d: number, e: number): number;
export function enemy_is_found(a: number): number;
export function enemy_is_attack(a: number): number;
export function enemy_get_attacking(a: number): number;
export function enemy_is_anger(a: number): number;
export function enemy_is_resting(a: number): number;
export function enemy_get_resting_progress(a: number): number;
export function enemy_take_damage(a: number, b: number): void;
export function enemy_is_dead(a: number): number;
export function __wbg_entity_free(a: number): void;
export function __wbg_get_entity_to_remove(a: number): number;
export function __wbg_set_entity_to_remove(a: number, b: number): void;
export function __wbg_get_entity_x(a: number): number;
export function __wbg_set_entity_x(a: number, b: number): void;
export function __wbg_get_entity_y(a: number): number;
export function __wbg_set_entity_y(a: number, b: number): void;
export function __wbg_get_entity_z(a: number): number;
export function __wbg_set_entity_z(a: number, b: number): void;
export function __wbg_get_entity_e(a: number): number;
export function __wbg_set_entity_e(a: number, b: number): void;
export function __wbg_get_entity_gold(a: number): number;
export function __wbg_set_entity_gold(a: number, b: number): void;
export function __wbg_get_entity_exp(a: number): number;
export function __wbg_set_entity_exp(a: number, b: number): void;
export function __wbg_get_entity_knife(a: number): number;
export function __wbg_set_entity_knife(a: number, b: number): void;
export function entity_new(a: number, b: number, c: number): number;
export function __wbg_knife_free(a: number): void;
export function __wbg_get_knife_angle(a: number): number;
export function __wbg_set_knife_angle(a: number, b: number): void;
export function __wbg_get_knife_block(a: number): number;
export function __wbg_set_knife_block(a: number, b: number): void;
export function __wbg_get_knife_enchant(a: number): number;
export function __wbg_set_knife_enchant(a: number, b: number): void;
export function __wbg_enchant_free(a: number): void;
export function __wbg_get_enchant_eff(a: number): number;
export function __wbg_set_enchant_eff(a: number, b: number): void;
export function __wbg_get_knife_weight(a: number): number;
export function __wbg_get_knife_speed(a: number): number;
export function __wbg_get_knife_radius(a: number): number;
export function __wbg_get_knife_parry(a: number): number;
export function __wbg_get_knife_damage(a: number): number;
export function __wbg_set_knife_weight(a: number, b: number): void;
export function __wbg_set_knife_speed(a: number, b: number): void;
export function __wbg_set_knife_radius(a: number, b: number): void;
export function __wbg_set_knife_parry(a: number, b: number): void;
export function __wbg_set_knife_damage(a: number, b: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
export function __wbindgen_exn_store(a: number): void;
