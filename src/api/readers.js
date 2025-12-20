import { post, get, put, del } from './http.js';

// 用户登录
export async function readerLogin(username, password) {
  const data = {
    account: username,
    password: password
  };
  
  return await post('/readers/login', data);
}

// 管理员登录
export async function adminLogin(username, password) {
  const data = {
    username: username,
    password: password
  };
  
  return await post('/admin/login', data);
}

// 获取管理员信息
export async function getAdminInfo() {
  return await get('/admin/me');
}

// 借书功能
export async function borrowBook(bookId) {
  return await post(`/readers/borrow?bookId=${bookId}`, {});
}

// 获取读者信息
export async function getReaderInfo() {
  return await get('/readers/me');
}

// 获取借阅记录
export async function getBorrowRecords(data) {
  return await post('/borrowRecords/page', data);
}

// 获取读者分页列表
export async function getReadersPage(pageNum, pageSize, params = {}) {
  // 构造请求数据
  const requestData = {
    page: pageNum,
    pageSize: pageSize,
    ...params
  };
  
  return await post('/readers/page/list', requestData);
}

// 添加读者
export async function addReader(readerData) {
  return await post('/readers/register', readerData);
}

// 更新读者
export async function updateReader(readerData) {
  return await put('/readers', readerData);
}

// 删除读者
export async function deleteReader(readerId) {
  return await del(`/readers?readerId=${readerId}`);
}