import Block from './Block'

class Blockchain {
	constructor(difficulty = 1) {
		this.chain = [this.createGenesisBlock()]
		this.difficulty = difficulty
	}

	createGenesisBlock() {
		return new Block('Genesis block', 'none', 2)
	}

	addBlock(data, difficulty = 0) {
		this.chain.push(new Block(
			(this.chain.length ? data : `Genesis block, ${data}`),
			(this.chain.length ? this.getLatestBlock().hash : 'none'),
			difficulty || this.difficulty
		))
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

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
}

export default Blockchain