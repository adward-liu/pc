import { stringify } from 'qs';
import request from '../utils/request';
import apiAddr from '../services/apiAddr';
import { message } from 'antd';

export async function queryProjectNotice() {
  return request('/apiMock/project/notice');
}

export async function queryActivities() {
  return request('/apiMock/activities');
}

export async function queryRule(params) {
  return request(`/apiMock/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/apiMock/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/apiMock/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/apiMock/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/apiMock/fake_chart_data');
}

export async function queryTags() {
  return request('/apiMock/tags');
}

export async function queryBasicProfile() {
  return request('/apiMock/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/apiMock/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/apiMock/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/apiMock/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/apiMock/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/apiMock/notices');
}

export async function apiRequest(url, params, msg, ck) {
  const response = await request(apiAddr[url], {
    method: 'POST',
    body: params,
  });
  if (response.code === '0') {
    ck && ck();
    msg && message.success(msg);
    return response.data;
  } else {
    message.error(response.message);
  }
}
