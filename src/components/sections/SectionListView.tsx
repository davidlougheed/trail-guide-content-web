// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useAuth0} from "@auth0/auth0-react";

import {Button, Modal, PageHeader, Space, Table, type TableColumnsType} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

import {useUrlPagination} from "../../hooks/pages";
import {useStations} from "../../modules/stations/hooks";
import type {Station} from "../../modules/stations/types";
import {deleteSection} from "../../modules/sections/actions";
import {useSections} from "../../modules/sections/hooks";
import type {Section} from "../../modules/sections/types";
import {ACCESS_TOKEN_MANAGE} from "../../utils";
import {useAppDispatch} from "../../hooks";
import SectionColorCircle from "./SectionColorCircle";

type SectionTableItem = Section & {
  stations: Station[],
};

const SectionListView = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {getAccessTokenSilently} = useAuth0();

  const { initialFetchDone: sectionsInitialFetch, isFetching: sectionsFetching, items: sections } = useSections();
  const { items: stations, isFetching: stationsFetching } = useStations();

  const [delSection, setDelSection] = useState<SectionTableItem | null>(null);

  const sectionTableItems = useMemo<SectionTableItem[]>(
    () => sections.map((s) => ({...s, stations: stations.filter((station) => station.section === s.id) })),
    [sections, stations]
  );

  const pagination = useUrlPagination();

  const onAdd = useCallback(() => navigate("../add"), [navigate]);
  const extra = useMemo(() => [
    <Button key="add"
            type="primary"
            icon={<PlusOutlined/>}
            onClick={onAdd}>
      Add New</Button>,
  ], [onAdd]);

  const columns = useMemo<TableColumnsType<SectionTableItem>>(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Colour",
        dataIndex: "color",
        render: (color) => <div style={{display: "flex", gap: "0.7rem", alignItems: "center"}}>
          <SectionColorCircle hex={color}/>
          <span style={{fontFamily: "monospace"}}>#{color}</span>
        </div>,
      },
      {
        title: "Stations",
        dataIndex: "stations",
        render: (stations) => <>{!sectionsInitialFetch && stationsFetching ? "" : stations.length}</>,
      },
      {
        title: "Rank",
        dataIndex: "rank",
      },
      {
        title: "Actions",
        key: "actions",
        width: 200,
        render: (section: SectionTableItem) => (
          <Space size="small">
            <Button icon={<EditOutlined />}
                    onClick={() => navigate(`../edit/${section.id}`)}>Edit</Button>
            <Button
              icon={<DeleteOutlined />}
              danger={true}
              onClick={() => setDelSection(section)}
              disabled={stationsFetching || section.stations.length > 0}
            >Delete</Button>
          </Space>
        ),
      },
    ],
    [navigate, stationsFetching]
  );

  const closeDelModal = useCallback(() => setDelSection(null), []);

  const onDelete = useCallback(async () => {
    if (!delSection) return;
    if (delSection.stations.length) return;
    try {
      const token = await getAccessTokenSilently(ACCESS_TOKEN_MANAGE);
      await dispatch(deleteSection(delSection.id, token));
    } catch (e) {
      console.error(e);
    }
    closeDelModal();
  }, [dispatch, getAccessTokenSilently, delSection]);

  return <PageHeader ghost={false} title="Sections" subTitle="View station sections" extra={extra}>
    <Modal title={`Delete section: ${delSection?.title}`}
           open={!!delSection}
           onCancel={closeDelModal}
           footer={<Space>
             <Button type="primary"
                     danger={true}
                     icon={<DeleteOutlined />}
                     onClick={onDelete}>Delete</Button>
             <Button onClick={closeDelModal}>Cancel</Button>
           </Space>}>
      Are you sure you wish to delete the section &ldquo;{delSection?.title}&rdquo;?
    </Modal>
    <Table<SectionTableItem>
      bordered={true}
      size="small"
      loading={!sectionsInitialFetch && sectionsFetching}
      columns={columns}
      dataSource={sectionTableItems}
      rowKey="id"
      pagination={pagination}
    />
  </PageHeader>;
});

export default SectionListView;
