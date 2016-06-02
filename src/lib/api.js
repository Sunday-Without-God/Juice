import rest from 'rest';
import pathPrefix from 'rest/interceptor/pathPrefix';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';
import jwtAuth from './interceptors/jwt-auth';
import headers from './interceptors/headers';

const api = rest
  .wrap(pathPrefix, { prefix: '/api/v1' })
  .wrap(mime, {
    mime: 'application/json',
    accept: 'application/json;q=0.8, text/plain;q=0.5, */*;q=0.2'
  })
  .wrap(jwtAuth)
  .wrap(headers)
  .wrap(errorCode);

export default api;
