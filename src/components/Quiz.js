import React, {useState} from "react";

import {Button, Card, Divider, Space, Typography} from "antd";

const Quiz = ({quiz_type, title, question, answer, options}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correct, setCorrect] = useState(false);

  return <Card title={title}>
    <Typography.Title level={5}>Question</Typography.Title>
    <div dangerouslySetInnerHTML={{__html: question}} />

    <Divider />

    {quiz_type === "choose_one" ? (<Space direction="vertical">
      {options.map((o, i) =>
        <Button
          key={i}
          type={selectedOption === i ? "primary" : "default"}
          danger={showAnswer && !o.answer}
          onClick={() => {
            setSelectedOption(i);
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
        ? <span style={{color: "#00AA00", fontWeight: "bold"}}>Correct!</span>
        : <span style={{color: "#AA0000", fontWeight: "bold"}}>Sorry, not quite right.</span>}
      <Typography.Title level={5} style={{marginTop: 8}}>Answer</Typography.Title>
      <div dangerouslySetInnerHTML={{__html: answer}} />
    </> : null}
  </Card>
};

export default Quiz;
