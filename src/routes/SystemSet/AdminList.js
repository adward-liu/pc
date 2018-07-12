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

import styles from './AdminList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      console.log(this.props);
      console.log(nextProps.match.params.type);
    }
  }

  render() {
    const { list: { list }, loading, form } = this.props;
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
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">话题讨论</RadioButton>
          <RadioButton value="waiting">结果预测</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>投票</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>评论</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>下架</div>
        <div className={styles.listContentItem}>
          <span>管理员</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>2018-06-16 14:03</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <StandardFormRow title="所属类目" block style={{ backgroundColor: '#fff', padding: 20 }}>
            <FormItem>
              {getFieldDecorator('category')(
                <TagSelect onChange={this.handleFormSubmit} expandable>
                  <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                  <TagSelect.Option value="cat2">类目二</TagSelect.Option>
                  <TagSelect.Option value="cat3">类目三</TagSelect.Option>
                  <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                  <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                  <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                  <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                  <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                  <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                  <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                  <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                  <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                </TagSelect>
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
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
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
