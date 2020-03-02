            calculateHash() {
                return SHA256(
                    this.previousHash +
                    this.timestamp +
                    JSON.stringify(this.data) +
                    this.nonce
                ).toString()
            }
Each block in the blockchain commits to all of the transactions in the block and the order that they are in. It does this by including the hash of all of the transactions in the block header, which is then part of the data that is hashed for the proof of work.

Modifying a transaction in a block will change the hash of all of the transactions which ultimately changes the hash of the block header. This will likely make the block header's hash have an invalid proof of work. Thus in order to modify the transaction, you would have to redo the block's proof of work, i.e. remine the block.

            class Block {
            constructor(data, previousHash = '', difficulty = 0) {
                this.previousHash = previousHash
            ...

Furthermore, the block header includes the hash of the previous block. So if you want to change a transaction, you will need to also remine all of the blocks following the block which contains the transaction you modified. Lastly, your set of modified blocks are actually a blockchain fork. In order to get it to be accepted by the rest of the network, your fork will need to have more cumulative work than the current blockchain, which effectively means that your fork needs to be longer than the current blockchain.

            isChainValid() {
                for (let i = 1; i < this.chain.length; i++) {
                    const currentBlock = this.chain[i]
                    const previousBlock = this.chain[i - 1]

                    if (currentBlock.hash !== currentBlock.calculateHash()) {
                        return false
                    }

                    if (currentBlock.previousHash !== previousBlock.hash) {
                        return false
                    }
                }
                return true
            }

Overall, modifying transactions already in the blockchain requires remining blocks, and after a transaction already has a few confirmations, doing this requires immense amounts of computing power. So much computing power is required that modifying blocks is effectively impossible to do.