import pkg from 'elliptic';
const { ec: EC } = pkg;
import crypto from 'crypto'

const ec = EC("secp256k1")


export class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }

    calculatedHash() {
        return crypto
        .createHash('sha256')
        .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
        .digest('hex')
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('you cannot sign transaction for other wallets')
        }

        const hash = this.calculatedHash()
        const signature = signingKey.sign(hash, 'base64')
        this.signature = signature.toDER('hex')
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('no signature found in this transaction!')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculatedHash(), this.signature)
    }
}

export const e =  new EC('secp256k1');