import SHA256 from 'crypto-js/sha256'

class Block {
  constructor(data, previousHash = '', difficulty = 0, setLoading = f => f) {
    this.previousHash = previousHash
    this.timestamp = +new Date()
    this.data = JSON.stringify(data)
    this.generationTime = {
      start: null,
      end: null
    }
    this.setLoading = setLoading
    this.hash = this.calculateHash()
    this.nonce = 0
    this.hashDifficulty = difficulty
    this.mineBlock(difficulty)
    console.log(setLoading)
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
    //start loading for mining process
    this.setLoading(true)

    this.generationTime.start = +new Date()
 
    const generateNewHash = () => {
      this.nonce++
      this.hash = this.calculateHash()
    }


    //using a generator to make sure while loop is non-blocking, allowing GUI to continue animating and being user friendly, instead of freezing screen while mining!
    function * generateCorrectHash() {
      // Keep generating hash and changing the nonce until the hash with enough zeros.
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        yield generateNewHash()
      }

      yield this.hash
    }

    //pass this ref to generator func, since cant use arrow func with generator yet
    const boundGenerator = generateCorrectHash.call(this)

    //start generating new hash, new generation on each req anim frame in event loop
    const loopGenerator = () => window.requestAnimationFrame(() => {
      console.log('generating new:', this.hash, this.nonce)
      
      if (!boundGenerator.next().done) {
        loopGenerator()
      } else {
        //finish mining
        this.generationTime.end = +new Date()
        this.setLoading(false)
      }

    })
    
    loopGenerator()

  }
}

export default Block



// function run() {
//   var a = "start"
//   var b = "finish"
//   var c = 0

//   function dome () {
//       window.requestAnimationFrame(() => {
//           c += 1
//           console.log(c)
//           if (c < 10) {
//               dome()
//           }
//       })
//   }

//   console.log(a)

//   dome()

//   console.log(b)

// }