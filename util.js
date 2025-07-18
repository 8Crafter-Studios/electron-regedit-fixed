const Q = require("q");
const debug = require("electron-regedit-fixed/debug");

/**
 *
 * @param {import('winreg').Registry} registry
 * @param {"create" | "set" | "destroy"} fn
 * @param  {...any} args
 * @returns
 */
function $call(registry, fn, ...args) {
    let deferred = Q.defer();
    registry[fn](...args, function (err) {
        if (err) {
            debug(err);
            deferred.reject(new Error(err));
        } else {
            let result = Array.prototype.splice.apply(arguments, [1]);
            deferred.resolve(...result);
        }
    });
    return deferred.promise;
}

/**
 *
 * @param {import('winreg').Registry} registry
 * @param  {...Parameters<import('winreg').Registry['create']>} args
 * @returns {Promise<void>}
 */
exports.$create = function (registry, ...args) {
    return $call(registry, "create", ...args);
};

/**
 *
 * @param {import('winreg').Registry} registry
 * @param  {...Parameters<import('winreg').Registry['set']>} args
 * @returns {Promise<void>}
 */
exports.$set = function (registry, ...args) {
    return $call(registry, "set", ...args);
};

/**
 *
 * @param {import('winreg').Registry} registry
 * @param  {...Parameters<import('winreg').Registry['destroy']>} args
 * @returns {Promise<void>}
 */
exports.$destroy = function (registry, ...args) {
    return $call(registry, "destroy", ...args);
};

