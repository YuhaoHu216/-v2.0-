import { post, put, uploadFile } from './http.js';

// 获取图书分页数据
export async function getBooksPage(pageNum = 1, pageSize = 10, searchParams = {}) {
  const requestData = {
    pageNum: pageNum,
    pageSize: pageSize,
    ...searchParams
  };
  
  return await post('/books/page', requestData);
}

// 添加图书
export async function addBook(bookData) {
  return await post('/books', bookData);
}

// 更新图书
export async function updateBook(bookData) {
  return await put('/books', bookData);
}

// 上传图书封面图片
export async function uploadBookImage(file) {
  return await uploadFile('/upload', file);
}