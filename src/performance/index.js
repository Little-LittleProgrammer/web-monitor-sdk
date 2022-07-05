import { observe_paint } from './observe-paint';
import { observe_resource } from './observe-resource';
import { observe_lcp } from './observe-lcp';
import { observe_cls } from './observe-cls';
import { observe_fid } from './observe-fid';
import { observe_api } from './observe-api';
import { config } from '../config';
import { observe_vue_router } from '../performance/observe-vue-router';

export function performance() {
    observe_paint();
    observe_resource();
    observe_lcp();
    observe_cls();
    observe_fid();
    observe_api();
    if (config.vue?.Vue && config.vue?.router) {
        observe_vue_router(config.vue.Vue, config.vue.router);
    }
}
