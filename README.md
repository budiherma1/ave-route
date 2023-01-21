# aveRoute
## Router like laravel for expressjs
#Now support multiple nested grouping

Sample usage:

routes/index.js
```
const Router = require('@averoa/ave-route');
const router = Router();

// default directories for controller and middleware are 'app/Controller/' and 'app/Middleware/'
// default method for middleware is 'handle'
// you can set to another directories and method using function below
router.config({
	controller: {path: 'sample_dir/Controller/'},
	middleware: {path: 'sample_dir/sample_dir/Middleware/', method: 'handle'}
});

// router
router.get('/', 'HomeController@getData');
router.get('/aa/', 'HomeController@getData');
router.post('/middleware', 'HomeController@getData', ['AuthMiddleware', 'AuthMiddleware1']);
router.put('/about', 'HomeController@getData');

router.delete('/ab*cd', 'HomeController@getData');
router.get('/user/:address/:user_id', 'HomeController@getDataTest');
// see on https://expressjs.com/en/guide/routing.html for another variation

router.get('/user', 'HomeController@getDataTest');
router.any('/anymenthod', 'HomeController@getDataTest');
router.all('/anymenthod', 'HomeController@getDataTest');
router.match(['get', 'post'], '/multimethod', 'HomeController@getDataTest');

router.middleware(['AuthMiddleware2', 'AuthMiddleware1'], () => {
	router.prefix('middleware-prefix', () => {
		router.get('sample-route', 'HomeController@getDataTest')
	});
	router.get('/aboutmid', 'HomeController@getData');
});

router.group({ middleware: ['AuthMiddleware', 'AuthMiddleware1'], prefix: 'group-middleware-prefix' }, () => {
	router.get('/route', 'HomeController@getData');
});

router.prefix('prefix', function () {
	router.middleware(['AuthMiddleware', 'AuthMiddleware1', 'AuthMiddleware2'], function () {
		router.get('middleware-route', 'HomeController@getDataTest');
	});
});

router.get('1', 'HomeController@getDataTest');

// Original express route
router.express.get('/11', function (req, res) {
    res.send('Birds home page');
})

router.express.get('/22', function (req, res) {
    res.send('About birds');
})

module.exports = router
```

index.js
```
const express = require('express');
const app = express()
const port = 3000
const router = require('./routes/index.js');

// should be wrapped by async function
const init = async () => {

	app.use('/', await router.init())
	
	app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
	})
}

init();
```

sample Controller

```
class HomeController {

	async getDataTest(req, res) {
		res.send('hello world')
	}
	
	async getData(req, res) {
		res.send('hello world')
	}

	async real(req, res) {
		res.send('hello world')
	}

}

module.exports = new HomeController;
```

sample Middleware

```
class AuthMiddleware {
	handle (req, res, next) {
		console.log('middleware')
		next()
	}
}

module.exports = new AuthMiddleware
```