let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const CellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cell_free(ptr >>> 0));
/**
*/
export class Cell {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cell_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        const ret = wasm.__wbg_get_cell_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_cell_x(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        const ret = wasm.__wbg_get_cell_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_cell_y(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get z() {
        const ret = wasm.__wbg_get_cell_z(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set z(arg0) {
        wasm.__wbg_set_cell_z(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get r() {
        const ret = wasm.__wbg_get_cell_r(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set r(arg0) {
        wasm.__wbg_set_cell_r(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get g() {
        const ret = wasm.__wbg_get_cell_g(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set g(arg0) {
        wasm.__wbg_set_cell_g(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get b() {
        const ret = wasm.__wbg_get_cell_b(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set b(arg0) {
        wasm.__wbg_set_cell_b(this.__wbg_ptr, arg0);
    }
}

const PlayerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_player_free(ptr >>> 0));
/**
*/
export class Player {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Player.prototype);
        obj.__wbg_ptr = ptr;
        PlayerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlayerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_player_free(ptr);
    }
    /**
    * x 位置
    * @returns {number}
    */
    get x() {
        const ret = wasm.__wbg_get_player_x(this.__wbg_ptr);
        return ret;
    }
    /**
    * x 位置
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_player_x(this.__wbg_ptr, arg0);
    }
    /**
    * y 位置
    * @returns {number}
    */
    get y() {
        const ret = wasm.__wbg_get_player_y(this.__wbg_ptr);
        return ret;
    }
    /**
    * y 位置
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_player_y(this.__wbg_ptr, arg0);
    }
    /**
    * z 位置
    * @returns {number}
    */
    get z() {
        const ret = wasm.__wbg_get_player_z(this.__wbg_ptr);
        return ret;
    }
    /**
    * z 位置
    * @param {number} arg0
    */
    set z(arg0) {
        wasm.__wbg_set_player_z(this.__wbg_ptr, arg0);
    }
    /**
    * 等级
    * @returns {number}
    */
    get lv() {
        const ret = wasm.__wbg_get_player_lv(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 等级
    * @param {number} arg0
    */
    set lv(arg0) {
        wasm.__wbg_set_player_lv(this.__wbg_ptr, arg0);
    }
    /**
    * 经验值
    * @returns {number}
    */
    get exp() {
        const ret = wasm.__wbg_get_player_exp(this.__wbg_ptr);
        return ret;
    }
    /**
    * 经验值
    * @param {number} arg0
    */
    set exp(arg0) {
        wasm.__wbg_set_player_exp(this.__wbg_ptr, arg0);
    }
    /**
    * 每一级升级所需经验
    * 一般设置为 lv * 10
    * @returns {number}
    */
    get exp_max() {
        const ret = wasm.__wbg_get_player_exp_max(this.__wbg_ptr);
        return ret;
    }
    /**
    * 每一级升级所需经验
    * 一般设置为 lv * 10
    * @param {number} arg0
    */
    set exp_max(arg0) {
        wasm.__wbg_set_player_exp_max(this.__wbg_ptr, arg0);
    }
    /**
    * 金钱
    * @returns {number}
    */
    get gold() {
        const ret = wasm.__wbg_get_player_gold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 金钱
    * @param {number} arg0
    */
    set gold(arg0) {
        wasm.__wbg_set_player_gold(this.__wbg_ptr, arg0);
    }
    /**
    * 血量
    * @returns {number}
    */
    get hp() {
        const ret = wasm.__wbg_get_player_hp(this.__wbg_ptr);
        return ret;
    }
    /**
    * 血量
    * @param {number} arg0
    */
    set hp(arg0) {
        wasm.__wbg_set_player_hp(this.__wbg_ptr, arg0);
    }
    /**
    * 最大血量
    * @returns {number}
    */
    get hp_max() {
        const ret = wasm.__wbg_get_player_hp_max(this.__wbg_ptr);
        return ret;
    }
    /**
    * 最大血量
    * @param {number} arg0
    */
    set hp_max(arg0) {
        wasm.__wbg_set_player_hp_max(this.__wbg_ptr, arg0);
    }
    /**
    * 蓝量
    * @returns {number}
    */
    get mp() {
        const ret = wasm.__wbg_get_player_mp(this.__wbg_ptr);
        return ret;
    }
    /**
    * 蓝量
    * @param {number} arg0
    */
    set mp(arg0) {
        wasm.__wbg_set_player_mp(this.__wbg_ptr, arg0);
    }
    /**
    * 最大蓝量
    * @returns {number}
    */
    get mp_max() {
        const ret = wasm.__wbg_get_player_mp_max(this.__wbg_ptr);
        return ret;
    }
    /**
    * 最大蓝量
    * @param {number} arg0
    */
    set mp_max(arg0) {
        wasm.__wbg_set_player_mp_max(this.__wbg_ptr, arg0);
    }
    /**
    * 耐力
    * @returns {number}
    */
    get sp() {
        const ret = wasm.__wbg_get_player_sp(this.__wbg_ptr);
        return ret;
    }
    /**
    * 耐力
    * @param {number} arg0
    */
    set sp(arg0) {
        wasm.__wbg_set_player_sp(this.__wbg_ptr, arg0);
    }
    /**
    * 最大耐力
    * @returns {number}
    */
    get sp_max() {
        const ret = wasm.__wbg_get_player_sp_max(this.__wbg_ptr);
        return ret;
    }
    /**
    * 最大耐力
    * @param {number} arg0
    */
    set sp_max(arg0) {
        wasm.__wbg_set_player_sp_max(this.__wbg_ptr, arg0);
    }
    /**
    * 攻击力
    * 攻击时伤害加成
    * @returns {number}
    */
    get atk() {
        const ret = wasm.__wbg_get_player_atk(this.__wbg_ptr);
        return ret;
    }
    /**
    * 攻击力
    * 攻击时伤害加成
    * @param {number} arg0
    */
    set atk(arg0) {
        wasm.__wbg_set_player_atk(this.__wbg_ptr, arg0);
    }
    /**
    * 防御力
    * 受伤时减轻伤害
    * @returns {number}
    */
    get def() {
        const ret = wasm.__wbg_get_player_def(this.__wbg_ptr);
        return ret;
    }
    /**
    * 防御力
    * 受伤时减轻伤害
    * @param {number} arg0
    */
    set def(arg0) {
        wasm.__wbg_set_player_def(this.__wbg_ptr, arg0);
    }
    /**
    * 智力
    * 增强魔法伤害，增强魔法减伤，增加魔力回复速率
    * @returns {number}
    */
    get int() {
        const ret = wasm.__wbg_get_player_int(this.__wbg_ptr);
        return ret;
    }
    /**
    * 智力
    * 增强魔法伤害，增强魔法减伤，增加魔力回复速率
    * @param {number} arg0
    */
    set int(arg0) {
        wasm.__wbg_set_player_int(this.__wbg_ptr, arg0);
    }
    /**
    * 力量
    * 增加移动速度，负重，体力和血量回复速度
    * 增加攻击速度
    * @returns {number}
    */
    get str() {
        const ret = wasm.__wbg_get_player_str(this.__wbg_ptr);
        return ret;
    }
    /**
    * 力量
    * 增加移动速度，负重，体力和血量回复速度
    * 增加攻击速度
    * @param {number} arg0
    */
    set str(arg0) {
        wasm.__wbg_set_player_str(this.__wbg_ptr, arg0);
    }
    /**
    * 敏捷
    * 增加闪避率，增加暴击率
    * 增加攻击速度
    * 增加移动速度，增加闪现距离（同时增加体力消耗）
    * @returns {number}
    */
    get agi() {
        const ret = wasm.__wbg_get_player_agi(this.__wbg_ptr);
        return ret;
    }
    /**
    * 敏捷
    * 增加闪避率，增加暴击率
    * 增加攻击速度
    * 增加移动速度，增加闪现距离（同时增加体力消耗）
    * @param {number} arg0
    */
    set agi(arg0) {
        wasm.__wbg_set_player_agi(this.__wbg_ptr, arg0);
    }
    /**
    * 灵巧
    * 增加命中率，增加暴击伤害
    * 增加闪现距离（同时增加体力消耗）
    * @returns {number}
    */
    get dex() {
        const ret = wasm.__wbg_get_player_dex(this.__wbg_ptr);
        return ret;
    }
    /**
    * 灵巧
    * 增加命中率，增加暴击伤害
    * 增加闪现距离（同时增加体力消耗）
    * @param {number} arg0
    */
    set dex(arg0) {
        wasm.__wbg_set_player_dex(this.__wbg_ptr, arg0);
    }
    /**
    * 幸运
    * 增加掉落率，增加暴击率，增加抽卡命中率
    * @returns {number}
    */
    get luk() {
        const ret = wasm.__wbg_get_player_luk(this.__wbg_ptr);
        return ret;
    }
    /**
    * 幸运
    * 增加掉落率，增加暴击率，增加抽卡命中率
    * @param {number} arg0
    */
    set luk(arg0) {
        wasm.__wbg_set_player_luk(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {Player}
    */
    static new() {
        const ret = wasm.player_new();
        return Player.__wrap(ret);
    }
    /**
    * @param {World} world
    */
    tick(world) {
        _assertClass(world, World);
        wasm.player_tick(this.__wbg_ptr, world.__wbg_ptr);
    }
    /**
    * @param {number} dx
    * @param {number} dy
    * @returns {string}
    */
    move_by(dx, dy) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.player_move_by(retptr, this.__wbg_ptr, dx, dy);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {number} dir_x
    * @param {number} dir_y
    * @returns {string}
    */
    dash(dir_x, dir_y) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.player_dash(retptr, this.__wbg_ptr, dir_x, dir_y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {boolean}
    */
    is_dashing() {
        const ret = wasm.player_is_dashing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    get_dash_deg() {
        const ret = wasm.player_get_dash_deg(this.__wbg_ptr);
        return ret;
    }
}

const WorldFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_world_free(ptr >>> 0));
/**
*/
export class World {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(World.prototype);
        obj.__wbg_ptr = ptr;
        WorldFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WorldFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_world_free(ptr);
    }
    /**
    * @returns {number}
    */
    get h() {
        const ret = wasm.__wbg_get_world_h(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set h(arg0) {
        wasm.__wbg_set_world_h(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get w() {
        const ret = wasm.__wbg_get_world_w(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set w(arg0) {
        wasm.__wbg_set_world_w(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} width
    * @param {number} height
    * @returns {World}
    */
    static new(width, height) {
        const ret = wasm.world_new(width, height);
        return World.__wrap(ret);
    }
    /**
    * @param {bigint} seed
    */
    start(seed) {
        wasm.world_start(this.__wbg_ptr, seed);
    }
    /**
    * @returns {number}
    */
    get_vec() {
        const ret = wasm.world_get_vec(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get_vec_len() {
        const ret = wasm.world_get_vec_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get_indices() {
        const ret = wasm.world_get_indices(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get_indices_len() {
        const ret = wasm.world_get_indices_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} index
    * @param {Function} printfn
    */
    print(index, printfn) {
        wasm.world_print(this.__wbg_ptr, index, addHeapObject(printfn));
    }
    /**
    */
    tick() {
        wasm.world_tick(this.__wbg_ptr);
    }
    /**
    * @returns {boolean}
    */
    to_update_map() {
        const ret = wasm.world_to_update_map(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {boolean}
    */
    to_update_index() {
        const ret = wasm.world_to_update_index(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {number}
    */
    get_h(x, y) {
        const ret = wasm.world_get_h(this.__wbg_ptr, x, y);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('gamers_world_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
