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
import styles from './Set.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, sysm: { ruleDetail } }) => ({
  ruleDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'sysm/addRuleParams',
          payload: values,
        });
      }
    });
  };
  handleNav = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysm/getRuleParams',
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
 componentDidMount(){
   this.handleNav();
 }
  render() {
    const { submitting, dispatch, state,ruleDetail } = this.props;
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
    console.log(ruleDetail);
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <div>
                <div
                  style={{
                    margin: '8px 0',
                    display:  'none',
                  }}
                >
                  <FormItem {...formItemLayout} label="主键">
                    {getFieldDecorator('id', {
                      initialValue:ruleDetail == undefined ? undefined: ruleDetail.id,
                      rules: [
                        {
                          required: false,
                          message: '奖惩机制的整体基数',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                </div>


                <FormItem {...formItemLayout} label="奖惩基数">
                  <br />
                  <FormItem {...formItemLayout} label="基数">
                    {getFieldDecorator('base', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.base,
                      rules: [
                        {
                          required: true,
                          message: '奖惩机制的整体基数',
                        },
                      ],
                    })(<Input placeholder="奖惩机制的整体基数"/>)}
                  </FormItem>
                </FormItem>
                <hr />

                <FormItem {...formItemLayout} label="签到">
                  <br />
                  <FormItem {...formItemLayout} label="第一天">
                    {getFieldDecorator('baseDay1', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDay1,
                      rules: [
                        {
                          required: true,
                          message: '签到第一天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第一天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第二天">
                    {getFieldDecorator('baseDay2', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDay2,
                      rules: [
                        {
                          required: true,
                          message: '签到第二天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第二天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第三天">
                    {getFieldDecorator('baseDay3', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDay3,
                      rules: [
                        {
                          required: true,
                          message: '签到第三天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第三天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第四天">
                    {getFieldDecorator('baseDay4', {
                      initialValue:ruleDetail == undefined ? undefined:  ruleDetail.baseDay4,
                      rules: [
                        {
                          required: true,
                          message: '签到第四天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第四天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第五天">
                    {getFieldDecorator('baseDay5', {
                      initialValue:ruleDetail == undefined ? undefined:  ruleDetail.baseDay5,
                      rules: [
                        {
                          required: true,
                          message: '签到第五天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第五天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第六天">
                    {getFieldDecorator('baseDay6', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDay6,
                      rules: [
                        {
                          required: true,
                          message: '签到第六天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第六天的奖励" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="第七天">
                    {getFieldDecorator('baseDay7', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDay7,
                      rules: [
                        {
                          required: true,
                          message: '签到第七天的奖励',
                        },
                      ],
                    })(<Input placeholder="签到第七天的奖励" />)}
                  </FormItem>
                </FormItem>
                <hr />

                <FormItem {...formItemLayout} label="话题相关">
                  <br />
                  <FormItem {...formItemLayout} label="话题被表态">
                    {getFieldDecorator('baseByDeclare', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseByDeclare,
                      rules: [
                        {
                          required: true,
                          message: '话题被表态',
                        },
                      ],
                    })(<Input placeholder="话题被表态" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="话题被评论">
                    {getFieldDecorator('baseByComment', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseByComment,
                      rules: [
                        {
                          required: true,
                          message: '话题被评论',
                        },
                      ],
                    })(<Input placeholder="话题被评论" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="话题违规">
                    {getFieldDecorator('baseIllegalTopic', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseIllegalTopic,
                      rules: [
                        {
                          required: true,
                          message: '话题违规',
                        },
                      ],
                    })(<Input placeholder="话题违规" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="话题表态">
                    {getFieldDecorator('baseDeclare', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.baseDeclare,
                      rules: [
                        {
                          required: true,
                          message: '话题表态',
                        },
                      ],
                    })(<Input placeholder="话题表态" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="评论被赞">
                    {getFieldDecorator('commentLIke', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.commentLIke,
                      rules: [
                        {
                          required: true,
                          message: '评论被赞',
                        },
                      ],
                    })(<Input placeholder="评论被赞" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="评论违规">
                    {getFieldDecorator('commentIllagel', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.commentIllagel,
                      rules: [
                        {
                          required: true,
                          message: '评论违规',
                        },
                      ],
                    })(<Input placeholder="评论违规" />)}
                  </FormItem>
                </FormItem>
                <hr />

                <FormItem {...formItemLayout} label="邀请好友">
                  <br />
                  <FormItem {...formItemLayout} label="一级邀请">
                    {getFieldDecorator('registFirst', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.registFirst,
                      rules: [
                        {
                          required: true,
                          message: '一级邀请',
                        },
                      ],
                    })(<Input placeholder="一级邀请" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="二级邀请">
                    {getFieldDecorator('registSecond', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.registSecond,
                      rules: [
                        {
                          required: true,
                          message: '二级邀请',
                        },
                      ],
                    })(<Input placeholder="二级邀请" />)}
                  </FormItem>
                </FormItem>
                <hr />

                <FormItem {...formItemLayout} label="注册奖励">
                  <br />
                  <FormItem {...formItemLayout} label="注册成功">
                    {getFieldDecorator('newRegister', {
                      initialValue: ruleDetail == undefined ? undefined: ruleDetail.newRegister,
                      rules: [
                        {
                          required: true,
                          message: '注册成功',
                        },
                      ],
                    })(<Input placeholder="注册成功" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="邀请注册">
                    {getFieldDecorator('registerInvite', {
                      initialValue:ruleDetail == undefined ? undefined:  ruleDetail.registerInvite,
                      rules: [
                        {
                          required: true,
                          message: '邀请注册',
                        },
                      ],
                    })(<Input placeholder="邀请注册"  />)}
                  </FormItem>
                </FormItem>
              </div>


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
