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
  loading: loading.effects['content/getTypeList'],
  submitTypeOneIng: loading.effects['content/submitFormTypeOne'],
}))
export default class Type extends PureComponent {
  pageSize = 10;
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

  confirm = () => {
    message.info('Click on Yes.');
  };

  render() {
    const { typeList, loading, form, submitTypeOneIng, typeListTotal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Popconfirm
        placement="top"
        title={
          <div>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入二级类目',
                },
              ],
            })(<Input placeholder="请输入二级类目" />)}
          </div>
        }
        onConfirm={() => {
          this.props.form.validateFieldsAndScroll((err, values) => {
            let data = {
              pid: this.props.typeId,
              status: 0,
            };
            if (!err) {
              this.props.dispatch({
                type: 'content/submitFormTypeOne',
                payload: { ...values, ...data },
              });
            }
          });
        }}
        okText="确定"
        cancelText="取消"
      >
        <Button>添加二级</Button>
      </Popconfirm>
    );
  }
}
