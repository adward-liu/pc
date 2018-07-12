import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './MsgList.less';
import moment from 'moment/moment';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ sysmsg: { list, total }, loading }) => ({
  list,
  total,
  loading: loading.models.sysmsg,
}))
export default class BasicList extends PureComponent {
  getMessageList(start, end) {
    this.props.dispatch({
      type: 'sysmsg/getMessaageList',
      payload: {
        start: start,
        end: end,
      },
    });
  }

  pageSize = 10;

  componentDidMount() {
    this.getMessageList(0, this.pageSize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      console.log(nextProps.match.params.type);
    }
  }

  render() {
    const { list, total, loading } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.pageSize,
      total: total,
      onChange: (page, pageSize) => {
        this.getMessageList((page - 1) * pageSize, page * pageSize);
      },
    };
    const ListContent = ({ data: { readNum, owner, addTime } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>阅读数</span>
          <p>{readNum}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>管理员</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>{moment(addTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={item.title}>{item.title}</a>}
                    description={item.content}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
