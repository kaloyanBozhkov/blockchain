import SHA256 from 'crypto-js/sha256'
class Block {
  constructor(data, previousHash = '', difficulty = 0) {
    this.previousHash = previousHash
    this.timestamp = +new Date()
    this.data = JSON.stringify(data)
    this.generationTime = {
      start: null,
      end: null
    }
    this.hash = this.calculateHash()
    this.nonce = 0
    this.hashDifficulty = difficulty
    this.mineBlock(difficulty)
  
  }
  calculateHash() {
    return SHA256(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString()
  }
  mineBlock(difficulty) {
    this.generationTime.start = +new Date()
    
    // Keep changing the nonce until the hash of our block starts with enough zero's.
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    this.generationTime.end = +new Date()
  }
}

export default Block
