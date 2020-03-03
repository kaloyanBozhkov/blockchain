import Block from './Block'

class Blockchain {
	constructor(setLoading, generationLog, difficulty = 1) {
		this.difficulty = difficulty
		this.setLoading = setLoading
		this.generationLog = generationLog
		this.chain = []
	}

	addBlock(data, difficulty = 0) {
		this.chain.push(new Block(
			(this.chain.length ? data : `Genesis block, ${data}`),
			(this.chain.length ? this.getLatestBlock().hash : 'none, this is genesis block!'),
			difficulty || this.difficulty,
			this.setLoading,
			this.generationLog
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