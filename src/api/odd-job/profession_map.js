import request from '@/utils/request'

// 查询行业字典列表
export function listProfession_map(query) {
  return request({
    url: '/odd-job/profession_map/list',
    method: 'get',
    params: query
  })
}

// 查询行业字典详细
export function getProfession_map(id) {
  return request({
    url: '/odd-job/profession_map/' + id,
    method: 'get'
  })
}

// 新增行业字典
export function addProfession_map(data) {
  return request({
    url: '/odd-job/profession_map',
    method: 'post',
    data: data
  })
}

// 修改行业字典
export function updateProfession_map(data) {
  return request({
    url: '/odd-job/profession_map',
    method: 'put',
    data: data
  })
}

// 删除行业字典
export function delProfession_map(id) {
  return request({
    url: '/odd-job/profession_map/' + id,
    method: 'delete'
  })
}
