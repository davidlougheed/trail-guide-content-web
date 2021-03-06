// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import {Button, Divider, Input, List, Select} from "antd";
import {DragOutlined} from "@ant-design/icons";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import {assetIdToBytesUrl} from "../utils";


const SortableItem = React.memo(({id, asset, caption, remove, onChangeCaption}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    // animateLayoutChanges: () => true,
    id,
  });

  const style = useMemo(() => ({
    transform: CSS.Translate.toString(transform),
    transition,
  }), [transform, transition]);

  return <div ref={setNodeRef} style={style}>
    <List.Item extra={
      <img height={100}
           alt={asset?.file_name ?? ""}
           src={assetIdToBytesUrl(asset?.id)}
      />
    } actions={[<a key="remove-item" onClick={() => remove(id)}>Remove</a>]}>
      <div {...attributes} {...listeners} style={{marginBottom: 8, cursor: "pointer"}}>
        <DragOutlined /> <span style={{color: "#CCC"}}>Drag to Rearrange</span>
      </div>
      <List.Item.Meta
        title={asset?.file_name ?? ""}
        description={`${((asset?.file_size ?? 0) / 1000).toFixed(0)} KB`} />
      <Input value={caption} onChange={e => onChangeCaption(e.target.value)} placeholder="Caption" />
    </List.Item>
  </div>;
});


const SortableGalleryInput = React.memo(({value, onChange}) => {
  const [toAdd, setToAdd] = useState(null);

  const items = value ?? [];

  const assets = useSelector(state => state.assets.items.filter(a => a.asset_type === "image"));
  const assetsByID = useMemo(() => Object.fromEntries(assets.map(a => [a.id, a])), [assets]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(({active, over}) => {
    if (active.id === over.id) return;

    onChange(arrayMove(
      items,
      items.findIndex(i => i.asset === active.id),
      items.findIndex(i => i.asset === over.id),
    ));
  }, [onChange, items]);

  // noinspection JSValidateTypes
  return <List itemLayout="vertical" bordered={true} footer={<div>
    <Divider style={{marginTop: 0}} />
    <Input.Group compact={true}>
      <Select
        style={{width: 400}}
        value={toAdd}
        onChange={a => setToAdd(a)}
        options={assets
          .filter(a => items.find(i => i.asset === a.id) === undefined)
          .map(a => ({value: a.id, label: a.file_name}))}
      />
      <Button onClick={() => {
        if (toAdd !== null) {
          onChange([...items, {asset: toAdd, caption: ""}]);
          setToAdd(null);
        }
      }}>Add</Button>
    </Input.Group>
  </div>}>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.asset)}
        strategy={verticalListSortingStrategy}
      >
        {items.map(({asset, caption}) =>
          <SortableItem
            key={asset}
            id={asset}
            asset={assetsByID[asset]}
            caption={caption}
            onChangeCaption={newCaption =>
              onChange(items.map(i => i.asset === asset
                ? {asset, caption: newCaption}
                : i))}
            remove={asset3 => onChange(items.filter(({asset: asset2}) => asset2 !== asset3))}
          />)}
      </SortableContext>
    </DndContext>
  </List>;
});

export default SortableGalleryInput;
