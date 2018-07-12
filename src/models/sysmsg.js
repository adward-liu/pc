import { routerRedux } from 'dva/router';
import { apiRequest } from '../services/api';

export default {
  namespace: 'sysmsg',

  state: {
    nav: 0,
    total: 0,
    list: [],
  },

  effects: {
    //消息 列表
    *getMessaageList({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'messageList', payload);
      yield put({
        type: 'messageList',
        response:{list:response.list,total:response.total},
      });
    },
    //推送消息
    *pushMessage({ payload }, { call, put }) {
      yield call(apiRequest, 'pushMessage', payload,"推送成功");
    },
  },
  reducers: {
    handleNav(state, { payload }) {
      return {
        ...state,
        nav: payload,
      };
    },
    messageList(state, { response:{list,total} }) {
      return {
        ...state,
        list,
        total,
      };
    },
  },
};
