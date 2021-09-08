import React, { Fragment } from "react";
import Checkbox from "./Checkbox";
import classes from "../styles/Answers.module.css";

const Answers = ({ options = [], handleChange, input }) => {
  return (
    <div className={classes.answers}>
      {options.map((options, index) => (
        <Fragment key={index}>
          {input ? (
            <Checkbox
              className={classes.answer}
              text={options.title}
              value={index}
              checked={options.checked}
              onChange={(e) => handleChange(e, index)}
              key={index}
            />
          ) : (
            <Checkbox
              key={index}
              className={`${classes.answer} ${
                options.correct
                  ? classes.correct
                  : options.checked
                  ? classes.wrong
                  : null
              }`}
              text={options.title}
              defaultChecked={options.checked}
              disabled
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Answers;
