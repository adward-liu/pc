export default {
  addTopic: '/cms/topic/addTopic', //添加话题
  topicDetail: '/cms/topic/getTopic', //话题详情
  getComments: '/cms/topic/getComments', //话题详情
  topicDel: '/cms/topic/outTopic', // 删除话题
  topicList: '/cms/topic/searchTopic', //话题条件搜索
  topicSetType: '/cms/topic/setType', //设置内容分类
  topicTypeList: '/cms/topic/getTypeList', //获取分类列表
  topicUpdate: '/cms/topic/updateTopic', //  话题更新
  topicTypeUpdate: '/cms/topic/updateType', //更新内容分类
  rewardTopic: '/cms/topic/rewardTopic', //开奖
  messageList: '/cms/common/messageList', //获取消息列表
  pushMessage: '/cms/common/pushMessage', //发布推送消息
  versionList: '/cms/common/versionList', //版本列表
  addVersion: '/cms/common/addVersion', //发布版本
  delVersion: '/cms/common/delVersion', //删除版本
  feedbackList: '/cms/common/feedbackList', //意见反馈列表
  //用户
  userList: '/cms/user/list', //意见反馈列表

  ruleParams: '/cms/account/saveAccountParams', //保存和更新积分规则
  getRuleParams: '/cms/account/getAccountRuleDetail', //保存和更新积分规则
};
