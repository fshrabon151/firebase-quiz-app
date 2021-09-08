import React, { useReducer, useState, useEffect } from "react";
import Answers from "../Answers";
import ProgressBar from "../ProgressBar";
import MiniPlayer from "../MiniPlayer";
import { useParams } from "react-router-dom";
import useQuestions from "../../Hooks/useQuestions";
import _ from "lodash";
import { useAuth } from "../../contexts/AuthContext";
import { getDatabase, ref, set } from "@firebase/database";

import { useHistory } from "react-router-dom";

const initialState = null;
const reducer = (state, action) => {
  switch (action.type) {
    case "QUESTIONS":
      action.value.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return action.value;

    case "ANSWER":
      const questions = _.cloneDeep(state);
      questions[action.questionID].options[action.optionIndex].checked =
        action.value;

      return questions;

    default:
      return state;
  }
};

const Quiz = () => {
  const { id } = useParams();
  const { loading, error, questions } = useQuestions(id);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [qna, dispatch] = useReducer(reducer, initialState);

  const { currentUser } = useAuth();
  const history = useHistory();

  const { location } = history;
  const { state } = location;
  const { videoTitle } = state;

  useEffect(() => {
    dispatch({
      type: "QUESTIONS",
      value: questions,
    });
  }, [questions]);

  const handleAnswerChange = (e, index) => {
    dispatch({
      type: "ANSWER",
      questionID: currentQuestion,
      optionIndex: index,
      value: e.target.checked,
    });
  };

  // handle when user clicks the next button to get the next question

  function nextQuestion() {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion + 1);
    }
  }
  // handle when user clicks the previous button to get the previous question
  function prevQuestion() {
    if (currentQuestion >= 1 && currentQuestion <= questions.length) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  }

  // submit quiz
  async function submit() {
    const { uid } = currentUser;

    const db = getDatabase();
    const resultRef = ref(db, `result/${uid}`);
    await set(resultRef, {
      [id]: qna,
    });

    history.push({
      pathname: `/result/${id}`,
      state: {
        qna,
      },
    });
  }

  // calculate percentage of progress
  const percentage =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>There was an error!</div>}

      {!loading && !error && qna && qna.length > 0 && (
        <>
          <h1>{qna[currentQuestion].title}</h1>
          <h4>Question can have multiple answers</h4>

          <Answers
            options={qna[currentQuestion].options}
            handleChange={handleAnswerChange}
            input={true}
          />

          <ProgressBar
            next={nextQuestion}
            prev={prevQuestion}
            progress={percentage}
            submit={submit}
          />
          <MiniPlayer id={id} title={videoTitle} />
        </>
      )}
    </>
  );
};

export default Quiz;
