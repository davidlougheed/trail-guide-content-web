import React, {useCallback, useMemo, useRef} from "react";
import {useSelector} from "react-redux";

import {Button, Card, Col, Divider, Form, Input, Row, Select, Space, Switch, Tooltip} from "antd";
import {
  CloseCircleOutlined,
  DownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UpOutlined
} from "@ant-design/icons";

import {helpText as helpTextStyle} from "../../styles";

import HTMLEditor from "../editor/HTMLEditor";
import SortableGalleryInput from "../SortableGalleryInput";
import ObjectForm, {RULES_REQUIRED_BASIC, useObjectForm} from "../ObjectForm";
import {useNavigate} from "react-router-dom";

const styles = {
  contentItemCard: {
    marginBottom: "12px",
    position: "relative",
  },
  contentItemHeaderExtra: {
    position: "absolute",
    height: 22,
    top: "8px",
    right: "12px",
    zIndex: 1,
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  contentItemHeaderExtraNumber: {color: "#CCC"},
  contentContainer: {marginBottom: 0},
  removeContentItem: {color: "#f5222d"},

  quizOptionsFieldSpace: {display: "flex", marginBottom: 8},
  quizOptionLabel: {width: 400},
  quizAnswerSelect: {width: 150},
};

// Maximum number of days each month can have.
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const zoneOptions = [];
for (let i = 1; i < 61; i++) {
  const numeral = String(i).padStart(2, "0");
  for (let li = 67; li < 91; li++) {
    const str = `${numeral}${String.fromCharCode(li)}`;
    zoneOptions.push({value: str, label: str});
  }
}
zoneOptions.push(
  {value: "A", label: "A"},
  {value: "B", label: "B"},
);

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

const quizAnswerOptions = [
  {value: true, label: "Correct"},
  {value: false, label: "Incorrect"},
];

const fieldPaths = {
  visible_from: ["visible", "from"],
  visible_to: ["visible", "to"],
  coordinates_utm_crs: ["coordinates_utm", "crs"],
  coordinates_utm_zone: ["coordinates_utm", "zone"],
  coordinates_utm_east: ["coordinates_utm", "east"],
  coordinates_utm_north: ["coordinates_utm", "north"],
  revision_message: ["revision", "message"],
};

const WYSIWYG_BLANKS = [
  "",
  "&nbsp;",
  "<p></p>",
  "<p><br></p>",
  "<p>&nbsp;</p>",
];

const normalizeHTMLContent = content => {
  if (!content) return "";

  content = content.trim();

  if (WYSIWYG_BLANKS.includes(content)) {
    // Annoying fake-empty content
    return "";
  }

  // These "narrow non-breaking spaces" were popping up a lot
  // with pastes from Word and created unintentionally strange
  // wrapping behaviour. Replace them with normal spaces.
  content = content.replace("\u202f", " ");

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
    items: c.items || [],
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

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
}


const StationForm = React.memo(({...props}) => {
  const navigate = useNavigate();

  const sections = useSelector(state => state.sections.items);
  const numStations = useSelector(state => state.stations.items.length);
  const categories = useSelector(state => state.categories.items);
  const assets = useSelector(state => state.assets.items);

  const headerImageOptions = useMemo(() => assets
    .filter(a => a.asset_type === "image")
    .map(a => ({value: a.id, label: a.file_name})),
    [assets]);
  const sectionOptions = useMemo(
    () => sections.map(({id, title}) => ({value: id, label: title})),
    [sections]);
  const categoryOptions = useMemo(() => categories.map(value => ({value})), [categories]);

  const transformInitialValues = useCallback(v => ({
    rank: numStations,  // Add station to the end of the list in the app by default
    coordinates_utm: {
      crs: "NAD83",
      zone: "18T",
      ...(v.coordinates_utm ?? {}),
    },
    ...v,
    enabled: !!v.enabled,
    revision: {
      working_copy: v.revision?.number ?? null,
      message: "",  // Clear revision message for possible filling out & re-submission
    },
    visible: {
      from: v.visible?.from || null,
      to: v.visible?.to || null,
    },
    contents: (v.contents ?? []).map(normalizeContents),
  }), [numStations]);

  const contentsRefs = useRef({});
  const getContentKey = useCallback((k, i) => ({
    [k]: normalizeHTMLContent(contentsRefs?.current[contentItemField(i)(k)]?.getEditor()?.root?.innerHTML),
  }), [contentsRefs]);

  const transformFinalValues = useCallback(v => ({
    ...v,

    title: v.title ?? "",
    long_title: v.long_title ?? "",
    subtitle: v.subtitle ?? "",

    // Properly type everything
    visible: {
      from: v.visible.from || null,
      to: v.visible.to || null,
    },
    header_image: v.header_image ?? null,
    coordinates_utm: {
      ...v.coordinates_utm,
      east: v.coordinates_utm.east ? parseInt(v.coordinates_utm.east, 10) : undefined,
      north: v.coordinates_utm.north ? parseInt(v.coordinates_utm.north, 10) : undefined,
    },
    contents: (v.contents.map(normalizeContents) ?? []).map((c, ci) => {
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
    enabled: !!v.enabled,
    rank: parseInt(v.rank),
  }), [getContentKey]);

  const contentFieldChanged = useCallback((field, contentField) => (prevValues, newValues) => {
    const ct1 = prevValues.contents[field.name]?.[contentField];
    const ct2 = newValues.contents[field.name]?.[contentField];
    return ct1 !== ct2;
  }, []);

  const onView = useCallback(v => {
    if (!v.id) return;
    navigate(`/stations/detail/${v.id}`, {replace: true});
  }, [navigate]);

  const objectForm = useObjectForm({
    transformInitialValues,
    transformFinalValues,
    onView,
    ...props,
  });

  const {form, transformedInitialValues, processLocalChanges} = objectForm;

  return <ObjectForm objectForm={objectForm} {...props}>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="title" label="Title" rules={RULES_REQUIRED_BASIC}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item name="long_title" label="Long Title" rules={RULES_REQUIRED_BASIC}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col flex={1}>
        <Form.Item name="subtitle" label="Subtitle" rules={RULES_REQUIRED_BASIC}>
          <Input />
        </Form.Item>
      </Col>
      <Col flex="140px">
        <Form.Item name={fieldPaths.visible_from}
                   label="Visible From"
                   rules={[
                     {validator: monthDayValidator, message: "Format is MM-DD"},
                     ({getFieldValue}) => ({
                       validator: (_, v) =>
                         (!v && getFieldValue(fieldPaths.visible_to))
                           ? Promise.reject(new Error("visible.to requires that visible.from is filled as well"))
                           : Promise.resolve(),
                     }),
                   ]}>
          <Input placeholder="MM-DD" />
        </Form.Item>
      </Col>
      <Col flex="140px">
        <Form.Item name={fieldPaths.visible_to}
                   label="Visible To"
                   rules={[
                     {validator: monthDayValidator, message: "Format is MM-DD"},
                     ({getFieldValue}) => ({
                       validator: (_, v) =>
                         (!v && getFieldValue(fieldPaths.visible_from))
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
      <Col span={6}>
        <Form.Item name={fieldPaths.coordinates_utm_crs} label="CRS" rules={RULES_REQUIRED_BASIC}>
          <Select>
            <Select.Option value="NAD83">NAD83</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name={fieldPaths.coordinates_utm_zone} label="UTM Zone" rules={RULES_REQUIRED_BASIC}>
          <Select showSearch={true} filterOption={filterOption} options={zoneOptions} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name={fieldPaths.coordinates_utm_east} label="Easting" rules={RULES_REQUIRED_BASIC}>
          <Input type="number" addonAfter="E" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name={fieldPaths.coordinates_utm_north} label="Northing" rules={RULES_REQUIRED_BASIC}>
          <Input type="number" addonAfter="N" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={12}>
      <Col span={8}>
        <Form.Item name="header_image" label="Header Image">
          <Select placeholder="Select header image for this station" allowClear={true} options={headerImageOptions} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="section" label="Section" rules={RULES_REQUIRED_BASIC}>
          <Select placeholder="Select app section for this station" options={sectionOptions} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="category" label="Category" rules={RULES_REQUIRED_BASIC}>
          <Select placeholder="Select category for this station" options={categoryOptions} />
        </Form.Item>
      </Col>
    </Row>
    <Form.List name="contents">
      {(fields, {add, move, remove}, {errors}) => <>
        {errors}
        {fields.map((field, idx) => {
          const fi = contentItemField(field.name);
          return <Card key={field.key} size="small" title="Content Item" style={styles.contentItemCard}>
            <div style={styles.contentItemHeaderExtra}>
              <span style={styles.contentItemHeaderExtraNumber}>#{idx + 1}</span>
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
                <CloseCircleOutlined style={styles.removeContentItem} onClick={() => remove(field.name)} />
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
                             rules={RULES_REQUIRED_BASIC}>
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
                         style={styles.contentContainer}>
                {f => {
                  const initialContents = transformedInitialValues.contents[field.name];
                  const updateContentRef = fk => el => {
                    contentsRefs.current = {...contentsRefs.current, [fi(fk)]: el};
                  };
                  switch (f.getFieldValue(["contents", field.name, "content_type"])) {
                    case "html":
                      return <>
                        <p style={helpTextStyle}>
                          Use this content type for article-style content, for example mixed text and multimedia.
                        </p>
                        <Form.Item key="content_before_fold" label="Content Before Fold">
                          <HTMLEditor
                            initialValue={initialContents?.content_before_fold ?? ""}
                            innerRef={updateContentRef("content_before_fold")}
                            helpText="Initial / above-the-fold / main content to show."
                          />
                        </Form.Item>
                        <Form.Item key="content_after_fold" label="Content After Fold" style={{marginBottom: 0}}>
                          <HTMLEditor
                            initialValue={initialContents?.content_after_fold ?? ""}
                            innerRef={updateContentRef("content_after_fold")}
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
                        <Form.Item key="description" label="Description" name={[field.name, "description"]}>
                          <HTMLEditor
                            initialValue={initialContents?.description}
                            innerRef={updateContentRef("description")}
                            helpText="Descriptive text for the entire gallery. In most cases, images DO NOT go here!"
                          />
                        </Form.Item>
                        <Form.Item key="items" label="Images" name={[field.name, "items"]}>
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
                        <Form.Item key="quiz_type" label="Quiz Type" name={[field.name, "quiz_type"]}>
                          <Select options={quizTypes} onChange={() => {
                            form.setFieldsValue({
                              contents: form.getFieldsValue().contents.map((c, i) =>
                                i === field.name ? {...c, options: []} : c),
                            });
                          }} />
                        </Form.Item>
                        <Form.Item key="question" label="Question">
                          <HTMLEditor
                            initialValue={initialContents?.question}
                            innerRef={updateContentRef("question")}
                          />
                        </Form.Item>
                        <Form.Item key="answer" label="Answer">
                          <HTMLEditor
                            initialValue={initialContents?.answer}
                            innerRef={updateContentRef("answer")}
                          />
                        </Form.Item>
                        <Form.Item label="Options">
                          <Form.List name={[field.name, "options"]}>
                            {(optionFields, {add: addOpt, remove: removeOpt}) => (
                              <>
                                {optionFields.map(optionField => (
                                  <Space key={optionField.key} style={styles.quizOptionsFieldSpace} align="baseline">
                                    <Form.Item
                                      {...optionField}
                                      label="Label"
                                      name={[optionField.name, "label"]}
                                      rules={RULES_REQUIRED_BASIC}
                                    >
                                      <Input placeholder="Label" style={styles.quizOptionLabel} />
                                    </Form.Item>
                                    <Form.Item
                                      label="Answer"
                                      shouldUpdate={contentFieldChanged(field, "quiz_type")}
                                    >
                                      {f => {
                                        const answerName = [optionField.name, "answer"];
                                        switch (f.getFieldValue(["contents", field.name, "quiz_type"])) {
                                          case "match_values":
                                            return <Form.Item name={answerName} rules={RULES_REQUIRED_BASIC}>
                                              <Input placeholder="Answer" />
                                            </Form.Item>;
                                          default:
                                            // select_all_that_apply
                                            // choose_one
                                            return <Form.Item name={answerName} rules={RULES_REQUIRED_BASIC}>
                                              <Select style={styles.quizAnswerSelect} options={quizAnswerOptions} />
                                            </Form.Item>;
                                        }
                                      }}
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => removeOpt(optionField.name)} />
                                  </Space>
                                ))}
                                <Form.Item>
                                  <Button type="dashed" onClick={() => addOpt()} block={true} icon={<PlusOutlined />}>
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
          </Card>;
        })}
        <Form.Item>
          <Button onClick={() => {
            add();
            // noinspection JSValidateTypes
            processLocalChanges();
          }} icon={<PlusOutlined/>}>Add Content Item</Button>
        </Form.Item>
      </>
    }
    </Form.List>
    <Divider />
    <Form.Item name={fieldPaths.revision_message} label="Revision Message">
      <Input />
    </Form.Item>
  </ObjectForm>;
});

export default StationForm;
