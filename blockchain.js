import crypto from 'crypto'
import { Transaction } from './transaction.js'

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.nonce = 0
        this.hash = this.calculatedHash()
    }

    calculatedHash() {
        return crypto
            .createHash("sha256")
            .update(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce)
            .digest("hex");
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith("0".repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculatedHash();
            console.log(this.hash)
        }

        console.log(`✅ Block mined: ${this.hash}`);
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createFirstBlock()]
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createFirstBlock() {
        return new Block(0, Date.now().toString(), "First Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculatedHash()
        this.chain.push(newBlock)
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i]
            const previous = this.chain[i - 1]

            if (current.previousHash !== previous.hash) {
                return false
            }

            if (current.hash !== current.calculatedHash()) {
                return false
            }
        }
        return true
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }


    minePendingTransactions(minerAddress) {
        const rewardTx = new Transaction(null, minerAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        const block = new Block(
            this.chain.length,
            Date.now().toString(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        block.mineBlock(this.difficulty);

        console.log('✅ Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            if (!Array.isArray(block.data)) continue;
            for (const tx of block.data) {
                if (tx.fromAddress === address) {
                    balance -= tx.amount;
                }

                if (tx.toAddress === address) {
                    balance += tx.amount;
                }
            }
        }

        return balance;
    }
}


export { Block, Blockchain }