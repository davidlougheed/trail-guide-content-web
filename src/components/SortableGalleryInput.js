import React, {useState} from "react";
import {useSelector} from "react-redux";

import {Button, Input, List, Select} from "antd";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {assetIdToBytesUrl} from "../utils";


const SortableItem = ({id, asset, caption, remove, onChangeCaption}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div ref={setNodeRef} style={style}>
    <List.Item extra={
      <img height={100}
           alt={asset.file_name}
           src={assetIdToBytesUrl(asset.id)}
      />
    } actions={[<a key="remove-item" onClick={() => remove(id)}>Remove</a>]}>
      <div {...attributes} {...listeners} style={{marginBottom: 8, cursor: "pointer"}}>
        <DragOutlined /> <span style={{color: "#CCC"}}>Drag to Rearrange</span>
      </div>
      <List.Item.Meta
        title={asset.file_name}
        description={`${(asset.file_size / 1000).toFixed(0)} KB`} />
      <Input value={caption} onChange={e => onChangeCaption(e.target.value)} placeholder="Caption" />
    </List.Item>
  </div>;
};


const SortableGalleryInput = ({value, onChange}) => {
  const [toAdd, setToAdd] = useState(null);

  const items = value ?? [];

  const assets = useSelector(state => state.assets.items.filter(a => a.asset_type === "image"));
  const assetsByID = Object.fromEntries(assets.map(a => [a.id, a]));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({active, over}) => {
    if (active.id === over.id) return;
    onChange(arrayMove(
      items,
      items.indexOf(active.id),
      items.indexOf(over.id),
    ));
  };

  // noinspection JSValidateTypes
  return <List itemLayout="vertical" bordered={true} footer={<div>
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
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
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
};

export default SortableGalleryInput;
