import { post } from './http.js';

// 用户登录
export async function readerLogin(username, password) {
  const data = {
    account: username,
    password: password
  };
  
  return await post('/readers/login', data);
}