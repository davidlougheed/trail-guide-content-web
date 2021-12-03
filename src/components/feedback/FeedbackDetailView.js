// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {findItemByID} from "../../utils";

const FeedbackDetailView = () => {
  const history = useHistory();
  const {id: feedbackID} = useParams();

  const feedback = useSelector(state => findItemByID(state.feedback.items, feedbackID));

  if (!feedback) return "Loading...";

  const feedbackDate = Date.parse(feedback.submitted);

  return <PageHeader
    ghost={false}
    onBack={() => history.goBack()}
    title={<span>Feedback from {feedbackDate.toLocaleString()}</span>}
    extra={[
      <Button key="edit" icon={<EditOutlined/>} onClick={() => history.push(`/pages/edit/${feedbackID}`)}>
        Edit
      </Button>,
    ]}
  >
    <Typography.Title level={2}>{feedback.long_title}</Typography.Title>
    <Descriptions bordered={true}>
      <Descriptions.Item label="From Name">{feedback.from.name}</Descriptions.Item>
      <Descriptions.Item label="Menu Icon">{feedback.from.email}</Descriptions.Item>
      <Descriptions.Item label="Time Submitted">{feedbackDate.toLocaleString()}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="Content" style={{marginTop: 16}}>
      {feedback.content}
    </Card>
  </PageHeader>;
};

export default FeedbackDetailView;
