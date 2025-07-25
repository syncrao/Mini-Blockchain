import crypto from 'crypto'

class Block{
    constructor(index, previousHash = "") {
        this.index = index
        this.timestamp = Date.now()
        this.previousHash = previousHash
        this.hash = this.calculatedHash()
    }

    calculatedHash() {
        return crypto.createHash("sha256").update(this.index + this.timestamp + this.previousHash).digest("hex")
    }
}


export default Block

