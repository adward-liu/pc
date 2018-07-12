import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '工作台',
    icon: 'profile',
    path: 'workplace',
    children: [
      {
        name: '代办事项',
        path: 'workplace',
      },
    ],
  },
  {
    name: '数据统计',
    icon: 'dashboard',
    path: 'statistics',
    children: [
      {
        name: '内容数据',
        path: 'analysis',
      },
      {
        name: '用户数据',
        path: 'monitor',
      },
    ],
  },
  {
    name: '内容管理',
    icon: 'form',
    path: 'content',
    children: [
      {
        name: '新建话题',
        path: 'add/0',
      },
      {
        name: '已发布话题',
        path: 'list/0',
      },
      {
        name: '待发布话题',
        path: 'list/1',
      },
      {
        name: '草稿箱',
        path: 'list/2',
      },
      {
        name: '回收站',
        path: 'list/3',
      },
      {
        name: '内容分类管理',
        path: 'type',
      },
      // {
      //   name: '回收站',
      //   path: 'workplace',
      //   // hideInBreadcrumb: true,
      //   // hideInMenu: true,
      // },
    ],
  },
  {
    name: '内容反垃圾',
    icon: 'form',
    path: 'garbage',
    children: [
      {
        name: '关键词屏蔽',
        path: 'keywords',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'table',
    path: 'users',
    children: [
      {
        name: '用户列表',
        path: 'list',
      },
    ],
  },
  {
    name: '系统消息',
    icon: 'profile',
    path: 'system-message',
    children: [
      {
        name: '发布公告',
        path: 'add',
      },
      {
        name: '通知公告',
        path: 'list',
      },
      {
        name: '意见反馈',
        path: 'opinion',
      },
    ],
  },
  {
    name: '系统设置',
    icon: 'check-circle-o',
    path: 'system-set',
    children: [
      {
        name: '参数设置',
        path: 'set',
      },
      {
        name: '添加管理员',
        path: 'admin-add',
      },
      {
        name: '管理员列表',
        path: 'admin-list',
      },
      {
        name: '发布版本',
        path: 'update-add',
      },
      {
        name: '版本管理',
        path: 'update-tips',
      },
    ],
  },

  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: process.env.NODE_ENV === 'development' ? false : true,
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
