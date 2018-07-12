import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Button,
  Row,
  Col,
  Card,
  Radio,
  List,
  Avatar,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';
import moment from 'moment/moment';
import { Form } from 'antd/lib/index';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const action = (
  <Fragment>
    <ButtonGroup>
      <Button>编辑</Button>
      <Button>下架</Button>
    </ButtonGroup>
  </Fragment>
);

const operationTabList = [
  {
    key: '0',
    tab: '全部',
  },
  {
    key: '2',
    tab: 'YES',
  },
  {
    key: '3',
    tab: 'NO',
  },
];

@connect(({ profile, loading, content: { voteDetail, commentList, commentListTotal } }) => ({
  voteDetail,
  commentList,
  commentListTotal,
  profile,
  loading: loading.effects['content/getCommentList', 'content/rewardTopic'],
}))
@Form.create()
export default class AdvancedProfile extends Component {
  state = {
    operationkey: '0',
    radioValue: 1,
    stepDirection: 'horizontal',
  };
  pageSize = 10;

  getCommentList(start, end, type) {
    this.props.dispatch({
      type: 'content/getCommentList',
      payload: { start: start, end: end, topicId: this.props.match.params.topicId, type: type },
    });
  }

  componentDidMount() {
    this.getCommentList(0, this.pageSize, 0);
    this.props.dispatch({
      type: 'content/getVoteDetail',
      payload: { topicId: this.props.match.params.topicId },
    });
  }

  componentWillUnmount() {
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
    this.getCommentList(0, this.pageSize, key);
  };
  onRadiaButtonChange = e => {
    this.setState({ radioValue: e.target.value });
  };

  rewardTopic = () => {
    this.props.dispatch({
      type: 'content/rewardTopic',
      payload: { topicId: this.props.match.params.topicId, yesOrNo: this.state.radioValue },
    });
  };

  render() {
    const { loading, voteDetail, commentList, commentListTotal } = this.props;
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: commentListTotal,
      onChange: (page, pageSize) => {
        this.getCommentList((page - 1) * pageSize, page * pageSize, this.state.operationkey);
      },
    };

    const ListContent = ({ data: { content, userEasyVo, greatNum, you } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>{content}</div>
        <div className={styles.listContentItem}>
          <p>{greatNum}赞</p>
        </div>
        <div className={styles.listContentItem}>
          <p>{you}YOU</p>
        </div>

        <div className={styles.listContentItem}>
          <Button>违规</Button>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout
        title={voteDetail.title}
        action={action}
        content={
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="投票"> {voteDetail.yesOrNoNum}</Description>
            <Description term="评论"> {voteDetail.commentNum}</Description>
            <Description term="投票产生奖励"> {voteDetail.yesCommentNum}</Description>
            <Description term="评论产生奖励"> {voteDetail.yesGreatNum}</Description>
            <Description term="YES"> {voteDetail.yesNum}</Description>
            <Description term="评论"> {voteDetail.yesCommentNum}</Description>
            <Description term="NO"> {voteDetail.noNum}</Description>
            <Description term="评论"> {voteDetail.noCommentNum}</Description>
          </DescriptionList>
        }
        extraContent={
          <Row>
            <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>状态</div>
              <div className={styles.heading}>正常</div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.textSecondary}>浏览</div>
              <div className={styles.heading}>32434</div>
            </Col>
          </Row>
        }
      >
        {/*TODO 判断是否符合开奖条件*/}
        <Card title='开奖' style={{ marginBottom: 24 }} bordered={false}>
          <Radio.Group defaultValue={1} onChange={this.onRadiaButtonChange}>
            <Radio value={1}>YES</Radio>
            <Radio value={0}>NO</Radio>
          </Radio.Group>
          <Button onClick={this.rewardTopic}>开奖</Button>
        </Card>
        <Card title={'描述'} style={{ marginBottom: 24 }} bordered={false}>
          <div>{voteDetail.description}</div>
        </Card>
        {/*<Card title="流程进度" style={{marginBottom: 24}} bordered={false}>*/}
        {/*<Steps direction={stepDirection} progressDot={customDot} current={1}>*/}
        {/*<Step title="创建项目" description={desc1}/>*/}
        {/*<Step title="部门初审" description={desc2}/>*/}
        {/*<Step title="财务复核"/>*/}
        {/*<Step title="完成"/>*/}
        {/*</Steps>*/}
        {/*</Card>*/}
        <Card
          title="评论列表"
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={commentList}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.userEasyVo.avatar} shape="square" size="large"/>}
                  title={item.userEasyVo.nickname}
                  description={moment(item.time).format('YYYY-MM-DD HH:mm:ss')}
                />
                <ListContent data={item}/>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
