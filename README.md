# under construction

- controller should be placed on /app/Controller/
- middleware should be placed on /app/Middleware/

usage:
```
import aveRoute from 'ave-route'

// aveRoute
aveRoute.get('/', 'UserController@getData')
aveRoute.post('/middleware', 'UserController@getData', ['AuthMiddleware', 'AuthMiddleware1'])
aveRoute.put('/about', 'AboutController@getData')
aveRoute.delete('/ab*cd', 'AboutController@getData')
aveRoute.get('/user/:address/:user_id', 'AboutController@getDataParams')
aveRoute.get('/user', 'AboutController@getDataQuery')
aveRoute.any('/anymenthod', 'AboutController@getDataQuery')
aveRoute.match(['get', 'post'], '/multimethod', 'AboutController@getDataQuery')

aveRoute.middleware(['AuthMiddleware2', 'AuthMiddleware1', 'AuthMiddleware1'], () => {
	aveRoute.prefix('middleware-prefix', () => {
		aveRoute.get('sample-route', 'UserController@getData')
	})
	aveRoute.get('/aboutmid', 'AboutController@getData')
})
aveRoute.group({ middleware: ['AuthMiddleware', 'AuthMiddleware1'], prefix: 'group-middleware-prefix' }, () => {
	aveRoute.get('/route', 'AboutController@getData')
})

aveRoute.prefix('prefix', function () {
	aveRoute.middleware(['AuthMiddleware2', 'AuthMiddleware1', 'AuthMiddleware1'], function () {
		aveRoute.get('middleware-route', 'UserController@getData')
	})
})

aveRoute.get('1', 'UserController@getData')

// Original express route
aveRoute.Router.get('/11', function (req, res) {
    res.send('Birds home page')
})

aveRoute.Router.get('/22', function (req, res) {
    res.send('About birds')
})

export default aveRoute.Router
```