import React, {useState} from "react";

import {Button, Card, Checkbox, Divider, Select, Space, Typography} from "antd";

const Quiz = React.memo(({quiz_type, title, question, answer, options, ...props}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    quiz_type === "match_values" ? [...new Array(options.length)] : [],
  );
  const [correct, setCorrect] = useState(false);

  // Used for matching quizzes
  const allOptionAnswers = options.map(o => ({
    value: o.answer.toString(),
    label: o.answer.toString(),
  })).sort((o1, o2) => o1.label.localeCompare(o2.label));

  return <Card title={title} {...props} className="quiz">
    <Typography.Title level={5}>Question</Typography.Title>
    <div className="html-content" dangerouslySetInnerHTML={{__html: question}} />

    <Divider />

    {quiz_type === "match_values" ? (<div>
      {options.map((o, i) => (<div key={i}>
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
        setCorrect(options.reduce((acc, o, i) => acc && o.answer === selectedOptions[i], true));
        setShowAnswer(true);
      }}>Submit</Button>
    </div>) : null}

    {quiz_type === "select_all_that_apply" ? (<div>
      <Checkbox.Group
        options={options.map((o, i) => ({
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
        setCorrect(options.reduce((acc, o, i) => acc && (o.answer === selectedOptions.includes(i)), true));
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
            setCorrect(o.answer);
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
