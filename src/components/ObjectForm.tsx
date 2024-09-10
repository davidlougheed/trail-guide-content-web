// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties, MouseEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import {isEqual, throttle} from "lodash";

import {Button, Form, FormInstance, Space} from "antd";
import {CheckOutlined, EyeOutlined, SaveOutlined} from "@ant-design/icons";

import {id, nop, getLocalStorageJSON, setLocalStorageJSON} from "../utils";

export const RULES_REQUIRED_BASIC = [{required: true}];

const styles: {[key: string]: CSSProperties} = {
  lastSaved: {color: "#AAA", fontStyle: "italic"},
};

export interface BaseParentObjectFormProps<ValuesType> {
  initialValues?: ValuesType;
  onFinish: (v: ValuesType) => void;
  localDataKey?: string;
  loading?: boolean;
}

interface UseObjectFormProps<ValuesType> extends BaseParentObjectFormProps<ValuesType> {
  transformInitialValues: (values: ValuesType) => any;
  transformFinalValues: (values: any) => ValuesType;
  onView: Function;
}

type ObjectForm<ValuesType> = {
  clearLocalData;
  processLocalChanges;
  localDataKey?: string;

  onFinish_: (values: ValuesType) => void;
  onValuesChange: (changedValues: any, values: any) => void;

  resetChanges: MouseEventHandler<HTMLElement>;
  submitAndView: MouseEventHandler<HTMLElement>;
  view: MouseEventHandler<HTMLElement>;

  form: FormInstance;

  editMode: boolean;
  isInInitialState: boolean;
  loading: boolean;

  lastSavedTime: string | null;

  transformedInitialValues;
};

export const useObjectForm = <ValuesType,>({
  initialValues,
  transformInitialValues,
  transformFinalValues,
  onFinish,
  onView,
  localDataKey,
  loading,
}: UseObjectFormProps<ValuesType>): ObjectForm<ValuesType> => {
  // Process parameters

  transformInitialValues = transformInitialValues || id;
  transformFinalValues = transformFinalValues || id;

  onView = onView || nop;

  // Set up hooks

  const [form] = Form.useForm();

  const editMode = useMemo(() => !!Object.keys(initialValues ?? {}).length, [initialValues]);

  const [savedData, setSavedData] = useState(getLocalStorageJSON(localDataKey));
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [initialFormRetrievedValues, setInitialFormRetrievedValues] = useState(null);
  const [isInInitialState, setIsInInitialState] = useState(true);

  const oldInitialValues = useMemo(
    () => initialValues ? {...initialValues, ...savedData} : {...savedData},
    [initialValues, savedData]);
  const newInitialValues = useMemo(() => transformInitialValues(oldInitialValues), [oldInitialValues]);

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue(newInitialValues);
    setInitialFormRetrievedValues(transformFinalValues(form.getFieldsValue(true)));
    setIsInInitialState(true);
  }, [form, newInitialValues]);

  const clearLocalData = useCallback(() => {
    if (localDataKey) {
      localStorage.removeItem(localDataKey);
    }
  }, [localDataKey]);

  const setLastSavedNow = useCallback(() => {
    const date = new Date(Date.now());
    setLastSavedTime(`${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`);
  }, []);

  // noinspection JSCheckFunctionSignatures
  const processLocalChanges = useCallback(throttle((providedValues=undefined) => {
    if (!form) return;

    const values = transformFinalValues(providedValues ?? form.getFieldsValue(true));

    setIsInInitialState(isEqual(values, initialFormRetrievedValues));

    if (!localDataKey) return;

    const valuesJSON = JSON.stringify(values);

    if (localStorage.getItem(localDataKey) !== valuesJSON) {
      console.log("saving locally", values);
      setLocalStorageJSON(localDataKey, values);
      setLastSavedNow();
    }
  }, 500), [form, localDataKey, initialFormRetrievedValues]);

  useEffect(() => {
    // noinspection JSCheckFunctionSignatures
    const interval = setInterval(processLocalChanges, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [processLocalChanges]);

  useEffect(() => {
    // Reset fields to initial value if savedData changes
    form.resetFields();
  }, [savedData]);

  // noinspection JSCheckFunctionSignatures
  const onValuesChange = useCallback(
    (_, allValues) => processLocalChanges(allValues),
    [processLocalChanges]);

  const onFinish_ = useCallback(
    v => {
      const fv = transformFinalValues({...newInitialValues, ...v});
      (onFinish ?? nop)(fv);
      // TODO: Handle saved data here for when edit mode also has it
      clearLocalData();
    },
    [transformFinalValues, newInitialValues, onFinish, clearLocalData]);

  const view = useCallback(() => {
    onView(newInitialValues);
  }, [newInitialValues]);

  const submitAndView = useCallback(() => {
    onFinish_(form.getFieldsValue(true));
    view();
  }, [form, view]);

  const resetChanges = useCallback(() => {
    setSavedData({});
    clearLocalData();
    setLastSavedNow();
  }, [clearLocalData]);

  return {
    clearLocalData,
    processLocalChanges,
    localDataKey,

    onFinish_,
    onValuesChange,

    resetChanges,
    submitAndView,
    view,

    form,

    editMode,
    isInInitialState,
    loading: loading ?? false,
    lastSavedTime,
    transformedInitialValues: newInitialValues,
  };
};

type ObjectFormProps<ValuesType> = {
  initialValues?: ValuesType;
  loading?: boolean;
  objectForm: ObjectForm<ValuesType>;
  onCancel?: MouseEventHandler<HTMLElement>;
  children: JSX.Element[];
  // TODO
}

const ObjectForm = React.memo(
  <ValuesType,>({
    initialValues,
    loading,
    objectForm,
    onCancel,
    children,
    ...props
  }: ObjectFormProps<ValuesType>) => {
    const {
      form,

      editMode,
      isInInitialState,
      lastSavedTime,
      localDataKey,
      transformedInitialValues,

      onFinish_,
      onValuesChange,

      resetChanges,
      submitAndView,
      view,
    } = objectForm;

    return <Form
      {...props}
      onFinish={onFinish_}
      form={form}
      layout="vertical"
      initialValues={transformedInitialValues}
      onValuesChange={onValuesChange}
    >
      {children}
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={editMode && isInInitialState}
            loading={loading}
            icon={<SaveOutlined />}>{editMode ? "Save" : "Submit"}</Button>

          {editMode && (
            isInInitialState ? (
              <Button onClick={view} icon={<EyeOutlined />}>View</Button>
            ) : (
              <Button onClick={submitAndView} icon={<CheckOutlined />}>Save and View</Button>
            )
          )}
          <Button disabled={editMode && isInInitialState} onClick={resetChanges}>Reset Changes</Button>

          {/* TODO: Modal for discarding changes instead of disabling */}
          {onCancel && (
            <Button htmlType="button" disabled={!isInInitialState} onClick={onCancel}>Cancel</Button>
          )}
          {(localDataKey && lastSavedTime) ? (
            <span style={styles.lastSaved}>Changes last saved locally at {lastSavedTime}.</span>
          ) : null}
        </Space>
      </Form.Item>
    </Form>;
  });

export default ObjectForm;
