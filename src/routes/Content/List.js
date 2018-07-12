import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Form,
} from 'antd';
import StandardFormRow from 'components/StandardFormRow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ loading, content: { voteListTotal, voteList, typeList } }) => ({
  typeList,
  voteListTotal,
  voteList,
  loading: loading.models.content,
}))
export default class BasicList extends PureComponent {
  pageSize = 10;
  genre = null;
  type = null;
  mode = 0;

  getVoteList(start, end) {
    this.props.dispatch({
      type: 'content/getVoteList',
      payload: {
        start: start,
        end: end,
        genre: this.genre,
        type: this.type,
        mode: this.mode,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.mode = nextProps.match.params.type;
      this.getVoteList(0, this.pageSize);
    }
  }

  componentDidMount() {
    this.getVoteList(0, this.pageSize);
    this.props.dispatch({
      type: 'content/getTypeList',
      payload: { start: 0, end: 9999999 },
    });
  }

  onGenreTypeChange = e => {
    const value = e.target.value;
    this.genre = null;
    if (value === 'discuss') {
      this.genre = 0;
    } else if (value === 'prediction') {
      this.genre = 1;
    }
    this.getVoteList(0, this.pageSize);
  };
  onTypeChange = e => {
    const value = e.target.value;
    this.type = null;
    if (value === 'all') {
    } else {
      this.type = value;
    }
    this.getVoteList(0, this.pageSize);
  };

  render() {
    const { loading, dispatch, form, voteList, voteListTotal, typeList } = this.props;
    const { getFieldDecorator } = form;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all" onChange={this.onGenreTypeChange}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="discuss">话题讨论</RadioButton>
          <RadioButton value="prediction">结果预测</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: voteListTotal,
      onChange: (page, pageSize) => {
        this.getVoteList((page - 1) * pageSize, page * pageSize);
      },
    };

    const ListContent = ({
      data: { yesOrNoNum, commentNum, createdAt, percent, status, date },
    }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>投票</span>
          <p>{yesOrNoNum}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>评论</span>
          <p>{commentNum}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>token</span>
          <p>{11111}</p>
        </div>
        <div className={styles.listContentItem}>
          <p>已发布</p>
          <p>预测中</p>
        </div>
        <div className={styles.listContentItem}>
          <span>管理员</span>
          <p>mengjia</p>
        </div>
        <div className={styles.listContentItem}>{moment(date).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <StandardFormRow title="所属类目" block style={{ backgroundColor: '#fff', padding: 20 }}>
            <FormItem>
              {getFieldDecorator('category')(
                <div>
                  {typeList && typeList.length > 0 ? (
                    <RadioGroup defaultValue="all" onChange={this.onTypeChange}>
                      <RadioButton value="all">全部</RadioButton>
                      {typeList.map(typeItem => (
                        <RadioButton value={typeItem.typeId} key={typeItem.typeId}>
                          {typeItem.name}
                        </RadioButton>
                      ))}
                    </RadioGroup>
                  ) : (
                    '暂无分类'
                  )}
                </div>
              )}
            </FormItem>
          </StandardFormRow>

          <Card
            className={styles.listCard}
            bordered={false}
            title="话题列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={voteList}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={
                      <a
                        onClick={() =>
                          dispatch(routerRedux.push('/content/detail/' + item.topicId))
                        }
                      >
                        {item.title}
                      </a>
                    }
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
