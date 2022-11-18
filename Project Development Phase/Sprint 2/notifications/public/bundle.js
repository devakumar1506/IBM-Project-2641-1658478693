
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.52.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const context = {
      subscribe: null,
      addNotification: null,
      removeNotification: null,
      clearNotifications: null,
    };

    const getNotificationsContext = () => getContext(context);

    /* src\components\Notification.svelte generated by Svelte v3.52.0 */

    function create_fragment$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*item*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: {
    				notification: /*notification*/ ctx[1],
    				withoutStyles: /*withoutStyles*/ ctx[2],
    				onRemove: /*removeNotificationHandler*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*notification*/ 2) switch_instance_changes.notification = /*notification*/ ctx[1];
    			if (dirty & /*withoutStyles*/ 4) switch_instance_changes.withoutStyles = /*withoutStyles*/ ctx[2];

    			if (switch_value !== (switch_value = /*item*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notification', slots, []);
    	let { item } = $$props;
    	let { notification = {} } = $$props;
    	let { withoutStyles = false } = $$props;
    	const { removeNotification } = getNotificationsContext();
    	const { id, removeAfter } = notification;
    	const removeNotificationHandler = () => removeNotification(id);
    	let timeout = null;

    	if (removeAfter) {
    		timeout = setTimeout(removeNotificationHandler, removeAfter);
    	}

    	onDestroy(() => {
    		if (removeAfter && timeout) clearTimeout(timeout);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<Notification> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item', 'notification', 'withoutStyles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('notification' in $$props) $$invalidate(1, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(2, withoutStyles = $$props.withoutStyles);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		getNotificationsContext,
    		item,
    		notification,
    		withoutStyles,
    		removeNotification,
    		id,
    		removeAfter,
    		removeNotificationHandler,
    		timeout
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('notification' in $$props) $$invalidate(1, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(2, withoutStyles = $$props.withoutStyles);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, notification, withoutStyles, removeNotificationHandler];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			item: 0,
    			notification: 1,
    			withoutStyles: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get item() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notification() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\components\DefaultNotification.svelte generated by Svelte v3.52.0 */
    const file$3 = "src\\components\\DefaultNotification.svelte";

    // (103:0) {#if text}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let button;
    	let t1;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			button = element("button");
    			t1 = text("×");
    			attr_dev(div0, "class", "" + (null_to_empty(/*getClass*/ ctx[2]('content')) + " svelte-ue5kxf"));
    			add_location(div0, file$3, 110, 4, 2718);
    			attr_dev(button, "class", "" + (null_to_empty(/*getClass*/ ctx[2]('button')) + " svelte-ue5kxf"));
    			attr_dev(button, "aria-label", "delete notification");
    			add_location(button, file$3, 113, 4, 2796);
    			attr_dev(div1, "class", "" + (null_to_empty(/*getClass*/ ctx[2]()) + " svelte-ue5kxf"));
    			attr_dev(div1, "role", "status");
    			attr_dev(div1, "aria-live", "polite");
    			add_location(div1, file$3, 103, 2, 2609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, button);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onRemove*/ ctx[0])) /*onRemove*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fade, {});
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(103:0) {#if text}",
    		ctx
    	});

    	return block;
    }

    // (112:12) {text}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*text*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(112:12) {text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*text*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*text*/ ctx[1]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DefaultNotification', slots, ['default']);
    	let { notification = {} } = $$props;
    	let { withoutStyles = false } = $$props;
    	let { onRemove = null } = $$props;
    	const { text, type } = notification;

    	const getClass = suffix => {
    		const defaultSuffix = suffix ? `-${suffix}` : '';
    		const defaultNotificationClass = ` default-notification-style${defaultSuffix}`;
    		const defaultNotificationType = type && !suffix ? ` default-notification-${type}` : '';
    		return `notification${defaultSuffix}${withoutStyles ? '' : defaultNotificationClass}${defaultNotificationType}`;
    	};

    	const writable_props = ['notification', 'withoutStyles', 'onRemove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DefaultNotification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('notification' in $$props) $$invalidate(3, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(4, withoutStyles = $$props.withoutStyles);
    		if ('onRemove' in $$props) $$invalidate(0, onRemove = $$props.onRemove);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		notification,
    		withoutStyles,
    		onRemove,
    		text,
    		type,
    		getClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('notification' in $$props) $$invalidate(3, notification = $$props.notification);
    		if ('withoutStyles' in $$props) $$invalidate(4, withoutStyles = $$props.withoutStyles);
    		if ('onRemove' in $$props) $$invalidate(0, onRemove = $$props.onRemove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onRemove, text, getClass, notification, withoutStyles, $$scope, slots];
    }

    class DefaultNotification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			notification: 3,
    			withoutStyles: 4,
    			onRemove: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DefaultNotification",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get notification() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onRemove() {
    		throw new Error("<DefaultNotification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRemove(value) {
    		throw new Error("<DefaultNotification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const positions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];

    const addNotification = (notification, store) => {
      if (!notification) return;

      const { update } = store;
      const safeNotification = {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 9999)}`,
        position: 'bottom-center',
        text: '',
        ...notification,
      };

      if (!positions.includes(notification.position)) return;

      update((notifications) => {
        if (safeNotification.position.includes('top-')) {
          return [safeNotification, ...notifications];
        }

        return [...notifications, safeNotification];
      });
    };

    const removeNotification = (notificationId, { update }) => {
      if (!notificationId) return;

      update((notifications) => notifications.filter(({ id }) => id !== notificationId));
    };

    const clearNotifications = (store) => store.set([]);

    const createStore = () => {
      const store = writable([]);

      return {
        subscribe: store.subscribe,
        addNotification: (notification) => addNotification(notification, store),
        removeNotification: (notificationId) => removeNotification(notificationId, store),
        clearNotifications: () => clearNotifications(store),
      };
    };

    var store = createStore();

    /* src\components\Notifications.svelte generated by Svelte v3.52.0 */
    const file$2 = "src\\components\\Notifications.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (76:8) {#if notification.position === position}
    function create_if_block$1(ctx) {
    	let notification;
    	let current;

    	notification = new Notification({
    			props: {
    				notification: /*notification*/ ctx[10],
    				withoutStyles: /*withoutStyles*/ ctx[1],
    				item: /*item*/ ctx[0] || DefaultNotification
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notification, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notification_changes = {};
    			if (dirty & /*$store*/ 8) notification_changes.notification = /*notification*/ ctx[10];
    			if (dirty & /*withoutStyles*/ 2) notification_changes.withoutStyles = /*withoutStyles*/ ctx[1];
    			if (dirty & /*item*/ 1) notification_changes.item = /*item*/ ctx[0] || DefaultNotification;
    			notification.$set(notification_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(76:8) {#if notification.position === position}",
    		ctx
    	});

    	return block;
    }

    // (75:6) {#each $store as notification (notification.id)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*notification*/ ctx[10].position === /*position*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*notification*/ ctx[10].position === /*position*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(75:6) {#each $store as notification (notification.id)}",
    		ctx
    	});

    	return block;
    }

    // (70:2) {#each positions as position}
    function create_each_block(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;
    	let each_value_1 = /*$store*/ ctx[3];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*notification*/ ctx[10].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "" + (null_to_empty(/*getClass*/ ctx[4](/*position*/ ctx[7])) + " svelte-inamvt"));
    			set_style(div, "z-index", /*zIndex*/ ctx[2]);
    			add_location(div, file$2, 70, 4, 1646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store, withoutStyles, item, DefaultNotification, positions*/ 11) {
    				each_value_1 = /*$store*/ ctx[3];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1, t, get_each_context_1);
    				check_outros();
    			}

    			if (dirty & /*zIndex*/ 4) {
    				set_style(div, "z-index", /*zIndex*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(70:2) {#each positions as position}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let each_value = positions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "notifications");
    			add_location(div, file$2, 68, 0, 1580);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*getClass, positions, zIndex, $store, withoutStyles, item, DefaultNotification*/ 31) {
    				each_value = positions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(3, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notifications', slots, ['default']);
    	let { item = null } = $$props;
    	let { withoutStyles = false } = $$props;
    	let { zIndex = null } = $$props;

    	const getClass = (position = '') => {
    		const defaultPositionClass = ` default-position-style-${position}`;
    		return `position-${position}${withoutStyles ? '' : defaultPositionClass}`;
    	};

    	setContext(context, store);
    	const writable_props = ['item', 'withoutStyles', 'zIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('withoutStyles' in $$props) $$invalidate(1, withoutStyles = $$props.withoutStyles);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		Notification,
    		DefaultNotification,
    		context,
    		store,
    		positions,
    		item,
    		withoutStyles,
    		zIndex,
    		getClass,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('withoutStyles' in $$props) $$invalidate(1, withoutStyles = $$props.withoutStyles);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, withoutStyles, zIndex, $store, getClass, $$scope, slots];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { item: 0, withoutStyles: 1, zIndex: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get item() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get withoutStyles() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set withoutStyles(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Notifications>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Notifications>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* example\CustomItem.svelte generated by Svelte v3.52.0 */
    const file$1 = "example\\CustomItem.svelte";

    // (70:10) {notification.text}
    function fallback_block(ctx) {
    	let t_value = /*notification*/ ctx[0].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*notification*/ 1 && t_value !== (t_value = /*notification*/ ctx[0].text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(70:10) {notification.text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let p;
    	let t1_value = (/*notification*/ ctx[0].description || 'Custom description') + "";
    	let t1;
    	let t2;
    	let div1;
    	let button0;
    	let t4;
    	let button1;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Action";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Close";
    			attr_dev(p, "class", "svelte-mkzgcj");
    			add_location(p, file$1, 70, 4, 1601);
    			attr_dev(div0, "class", "notification-content svelte-mkzgcj");
    			add_location(div0, file$1, 68, 2, 1523);
    			attr_dev(button0, "class", "svelte-mkzgcj");
    			add_location(button0, file$1, 73, 4, 1712);
    			attr_dev(button1, "class", "svelte-mkzgcj");
    			add_location(button1, file$1, 76, 4, 1775);
    			attr_dev(div1, "class", "notification-buttons svelte-mkzgcj");
    			add_location(div1, file$1, 72, 2, 1672);
    			attr_dev(div2, "class", "notification svelte-mkzgcj");
    			add_location(div2, file$1, 63, 0, 1463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t4);
    			append_dev(div1, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*onRemove*/ ctx[1])) /*onRemove*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*onRemove*/ ctx[1])) /*onRemove*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*notification*/ 1)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if ((!current || dirty & /*notification*/ 1) && t1_value !== (t1_value = (/*notification*/ ctx[0].description || 'Custom description') + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, fade, {});
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CustomItem', slots, ['default']);
    	let { notification } = $$props;
    	let { onRemove = null } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (notification === undefined && !('notification' in $$props || $$self.$$.bound[$$self.$$.props['notification']])) {
    			console.warn("<CustomItem> was created without expected prop 'notification'");
    		}
    	});

    	const writable_props = ['notification', 'onRemove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CustomItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    		if ('onRemove' in $$props) $$invalidate(1, onRemove = $$props.onRemove);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, notification, onRemove });

    	$$self.$inject_state = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    		if ('onRemove' in $$props) $$invalidate(1, onRemove = $$props.onRemove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [notification, onRemove, $$scope, slots];
    }

    class CustomItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { notification: 0, onRemove: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomItem",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get notification() {
    		throw new Error("<CustomItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<CustomItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onRemove() {
    		throw new Error("<CustomItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRemove(value) {
    		throw new Error("<CustomItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* example\Children.svelte generated by Svelte v3.52.0 */
    const file = "example\\Children.svelte";

    // (143:4) {#if !showCustom}
    function create_if_block(ctx) {
    	let div;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let label;
    	let t2;
    	let label_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = space();
    			label = element("label");
    			t2 = text("Show error notification");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "show-danger");
    			add_location(input, file, 144, 8, 3591);
    			attr_dev(span, "class", "toggle toggle-danger");
    			attr_dev(span, "role", "presentation");
    			add_location(span, file, 145, 8, 3667);
    			attr_dev(label, "for", "show-danger");
    			attr_dev(label, "class", label_class_value = `label-show-custom ${/*showDanger*/ ctx[4] ? 'active' : ''}`);
    			add_location(label, file, 150, 8, 3800);
    			attr_dev(div, "class", "col col-1-3 show-custom");
    			add_location(div, file, 143, 6, 3544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*showDanger*/ ctx[4];
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(div, t1);
    			append_dev(div, label);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[14]),
    					listen_dev(span, "click", /*toggleDanger*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*showDanger*/ 16) {
    				input.checked = /*showDanger*/ ctx[4];
    			}

    			if (dirty & /*showDanger*/ 16 && label_class_value !== (label_class_value = `label-show-custom ${/*showDanger*/ ctx[4] ? 'active' : ''}`)) {
    				attr_dev(label, "class", label_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(143:4) {#if !showCustom}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div10;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div7;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div6;
    	let label2;
    	let t11;
    	let div5;
    	let div3;
    	let button0;
    	let t13;
    	let button1;
    	let t15;
    	let button2;
    	let t17;
    	let div4;
    	let button3;
    	let t19;
    	let button4;
    	let t21;
    	let button5;
    	let t23;
    	let div9;
    	let div8;
    	let input2;
    	let t24;
    	let span;
    	let t25;
    	let label3;
    	let t26;
    	let label3_class_value;
    	let t27;
    	let t28;
    	let button6;
    	let t30;
    	let button7;
    	let mounted;
    	let dispose;
    	let if_block = !/*showCustom*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Notifications";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Extremely simple and flexible notifications";
    			t3 = space();
    			div7 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Message";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Remove after (ms)";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div6 = element("div");
    			label2 = element("label");
    			label2.textContent = "Position";
    			t11 = space();
    			div5 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "↖";
    			t13 = space();
    			button1 = element("button");
    			button1.textContent = "↑";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "↗";
    			t17 = space();
    			div4 = element("div");
    			button3 = element("button");
    			button3.textContent = "↙";
    			t19 = space();
    			button4 = element("button");
    			button4.textContent = "↓";
    			t21 = space();
    			button5 = element("button");
    			button5.textContent = "↘";
    			t23 = space();
    			div9 = element("div");
    			div8 = element("div");
    			input2 = element("input");
    			t24 = space();
    			span = element("span");
    			t25 = space();
    			label3 = element("label");
    			t26 = text("Show custom notification");
    			t27 = space();
    			if (if_block) if_block.c();
    			t28 = space();
    			button6 = element("button");
    			button6.textContent = "Create";
    			t30 = space();
    			button7 = element("button");
    			button7.textContent = "Clear all";
    			add_location(h1, file, 40, 4, 802);
    			add_location(p, file, 44, 4, 852);
    			attr_dev(div0, "class", "example-title");
    			add_location(div0, file, 39, 2, 769);
    			attr_dev(label0, "for", "notification-text");
    			add_location(label0, file, 48, 6, 972);
    			attr_dev(input0, "id", "notification-text");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file, 51, 6, 1044);
    			attr_dev(div1, "class", "col col-1-3");
    			add_location(div1, file, 47, 4, 939);
    			attr_dev(label1, "for", "notification-remove-after");
    			add_location(label1, file, 58, 6, 1191);
    			attr_dev(input1, "id", "notification-remove-after");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file, 61, 6, 1281);
    			attr_dev(div2, "class", "col col-1-3");
    			add_location(div2, file, 57, 4, 1158);
    			attr_dev(label2, "for", "notification-position");
    			add_location(label2, file, 68, 6, 1443);
    			attr_dev(button0, "class", "top-left");
    			attr_dev(button0, "id", "top-left");
    			toggle_class(button0, "active", /*position*/ ctx[2] === 'top-left');
    			add_location(button0, file, 73, 10, 1604);
    			attr_dev(button1, "class", "top-center");
    			attr_dev(button1, "id", "top-center");
    			toggle_class(button1, "active", /*position*/ ctx[2] === 'top-center');
    			add_location(button1, file, 81, 10, 1823);
    			attr_dev(button2, "class", "top-right");
    			attr_dev(button2, "id", "top-right");
    			toggle_class(button2, "active", /*position*/ ctx[2] === 'top-right');
    			add_location(button2, file, 89, 10, 2047);
    			attr_dev(div3, "class", "position-select-row");
    			add_location(div3, file, 72, 8, 1559);
    			attr_dev(button3, "class", "bottom-left");
    			attr_dev(button3, "id", "bottom-left");
    			toggle_class(button3, "active", /*position*/ ctx[2] === 'bottom-left');
    			add_location(button3, file, 99, 10, 2328);
    			attr_dev(button4, "class", "bottom-center");
    			attr_dev(button4, "id", "bottom-center");
    			toggle_class(button4, "active", /*position*/ ctx[2] === 'bottom-center');
    			add_location(button4, file, 107, 10, 2556);
    			attr_dev(button5, "class", "bottom-right");
    			attr_dev(button5, "id", "bottom-right");
    			toggle_class(button5, "active", /*position*/ ctx[2] === 'bottom-right');
    			add_location(button5, file, 115, 10, 2789);
    			attr_dev(div4, "class", "position-select-row");
    			add_location(div4, file, 98, 8, 2283);
    			attr_dev(div5, "class", "position-select");
    			add_location(div5, file, 71, 6, 1520);
    			attr_dev(div6, "class", "col col-1-3");
    			add_location(div6, file, 67, 4, 1410);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file, 46, 2, 916);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "show-custom");
    			add_location(input2, file, 129, 6, 3145);
    			attr_dev(span, "class", "toggle toggle-custom");
    			attr_dev(span, "role", "presentation");
    			add_location(span, file, 130, 6, 3219);
    			attr_dev(label3, "for", "show-custom");
    			attr_dev(label3, "class", label3_class_value = `label-show-custom ${/*showCustom*/ ctx[3] ? 'active' : ''}`);
    			add_location(label3, file, 135, 6, 3342);
    			attr_dev(div8, "class", "col col-1-3 show-custom");
    			add_location(div8, file, 128, 4, 3100);
    			attr_dev(div9, "class", "additional-tools");
    			add_location(div9, file, 127, 2, 3064);
    			attr_dev(button6, "class", "button");
    			attr_dev(button6, "id", "create-button");
    			add_location(button6, file, 159, 2, 4007);
    			attr_dev(button7, "class", "button secondary");
    			add_location(button7, file, 173, 2, 4303);
    			attr_dev(div10, "class", "example");
    			add_location(div10, file, 38, 0, 744);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div10, t3);
    			append_dev(div10, div7);
    			append_dev(div7, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			set_input_value(input0, /*text*/ ctx[0]);
    			append_dev(div7, t6);
    			append_dev(div7, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t8);
    			append_dev(div2, input1);
    			set_input_value(input1, /*removeAfter*/ ctx[1]);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, label2);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t13);
    			append_dev(div3, button1);
    			append_dev(div3, t15);
    			append_dev(div3, button2);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, button3);
    			append_dev(div4, t19);
    			append_dev(div4, button4);
    			append_dev(div4, t21);
    			append_dev(div4, button5);
    			append_dev(div10, t23);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, input2);
    			input2.checked = /*showCustom*/ ctx[3];
    			append_dev(div8, t24);
    			append_dev(div8, span);
    			append_dev(div8, t25);
    			append_dev(div8, label3);
    			append_dev(label3, t26);
    			append_dev(div9, t27);
    			if (if_block) if_block.m(div9, null);
    			append_dev(div10, t28);
    			append_dev(div10, button6);
    			append_dev(div10, t30);
    			append_dev(div10, button7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(button0, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(button3, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(button4, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(button5, "click", /*setPosition*/ ctx[7], false, false, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[13]),
    					listen_dev(span, "click", /*toggleCustom*/ ctx[8], false, false, false),
    					listen_dev(button6, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(button7, "click", /*click_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input0.value !== /*text*/ ctx[0]) {
    				set_input_value(input0, /*text*/ ctx[0]);
    			}

    			if (dirty & /*removeAfter*/ 2 && input1.value !== /*removeAfter*/ ctx[1]) {
    				set_input_value(input1, /*removeAfter*/ ctx[1]);
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button0, "active", /*position*/ ctx[2] === 'top-left');
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button1, "active", /*position*/ ctx[2] === 'top-center');
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button2, "active", /*position*/ ctx[2] === 'top-right');
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button3, "active", /*position*/ ctx[2] === 'bottom-left');
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button4, "active", /*position*/ ctx[2] === 'bottom-center');
    			}

    			if (dirty & /*position*/ 4) {
    				toggle_class(button5, "active", /*position*/ ctx[2] === 'bottom-right');
    			}

    			if (dirty & /*showCustom*/ 8) {
    				input2.checked = /*showCustom*/ ctx[3];
    			}

    			if (dirty & /*showCustom*/ 8 && label3_class_value !== (label3_class_value = `label-show-custom ${/*showCustom*/ ctx[3] ? 'active' : ''}`)) {
    				attr_dev(label3, "class", label3_class_value);
    			}

    			if (!/*showCustom*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div9, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Children', slots, []);

    	let { toggleItemType = () => {
    		
    	} } = $$props;

    	let text = 'Notification';
    	let removeAfter = 4000;
    	let position = 'bottom-center';
    	let showCustom = false;
    	let showDanger = false;
    	const { addNotification, clearNotifications } = getNotificationsContext();

    	const setPosition = ({ target }) => {
    		if (target && target.id) {
    			$$invalidate(2, position = target.id);
    		}
    	};

    	const toggleCustom = () => {
    		$$invalidate(3, showCustom = !showCustom);
    		if (showCustom) $$invalidate(4, showDanger = false);
    		toggleItemType();
    		clearNotifications();
    	};

    	const toggleDanger = () => {
    		$$invalidate(4, showDanger = !showDanger);
    		clearNotifications();
    	};

    	const writable_props = ['toggleItemType'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Children> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	function input1_input_handler() {
    		removeAfter = this.value;
    		$$invalidate(1, removeAfter);
    	}

    	function input2_change_handler() {
    		showCustom = this.checked;
    		$$invalidate(3, showCustom);
    	}

    	function input_change_handler() {
    		showDanger = this.checked;
    		$$invalidate(4, showDanger);
    	}

    	const click_handler = () => addNotification({
    		id: new Date().getTime(),
    		text,
    		removeAfter,
    		position,
    		type: showDanger && 'error',
    		customClass: 'default-custom-class'
    	});

    	const click_handler_1 = () => clearNotifications();

    	$$self.$$set = $$props => {
    		if ('toggleItemType' in $$props) $$invalidate(10, toggleItemType = $$props.toggleItemType);
    	};

    	$$self.$capture_state = () => ({
    		getNotificationsContext,
    		toggleItemType,
    		text,
    		removeAfter,
    		position,
    		showCustom,
    		showDanger,
    		addNotification,
    		clearNotifications,
    		setPosition,
    		toggleCustom,
    		toggleDanger
    	});

    	$$self.$inject_state = $$props => {
    		if ('toggleItemType' in $$props) $$invalidate(10, toggleItemType = $$props.toggleItemType);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('removeAfter' in $$props) $$invalidate(1, removeAfter = $$props.removeAfter);
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    		if ('showCustom' in $$props) $$invalidate(3, showCustom = $$props.showCustom);
    		if ('showDanger' in $$props) $$invalidate(4, showDanger = $$props.showDanger);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		text,
    		removeAfter,
    		position,
    		showCustom,
    		showDanger,
    		addNotification,
    		clearNotifications,
    		setPosition,
    		toggleCustom,
    		toggleDanger,
    		toggleItemType,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		input_change_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Children extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { toggleItemType: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Children",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get toggleItemType() {
    		throw new Error("<Children>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleItemType(value) {
    		throw new Error("<Children>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* example\App.svelte generated by Svelte v3.52.0 */

    // (17:0) <Notifications {item} zIndex={5000}>
    function create_default_slot(ctx) {
    	let children_1;
    	let current;

    	children_1 = new Children({
    			props: {
    				toggleItemType: /*toggleItemType*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(children_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(children_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(children_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(children_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(children_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(17:0) <Notifications {item} zIndex={5000}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let notifications;
    	let current;

    	notifications = new Notifications({
    			props: {
    				item: /*item*/ ctx[0],
    				zIndex: 5000,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const notifications_changes = {};
    			if (dirty & /*item*/ 1) notifications_changes.item = /*item*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				notifications_changes.$$scope = { dirty, ctx };
    			}

    			notifications.$set(notifications_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let item = null;

    	const toggleItemType = () => {
    		if (!item) {
    			$$invalidate(0, item = CustomItem);
    		} else {
    			$$invalidate(0, item = null);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Notifications,
    		CustomItem,
    		Children,
    		item,
    		toggleItemType
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, toggleItemType];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var index = new App({
      target: document.body,
    });

    return index;

})();
//# sourceMappingURL=bundle.js.map
