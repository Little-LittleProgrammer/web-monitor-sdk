import { deep_copy } from './tools';

let cache = [];

export function get_cache() {
    return deep_copy(cache);
}

export function add_cache(data) {
    cache.push(data);
}

export function clear_cache() {
    cache = [];
}
