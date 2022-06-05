import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import {Button, Modal, PageHeader, Space, Table} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, QrcodeOutlined} from "@ant-design/icons";

import PageQR from "./PageQR";

const QRModal = React.memo(({page, modalCancel}) => {
  return <Modal title={page?.title}
                style={{top: 36}}
                visible={!!page}
                onCancel={modalCancel}
                footer={null}>
    {page ? <PageQR page={page} /> : null}
  </Modal>;
});

const PageListView = React.memo(() => {
  const navigate = useNavigate();

  const loadingPages = useSelector(state => state.pages.isFetching);
  const pages = useSelector(state => state.pages.items);

  const [qrPage, setQrPage] = useState(null);

  const columns = useMemo(() => [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      shouldCellUpdate: (r, pr) => (r?.enabled !== pr?.enabled),
      render: v => v ? (<CheckOutlined/>) : (<CloseOutlined/>),
    },
    {
      title: "Actions",
      key: "actions",
      shouldCellUpdate: (r, pr) => (r?.id !== pr?.id),
      render: page => (
        <Space size="small">
          <Button icon={<QrcodeOutlined />}
                  onClick={() => setQrPage(page)}>QR</Button>
          <Button icon={<EyeOutlined/>}
                  onClick={() => navigate(`../detail/${page.id}`)}>View</Button>
          <Button icon={<EditOutlined/>}
                  onClick={() => navigate(`../edit/${page.id}`)}>Edit</Button>
        </Space>
      )
    },
  ], [navigate]);

  const modalCancel = useCallback(() => setQrPage(null), []);

  return <PageHeader ghost={false} title="Pages" subTitle="View and edit app pages">
    <QRModal page={qrPage} modalCancel={modalCancel} />
    <Table bordered={true} loading={loadingPages} columns={columns} dataSource={pages} rowKey="id" />
  </PageHeader>;
});

export default PageListView;
