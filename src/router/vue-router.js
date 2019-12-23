import Vue from "vue";

class HistoryRoute {
  constructor() {
    this.current = null; // 存储当前的路由信息
  }
}
class VueRouter {
  constructor(options) {
    this.mode = options.mode || "hash";
    this.routes = options.routes || [];
    this.routerMaps = this.normolize(this.routes); // 序列化routes  [{path: '/home', component: Home}] =>  {'/home':  Home}  以便于之后通过路径匹配要渲染的模板
    this.history = new HistoryRoute;
    this.init();
  }
  init() {
    if (this.mode === "hash") {
      location.hash ? "" : (location.hash = "/");
      window.addEventListener("load", () => {
        this.history.current = location.hash.slice(1);  // '/home', '/index'
      });
      window.addEventListener("hashchange", () => {
        this.history.current = location.hash.slice(1);
      });
    } else {
      location.pathname ? "" : (location.pathname = "/");
      window.addEventListener("load", () => {
        this.history.current = location.pathname; // '/home', '/index'
      });
      window.addEventListener("popstate", () => {
        this.history.current = location.pathname;
      });
    }
  }
  normolize(routes) {
    return routes.reduce((prev, current) => {
      prev[current.path] = current.component;
      return prev;
    }, {});
  }
}
/**
 * 通过调用Vue.use()  方法就调用了插件的install方法
 * @param {Vue的实例} Vue 
 */
VueRouter.install = function(Vue) {
  // 通过全局的mixin  在vue实例上添加  $router   $route  并且定义router-link  router-view两个全局组件
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        this._root = this;
        this._router = this.$options.router;
        Vue.util.defineReactive(this,'xxx',this._router.history)  // vue的核心方法，用来劫持history中current变化，来set当前值
      } else {
        this._root = this.$parent._root;
      }
      Object.defineProperty(this, "$router", {
        get() {
          return this._root._router;
        }
      });

      Object.defineProperty(this, "$route", {
        get() {
          return {
            current: this._root._router.history.current
          };
        }
      });
    }
  });
  // <router-view></router-view>
  Vue.component("router-view", {
    render(h) {
        let current = this._self._root._router.history.current;
        let routerMap = this._self._root._router.routerMaps
        return h(routerMap[current]);
    }
  });
  // <router-link></router-link>
  Vue.component("router-link", {
      props: {
          to: String,
          tag: String
      },
      methods: {
        handleClick(to, mode) {
            to = mode === 'hash'? '#'+ to : to
            let a = document.createElement('a');
            a.href = to;
            a.click();
        }
      },
    render(h) {
        let mode = this._self._root._router.mode;
        let tag = this.tag;
        let to = this.to;
        return <tag on-click={this.handleClick.bind(this, to, mode)}>{this.$slots.default}</tag>;
    }
  });
};

export default VueRouter;
