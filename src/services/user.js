import request from '../utils/request';

export async function query() {
  return request('/apiMock/users');
}

export async function queryCurrent() {
  return request('/apiMock/currentUser');
}
