// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, Modal, PageHeader, Typography} from "antd";
import {EditOutlined, QrcodeOutlined} from "@ant-design/icons";

import {findItemByID} from "../../utils";
import PageQR from "./PageQR";
import HTMLContent from "../HTMLContent";

const PageDetailView = () => {
  const navigate = useNavigate();
  const {id: pageID} = useParams();

  const fetchingPages = useSelector(state => state.pages.isFetching);
  const page = useSelector(state => findItemByID(state.pages.items, pageID));

  const [qrModalVisible, setQrModalVisible] = useState(false);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const showQrModal = useCallback(() => setQrModalVisible(true), []);
  const hideQrModal = useCallback(() => setQrModalVisible(false), []);
  const editPage = useCallback(() => navigate(`/pages/edit/${pageID}`), [navigate, pageID]);

  return <PageHeader
    ghost={false}
    onBack={onBack}
    title={fetchingPages ? "Loading..." : (page ? <span>Page: {page.title}</span> : <span>Page not found</span>)}
    extra={[
      <Button key="qr" icon={<QrcodeOutlined />} onClick={showQrModal} disabled={!page}>QR Code</Button>,
      <Button key="edit" icon={<EditOutlined/>} onClick={editPage} disabled={!page}>
        Edit
      </Button>,
    ]}
  >
    <Modal visible={qrModalVisible} onCancel={hideQrModal} footer={null}>
      {page ? <PageQR page={page} /> : null}
    </Modal>

    {page && <>
      <Typography.Title level={2}>{page.long_title}</Typography.Title>
      <Descriptions bordered={true} size="small">
        <Descriptions.Item label="Subtitle">{page.subtitle}</Descriptions.Item>
        <Descriptions.Item label="Menu Icon">{page.icon}</Descriptions.Item>
        <Descriptions.Item label="Enabled">{page.enabled ? "Yes" : "No"}</Descriptions.Item>
      </Descriptions>

      <Descriptions bordered={true} size="small" style={{marginTop: 16}}>
        <Descriptions.Item label="Revision" span={1}>{page.revision.number}</Descriptions.Item>
        <Descriptions.Item label="Update" span={1}>{page.revision.message}</Descriptions.Item>
        <Descriptions.Item label="Last Updated" span={1}>{page?.revision.timestamp}</Descriptions.Item>
      </Descriptions>

      <Card size="small" title="Content" style={{marginTop: 16}}>
        <HTMLContent id="page-detail-content" htmlContent={page.content} />
      </Card>
    </>}
  </PageHeader>;
};

export default PageDetailView;
