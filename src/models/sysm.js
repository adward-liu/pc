import { routerRedux } from 'dva/router';
import { apiRequest } from '../services/api';

export default {
  namespace: 'sysm',

  state: {
    nav: 0,
    total: 0,
    ruleDetail: '',
    list: [],
  },

  effects: {
    //消息 列表
    *addRuleParams({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'ruleParams', payload);
      yield put({
        type: 'ruleParams',
        response,
      });
    },
    *getRuleParams({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'getRuleParams', payload);
      console.log(response);
      yield put({
        type: 'ruleDetail',
        response,
      });
    },
    *getVersionList({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'versionList', payload);
      yield put({
        type: 'versionList',
        response: { list: response.list, total: response.total },
      });
    },
    //发布版本
    *addVersion({ payload }, { call, put }) {
      yield call(apiRequest, 'addVersion', payload, '添加成功');
    },
    //删除版本
    *delVersion({ payload }, { call, put }) {
      yield call(apiRequest, 'delVersion', payload, '删除成功');
    },
  },
  reducers: {
    handleNav(state, { payload }) {
      return {
        ...state,
        nav: payload,
      };
    },
    versionList(state, { response: { list, total } }) {
      return {
        ...state,
        list,
        total,
      };
    },
    ruleDetail(state, { response }) {
      return {
        ...state,
        ruleDetail: response,
      };
    },
  },
};
