
const express = require('express')

class aveRoute {

	constructor() {
		this.c_path = "/app/Controllers/";
		this.m_path = "/app/Middleware/";
		this.mod_path = "/app/Models/";
		this.m_met = "handle";
		this.router = express.Router();
		this.mid = [];
		this.importControllers = {};
		this.importMiddlewares = {};
		this.allRoutes = [];
	}

	static Router() {
		return new this;
	}

	config({ controller, middleware }) {
		this.c_path = controller.path ? ('/' + controller.path + '/').replace('//', '/') : this.c_path;
		this.m_path = middleware.path ? ('/' + middleware.path + '/').replace('//', '/') : this.m_path;
		this.m_met = middleware.method ? middleware.method : this.m_met;
	}

	async express() {
		return this.router;
	}
	get(pt, ct, mid) {
		return this.proceed('get', pt, ct, mid);
	}

	post(pt, ct, mid) {
		return this.proceed('post', pt, ct, mid);
	}

	put(pt, ct, mid) {
		return this.proceed('put', pt, ct, mid);
	}

	delete(pt, ct, mid) {
		return this.proceed('delete', pt, ct, mid);
	}

	patch(pt, ct, mid) {
		return this.proceed('patch', pt, ct, mid);
	}

	match(rt, pt, ct, mid) {
		for (let i of rt) {
			this.proceed(i, pt, ct, mid);
		}
	}

	any(pt, ct, mid) {
		this.proceed('get', pt, ct, mid);
		this.proceed('post', pt, ct, mid);
		this.proceed('put', pt, ct, mid);
		this.proceed('delete', pt, ct, mid);
		this.proceed('patch', pt, ct, mid);
	}

	all(pt, ct, mid) {
		this.proceed('all', pt, ct, mid);
	}

	middleware(mid = [], cb) {
		this.mid = [...this.mid, ...mid];
		cb();
		this.mid = this.mid.filter(function (item) {
			return !(mid.includes(item))
		});
	}

	prefix(pref, cb) {
		let filteredPref = ('/' + pref).replace('//', '/');
		this.pref = (this.pref ?? '') + filteredPref;
		cb();
		this.pref = this.pref.replace(filteredPref, '');
	}

	group({ middleware, prefix }, cb) {
		let filteredPref = '';
		if (middleware) {
			this.mid = [...this.mid, ...middleware];
		}
		if (prefix) {
			filteredPref = ('/' + prefix).replace('//', '/');
			this.pref = (this.pref ?? '') + filteredPref;
		}

		cb();

		if (middleware) {
			this.mid = this.mid.filter(function (item) {
				return !(middleware.includes(item))
			});
		}
		if (prefix) {
			this.pref = this.pref.replace(filteredPref, '');
		}
	}

	proceed(ty, pt, ct, mid) {
		let p = ('/' + pt).replace('//', '/');
		let ctm = ct.split('@');
		let pref = this.pref ?? '';

		if (this.mid.length) {
			mid = this.mid;
		}

		this.importControllers[ctm[0]] = `./../../..${this.c_path}${ctm[0]}.js`;

		let midn = "";

		if (mid) {
			midn = `[`;

			for (let a in mid) {
				this.importMiddlewares[mid[a]] = `./../../..${this.m_path}${mid[a]}.js`;
				midn += ` (req, res, next) => middleware.${mid[a]}.${this.m_met}(req, res, next),`;
			}
			midn += "], ";
		}

		let route = `this.router.${ty}('${pref}${p}',${mid ? midn : ''} controller.${ctm[0]}.${ctm[1]})`;
		this.allRoutes.push(route);
	}

	async init() {
		let controller = {}
		let middleware = {}
		for (let key in this.importControllers) {
			controller[key] = (await import(this.importControllers[key])).default
		}
		for (let key1 in this.importMiddlewares) {
			middleware[key1] = (await import(this.importMiddlewares[key1])).default
		}

		Promise.all(this.allRoutes.map((v, i) => {
			return eval(v);
		}))

		return this.router;
	}
}

module.exports = aveRoute.Router.bind(aveRoute);