import { useState } from "@wordpress/element";
import Title from "./title";
import Button from "./button";

const Block = ({ attributes, children, isView }) => {
  const [show, setShow] = isView ? useState(true) : [true];
  const [counter, setCounter] = isView ? useState(0) : [0];

  return (
    <>
      <Title message={attributes.message} />
      <Button handler={() => setShow(!show)} />
      <button onClick={() => setCounter(counter + 1)}>{counter}</button>
      {show && children}
    </>
  );
};

export default Block;
