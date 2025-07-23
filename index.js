import { Blockchain, Block } from "./blockchain.js";
import { e, Transaction } from "./transaction.js";


const myChain = new Blockchain()

console.log(myChain)

myChain.addBlock(new Block(1, Date.now().toString(), {amount:100} ))
myChain.addBlock(new Block(2, Date.now().toString(), {amount:1000} ))

console.log(myChain)

console.log(JSON.stringify(myChain, null, 2))

console.log("Validate", myChain.isChainValid())

const myKey = e.genKeyPair()
const myWalletAddress = myKey.getPublic('hex')
const tx1 = new Transaction(myWalletAddress, 'recipient-address', 10)
tx1.signTransaction(myKey)
myChain.addTransaction(tx1)

console.log('⛏️ Mining pending transactions...')

myChain.minePendingTransactions(myWalletAddress)

console.log('💰 Balance of my wallet:', myChain.getBalanceOfAddress(myWalletAddress))