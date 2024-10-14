// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties, useMemo, useState} from "react";

import {Button, Card, Checkbox, Divider, Select, Space, Typography} from "antd";

import {CIQuiz, QuizOption} from "../modules/stations/types";

interface SelectOption {
  label: string;
  value: string;
}

interface QuizProps extends CIQuiz {
  style: CSSProperties | unknown;
}

const Quiz = React.memo(({quiz_type, title, question, answer, options, style}: QuizProps) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState(
    quiz_type === "match_values" ? [...new Array(options.length)] : [],
  );
  const [correct, setCorrect] = useState<boolean>(false);

  // Used for matching quizzes
  const allOptionAnswers = useMemo<SelectOption[]>(() => options.map(o => ({
    value: o.answer.toString(),
    label: o.answer.toString(),
  })).sort((o1: SelectOption, o2: SelectOption) => o1.label.localeCompare(o2.label)), [options]);

  return <Card title={title} style={style} className="quiz">
    <Typography.Title level={5}>Question</Typography.Title>
    <div className="html-content" dangerouslySetInnerHTML={{__html: question}} />

    <Divider />

    {quiz_type === "match_values" ? (<div>
      {options.map((o: QuizOption, i: number) => (<div key={i}>
        <Select
          options={allOptionAnswers}
          style={{
            width: 80,
            borderRadius: 2,
            boxShadow: showAnswer
              ? `0px 0px 8px ${o.answer === selectedOptions[i] ? "#52c41a" : "#ff4d4f"}`
              : "none",
          }}
          value={selectedOptions[i]}
          onChange={v => {
            setSelectedOptions(selectedOptions.map((v2, i2) => i === i2 ? v : v2))
          }}
        />
        <span style={{marginLeft: "1em"}}>{o.label}</span>
        <Divider />
      </div>))}
      <Button type="primary" onClick={() => {
        setCorrect(options.reduce((acc: true, o: QuizOption, i: number) =>
          acc && o.answer === selectedOptions[i], true));
        setShowAnswer(true);
      }}>Submit</Button>
    </div>) : null}

    {quiz_type === "select_all_that_apply" ? (<div>
      <Checkbox.Group
        options={options.map((o: QuizOption, i: number) => ({
          label: o.label,
          value: i,
          style: showAnswer ? (
            selectedOptions.includes(i)
              ? {color: o.answer ? "#52c41a" : "#ff4d4f"}
              : (o.answer ? {color: "#52c41a"} : {})
          ) : {},
        }))}
        onChange={selected => setSelectedOptions(selected)}
      />
      <br />
      <Button type="primary" style={{marginTop: 8}} onClick={() => {
        setCorrect(options.reduce((acc: boolean, o: QuizOption, i: number) =>
          acc && (o.answer === selectedOptions.includes(i)), true));
        setShowAnswer(true);
      }}>Submit</Button>
    </div>) : null}

    {quiz_type === "choose_one" ? (<Space direction="vertical">
      {options.map((o, i) =>
        <Button
          key={i}
          type={selectedOptions[0] === i ? "primary" : "default"}
          danger={showAnswer && !o.answer}
          onClick={() => {
            setSelectedOptions([i]);
            setCorrect(!!o.answer);
            setShowAnswer(true);
          }}>
          <span dangerouslySetInnerHTML={{__html: o.label}} />
        </Button>
      )}
    </Space>) : null}

    {showAnswer ? <>
      <Divider />
      {correct
        ? <span style={{color: "#52c41a", fontWeight: "bold"}}>Correct!</span>
        : <span style={{color: "#ff4d4f", fontWeight: "bold"}}>Sorry, not quite right.</span>}
      <Typography.Title level={5} style={{marginTop: 8}}>Answer</Typography.Title>
      <div className="html-content" dangerouslySetInnerHTML={{__html: answer}} />
    </> : null}
  </Card>
});

export default Quiz;
