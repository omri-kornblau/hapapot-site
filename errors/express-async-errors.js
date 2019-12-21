const Layer = require('express/lib/router/layer');
const Router = require('express/lib/router')

const getLast = (arr = []) => arr[arr.length - 1];
const noop = Function.prototype;

const copyFnProps = (oldFn, newFn) => {
  Object.keys(oldFn).forEach((key) => {
    newFn[key] = oldFn[key];
  });
  return newFn;
}

const wrap = (fn, routeError) => {
  const newFn = function newFn(...args) {
    const ret = fn.apply(this, args);
    const next = (args.length === 5 ? args[2] : getLast(args)) || noop;
    if (ret && ret.catch) ret.catch(routeError(args[0], args[1], next));
    return ret;
  };
  Object.defineProperty(newFn, 'length', {
    value: fn.length,
    writable: false,
  });
  return copyFnProps(fn, newFn);
}

exports.patchRouter = (routeError) => {
  const originalParam = Router.prototype.constructor.param;
  Router.prototype.constructor.param = function param(name, fn) {
    fn = wrap(fn);
    return originalParam.call(this, name, fn);
  };

  Object.defineProperty(Layer.prototype, 'handle', {
    enumerable: true,
    get() {
      return this.__handle;
    },
    set(fn) {
      fn = wrap(fn, routeError);
      this.__handle = fn;
    },
  });
}
