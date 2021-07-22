const { createReadStream } = require('fs');
const Koa = require('koa');
var Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser')
var session = require('koa-session');


const PORT = '1337';
const router = new Router();
const server = new Koa();
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) cookie 的Name */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000, /** cookie 的过期时间 */
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  }


server.keys = ['login pr'];


router.get('/',(ctx, next)=> {
    ctx.type = 'html';
    ctx.body = createReadStream('./pr_admin/index.html');
})
.post('/login', async(ctx)=>{
    try {
        console.log(ctx.request.body)
        const data = ctx.request.body.data
        
        if (true) {
            // 保存登录状态，这句代码会在浏览器中生成一个以 "koa:sess" 为 Name 的 cookie
            ctx.session.userInfo = {username: '', userID: ''}
            ctx.body = {code: 1, message: '登陆成功'}
          } else {
            ctx.body = {code: 0, message: '账号或密码错误'}
          }
    }catch(err) {
        throw new Error(err)
    }
})
.get('/getSession', async (ctx) => {
    try {
        console.log('ctx',ctx)
      if (ctx.session.userInfo) {
        ctx.body = {code: 1, message: '已登陆'}
      } else {
        ctx.body = {code: 0, message: '未登陆'}
        // 跳转到登录页
        // ctx.response.redirect('/login') 
      }
    } catch(err) {
      throw new Error(err)
    }
  })
  

server.use(logger())
.use(session(CONFIG, server))
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods())
.use(require('koa-static')('./pr_admin', {}))

server.listen(PORT)