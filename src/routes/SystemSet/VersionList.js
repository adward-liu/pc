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
  Modal,
  Avatar,
  Form,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './VersionList.less';
import moment from 'moment/moment';
import { message } from 'antd/lib/index';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ sysm: { list, total }, loading }) => ({
  list,
  total,
  loading: loading.models.sysm,
}))
export default class BasicList extends PureComponent {
  state = {
    delVisible: false,
    item: null,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'sysm/getVersionList',
      payload: {
        start: 0,
        end: 10,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      console.log(this.props);
      console.log(nextProps.match.params.type);
    }
  }

  handleDel(item, index) {
    this.setState({
      delVisible: true,
      item: item,
    });
  }

  async handleOk() {
    const { list, total } = this.props;
    const { item } = this.state;
    let index = list.indexOf(item);
    list.splice(index, 1);
    this.setState({
      delVisible: false,
      item: null,
      list: list,
      total: total - 1,
    });
    let response = await this.props.dispatch({
      type: 'sysm/delVersion',
      payload: {
        id: item.id,
      },
    });
  }

  handleCancel() {
    console.log('test');
    this.setState({
      delVisible: false,
      item: null,
    });
  }

  render() {
    const { list, total, loading } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      total: total,
    };
    const ListContent = ({ data: { version, fileSize, status, type, addTime } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>{version}</div>
        <div className={styles.listContentItem}>{fileSize}</div>
        <div className={styles.listContentItem}>
          {moment(addTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div className={styles.listContentItem}>{type}</div>
        <div className={styles.listContentItem}>
          {moment(addTime).format('YYYY-MM-DD HH:mm:ss')}
        </div>
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
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <a href="javascript:void(0);" onClick={() => this.handleDel(item, index)}>
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={<a href={item.title}>{item.title}</a>}
                    description={item.content}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
          <Modal
            title="提示"
            onOk={() => this.handleOk()}
            onCancel={() => this.handleCancel()}
            visible={this.state.delVisible}
          >
            <p>确定要删除这个版本吗？</p>
          </Modal>
        </div>
      </PageHeaderLayout>
    );
  }
}
