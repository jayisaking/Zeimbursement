import { useState, useEffect } from "react";
import React from "react";
import { InputField, InputFieldLabel } from "./uploadTransaction.js";
import { setUpNewExpense, getExpenseEvents, checkNumberGreaterThen } from "./web3Utils.js";
const ethers = require("ethers");


function SetNewExpenseForm({ setDisplayItems, addNewPopup }) {
  const [expenseID, setExpenseID] = useState("");
  const [rsaPublicKeyN, setRSAPublicKeyN] = useState("");
  const [rsaPublicKeyE, setRSAPublicKeyE] = useState("");
  const [allowedPublicKey1, setAllowedPublicKey1] = useState([]);
  const [allowedPublicKey2, setAllowedPublicKey2] = useState([]);
  const [allowedPublicKey3, setAllowedPublicKey3] = useState([]);
  const [allowedPublicKey4, setAllowedPublicKey4] = useState([]);
  function handleSetUp() {
    console.log("handling set up");
    if (checkNumberGreaterThen(rsaPublicKeyN, 448)) {
        throw new Error("N must be greater then 2 ** 512");
    }
    setUpNewExpense(
      expenseID,
      [
        allowedPublicKey1,
        allowedPublicKey2,
        allowedPublicKey3,
        allowedPublicKey4,
      ],
      rsaPublicKeyE,
      rsaPublicKeyN
    )
      .then(() => {
        addNewPopup("Set expense successfully!");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    <div className="rounded-xl shadow-xl p-6 w-full pt-8 border-gray-200 border-2 my-1">
      <h2 className="text-2xl font-semibold mb-4">New Expense Information</h2>
      <div className="mb-4">
        <InputFieldLabel label="Expense ID" />
        <InputField
          placeholder="Expense ID"
          valueItem={expenseID}
          setValueItem={setExpenseID}
        />
      </div>
      <div className="mb-4">
        <InputFieldLabel label="RSA Public Key N (512bits)" />
        <InputField
          placeholder="RSA Public Key N "
          valueItem={rsaPublicKeyN}
          setValueItem={setRSAPublicKeyN}
        />
      </div>
      <div className="mb-4">
        <InputFieldLabel label="RSA Public Key E" />
        <InputField
          placeholder="RSA Public Key E"
          valueItem={rsaPublicKeyE}
          setValueItem={setRSAPublicKeyE}
        />
      </div>
      <div className="mb-4">
        <InputFieldLabel label="Allowed Public Keys" />
        <InputField
          placeholder="Allowed Public Key 1"
          valueItem={allowedPublicKey1}
          setValueItem={setAllowedPublicKey1}
        />
        <InputField
          placeholder="Allowed Public Key 2"
          valueItem={allowedPublicKey2}
          setValueItem={setAllowedPublicKey2}
        />
        <InputField
          placeholder="Allowed Public Key 3"
          valueItem={allowedPublicKey3}
          setValueItem={setAllowedPublicKey3}
        />
        <InputField
          placeholder="Allowed Public Key 4"
          valueItem={allowedPublicKey4}
          setValueItem={setAllowedPublicKey4}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:bg-blue-900"
        onClick={handleSetUp}
      >
        Set Up
      </button>
    </div>
  );
}
function DisplayComponent({ name, content }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl my-1 h-16 px-3 py-3">
      <div className="flex flex-row justify-center h-full">
        <h2 className="text-lg font-semibold px-2 my-auto w-2/5">{name}</h2>
        <pre className="bg-gray-100 py-2 px-3 rounded-xl w-2/3 mx-2 h-10 my-auto text-sm">
          {
            // if the content is longer then 50 characters, only display the first 50 characters + "..."
            content.length > 30 ? content.slice(0, 30) + "..." : content
          }
        </pre>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline h-10 my-auto text-sm active:bg-blue-900"
          onClick={handleCopy}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
function NewExpense({ addNewPopup }) {
  const [displayItems, setDisplayItems] = useState([]);
  return (
    <div className="flex flex-row justify-center w-5/12 pt-3">
      <div className="flex flex-col w-full">
        <SetNewExpenseForm
          setDisplayItems={setDisplayItems}
          addNewPopup={addNewPopup}
        />
        {displayItems.map((item) => (
          <DisplayComponent name={item.name} content={item.value} />
        ))}
      </div>
    </div>
  );
}

export default NewExpense;
