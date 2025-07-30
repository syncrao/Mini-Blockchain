// A browser extension is a small software program 
// that adds specific features or functionalities to a web browser
// (like Chrome, Firefox, Edge, etc.).


// 🔧 What It Does

// Browser extensions modify or enhance how you interact with websites or the browser itself. They can:

// Block ads (e.g., Adblock)

// Autofill passwords (e.g., LastPass)

// Translate web pages (e.g., Google Translate)

// Add dark mode to all websites

// Help developers debug websites (e.g., React DevTools)

// Act as a crypto wallet (e.g., MetaMask)


// 📦 How It Works
// An extension typically includes:

// HTML/CSS/JS – Like a mini website.

// Manifest file (manifest.json) – Describes the extension, its permissions, and which files to load.

// Background script – Runs in the background to handle events (e.g., listening for clicks, managing data).

// Content scripts – Injected into web pages to read or modify their content.

// Popup UI (optional) – A small user interface when clicking the extension icon.


// 🧠 TL;DR
// A browser extension is like a plugin for your browser
//  — built with web tech 
//  — that customizes or improves your browsing experience.










// step 1 wallet.js and app.js

// app.js add  wallet? state  create componnent wallet.js and Account.js
import { useEffect, useState } from "react";
import Wallet from "./Wallet";
import Account from "./Account";

function App() {
  const [wallet, setWallet] = useState(null)

  return (
    <div className="bg-light w-100 h-100 border p-3 text-center">
      {wallet ? <Account /> : <Wallet setWallet={setWallet} />}
    </div>
  );
}


















//Account . js  add simple div 
function Account(props) {
    return <>
    <div>Account</div>
    </>
}












// Wallet .js  setMode state ? 
import { ethers } from "ethers"
import { useRef, useState } from "react"

const Wallet = (props) => {
    const [wallet, setWallet] = useState(null)
    const [mode, setMode] = useState(null)
    const phrase = useRef()

    const importWallet = () => {
        props.setWallet(ethers.Wallet.fromPhrase(phrase.current.value))
    }
 
    return <>
    {!mode ? 
    <div>
        Create Wallet
        <p className="my-2">{wallet && wallet.mnemonic.phrase}</p>
        <button onClick={() => setWallet(ethers.Wallet.createRandom())} className="btn btn-primary"> Generate Wallet</button>
        {wallet &&  <button onClick={() => props.setWallet(wallet)} className="btn btn-primary my-2">Save</button>}
        <button onClick={() => setMode("import")} className="btn btn-primary mt-2"> import wallet</button>
    </div> : 
    <div>
        import Wallet 
        <textarea className="form-control p-3 my-2" ref={phrase}/>
        <button onClick={importWallet} className="btn btn-primary my-2" >save</button>
    </div>
    }
    </>
}







// step 2 utils.js and account.js


// Account js
import { useEffect, useState } from "react"
import { getBalance } from "./utlis.js"

function Account(props) {
    const [balance, setBalance] = useState()

    useEffect(() => {
        async function getBal(address) {
            const bal = await getBalance(address)
            setBalance(bal)
        }
        getBal(props.wallet.address)
    }, [props.wallet.address])

    return <>
        <div>
            <h3>Account</h3>
            <p className="text-break">Address: {props.wallet.address}</p>
            <p>Balance: {balance} ETH</p>
        </div>
    </>
}












// A provider is how you read data from the blockchain.
// It connects your application to a remote Ethereum node (via JSON-RPC, Infura, Alchemy, etc.) and lets you:

// Read balances

// Fetch blocks, transactions

// Call smart contracts (read-only)

// Listen to events



// utlis . js
import { JsonRpcProvider, formatEther } from "ethers";

const url = "https://rpc-sepolia.rockx.com"

export async function getBalance(address = "0x65a0D7a13eb479087658e636aA81DA125faBce99") {
    const provider = new JsonRpcProvider(url)
    const balance =  await provider.getBalance(address)
    return formatEther(balance)
}













// step 3 utils SendEth.js and account.js


// utlis . js

import { JsonRpcProvider, formatEther, parseEther } from "ethers";
import { Wallet } from "ethers";

const provider = new JsonRpcProvider("https://rpc-sepolia.rockx.com")

const myWallet = Wallet.fromPhrase("funny report blush unveil gadget leopard unaware relax eager auto despair luxury")

console.log(myWallet)


// ✅ You send it to the provider, not directly to a blockchain node.
// The provider acts as a gateway to the blockchain
//  — it forwards your signed transaction to a node, which then broadcasts it to the network.

export async function handleSend(wallet = myWallet, to = "0x65a0D7a13eb479087658e636aA81DA125faBce99", amount = "0.0001") {
    const signer = wallet.connect(provider)
    const txn = await signer.sendTransaction({ to, value: parseEther(amount) })
    return txn
}

export async function getBalance(address = myWallet.address) {
    const balance = await provider.getBalance(address)
    return formatEther(balance)
}


// console.log(await getBalance())
// console.log(await handleSend())











// Account.js setMode ?
import { useEffect, useState } from "react"
import { getBalance } from "./utlis.js"
import SendEth from "./SendEth.js"

function Account(props) {
    const [balance, setBalance] = useState()
    const [mode, setMode] = useState(null)

    useEffect(() => {
        async function getBal(address) {
            const bal = await getBalance(address)
            setBalance(bal)
        }
        getBal(props.wallet.address)
    }, [props.wallet.address])

    return <>
        {!mode ?
            <div>
                <h3>Account</h3>
                <p className="text-break">Address: {props.wallet.address}</p>
                <p>Balance: {balance} ETH</p>
                <button onClick={() => setMode("Send")} className="btn btn-primary">Send Eth</button>
            </div>
            :
            <SendEth setBack={setMode} wallet={props.wallet} balance={balance}/>}
    </>
}










// SendEth . js create input  
import { useRef, useState } from "react"
import { handleSend } from "./utlis.js"

function SendEth(props) {
    const address = useRef()
    const amount = useRef()
    const [txn, setTxn] = useState()

    const send = async () => {
        const txn = await  handleSend(props.wallet, address.current.value, amount.current.value)
        setTxn(txn)
    }


    return <>
    <p onClick={() => props.setBack(null)}>Back</p>
        <input ref={address} placeholder="Address" className="form-control p-2 my-2" />
        <p>Eth : {props.balance}</p>
        <input ref={amount} placeholder="Eth" className="form-control p-2 my-2" />
        <button onClick={send} className="btn btn-primary">Send</button>
        <p className="text-break">{txn && txn.hash}</p>
    </>
}










// step4 security 

import CryptoJS from "crypto-js";

const STORAGE_KEY = "phrase"

export function storeMnemonic(mnemonic) {
    chrome.storage.local.set({ [STORAGE_KEY]: mnemonic })
}

export async function getMnemonic() {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            resolve(result[STORAGE_KEY] || null);
        });
    });
}

export function deleteMnemonic() {
     chrome.storage.local.remove([STORAGE_KEY])
}


let phrase = "aa bb cc"
let password = "pass"

const enCrypt = CryptoJS.AES.encrypt(phrase, password).toString()

console.log(enCrypt)


const deCrypt = CryptoJS.AES.decrypt(enCrypt, password)

console.log(deCrypt)
console.log(deCrypt.toString(CryptoJS.enc.Utf8))






