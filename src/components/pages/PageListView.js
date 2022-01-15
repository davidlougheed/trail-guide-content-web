import React from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import {Button, PageHeader, Space, Table} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";

const PageListView = () => {
  const history = useHistory();

  const loadingPages = useSelector(state => state.pages.isFetching);
  const pages = useSelector(state => state.pages.items);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      render: v => v ? (<CheckOutlined/>) : (<CloseOutlined/>),
    },
    {
      title: "Actions",
      key: "actions",
      render: page => (
        <Space size="middle">
          <Button icon={<EyeOutlined/>}
                  onClick={() => history.push(`/pages/detail/${page.id}`)}>View</Button>
          <Button icon={<EditOutlined/>}
                  onClick={() => history.push(`/pages/edit/${page.id}`)}>Edit</Button>
        </Space>
      )
    },
  ];

  return <PageHeader
    ghost={false}
    title="Pages"
    subTitle="View and edit app pages"
  >
    <Table bordered={true} loading={loadingPages} columns={columns} dataSource={pages} rowKey="id" />
  </PageHeader>;
};

export default PageListView;
