import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, apiRequest } from '../services/api';

export default {
  namespace: 'content',

  state: {
    nav: 0,
    type: [],
    typeList: [],
    typeListTotal: 0,
    add: [],
    voteList: [],
    voteListTotal: 0,
    voteDetail: '',
    feedbackList: [],
    feedbackListTotal: 0,
    commentList: [],
    commentListTotal: 0,
  },

  effects: {
    //话题 添加
    *submitRegularForm({ payload }, { call }) {
      yield call(apiRequest, 'addTopic', payload, '添加成功');
    },
    //话题 列表
    *getVoteList({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'topicList', payload);
      yield put({
        type: 'voteList',
        response: { voteList: response.content, voteListTotal: response.totalElements },
      });
    },
    //话题 详情
    *getVoteDetail({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'topicDetail', payload);
      yield put({
        type: 'voteDetail',
        response: { voteDetail: response },
      });
    },
    //评论 列表
    *getCommentList({ payload }, { call, put }) {
      const response = yield call(apiRequest, 'getComments', payload);
      yield put({
        type: 'commentList',
        response: { commentList: response.comments, commentListTotal: response.total },
      });
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },

    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    //分类设置 添加
    *submitFormTypeOne({ payload }, { call, put }) {
      yield call(apiRequest, 'topicSetType', payload, '添加成功', () => {
        //put({type: 'content/getTypeList'})
        //yield take('content/getTypeList')
      });
    },
    //分类设置 更新
    *topicTypeUpdate({ payload }, { call, put }) {
      yield call(apiRequest, 'topicTypeUpdate', payload, '更新成功');
    },
    //分类设置 列表
    *getTypeList({ payload }, { select, call, put }) {
      const response = yield call(apiRequest, 'topicTypeList', payload);
      yield put({
        type: 'typeList',
        response: { typeList: response.typeList, total: response.total },
      });
    },
    //分类设置 列表
    *getFeedbackList({ payload }, { select, call, put }) {
      const response = yield call(apiRequest, 'feedbackList', payload);
      yield put({
        type: 'feedbackList',
        response: { feedbackList: response.list, feedbackListTotal: response.total },
      });
    },
    *rewardTopic({ payload }, { call, put }) {
      yield call(apiRequest, 'rewardTopic', payload, '开奖成功');
    },
  },
  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    handleNav(state, { payload }) {
      return {
        ...state,
        nav: payload,
      };
    },
    typeList(state, { response: { typeList, total } }) {
      return {
        ...state,
        typeList: typeList,
        typeListTotal: total,
      };
    },
    voteList(state, { response: { voteList, voteListTotal } }) {
      return {
        ...state,
        voteList,
        voteListTotal,
      };
    },
    commentList(state, { response: { commentList, commentListTotal } }) {
      return {
        ...state,
        commentList,
        commentListTotal,
      };
    },
    voteDetail(state, { response: { voteDetail } }) {
      return {
        ...state,
        voteDetail,
      };
    },
    feedbackList(state, { response: { feedbackList, feedbackListTotal } }) {
      return {
        ...state,
        feedbackList,
        feedbackListTotal,
      };
    },
  },
};
