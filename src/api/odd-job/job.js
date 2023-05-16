import request from '@/utils/request'

// 查询零工需求管理列表
export function listJob(query) {
  return request({
    url: '/odd-job/job/list',
    method: 'get',
    params: query
  })
}

// 查询零工需求管理详细
export function getJob(id) {
  return request({
    url: '/odd-job/job/' + id,
    method: 'get'
  })
}

// 新增零工需求管理
export function addJob(data) {
  return request({
    url: '/odd-job/job',
    method: 'post',
    data: data
  })
}

// 修改零工需求管理
export function updateJob(data) {
  return request({
    url: '/odd-job/job',
    method: 'put',
    data: data
  })
}

// 删除零工需求管理
export function delJob(id) {
  return request({
    url: '/odd-job/job/' + id,
    method: 'delete'
  })
}
