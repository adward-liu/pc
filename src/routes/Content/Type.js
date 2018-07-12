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
  Switch,
  Popconfirm,
  message,
} from 'antd';
import StandardFormRow from 'components/StandardFormRow';
import TagSelect from 'components/TagSelect';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import TypeTwo from './TypeTwo';
import styles from './List.less';
import stylesType from './Type.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@Form.create()
@connect(({ content: { typeList, typeListTotal }, loading }) => ({
  typeListTotal,
  typeList,
  loading: loading.models.content,
  submitTypeOneIng: loading.effects['content/submitFormTypeOne'],
}))
export default class Type extends PureComponent {
  pageSize = 10;
  state = {
    pageStart: 0,
  };
  handleSubmitFormTypeOne = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let data = {
        pid: 0,
        status: 0,
      };
      if (!err) {
        this.props.dispatch({
          type: 'content/submitFormTypeOne',
          payload: { ...values, ...data },
        });
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      console.log(this.props);
      console.log(nextProps.match.params.type);
    }
  }

  getTypeList() {
    this.props.dispatch({
      type: 'content/getTypeList',
      payload: { start: this.state.pageStart, end: this.state.pageStart + this.pageSize },
    });
  }

  componentDidMount() {
    this.getTypeList();
  }

  confirm = () => {
    message.info('Click on Yes.');
  };

  render() {
    const { typeList, loading, form, submitTypeOneIng, typeListTotal } = this.props;
    const { getFieldDecorator } = form;

    const paginationProps = {
      showQuickJumper: true,
      pageSize: this.pageSize,
      total: typeListTotal,
      onChange: (page, pageSize) => {
        this.setState({ pageStart: (page - 1) * pageSize }, () => this.getTypeList());
      },
    };

    const ListContent = ({ data: { name, status, typeId, childList } }) => (
      <div className={stylesType.listContent}>
        <div className={stylesType.listContentItem}>
          <div className={stylesType.title}>{name}</div>
          <div className={stylesType.item}>
            {childList.length > 0 &&
              childList.map(childItem => <li key={childItem.typeId}>{childItem.name}</li>)}
          </div>
          <div className={stylesType.tool}>
            <Icon type="plus-square-o" style={{ color: '#1890FF', marginRight: 10 }} />
            <TypeTwo typeId={typeId} />
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked={status === 0 ? true : false}
              style={{ marginLeft: 20 }}
              onChange={async () => {
                await this.props.dispatch({
                  type: 'content/topicTypeUpdate',
                  payload: {
                    name: name,
                    typeId: typeId,
                    status: status === 0 ? 1 : 0,
                  },
                });
                this.getTypeList();
              }}
            />
          </div>
        </div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderLayout>
        <Form onSubmit={this.handleSubmitFormTypeOne} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="添加一级类目">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入一级类目',
                },
              ],
            })(<Input placeholder="请输入一级类目" />)}
            <Button type="primary" htmlType="submit" loading={submitTypeOneIng}>
              新建一级类目
            </Button>
          </FormItem>
        </Form>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="内容分类"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={typeList}
              renderItem={item => (
                <List.Item>
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
