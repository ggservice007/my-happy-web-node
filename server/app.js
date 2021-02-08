import Koa from 'koa';
import logger from 'koa-logger';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import convert from 'koa-convert';
import serve from 'koa-static';
import cors from 'kcors';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import moment from 'moment';

import { version, description } from './package.json';


const app = new Koa();
const router = new Router();
const PORT = 7571;


app.use(cors());
app.use(logger());
app.use(koaBody({
  jsonLimit: '2048mb',
  formLimit: '2048mb',
  textLimit: '2048mb'
}));

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
//app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
//app.use(helmet());
app.use(compress());

app.use(serve(path.join(__dirname, './public/resource')));

app.use(serve(path.join(__dirname, './work_directory')));




router.all('/', async (ctx, next) => {
    ctx.body = {
      "version": version,
      "description": description,
      "now": moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    };
});

router.post('/bokeh-extra-resource', async(ctx, next) => {
  const lst_js = [];
  const lst_css = [];

  lst_js.push({
    name: 'axios',
    version: '0.20.0',
    file_name: 'axios.min.js',
    url: '/javascript/axios/@0.20.0/axios.min.js'
  });

  ctx.body = {
    "extra_js":  lst_js,
    "extra_css": lst_css
  };
});

router.post('/bokeh-template-path', async(ctx, next) => {
  ctx.body = {
    "relative": 'boken_template/@0.0.1',
    "absolute": path.resolve('work_directory/boken_template/@0.0.1')
  };
});

/**
The following subdirectories are in the public_work.
bokeh
*/
router.post('/work-directory-path', async(ctx, next) => {
  ctx.body = {
    "relative": 'public_work',
    "absolute": path.resolve('work_directory/public_work')
  };
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`Server is now running on http://localhost:${PORT}`)
});

app.timeout = 60 * 60 * 1000;
