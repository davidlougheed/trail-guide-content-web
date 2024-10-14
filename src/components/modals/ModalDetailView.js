// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Card, Descriptions, PageHeader, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";

import {detailTitle, findItemByID} from "../../utils";
import HTMLContent from "../HTMLContent";

const styles = {
  revision: {marginTop: 16},
  modalCard: {marginTop: 16},
};

const modalDetailTitle = detailTitle("Modal", "title");

const ModalDetailView = React.memo(() => {
  const navigate = useNavigate();
  const {id: modalID} = useParams();

  const modalsInitialFetch = useSelector(state => state.modals.initialFetchDone);
  const modalsFetching = useSelector(state => state.modals.isFetching);
  const modal = useSelector(state => findItemByID(state.modals.items, modalID));

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const editModal = useCallback(() => navigate(`/modals/edit/${modalID}`), [navigate, modalID]);

  const title = useMemo(
    () => modalDetailTitle(modal, modalsInitialFetch, modalsFetching),
    [modalsInitialFetch, modalsFetching, modal]);
  const extra = useMemo(() => [
    <Button key="edit" icon={<EditOutlined/>} onClick={editModal}>Edit</Button>,
  ], [editModal]);

  return <PageHeader ghost={false} onBack={onBack} title={title} extra={extra}>
    <Typography.Title level={2}>{modal.title}</Typography.Title>
    <Descriptions bordered={true} size="small">
      <Descriptions.Item label="Close Text">{modal.close_text}</Descriptions.Item>
    </Descriptions>

    <Descriptions bordered={true} size="small" style={styles.revision}>
      <Descriptions.Item label="Revision" span={1}>{modal?.revision?.number ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Update" span={1}>{modal?.revision?.message ?? ""}</Descriptions.Item>
      <Descriptions.Item label="Last Updated" span={1}>{modal?.revision?.timestamp ?? ""}</Descriptions.Item>
    </Descriptions>

    <Card size="small" title="Content" style={styles.modalCard}>
      <HTMLContent id="modal-detail-content" htmlContent={modal?.content} />
      <Button>{modal?.close_text}</Button>
    </Card>
  </PageHeader>;
});

export default ModalDetailView;
