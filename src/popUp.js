import React, { useState } from "react";
const crossIcon = require("./cross.png");

function Popup(props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(false);
    props.deleteItem(props.idx);
  };
  // delete this item after 10 seconds
    setTimeout(() => {
        setIsOpen(false);
        props.deleteItem(props.idx);
    }, 10000);

  return (
    <div className="flex flex-row justify-between bg-white shadow-md rounded-md my-2 ">
      <div className="mx-3 my-auto py-4">
        <p> {props.content} </p>
      </div>
      <button className="my-auto py-4 mx-3" onClick={handleToggle}>
        <img src={crossIcon} className="w-4 h-4" />
      </button>
    </div>
  );
}
function PopupList(props) {

  return (
    <div className="fixed right-4 top-4 bg-transparent">
      {props.contentArray.map((content, idx) => {
        return <Popup content = { content } idx = { idx } deleteItem = {props.deleteItem} />;
      })}
    </div>
  );
}

export default PopupList;
