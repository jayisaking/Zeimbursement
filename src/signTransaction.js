import { useState, useEffect } from "react";
import React from "react";
import { InputField } from "./uploadTransaction.js";
import { getPublicKey, uint8ArrayToString } from "./web3Utils.js";
const ethers = require("ethers")


const signMessage = async ({ message }) => {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = '0x' + signature.slice(130, 132);
    const messageHash = ethers.utils.hashMessage(message);
    const publicKey = getPublicKey(r, s, v, messageHash);
    return [messageHash, signature, address, r, s, v, publicKey];
};

function SignForm({ setDisplayItems, addNewPopup }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  function handleSign() {
    const wholeMessage = {
      "from": from,
      "to": to,
      "amount": amount,
      "message": message

    }
    const wholeMessageString = JSON.stringify(wholeMessage);
    signMessage({ message: wholeMessageString })
      .then(([messageHash, signature, address, r, s, v, publicKey]) => {
          console.log({ messageHash, signature, address, r, s, v, publicKey });
          setDisplayItems([
            { name: "msg", value: messageHash },
            { name: "sig", value: signature },
            { name: "pubkey", value : uint8ArrayToString(publicKey) }])
          addNewPopup("Signed transaction successfully!");
      })
      .catch((err) => {
          console.log(err.message);
      })

  }
  return (
    <div className="rounded-xl shadow-xl p-6 w-full pt-8 border-gray-200 border-2 my-1">
      <h2 className="text-2xl font-semibold mb-4">Transaction Information</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fromField"
          >
            From
          </label>
          <InputField placeholder = "From" valueItem = { from } setValueItem = { setFrom }/>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="toField"
          >
            To
          </label>
          <InputField placeholder="To" valueItem = { to } setValueItem = { setTo }/>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amountField"
          >
            Amount
          </label>
          <InputField placeholder="Amount" valueItem = { amount } setValueItem = { setAmount }/>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="messageField"
          >
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 focus:border-2"
            id="messageField"
            rows="3"
            placeholder="Message"
            onInput = {e => setMessage(e.target.value) }
            value = { message }
          ></textarea>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:bg-blue-900"
          onClick = { handleSign }
        >
          Sign
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
           
        { // if the content is longer then 50 characters, only display the first 50 characters + "..."
          content.length > 30 ? content.slice(0, 30) + "..." : content}
        </pre>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline h-10 my-auto text-sm active:bg-blue-900"
          onClick={handleCopy}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
function Sign({ addNewPopup }) {
  const [displayItems, setDisplayItems] = useState([]);
  return (
    <div className="flex flex-row justify-center w-5/12 pt-3">
      <div className="flex flex-col w-full">
        <SignForm setDisplayItems = { setDisplayItems } addNewPopup = { addNewPopup }/>
        {displayItems.map((item) => (
          <DisplayComponent name={item.name} content={item.value} />
        ))}
      </div>
    </div>
  );
}

export default Sign;
