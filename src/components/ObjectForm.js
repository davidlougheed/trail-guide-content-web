// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Form, Space} from "antd";
import {id, nop} from "../utils";
import {isEqual, throttle} from "lodash";
import {CheckOutlined, EyeOutlined, SaveOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

export const RULES_REQUIRED_BASIC = [{required: true}];

const styles = {
  lastSaved: {color: "#AAA", fontStyle: "italic"},
};

const getLocalStorageValues = k => {
  if (!k) {
    return {};
  }
  const ls = localStorage.getItem(k);
  return ls ? JSON.parse(ls) : {};
};

const ObjectForm = React.memo(
  ({
     initialValues,
     transformInitialValues,
     transformFinalValues,
     onFinish,
     onCancel,
     loading,
     localDataKey,
     children,
     ...props
  }) => {
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [savedData, setSavedData] = useState(getLocalStorageValues(localDataKey));
    const [lastSavedTime, setLastSavedTime] = useState(null);

    const transformInitialValues_ = transformInitialValues || id;
    const transformFinalValues_ = transformFinalValues || id;

    const oldInitialValues = initialValues ?? {};

    const newInitialValues = useMemo(() => transformInitialValues_(oldInitialValues), [oldInitialValues]);

    const [initialFormRetrievedValues, setInitialFormRetrievedValues] = useState(null);
    const [isInInitialState, setIsInInitialState] = useState(true);

    useEffect(() => {
      if (!form) return;
      form.setFieldsValue(newInitialValues);
      setInitialFormRetrievedValues(transformFinalValues_(form.getFieldsValue(true)));
    }, [form])

    const clearLocalData = useCallback(() => {
      if (localDataKey) {
        localStorage.removeItem(localDataKey);
      }
    }, [localDataKey]);

    const processLocalChanges = useCallback(throttle((providedValues=undefined) => {
      if (!form) return;

      const values = transformFinalValues_(providedValues ?? form.getFieldsValue(true));

      console.log(values, initialFormRetrievedValues);

      setIsInInitialState(isEqual(values, initialFormRetrievedValues));

      if (!localDataKey) return;

      const valuesJSON = JSON.stringify(values);

      if (localStorage.getItem(localDataKey) !== valuesJSON) {
        console.log("saving locally", values);
        localStorage.setItem(localDataKey, JSON.stringify(values));
        const date = new Date(Date.now());
        setLastSavedTime(`${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`);
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

    // noinspection JSValidateTypes,JSCheckFunctionSignatures
    const onValuesChange = useCallback(
      (_, allValues) => processLocalChanges(allValues),
      [processLocalChanges]);


    const onFinish_ = useCallback(
      v => {
        const fv = transformFinalValues_({...newInitialValues, ...v});
        (onFinish ?? nop)(fv);
        clearLocalData();
        setInitialFormRetrievedValues(fv);
        setIsInInitialState(true);
      },
      [transformFinalValues_, newInitialValues, onFinish, clearLocalData]);


    const view = useCallback(() => {
      if (!newInitialValues.id) return;
      navigate(`/stations/detail/${newInitialValues.id}`, {replace: true});
    }, [navigate, newInitialValues]);

    const submitAndView = useCallback(() => {
      onFinish_(form.getFieldsValue(true));
      view();
    }, [form, view]);

    const resetChanges = useCallback(() => {
      setSavedData({});
      clearLocalData();
    }, [clearLocalData]);


    return <Form
      {...props}
      onFinish={onFinish_}
      form={form}
      layout="vertical"
      initialValues={newInitialValues}
      onValuesChange={onValuesChange}
    >
      {children}
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            disabled={initialValues && isInInitialState}
            loading={loading}
            icon={<SaveOutlined />}>{initialValues ? "Save" : "Submit"}</Button>

          {initialValues && (
            isInInitialState ? (
              <Button onClick={view} icon={<EyeOutlined />}>View</Button>
            ) : (
              <Button onClick={submitAndView} icon={<CheckOutlined />}>Save and View</Button>
            )
          )}
          <Button disabled={isInInitialState} onClick={resetChanges}>Reset Changes</Button>

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
