import React from "react";
import {useSelector} from "react-redux";

import {PageHeader, Table} from "antd";

const COLUMNS = [
  {
    "title": "ID",
    "dataIndex": "id",
  },
  {
    "title": "Title",
    "dataIndex": "title",
  },
  // {
  //     "title": "Actions",
  //     "key": "actions",
  // },
];

const SectionsPage = () => {
  const loadingSections = useSelector(state => state.sections.isFetching);
  const sections = useSelector(state => state.sections.items);

  return <PageHeader
    ghost={false}
    title="Sections"
    subTitle="View station sections"
  >
    <Table
      bordered={true}
      loading={loadingSections}
      columns={COLUMNS}
      dataSource={sections}
      rowKey="id"
    />
  </PageHeader>;
};

export default SectionsPage;
