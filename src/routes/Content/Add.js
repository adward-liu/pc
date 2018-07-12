import React, {PureComponent, Component} from 'react';
import {connect} from 'dva';
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
  Upload,
  Modal,
  Tooltip,
  Checkbox,
  Row,
  Col,
  TimePicker,
} from 'antd';
import {routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Add.less';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const RadioGroup = Radio.Group;

@connect(({loading}) => ({
  submitting: loading.effects['content/submitRegularForm'],
}))
@Form.create()
class BasicForms extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    date: moment(new Date()).format('x'),
    stopTime: '',
    images: [],
    typeSelect: 0,
    typeSelectName: '',
    typeTwo: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let {typeSelect, images, date, stopTime} = this.state;
      let data = {
        date: date, //发布日期
        description: values.description, //描述
        genre: this.props.content.nav, //讨论和预测类型
        images: images,
        label: values.label,
        mode: Number(values.mode), //0立即发布 1定时发布 2待定
        reward: values.reward, //总奖励
        stopTime: stopTime, //停止投票时间
        title: values.title,
        type: typeSelect,
      };
      if (!err) {
        this.props.dispatch({
          type: 'content/submitRegularForm',
          payload: data,
        });
      }
    });
  };
  handleNav = type => {
    const {dispatch} = this.props;
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

  handleCancel = () => this.setState({previewVisible: false});
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({file, fileList}) => {
    this.setState({fileList}, () => {
      if (file.response && file.response.code === '0') {
        let images = this.state.images;
        images.push(file.response.data);
        this.setState({images});
      }
    });
  };

  getTypeList(start, end) {
    this.props.dispatch({
      type: 'content/getTypeList',
      payload: {start: start, end: end, status: 0},
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.content.typeList.length !== this.props.content.typeList.length) {
      const topicId = Number(this.props.match.params.topicId);
      if (!topicId) {
        this.setState({
          typeSelect: nextProps.content.typeList[0].typeId,
          typeSelectName: nextProps.content.typeList[0].name,
          typeTwo: nextProps.content.typeList[0].childList,
        });
      }
    }

    if (nextProps.content.voteDetail !== this.props.content.voteDetail) {
      console.log(12);
      let voteDetail = nextProps.content.voteDetail;
      let typeList = nextProps.content.typeList;
      let type = voteDetail.type;
      let typeSelect = typeList.find(data => data.name === type[0]).typeId;
      let typeSelectName = typeList.find(data => data.name === type[0]).name;
      let typeTwo = typeList.find(data => data.typeId === typeSelect).childList;
      this.setState({
        typeSelect,
        typeSelectName,
        typeTwo,
      });
    }
  }

  async getInit() {
    const {dispatch} = this.props;
    const topicId = this.props.match.params.topicId;
    let typeList = await this.getTypeList(0, 99999999);
    let voteDetail = await dispatch({
      type: 'content/getVoteDetail',
      payload: {topicId: topicId},
    });
    if (typeList && voteDetail) {
      let type = voteDetail.type;
      let typeSelect = typeList.find(data => data.name === type[0]).typeId;
    }
  }

  async componentDidMount() {
    const {dispatch} = this.props;
    const topicId = Number(this.props.match.params.topicId);
    await this.getTypeList(0, 99999999);
    if (topicId) {
      await dispatch({
        type: 'content/getVoteDetail',
        payload: {topicId: topicId},
      });
    }
    const {typeList} = this.props.content;
    if (typeList.length >0) {
      const topicId = Number(this.props.match.params.topicId);
      if (!topicId) {
        this.setState({
          typeSelect:typeList[0].typeId,
          typeSelectName: typeList[0].name,
          typeTwo: typeList[0].childList,
        });
      }
    }
  }

  render() {
    const {submitting, dispatch, content: {nav, typeList, voteDetail}} = this.props;
    const {previewVisible, previewImage, fileList, typeTwo, typeSelectName} = this.state;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderLayout>
        <div className={styles.addNav}>
          <span className={nav === 0 ? styles.addNavOn : ''} onClick={() => this.handleNav(0)}>
            话题讨论
          </span>
          <span className={nav === 1 ? styles.addNavOn : ''} onClick={() => this.handleNav(1)}>
            结果预测
          </span>
        </div>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{marginTop: 8}}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('title', {
                initialValue: voteDetail.title,
                rules: [
                  {
                    required: true,
                    message: '输入一个有争议的标题',
                  },
                ],
              })(<Input placeholder="输入一个有争议的标题"/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  上传图片<em className={styles.optional}>（选填）</em>
                </span>
              }
            >
              <div className="clearfix">
                <Upload
                  action="/cms/common/upload"
                  data={{type: 3}}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  描述 <em className={styles.optional}>（选填）</em>{' '}
                </span>
              }
            >
              {getFieldDecorator('description', {
                initialValue: voteDetail.description,
              })(
                <TextArea style={{minHeight: 32}} placeholder="输入对标题的补充内容" rows={4}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="发布方式">
              <div>
                {getFieldDecorator('mode', {
                  initialValue: '0',
                })(
                  <Radio.Group>
                    <Radio value="0">立即发布</Radio>
                    <Radio value="1">定时发布</Radio>
                    <Radio value="2">待定</Radio>
                  </Radio.Group>
                )}
                <div
                  style={{
                    margin: '8px 0',
                    display: getFieldValue('mode') === '1' ? 'block' : 'none',
                  }}
                >
                  <FormItem style={{marginBottom: 0}}>
                    <DatePicker
                      style={{width: '100%'}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      defaultValue={moment(new Date(), 'YYYY-MM-DD HH:mm:ss')}
                      onChange={(date, dateString) =>
                        this.setState({date: moment(dateString).format('x')})
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </FormItem>
            {nav === 1 && (
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
                      //disabledTime={this.disabledDateTime}
                      showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                      onChange={(date, dateString) =>
                        this.setState({stopTime: moment(dateString).format('x')})
                      }
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="投票奖励">
                  {getFieldDecorator('reward', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: '奖励限制10000.00 ~ 1000000.00 区间',
                        initialValue: 1,
                      },
                    ],
                  })(
                    <InputNumber
                      size="large"
                      style={{width: 320}}
                      min={1}
                      max={1000000}
                      placeholder="奖励限制1 ~ 1000000.00 区间"
                    />
                  )}
                </FormItem>
              </div>
            )}

            <FormItem {...formItemLayout} label="话题类目">
              {getFieldDecorator('type')(
                <div>
                  {typeList && typeList.length > 0 && typeSelectName ? (
                    <Select
                      defaultValue={typeSelectName}
                      style={{width: 120}}
                      onChange={value => {
                        let typeTwo = typeList.find(item => item.typeId === value).childList;
                        this.setState({typeSelect: value, typeTwo});
                      }}
                    >
                      {typeList.map(typeListItem => (
                        <Option value={typeListItem.typeId} key={typeListItem.typeId}>
                          {typeListItem.name}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    '暂无分类'
                  )}
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  细分类目 <em className={styles.optional}>（选填）</em>{' '}
                </span>
              }
            >
              {getFieldDecorator('type2')(
                <div>
                  {typeTwo.length > 0 ? (
                    <RadioGroup onChange={e => this.setState({typeSelect: e.target.value})}>
                      {typeTwo.map(typeTwoItem => (
                        <Radio value={typeTwoItem.typeId} key={typeTwoItem.typeId}>
                          {typeTwoItem.name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div>
                      暂无细分类目{' '}
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => dispatch(routerRedux.push('/content/type'))}
                      >
                        去添加
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={
              <span>
                  话题标签 <em className={styles.optional}>（选填）</em>{' '}
                </span>
            }>
              {getFieldDecorator('label', {
                initialValue: voteDetail.label,
              })(<Input placeholder="输入话题标签，多个标签可用“,”分隔"/>)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{marginLeft: 8}}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({content}) => ({
  content: content,
}))(BasicForms);
