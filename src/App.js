import Sign from "./signTransaction.js";
import Upload from "./uploadTransaction.js";
import PopupList from "./popUp.js";
import NewExpense from "./setNewExpense.js";
import { useState } from "react";
function App() {
  const [popupArray, setPopupArray] = useState([]);
  function addNewPopup(content) {
    setPopupArray([...popupArray, content]);
    console.log(popupArray);
  }
  function deleteItem(idx) {
    const newPopupArray = popupArray.filter((content, index) => {
      return index !== idx;
    });
    setPopupArray(newPopupArray);
  }
  return (
    <div className="container h-screen w-full mx-auto flex flex-col">
      <PopupList contentArray = {popupArray} deleteItem = { deleteItem }/>
      <div className="container pt-4 flex flex-row w-full justify-evenly">
          <Sign addNewPopup = { addNewPopup }/>
         <Upload addNewPopup = { addNewPopup }/>  
      </div>
      <div className="container pt-4 flex flex-row w-full justify-evenly">
          <NewExpense addNewPopup = { addNewPopup }/>
      </div>
    </div>
  );
}

export default App;
