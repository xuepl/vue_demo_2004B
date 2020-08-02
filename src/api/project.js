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

export function suiteListRequest(query) {
  return request({
    url: '/suites',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function addSuiteRequest(data) {
  return request({
    url: '/suites',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

export function updateSuiteRequest(id, data) {
  return request({
    url: `/suites/${id}`,
    method: 'put',
    baseURL: baseURL,
    data
  })
}

export function deleteSuiteRequest(id) {
  return request({
    url: `/suites/${id}`,
    method: 'delete',
    baseURL: baseURL
  })
}

export function caseListRequest(query) {
  return request({
    url: '/cases',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function addCaseRequest(data) {
  return request({
    url: '/cases',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

export function updateCaseRequest(id, data) {
  return request({
    url: `/cases/${id}`,
    method: 'put',
    baseURL: baseURL,
    data
  })
}

export function deleteCaseRequest(id) {
  return request({
    url: `/cases/${id}`,
    method: 'delete',
    baseURL: baseURL
  })
}

export function apiListRequest(query) {
  return request({
    url: '/api',
    method: 'get',
    params: query,
    baseURL: baseURL
  })
}

export function addAPIRequest(data) {
  return request({
    url: '/api',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

export function updateAPIRequest(id, data) {
  return request({
    url: `/api/${id}`,
    method: 'put',
    baseURL: baseURL,
    data
  })
}

export function deleteAPIRequest(id) {
  return request({
    url: `/api/${id}`,
    method: 'delete',
    baseURL: baseURL
  })
}

export function runAPIRequest(data) {
  return request({
    url: '/runApi',
    method: 'post',
    baseURL: baseURL,
    data
  })
}

