import React from "react";

import {PageHeader, Table} from "antd";

import {useUrlPagination} from "../../hooks/pages";
import {useCategories} from "../../modules/categories/hooks";

const COLUMNS = [
  {
    "title": "ID",
    "dataIndex": "id",
  },
  // {
  //   "title": "Icon",
  //   "dataIndex": "icon_svg",
  // },
  // {
  //     "title": "Actions",
  //     "key": "actions",
  // },
];

const CategoriesPage = React.memo(() => {
  const { initialFetchDone, isFetching, items } = useCategories();

  const pagination = useUrlPagination();

  return <PageHeader ghost={false} title="Categories" subTitle="View station categories">
    <Table
      bordered={true}
      size="small"
      loading={!initialFetchDone && isFetching}
      columns={COLUMNS}
      dataSource={items}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default CategoriesPage;
