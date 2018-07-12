import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Upload,
  Modal,
  Tooltip,
  Checkbox,
  Row, Col,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PushMsg.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['sysmsg/pushMessage'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      values.param=JSON.stringify(param);
      if (!err) {
        this.props.dispatch({
          type: 'sysmsg/pushMessage',
          payload: values,
        });
      }
    });
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  render() {
    const { submitting, dispatch, state } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '输入推送消息的标题',
                  },
                ],
              })(<Input placeholder="输入推送消息的标题"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>描述</span>}>
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入推送消息内容',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入推送消息内容"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详情">
              {getFieldDecorator('url', {
                rules: [
                  {
                    required: true,
                    message: '输入推送消息的详情页',
                  },
                ],
              })(<Input placeholder="输入推送消息的详情页"/>)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                发布
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ content }) => ({
  state: content,
}))(BasicForms);
