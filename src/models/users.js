import { routerRedux } from 'dva/router';
import { apiRequest } from '../services/api';

export default {
  namespace: 'users',

  state: {
    total: 0,
    list: [],
  },

  effects: {
    //消息 列表
    *getUserList({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'userList', payload);
      yield put({
        type: 'userList',
        response:{list:response.list,total:response.total},
      });
    },
  },
  reducers: {
    userList(state, { response:{list,total} }) {
      return {
        ...state,
        list,
        total,
      };
    },
  },
};
