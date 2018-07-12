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
} from 'antd';
import StandardFormRow from 'components/StandardFormRow';
import TagSelect from 'components/TagSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ users: { list, total }, loading }) => ({
  list,
  total,
  loading: loading.models.users,
}))
@Form.create()
export default class BasicList extends PureComponent {
  getUserList(start, end) {
    this.props.dispatch({
      type: 'users/getUserList',
      payload: {
        phone:this.phone,
        id:this.id,
        start: start,
        end: end,
      },
    });
  }

  phone = '';
  id = 0;
  pageSize = 10;

  componentDidMount() {
    this.getUserList(0, this.pageSize);
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err)
        return;
      this.phone = fieldsValue.phone;
      this.id = fieldsValue.id;
      this.getUserList(0, this.pageSize);
    });
  };

  render() {
    const { list, total, loading, form } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.pageSize,
      total: total,
      onChange: (page, pageSize) => {
        this.getUserList((page - 1) * pageSize, page * pageSize);
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const ListContent = ({ data: { id, phone, createTime } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          {id}
        </div>
        <div className={styles.listContentItem}>
          {phone}
        </div>
        <div className={styles.listContentItem}>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Form onSubmit={this.handleSearch} layout="inline">
              <FormItem label="手机号">
                {getFieldDecorator('phone')(<Input placeholder="请输入"/>)}
              </FormItem>
              <FormItem label="ID">
                {getFieldDecorator('id')(<Input placeholder="请输入"/>)}
              </FormItem>
              <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            </Form>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} shape="square" size="large"/>}
                    title={item.nickname}
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
