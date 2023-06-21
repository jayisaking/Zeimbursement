import { useState, useEffect } from "react";
import React from "react";
import { getExpenseEvents, getRSAProof } from "./web3Utils";
import { getECDSAProof, getRSVFromSig, processECDSAProof, processRSAProof, uploadTransaction } from "./web3Utils";

// const testConfig = require("./testProofConfig.json");

export function InputField ({ placeholder, valueItem, setValueItem}) {
    return (
        <input
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1 focus:border-blue-500 focus:border-2"
            type = "text"
            value = { valueItem }
            onInput = {e => setValueItem(e.target.value)}
            placeholder =  { placeholder }
        />
    )
}
export function InputFieldLabel ({ label }) {
    return (
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="messageField"
      >
          { label }
      </label>
    )
}
function UploadForm( { addNewPopup }) {
  const [partyASig, setPartyASig] = useState("");
  const [partyAPubKey, setPartyAPubKey] = useState("");
  const [partyBSig, setPartyBSig] = useState("");
  const [partyBPubKey, setPartyBPubKey] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseID, setExpenseID] = useState("");
  const [messageHash, setMessageHash] = useState("");
  async function handleUpload () {
      const eventDict = await getExpenseEvents(expenseID)
      const [rA, sA, vA] = getRSVFromSig(partyASig);
      const [rB, sB, vB] = getRSVFromSig(partyBSig);
      // console.log(rA, sA, messageHash, partyAPubKey, eventDict.allowedPublicKeys)
      const [proofPA, pubSignalPartyA] = await getECDSAProof(rA, sA, messageHash, partyAPubKey, eventDict.allowedPublicKeys)
      const [proofPB, pubSignalPartyB] = await getECDSAProof(rB, sB, messageHash, partyBPubKey, eventDict.allowedPublicKeys)
      // console.log(proofPartyA, pubSignalPartyA)
      // console.log(proofPartyB, pubSignalPartyB)
      // console.log(eventDict.keyE, eventDict.keyN, amount)
      const { amountProof, rsaPublicSignals } = await getRSAProof(eventDict.keyE, eventDict.keyN, amount)
      // console.log(amountProof, rsaPublicSignals)
      const [proofPartyA, __] = processECDSAProof(
        proofPA,
        pubSignalPartyA
      );
      const [proofPartyB, _] = processECDSAProof(
        proofPB,
        pubSignalPartyB
      );
      
      const [proofARSA, proofBRSA, proofCRSA, amountHash] = processRSAProof(amountProof, rsaPublicSignals);
      // console.log(eventDict.keyE, eventDict.keyN, amount)
      // console.log(proofARSA, proofBRSA, proofCRSA, amountHash)
      await uploadTransaction(proofPartyA, proofPartyB, messageHash, proofARSA, proofBRSA, proofCRSA, amountHash, expenseID)
  }
  return (
    <div className="rounded-xl shadow-xl p-6 w-full pt-8 border-gray-200 border-2 mt-2">
      <h2 className="text-2xl font-semibold mb-4">Transaction Upload Information</h2>
        <div className="mb-4">
          <InputFieldLabel label = "Party A"/>
          <InputField placeholder = "signature" valueItem = {partyASig} setValueItem = {setPartyASig}/>
          <InputField placeholder = "public key" valueItem = {partyAPubKey} setValueItem = {setPartyAPubKey}/>
        </div>
        <div className="mb-4">
          <InputFieldLabel label = "Party B"/>
          <InputField placeholder = "signature" valueItem = {partyBSig} setValueItem = {setPartyBSig}/>
          <InputField placeholder = "public key" valueItem = {partyBPubKey} setValueItem = {setPartyBPubKey}/>
        </div>
        <div className="mb-4">
          <InputFieldLabel label = "Amount" />
          <InputField placeholder = "amount" valueItem = {amount} setValueItem = {setAmount}/>
        </div>
        <div className="mb-4">
          <InputFieldLabel label = "Expense ID"/>
          <InputField placeholder = "expense ID" valueItem = {expenseID} setValueItem = {setExpenseID}/>
        </div>
        <div className="mb-4">
          <InputFieldLabel label = "Message Hash"/>
          <InputField placeholder = "message hash" valueItem = {messageHash} setValueItem = {setMessageHash}/>
        </div>
        <button
          onClick = { handleUpload }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline active:bg-blue-900"
        >
          Upload
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
    <div className="bg-white rounded-xl shadow-xl p-2 my-2 h-20">
      

      <div className="flex flex-row justify-center h-full">
        <h2 className="text-lg font-semibold px-2 my-auto">{name}</h2>
        <pre className="bg-gray-100 p-2 rounded-md w-4/5 mx-2 h-10 my-auto text-sm ">
          <code>{content}</code>
        </pre>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-10 my-auto text-sm active:bg-blue-900"
          onClick={handleCopy}
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
function Upload ( { addNewPopup } ) {
  const [displayItems, setDisplayItems] = React.useState([]);
  return (
    <div className="flex flex-row justify-center w-5/12 pt-2">
      <div className="flex flex-col w-full">
        <UploadForm  addNewPopup = { addNewPopup }/>
        {displayItems.map((item) => (
          <DisplayComponent name = {item.name} content = {item.value} />
        ))}
      </div>
    </div>
  );
}

export default Upload;
