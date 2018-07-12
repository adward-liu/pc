import React, { PureComponent } from 'react';
import moment from 'moment';
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
  InputNumber,
} from 'antd';
import StandardFormRow from 'components/StandardFormRow';
import TagSelect from 'components/TagSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Opinion.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ content: { feedbackList, feedbackListTotal }, loading }) => ({
  feedbackList,
  feedbackListTotal,
  loading: loading.models.content,
}))
export default class BasicList extends PureComponent {
  pageSize = 10;

  getCommentList(start, end) {
    this.props.dispatch({
      type: 'content/getFeedbackList',
      payload: { start: start, end: end },
    });
  }

  componentDidMount() {
    this.getCommentList(0, this.pageSize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      console.log(this.props);
      console.log(nextProps.match.params.type);
    }
  }

  render() {
    console.log(this.props);
    const { feedbackList, feedbackListTotal, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      total: feedbackListTotal,
      onChange: (page, pageSize) => {
        this.getCommentList((page - 1) * pageSize, page * pageSize);
      },
    };

    const ListContent = ({ data: { urls, userId, addTime } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <div className={styles.listContentItem}>
            <ul>
              {urls.map(function(val) {
                return <img src={val} />;
              })}
            </ul>
          </div>
          <div className={styles.listContentItem}>{userId}</div>
          <div className={styles.listContentItem}>
            {moment(addTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <InputNumber
            style={{ marginLeft: 24 }}
            defaultValue={1000}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={value => console.log(value)}
          />
          <Button type="primary" style={{ marginLeft: 24 }}>
            奖励
          </Button>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="反馈列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={feedbackList}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.content} description={item.type} />
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
