// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties, useCallback, useMemo, useState} from "react";

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

import {helpText as helpTextStyle} from "../styles";
import {assetIdToBytesUrl} from "../utils";
import {useAppSelector} from "../hooks";

import type {Asset} from "../modules/assets/types";


const styles: {[key: string]: CSSProperties} = {
  sortableItemStyle: {
    border: "1px solid #f0f0f0",
    margin: "8px 24px",
  },
  sortableItemDragHandle: {marginBottom: 8, cursor: "pointer"},
  sortableItemDragHandleText: {color: "#AAA"},
  listItem: {padding: 12},
  listItemDescription: {display: "flex", flexDirection: "row", alignItems: "center", gap: 16},

  helpParagraph: {...helpTextStyle, marginBottom: 0},
  footerDivider: {marginTop: 0},
  assetSelect: {width: 400},
};

type SortableItemProps = {
  id: string;
  asset: Asset;
  caption: string;
  remove: (id: string) => void;
  onChangeCaption: (caption: string) => void;
};

const SortableItem = React.memo(({id, asset, caption, remove, onChangeCaption}: SortableItemProps) => {
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

  const style = useMemo<CSSProperties>(() => ({
    transform: CSS.Translate.toString(transform),
    transition,
    ...styles.sortableItemStyle,
  }), [transform, transition]);

  const actions = useMemo<JSX.Element[]>(() =>
    [<a key="remove-item" onClick={() => remove(id)}>Remove</a>], [remove]);

  return <div ref={setNodeRef} style={style}>
    <List.Item style={styles.listItem} extra={
      <img height={100} alt={asset?.file_name ?? ""} src={assetIdToBytesUrl(asset?.id)} />
    } actions={actions}>
      <div {...attributes} {...listeners} style={styles.sortableItemDragHandle}>
        <DragOutlined /> <span style={styles.sortableItemDragHandleText}>Drag to Rearrange</span>
      </div>
      <List.Item.Meta
        title={asset?.file_name ?? ""}
        description={<div style={styles.listItemDescription}>
          <span>{((asset?.file_size ?? 0) / 1000).toFixed(0)}&nbsp;KB</span>
          <Input value={caption} onChange={e => onChangeCaption(e.target.value)} placeholder="Caption" />
        </div>} />
    </List.Item>
  </div>;
});


const SortableGalleryInputHeader = React.memo(() => <div>
  <p style={styles.helpParagraph}>
    Select image assets to add to the gallery. Added images can then be given a caption and
    rearranged as desired.
  </p>
</div>);

interface SortableGalleryInputProps {
  value?: ({
    asset: string;
    caption: string;
  })[];
  onChange?: Function;
}

const SortableGalleryInput = React.memo(({value, onChange}: SortableGalleryInputProps) => {
  const [toAdd, setToAdd] = useState<string | null>(null);

  const items = value ?? [];
  const itemAssets = useMemo(() => items.map(item => item.asset), [items]);

  const assets = useAppSelector(state => state.assets.items.filter(a => a.asset_type === "image"));
  const assetsByID = useMemo(() => Object.fromEntries(assets.map(a => [a.id, a])), [assets]);

  const imageAssetItems = useMemo(() => assets
    .filter(a => items.find(i => i.asset === a.id) === undefined)
    .map(a => ({value: a.id, label: a.file_name})),
    [assets]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(({active, over}) => {
    if (!onChange) return;
    if (active.id === over.id) return;

    onChange(arrayMove(
      items,
      items.findIndex(i => i.asset === active.id),
      items.findIndex(i => i.asset === over.id),
    ));
  }, [onChange, items]);

  const onAssetSelectChange = useCallback((a: string) => setToAdd(a), []);
  const onImageAdd = useCallback(() => {
    if (!onChange) return;
    if (toAdd !== null) {
      onChange([...items, {asset: toAdd, caption: ""}]);
      setToAdd(null);
    }
  }, [onChange, toAdd]);
  const onItemRemove = useCallback(
    (asset3: string) => onChange(items.filter(({asset: asset2}) => asset2 !== asset3)),
    [onChange, items]);

  // noinspection JSValidateTypes
  return <List itemLayout="vertical" bordered={true} header={<SortableGalleryInputHeader />} footer={<div>
    {!!items.length && <Divider style={styles.footerDivider} />}
    <Input.Group compact={true}>
      <Select style={styles.assetSelect} value={toAdd} onChange={onAssetSelectChange} options={imageAssetItems} />
      <Button onClick={onImageAdd}>Add</Button>
    </Input.Group>
  </div>}>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemAssets} strategy={verticalListSortingStrategy}>
        {items.map(({asset, caption}) =>
          <SortableItem
            key={asset}
            id={asset}
            asset={assetsByID[asset]}
            caption={caption}
            onChangeCaption={(newCaption: string) =>
              onChange(items.map(i => i.asset === asset
                ? {asset, caption: newCaption}
                : i))}
            remove={onItemRemove}
          />)}
      </SortableContext>
    </DndContext>
  </List>;
});

export default SortableGalleryInput;
