import Block from "./block.js";

class Blockchain{
    constructor() {
         this.chain = [this.createFirstBlock()]
    }

    createFirstBlock() {
        return new Block(0, "000000" )
    }

    getPreviousHash() {
        return this.chain[this.chain.length - 1].hash
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getPreviousHash()
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
}

const bitcoin = new Blockchain()

bitcoin.addBlock(new Block(1, ))
bitcoin.addBlock(new Block(2, ))



console.log(bitcoin.chain)
console.log(bitcoin.isChainValid())

console.log(bitcoin.chain[1].hash)

bitcoin.chain[1].hash = 'shahrukh'

console.log(bitcoin.chain)

console.log(bitcoin.isChainValid())