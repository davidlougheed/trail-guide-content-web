// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {findItemByID} from "../../utils";

const ModalDetailView = () => {
  const navigate = useNavigate();
  const {id: modalID} = useParams();

  const fetchingModals = useSelector(state => state.modals.isFetching);
  const modal = useSelector(state => findItemByID(state.modals.items, modalID));

  if (!modal) return "Loading...";

  return <PageHeader
    ghost={false}
    onBack={() => navigate(-1)}
    title={fetchingModals ? "Loading..." : <span>Modal: {modal.title}</span>}
    extra={[
      <Button key="edit" icon={<EditOutlined/>} onClick={() => navigate(`/modals/edit/${modalID}`)}>
        Edit
      </Button>,
    ]}
  >
    <Typography.Title level={2}>{modal.title}</Typography.Title>
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="Close Text">{modal.close_text}</Descriptions.Item>
    </Descriptions>

    <Descriptions bordered={true} size="small" style={{marginTop: 16}}>
      <Descriptions.Item label="Revision" span={1}>{modal?.revision?.number ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Update" span={1}>{modal?.revision?.message ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Last Updated" span={1}>{modal?.revision?.timestamp ?? ""}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="Content" style={{marginTop: 16}}>
      <div className="modal-detail-content" dangerouslySetInnerHTML={{__html: modal.content}} />
      <Button>{modal?.close_text}</Button>
    </Card>
  </PageHeader>;
};

export default ModalDetailView;
