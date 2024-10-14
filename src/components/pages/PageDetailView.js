// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {Button, Descriptions, Divider, Modal, PageHeader} from "antd";
import {EditOutlined, QrcodeOutlined} from "@ant-design/icons";

import {detailTitle, findItemByID, timestampToString} from "../../utils";

import PageQR from "./PageQR";
import HTMLContent from "../HTMLContent";
import TGCPreviewHeader from "../TGCPreviewHeader";
import TGCPreviewContent from "../TGCPreviewContent";

const styles = {
  revision: {marginTop: 16},
  content: {marginTop: 16},
};

const QRModal = React.memo(({qrModalOpen, hideQrModal, page}) => {
  return <Modal open={qrModalOpen} onCancel={hideQrModal} footer={null}>
    <PageQR page={page} />
  </Modal>;
});

const PagePreview = React.memo(({page}) => {
  return <div className="tgc-preview page-preview">
    <TGCPreviewHeader headerImage={page.header_image} longTitle={page.long_title} subtitle={page.subtitle} />
    <TGCPreviewContent>
      <HTMLContent id="page-detail-content" htmlContent={page?.content ?? ""} />
    </TGCPreviewContent>
  </div>;
});

const pageDetailTitle = detailTitle("Page", "title");

const PageDetailView = React.memo(() => {
  const navigate = useNavigate();
  const {id: pageID} = useParams();

  const pagesInitialFetch = useSelector(state => state.pages.initialFetchDone);
  const pagesFetching = useSelector(state => state.pages.isFetching);
  const page = useSelector(state => findItemByID(state.pages.items, pageID));

  const [qrModalOpen, setQrModalOpen] = useState(false);

  const onBack = useCallback(() => navigate(-1), [navigate]);
  const showQrModal = useCallback(() => setQrModalOpen(true), []);
  const hideQrModal = useCallback(() => setQrModalOpen(false), []);
  const editPage = useCallback(() => navigate(`/pages/edit/${pageID}`), [navigate, pageID]);

  const title = useMemo(
    () => pageDetailTitle(page, pagesInitialFetch, pagesFetching),
    [pagesInitialFetch, pagesFetching, page]);
  const extra = useMemo(() => [
    <Button key="qr" icon={<QrcodeOutlined />} onClick={showQrModal} disabled={!page}>QR Code</Button>,
    <Button key="edit" icon={<EditOutlined/>} onClick={editPage} disabled={!page}>Edit</Button>,
  ], [page, showQrModal, editPage]);

  return <PageHeader ghost={false} onBack={onBack} title={title} extra={extra}>
    <QRModal qrModalOpen={qrModalOpen} hideQrModal={hideQrModal} page={page} />
    <div>
      <Descriptions bordered={true} size="small">
        <Descriptions.Item label="Subtitle">{page?.subtitle ?? ""}</Descriptions.Item>
        <Descriptions.Item label="Menu Icon">{page?.icon ?? ""}</Descriptions.Item>
        <Descriptions.Item label="Enabled">{page?.enabled ? "Yes" : "No"}</Descriptions.Item>
      </Descriptions>

      <Descriptions bordered={true} size="small" style={styles.revision}>
        <Descriptions.Item label="Revision" span={1}>{page?.revision?.number ?? ""}</Descriptions.Item>
        <Descriptions.Item label="Update" span={1}>{page?.revision?.message ?? ""}</Descriptions.Item>
        <Descriptions.Item label="Last Updated" span={1}>
          {timestampToString(page?.revision?.timestamp)}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {page && <PagePreview page={page} />}
    </div>
  </PageHeader>;
});

export default PageDetailView;
