import { get, post, put, del } from './http.js';

// 获取管理员分页数据
export async function getAdminsPage(pageNum = 1, pageSize = 10, searchParams = {}) {
  // 构建请求数据，过滤掉空值
  const requestData = {
    pageNum: pageNum,
    pageSize: pageSize
  };
  
  // 只添加非空的搜索参数
  if (searchParams.adminId) {
    requestData.adminId = parseInt(searchParams.adminId);
  }
  if (searchParams.username) {
    requestData.username = searchParams.username;
  }
  if (searchParams.realName) {
    requestData.realName = searchParams.realName;
  }
  if (searchParams.startTime) {
    requestData.startTime = searchParams.startTime;
  }
  if (searchParams.endTime) {
    requestData.endTime = searchParams.endTime;
  }
  
  return await post('/admin/page/list', requestData);
}

// 添加管理员
export async function addAdmin(adminData) {
  // 构建符合新接口要求的请求数据
  const requestData = {
    username: adminData.username,
    password: adminData.password,
    realName: adminData.realName
  };
  
  return await post('/admin/add', requestData);
}

// 更新管理员
export async function updateAdmin(adminData) {
  return await put('/admins', adminData);
}

// 删除管理员
export async function deleteAdmin(adminId) {
  return await del(`/admin/delete?adminId=${adminId}`);
}

// 重置管理员密码
export async function resetAdminPassword(adminId) {
  return await put(`/admins/resetPassword?adminId=${adminId}`);
}