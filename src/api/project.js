import request from '@/utils/request'

const baseURL = 'http://127.0.0.1:8010/v01'

export function projectInfo(query) {
  return request({
    url: '/project_info',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function projectList(query) {
  return request({
    url: '/projects',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function addProjectRequest(data) {
  return request({
    url: '/projects',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

export function updateProject(id, data) {
  return request({
    url: `/projects/${id}`,
    method: 'put',
    baseURL: baseURL,
    data
  })
}

export function deleteProject(id) {
  return request({
    url: `/projects/${id}`,
    method: 'delete',
    baseURL: baseURL
  })
}

export function hostListRequest(query) {
  return request({
    url: '/hosts',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function addHostRequest(data) {
  return request({
    url: '/hosts',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

export function updateHostRequest(id, data) {
  return request({
    url: `/hosts/${id}`,
    method: 'put',
    baseURL: baseURL,
    data
  })
}

export function deleteHostRequest(id) {
  return request({
    url: `/hosts/${id}`,
    method: 'delete',
    baseURL: baseURL
  })
}
