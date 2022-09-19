import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";

import {throttle, isEqual} from "lodash";

import {Button, Card, Col, Divider, Form, Input, Row, Select, Space, Switch, Tooltip} from "antd";
import {
  CheckOutlined,
  CloseCircleOutlined,
  DownOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UpOutlined
} from "@ant-design/icons";

import {helpText as helpTextStyle} from "../../styles";

import HTMLEditor from "../editor/HTMLEditor";
import SortableGalleryInput from "../SortableGalleryInput";
import {useNavigate} from "react-router-dom";

// Maximum number of days each month can have.
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const contentTypes = [
  {value: "html", label: "Rich Text"},
  {value: "gallery", label: "Gallery"},
  {value: "quiz", label: "Quiz"},
];

const quizTypes = [
  {value: "match_values", label: "Match values"},
  {value: "select_all_that_apply", label: "Select all that apply"},
  {value: "choose_one", label: "Choose the correct option"},
];

const normalizeHTMLContent = content => {
  if (!content) return "";
  content = content.trim();
  if (["", "<p><br></p>", "<p></p>"].includes(content)) {
    // Annoying WYSIWYG "blanks"
    return "";
  }
  return content;
};

const contentItemField = i => k => `contents_${i}_${k}`;
const normalizeContents = c => c ? ({
  ...c,
  title: c.title || "",

  ...(c.content_type === "html" ? {
    content_before_fold: normalizeHTMLContent(c.content_before_fold),
    content_after_fold: normalizeHTMLContent(c.content_after_fold),
  } : {}),

  ...(c.content_type === "gallery" ? {
    description: normalizeHTMLContent(c.description),
    items: c.items || []
  } : {}),

  ...(c.content_type === "quiz" ? {
    question: normalizeHTMLContent(c.question),
    answer: normalizeHTMLContent(c.answer),
    options: (c.options || []).map(o => ({
      ...o,

      ...(["select_all_that_apply", "choose_one"].includes(c.quiz_type) ? {
        // "cast" these answers to booleans
        answer: o.answer,  // fromAPI ? (o.answer ? "true" : "false") : (o.answer === "true"),
      } : {}),
    })),
  } : {}),
}) : ({
  content_type: null,
  title: "",
});

const monthDayValidator = (r, v) => {
  if (!v) return Promise.resolve();

  if (!/^\d{2}-\d{2}$/.test(v)) {
    return Promise.reject(r.message);
  }

  const [month, day] = v.split("-").map(e => parseInt(e, 10));
  if (month < 1 || month > 12 || day < 1 || day > MONTH_DAYS[month - 1]) {
    return Promise.reject(r.message);
  }

  return Promise.resolve();
};

const getLocalStorageValues = k => {
  if (!k) {
    return {};
  }
  const ls = localStorage.getItem(k);
  return ls ? JSON.parse(ls) : {};
};

const StationForm = React.memo(({onFinish, initialValues, loading, localDataKey, ...props}) => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const sections = useSelector(state => state.sections.items);
  const numStations = useSelector(state => state.stations.items.length);
  const categories = useSelector(state => state.categories.items);
  const assets = useSelector(state => state.assets.items);

  const [savedData, setSavedData] = useState(getLocalStorageValues(localDataKey));
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const oldInitialValues = useMemo(
    () => initialValues ? {...initialValues, ...savedData} : {...savedData},
    [initialValues, savedData]);

  console.log("initial values", oldInitialValues);
  const newInitialValues = useMemo(() => ({
    rank: numStations,  // Add station to the end of the list in the app by default
    coordinates_utm: {
      zone: "18N",
      ...(oldInitialValues.coordinates_utm ?? {}),
    },
    ...oldInitialValues,
    enabled: !!oldInitialValues.enabled,
    revision: {
      working_copy: oldInitialValues.revision?.number ?? null,
      message: "",  // Clear revision message for possible filling out & re-submission
    },
    visible: {
      from: oldInitialValues.visible?.from || null,
      to: oldInitialValues.visible?.to || null,
    },
    contents: (oldInitialValues.contents ?? []).map(normalizeContents),
  }), [numStations, oldInitialValues]);

  const [initialFormRetrievedValues, setInitialFormRetrievedValues] = useState(null);
  const [isInInitialState, setIsInInitialState] = useState(true);

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue(newInitialValues);
    setInitialFormRetrievedValues(form.getFieldsValue(true));
  }, [form])

  const contentsRefs = useRef({});
  const getContentKey = useCallback((k, i) => ({
    [k]: normalizeHTMLContent(contentsRefs?.current[contentItemField(i)(k)]?.getEditor()?.root?.innerHTML),
  }), [contentsRefs]);

  const processValues = useCallback(values => ({
    ...values,

    title: values.title ?? "",
    long_title: values.long_title ?? "",
    subtitle: values.subtitle ?? "",

    // Properly type everything
    visible: {
      from: values.visible.from || null,
      to: values.visible.to || null,
    },
    header_image: values.header_image ?? null,
    coordinates_utm: {
      ...values.coordinates_utm,
      east: values.coordinates_utm.east ? parseInt(values.coordinates_utm.east, 10) : undefined,
      north: values.coordinates_utm.north ? parseInt(values.coordinates_utm.north, 10) : undefined,
    },
    contents: (values.contents.map(normalizeContents) ?? []).map((c, ci) => {
      switch (c.content_type) {
        case "html":
          return {
            ...c,
            ...getContentKey("content_before_fold", ci),
            ...getContentKey("content_after_fold", ci),
          };
        case "gallery":
          return {
            ...c,
            ...getContentKey("description", ci),
          };
        case "quiz":
          return {
            ...c,
            ...getContentKey("question", ci),
            ...getContentKey("answer", ci),
          };
      }
    }),
    enabled: !!values.enabled,
    rank: parseInt(values.rank),
  }), [getContentKey]);

  const clearLocalData = useCallback(() => {
    if (localDataKey) {
      localStorage.removeItem(localDataKey);
    }
  }, [localDataKey]);

  const onFinish_ = useCallback(
    values => {
      (onFinish ?? (() => {}))(processValues(values));
      clearLocalData();
    },
    [onFinish, processValues, clearLocalData]);

  // noinspection JSCheckFunctionSignatures
  const processLocalChanges = useCallback(throttle((providedValues=undefined) => {
    if (!form) return;

    const values = processValues(providedValues ?? form.getFieldsValue(true));
    console.log(values, initialFormRetrievedValues, isEqual(values, initialFormRetrievedValues));
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

  // noinspection JSValidateTypes,JSCheckFunctionSignatures
  const onValuesChange = useCallback(
    (_, allValues) => processLocalChanges(allValues),
    [processLocalChanges]);

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

  useEffect(() => {
    // Reset fields to initial value if savedData changes
    form.resetFields();
  }, [savedData]);

  const contentFieldChanged = (field, contentField) => (prevValues, newValues) => {
    const ct1 = prevValues.contents[field.name]?.[contentField];
    const ct2 = newValues.contents[field.name]?.[contentField];
    return ct1 !== ct2;
  };

  return <Form form={form}
               layout="vertical"
               initialValues={newInitialValues}
               onValuesChange={onValuesChange}
               onFinish={onFinish_}
               {...props}>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="title" label="Title" rules={[{required: true}]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item name="long_title" label="Long Title" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col flex={1}>
        <Form.Item name="subtitle" label="Subtitle" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
      </Col>
      <Col flex="140px">
        <Form.Item name={["visible", "from"]}
                   label="Visible From"
                   rules={[
                     {validator: monthDayValidator, message: "Format is MM-DD"},
                     ({getFieldValue}) => ({
                       validator: (_, v) =>
                         (!v && getFieldValue(["visible", "to"]))
                           ? Promise.reject(new Error("visible.to requires that visible.from is filled as well"))
                           : Promise.resolve(),
                     }),
                   ]}>
          <Input placeholder="MM-DD" />
        </Form.Item>
      </Col>
      <Col flex="140px">
        <Form.Item name={["visible", "to"]}
                   label="Visible To"
                   rules={[
                     {validator: monthDayValidator, message: "Format is MM-DD"},
                     ({getFieldValue}) => ({
                       validator: (_, v) =>
                         (!v && getFieldValue(["visible", "from"]))
                           ? Promise.reject(new Error("visible.from requires that visible.to is filled as well"))
                           : Promise.resolve(),
                     }),
                   ]}>
          <Input placeholder="MM-DD" />
        </Form.Item>
      </Col>
      <Col flex="80px">
        <Form.Item name="enabled" label="Enabled" valuePropName="checked">
          <Switch/>
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item name="rank" label="Rank">
          <Input type="number" min={0} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name={["coordinates_utm", "zone"]} label="UTM Zone" rules={[{required: true}]}>
          <Select>
            <Select.Option value="18N">18N</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name={["coordinates_utm", "east"]} label="Easting" rules={[{required: true}]}>
          <Input type="number" addonAfter="E" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name={["coordinates_utm", "north"]} label="Northing" rules={[{required: true}]}>
          <Input type="number" addonAfter="N" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="header_image" label="Header Image">
          <Select
            placeholder="Select header image for this station"
            allowClear={true}
            options={
              assets
                .filter(a => a.asset_type === "image")
                .map(a => ({value: a.id, label: a.file_name}))
            }
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="section" label="Section" rules={[{required: true}]}>
          <Select
            placeholder="Select app section for this station"
            options={sections.map(({id, title}) => ({value: id, label: title}))}
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="category" label="Category" rules={[{required: true}]}>
          <Select placeholder="Select category for this station"
                  options={categories.map(value => ({value}))}/>
        </Form.Item>
      </Col>
    </Row>
    <Form.List name="contents">
      {(fields, {add, move, remove}, {errors}) => (
        <>
          {errors}
          {fields.map((field, idx) => {
            const fi = contentItemField(field.name);
            return (
              <Card
                key={field.key}
                size="small"
                title="Content Item"
                style={{
                  marginBottom: "12px",
                  position: "relative",
                }}
              >
                <div style={{
                  position: "absolute",
                  height: 22,
                  top: "8px",
                  right: "12px",
                  zIndex: 1,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}>
                  <span style={{color: "#CCC"}}>#{idx + 1}</span>
                  {fields.length > 1 && <>
                    {idx > 0 && (
                      <Tooltip title="Move content item up">
                        <UpOutlined onClick={() => move(idx, idx - 1)} />
                      </Tooltip>
                    )}
                    {idx < fields.length - 1 && (
                      <Tooltip title="Move content item down">
                        <DownOutlined onClick={() => move(idx, idx + 1)} />
                      </Tooltip>
                    )}
                    <Divider type="vertical" />
                  </>}
                  <Tooltip title="Remove content item">
                    <CloseCircleOutlined style={{color: "#f5222d"}} onClick={() => remove(field.name)} />
                  </Tooltip>
                </div>
                <Form.Item noStyle={true}>
                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item {...field}
                                 validateTrigger={["onChange", "onBlur"]}
                                 key="content_type"
                                 label="Content Type"
                                 name={[field.name, "content_type"]}
                                 rules={[{required: true}]}>
                        <Select placeholder="Content Type" options={contentTypes}/>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item {...field}
                                 key="title"
                                 label="Title"
                                 name={[field.name, "title"]}>
                        <Input placeholder="Title"/>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item shouldUpdate={contentFieldChanged(field, "content_type")}
                             style={{marginBottom: 0}}>
                    {f => {
                      switch (f.getFieldValue(["contents", field.name, "content_type"])) {
                        case "html":
                          return <>
                            <p style={helpTextStyle}>
                              Use this content type for article-style content, for example mixed text and multimedia.
                            </p>
                            <Form.Item key="content_before_fold" label="Content Before Fold">
                              <HTMLEditor
                                initialValue={newInitialValues.contents[field.name]?.content_before_fold}
                                innerRef={el => {
                                  contentsRefs.current = {...contentsRefs.current, [fi("content_before_fold")]: el};
                                }}
                                helpText="Initial / above-the-fold / main content to show."
                              />
                            </Form.Item>
                            <Form.Item key="content_after_fold" label="Content After Fold" style={{marginBottom: 0}}>
                              <HTMLEditor
                                initialValue={newInitialValues.contents[field.name]?.content_after_fold}
                                innerRef={el => {
                                  contentsRefs.current = {...contentsRefs.current, [fi("content_after_fold")]: el};
                                }}
                                helpText={
                                  "Content to be hidden behind a 'Read More' button. If this is left blank, no " +
                                  "'Read More' button will be found."
                                }
                              />
                            </Form.Item>
                          </>;

                        case "gallery":
                          return <>
                            <p style={helpTextStyle}>
                              Use this content type for a gallery of images. Captions can be provided, or left out.
                            </p>
                            <Form.Item key="description"
                                       label="Description"
                                       name={[field.name, "description"]}>
                              <HTMLEditor
                                initialValue={newInitialValues.contents[field.name]?.description}
                                innerRef={el => {
                                  contentsRefs.current = {...contentsRefs.current, [fi("description")]: el};
                                }}
                                helpText={
                                  "Descriptive text for the entire gallery. In most cases, images DO NOT go here!"
                                }
                              />
                            </Form.Item>
                            <Form.Item key="items"
                                       label="Images"
                                       name={[field.name, "items"]}>
                              <SortableGalleryInput />
                            </Form.Item>
                          </>;

                        case "quiz":
                          return <>
                            <p style={helpTextStyle}>
                              Use this content type for creating an interactive quiz. Currently, three types of quizzes
                              are available: A 'match values' quiz, for matching values to a provided picture or set
                              of hints; a 'select all that apply' quiz; and a 'choose the correct answer' quiz.
                            </p>
                            <Form.Item key="quiz_type"
                                       label="Quiz Type"
                                       name={[field.name, "quiz_type"]}>
                              <Select options={quizTypes} onChange={() => {
                                form.setFieldsValue({
                                  contents: form.getFieldsValue().contents.map((c, i) =>
                                    i === field.name ? {...c, options: []} : c),
                                });
                              }} />
                            </Form.Item>
                            <Form.Item key="question" label="Question">
                              <HTMLEditor
                                initialValue={newInitialValues.contents[field.name]?.question}
                                innerRef={el => {
                                  contentsRefs.current = {...contentsRefs.current, [fi("question")]: el};
                                }}
                              />
                            </Form.Item>
                            <Form.Item key="answer" label="Answer">
                              <HTMLEditor
                                initialValue={newInitialValues.contents[field.name]?.answer}
                                innerRef={el => {
                                  contentsRefs.current = {...contentsRefs.current, [fi("answer")]: el};
                                }}
                              />
                            </Form.Item>
                            <Form.Item label={"Options"}>
                              <Form.List name={[field.name, "options"]}>
                                {(optionFields, {add: addOption, remove: removeOption}) => (
                                  <>
                                    {optionFields.map(optionField => (
                                      <Space
                                        key={optionField.key}
                                        style={{display: "flex", marginBottom: 8}}
                                        align="baseline"
                                      >
                                        <Form.Item
                                          {...optionField}
                                          label="Label"
                                          name={[optionField.name, "label"]}
                                          rules={[{required: true}]}
                                        >
                                          <Input placeholder="Label" style={{width: 400}} />
                                        </Form.Item>
                                        <Form.Item
                                          label="Answer"
                                          shouldUpdate={contentFieldChanged(field, "quiz_type")}
                                        >
                                          {f => {
                                            switch (f.getFieldValue(["contents", field.name, "quiz_type"])) {
                                              case "match_values":
                                                return <Form.Item name={[optionField.name, "answer"]}
                                                                  rules={[{required: true}]}>
                                                  <Input placeholder="Answer" />
                                                </Form.Item>;
                                              default:
                                                // select_all_that_apply
                                                // choose_one
                                                return <Form.Item name={[optionField.name, "answer"]}
                                                                  rules={[{required: true}]}>
                                                  <Select style={{width: 150}} options={[
                                                    {value: true, label: "Correct"},
                                                    {value: false, label: "Incorrect"},
                                                  ]} />
                                                </Form.Item>;
                                            }
                                          }}
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => removeOption(optionField.name)} />
                                      </Space>
                                    ))}
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => addOption()}
                                        block={true}
                                        icon={<PlusOutlined />}
                                      >
                                        Add Option
                                      </Button>
                                    </Form.Item>
                                  </>
                                )}
                              </Form.List>
                            </Form.Item>
                          </>;
                      }
                    }}
                  </Form.Item>
                </Form.Item>
              </Card>
            )
          })}
          <Form.Item>
            <Button onClick={() => {
              add();
              // noinspection JSValidateTypes
              processLocalChanges();
            }} icon={<PlusOutlined/>}>Add Content Item</Button>
          </Form.Item>
        </>
      )}
    </Form.List>
    <Divider />
    <Form.Item name={["revision", "message"]} label="Revision Message">
      <Input />
    </Form.Item>
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
        {(localDataKey && lastSavedTime) ? (
          <span style={{color: "#AAA", fontStyle: "italic"}}>Changes last saved locally at {lastSavedTime}.</span>
        ) : null}
      </Space>
    </Form.Item>
  </Form>;
});

export default StationForm;
