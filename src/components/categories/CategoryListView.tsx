// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table, type TableColumnsType} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

import {useAppDispatch} from "../../hooks";
import {deleteCategory} from "../../modules/categories/actions";
import {useCategories} from "../../modules/categories/hooks";
import type {Category} from "../../modules/categories/types";
import {useStations} from "../../modules/stations/hooks";
import type {Station} from "../../modules/stations/types";
import {ACCESS_TOKEN_MANAGE} from "../../utils";

import CategoryIcon from "./CategoryIcon";

type CategoryTableItem = Category & {
  stations: Station[],
};

const CategoryListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const { initialFetchDone, isFetching, items: categories } = useCategories();
  const { items: stations, isFetching: stationsFetching, initialFetchDone: initialStationFetchDone } = useStations();

  const categoryTableItems = useMemo<CategoryTableItem[]>(
    () => categories.map((s) => ({...s, stations: stations.filter((station) => station.category === s.id) })),
    [categories, stations]
  );

  const [delCategory, setDelCategory] = useState<CategoryTableItem | null>(null);

  const onAdd = useCallback(() => navigate("../add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add New</Button>,
  ], [onAdd]);

  const columns = useMemo<TableColumnsType<CategoryTableItem>>(() => [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Icon",
      dataIndex: "icon_svg",
      render: (path: string) => path ? <CategoryIcon path={path} /> : null,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (category) => (
        <Space size="small">
          <Button icon={<EditOutlined />}
                  onClick={() => navigate(`../edit/${category.id}`)}>Edit</Button>
          <Button
            icon={<DeleteOutlined />}
            danger={true}
            onClick={() => setDelCategory(category)}
            disabled={(!initialStationFetchDone && stationsFetching) || category.stations.length > 0}
          >Delete</Button>
        </Space>
      )
    },
  ], [navigate, initialStationFetchDone, stationsFetching]);

  const closeDelModal = useCallback(() => setDelCategory(null), []);

  const onDelete = useCallback(async () => {
    if (!delCategory) return;
    if (delCategory.stations.length) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(deleteCategory(delCategory.id, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delCategory]);

  return <PageHeader ghost={false} title="Categories" subTitle="View station categories" extra={extra}>
    <Modal title={`Delete category: ${delCategory?.id}`}
           open={!!delCategory}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary"
                     danger={true}
                     icon={<DeleteOutlined />}
                     onClick={onDelete}>Delete</Button>
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the category &ldquo;{delCategory?.id}&rdquo;?
    </Modal>
    <Table
      bordered={true}
      size="small"
      loading={!initialFetchDone && isFetching}
      columns={columns}
      dataSource={categoryTableItems}
      rowKey="id"
      pagination={false}
    />
  </PageHeader>;
});

export default CategoryListView;
