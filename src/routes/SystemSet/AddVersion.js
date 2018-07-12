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
import styles from './AddVersion.less';
import moment from 'moment/moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['sysmsg/pushMessage'],
}))
@Form.create()
class BasicForms extends PureComponent {

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    images: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      let { images } = this.state;
      let param = '';
      if (images && images.length > 0) {
        param = {
          url: images[0],
        };
      }
      if (!err) {
        this.props.dispatch({
          type: 'sysm/addVersion',
          payload: {...values,...param},
        });
      }
    });
  };
  handleNav = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysmsg/handleNav',
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
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList }, () => {
      if (file.response && file.response.code === '0') {
        let images = this.state.images;
        images.push(file.response.data);
        this.setState({ images });
      }
    });
  };

  render() {
    const { submitting, dispatch, state } = this.props;
    console.log(submitting);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
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
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="更新标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '输入更新标题',
                  },
                ],
              })(<Input placeholder="输入更新标题"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="更新内容">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入更新内容',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入更新内容"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="更新版本">
              {getFieldDecorator('version', {
                rules: [
                  {
                    required: true,
                    message: '请输入版本号(例如：1.0.0)',
                  },
                ],
              })(<Input placeholder="请输入版本号(例如：1.0.0)"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="发布方式">
              <div>
                {getFieldDecorator('status', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">发布</Radio>
                    <Radio value="0">待发布</Radio>
                  </Radio.Group>,
                )}

              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="发布平台">
              <div>
                {getFieldDecorator('type', {
                  initialValue: 'android',
                })(
                  <Radio.Group>
                    <Radio value="android">Android</Radio>
                    <Radio value="ios">iOS</Radio>
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  上传文件
                </span>
              }
            >
              <div className="clearfix">
                <Upload
                  action="/cms/common/upload"
                  data={{ type: 1 }}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage}/>
                </Modal>
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="文件大小">
              {getFieldDecorator('fileSize', {
                rules: [
                  {
                    required: true,
                    message: '请输入文件大小',
                  },
                ],
              })(
                <Input
                  placeholder="请输入文件大小"
                />,
              )}
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
