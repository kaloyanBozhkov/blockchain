import React, { useState, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'

import Blockchain from '../classes/Blockchain'
import Block from '../components/Block/Block'
import Button from '../components/Button/Button'
import Header from '../components/Header/Header'
import Label from '../components/Label/Label'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Wave from '../components/Wave/Wave'


//handle blockchain validity check
const checkValidity = (chain, blockchain) => {
  if (chain.length > 0) {
    const validity = blockchain.isChainValid()

    alert('Blockchain is ' + (validity ? 'valid!' : 'invalid!'))
  } else {
    alert("Blockchain has no chains yet, add some in order to check validity!")
  }
}

//handle addition of new block to blockchain, and render trigger
const addBlock = (blockchain, difficulty) => {
  const data = prompt('Block data:')

  if (data) {

    blockchain.addBlock(data, difficulty)
  }
}

const onDeleteBlock = (blockHash, setChain, blockchain) => {
  blockchain.chain = blockchain.chain.filter((block) => block.hash !== blockHash)

  setChain([...blockchain.chain])
}

const onEditBlock = (blockTimestamp, newDataValue, blockchain, setChain) => {
  blockchain.chain = blockchain.chain.map((block) => {
    if (block.timestamp === blockTimestamp) {
      block.data = JSON.stringify(newDataValue)
      return block
    }

    return block
  })

  setChain([...blockchain.chain])
}

const onSetDifficulty = (setDifficulty) => setDifficulty(parseFloat(prompt('Choose difficulty')) || 1)


export default function App() {

  //loading icon, for when mining block
  const [loading, setLoading] = useState(false)

  //persist blockchain obj through re-renders
  const blockchain = useRef(new Blockchain(setLoading))

  //have a chain arr that is in state to trigger updates
  const [chain, setChain] = useState([...blockchain.current.chain])


  //difficulty of blockchain
  const [difficulty, setDifficulty] = useState(1)


  //when loading finishes, block has finished mining, can add it to state chain
  useEffect(() => {
    if (!loading) {
      setChain([...blockchain.current.chain])
    }
  }, [loading])

  //log blockchain on each render
  useEffect(() => {
    console.log('blockchain obj: ', blockchain)
  })

  return (
    <div className="App">
      {loading ? <LoadingSpinner /> : null}
      <Header />
      <section data-title="Blockchain controls:" className="controls">
        <Button label="Add new block" action={() => addBlock(blockchain.current, difficulty, setLoading)} />
        <Button label="Check validity" action={() => checkValidity(chain, blockchain.current)} />
      </section>
      <section data-title="Blockchain configuartion:" className="config">
        <Button label={`Set hash difficulty (${difficulty})`} action={() => onSetDifficulty(setDifficulty)} />
      </section>
      <section data-title="Blockchain blocks:" className="blocks">
        {chain.length > 0 ? (
          chain.map((block) => 
            (<CSSTransition
                key={block.hash}
                timeout={300}
                classNames="ok"
              >
                <Block 
                  {...block} 
                  onDeleteBlock={(blockHash) => onDeleteBlock(blockHash, setChain, blockchain.current)} 
                  onEditBlock={(blockTimestamp, newDataValue) => onEditBlock(blockTimestamp, newDataValue, blockchain.current, setChain)}
                />
              </CSSTransition>)
            )
        ) : (
          <Label labelText="No blocks in the blockchain." />
        )}
      </section>
      <Wave position="right" />
      <Wave position="left" />
    </div>
  )
}
