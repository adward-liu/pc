import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Checkbox,
  Row,
  Col,
  TimePicker,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AdminAdd.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  handleNav = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/handleNav',
      payload: type,
    });
  };
  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  disabledDate = current => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  disabledDateTime = () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
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
        <div className={styles.addNav}>
          <span
            className={state.nav === 0 ? styles.addNavOn : ''}
            onClick={() => this.handleNav(0)}
          >
            话题讨论
          </span>
          <span
            className={state.nav === 1 ? styles.addNavOn : ''}
            onClick={() => this.handleNav(1)}
          >
            结果预测
          </span>
        </div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '输入一个有争议的标题',
                  },
                ],
              })(<Input placeholder="输入一个有争议的标题" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  上传图片<em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <div className={styles.upload}>
                  <li>
                    <span>上传</span>
                  </li>
                  <li>
                    <img src="https://www.baidu.com/img/bd_logo1.png" alt="" />
                  </li>
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  描述 <em className={styles.optional}>（选填）</em>{' '}
                </span>
              }
            >
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: '请输入目标描述',
                  },
                ],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="输入对标题的补充内容" rows={4} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="发布方式" help="">
              <div>
                {getFieldDecorator('public', {
                  initialValue: '0',
                })(
                  <Radio.Group>
                    <Radio value="0">立即发布</Radio>
                    <Radio value="1">定时发布</Radio>
                    <Radio value="2">待定</Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <div
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '1' ? 'block' : 'none',
                      }}
                    >
                      {getFieldDecorator('date', {
                        rules: [
                          {
                            required: true,
                            message: '请选择发布日期及时间',
                          },
                        ],
                      })(
                        <div>
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={(date, dateString) => console.log(date, dateString)}
                          />
                          <TimePicker
                            style={{ width: '100%' }}
                            onChange={(time, timeString) => console.log(time, timeString)}
                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </FormItem>
              </div>
            </FormItem>
            {state.nav === 1 && (
              <div>
                <FormItem {...formItemLayout} label="停止投票时间">
                  {getFieldDecorator('date', {
                    rules: [
                      {
                        required: true,
                        message: '请选择停止投票时间',
                      },
                    ],
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={current => this.disabledDate(current)}
                      disabledTime={this.disabledDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="投票奖励">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: true,
                        message: '奖励限制10000.00 ~ 1000000.00 区间',
                      },
                    ],
                  })(<Input placeholder="奖励限制10000.00 ~ 1000000.00 区间" />)}
                </FormItem>
              </div>
            )}
            <FormItem {...formItemLayout} label="话题类目" help="">
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={checkedValues => console.log('checked = ', checkedValues)}
              >
                <Row>
                  <Col span={8}>
                    <Checkbox value="A">A</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="B">B</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="C">C</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="D">D</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="E">E</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </FormItem>
            <FormItem {...formItemLayout} label="话题标签">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '输入话题标签，多个标签可用“,”分隔',
                  },
                ],
              })(<Input placeholder="输入话题标签，多个标签可用“,”分隔" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
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
