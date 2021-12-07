import React, {useState} from "react";

import {Button, Card, Checkbox, Divider, Space, Typography} from "antd";

const Quiz = ({quiz_type, title, question, answer, options, ...props}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correct, setCorrect] = useState(false);

  return <Card title={title} {...props}>
    <Typography.Title level={5}>Question</Typography.Title>
    <div dangerouslySetInnerHTML={{__html: question}} />

    <Divider />

    {quiz_type === "match_values" ? (<div>
      TODO
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
          {o.label}
        </Button>
      )}
    </Space>) : null}

    {showAnswer ? <>
      <Divider />
      {correct
        ? <span style={{color: "#52c41a", fontWeight: "bold"}}>Correct!</span>
        : <span style={{color: "#ff4d4f", fontWeight: "bold"}}>Sorry, not quite right.</span>}
      <Typography.Title level={5} style={{marginTop: 8}}>Answer</Typography.Title>
      <div dangerouslySetInnerHTML={{__html: answer}} />
    </> : null}
  </Card>
};

export default Quiz;
