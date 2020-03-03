import React, { useState, useRef, useEffect } from 'react'

import Blockchain from '../classes/Blockchain'
import Block from '../components/Block/Block'
import Button from '../components/Button/Button'
import Header from '../components/Header/Header'
import Label from '../components/Label/Label'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import GenerationComments from '../components/GenerationComments/GenerationComments'
import Wave from '../components/Wave/Wave'
import Modal from '../components/Modal/Modal'

//handle blockchain validity check
const checkValidity = (setModalConfig, chain, blockchain) => {

  if (chain.length > 0) {
    setModalConfig({
      title: 'Blockchain is ' + (blockchain.isChainValid() ? 'valid!' : 'invalid!'),
      description: 'Blockchain validity is checked by comparing the hashes or each block (previous hash and current hash), as well as re-calculating individual block hash.',
      setModalConfig,
    })
  } else {
    setModalConfig({
      title: 'Blockchain validity check',
      description: 'Blockchain has no blocks in its chain yet, add some in order to check its validity!',
      setModalConfig,
    })
  }
}

//handle addition of new block to blockchain, and render trigger
const addBlock = (setModalConfig, blockchain, difficulty) => {
  setModalConfig({
    title: 'Add new block',
    description: 'Write down whatever string value you want to save in this block!',
    setModalConfig,
    buttonLabel: "Create Block",
    action: (data) => {
      if (data) {

        blockchain.addBlock(data, difficulty)
      }
    }
  })
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

const onSetDifficulty = (setModalConfig, setDifficulty) => {
  setModalConfig({
    title: 'Set hash difficulty',
    description: 'Choose the blockchain difficuly level, which affects how new blocks generate their hashes. The higher the difficulty, the longer the mining process. Above 4 could take a while.',
    setModalConfig,
    buttonLabel: "Set Difficulty",
    action: (data) => {
      setDifficulty(parseFloat(data) || 1)
    }
  })
}


export default function App() {

  //handle modal
  const [modalConfig, setModalConfig] = useState(null)

  //loading icon, for when mining block
  const [loading, setLoading] = useState(false)
  const generationLog = useRef([])

  //persist blockchain obj through re-renders
  const blockchain = useRef(new Blockchain(setLoading, generationLog))

  //have a chain arr that is in state to trigger updates
  const [chain, setChain] = useState([...blockchain.current.chain])

  //difficulty of blockchain
  const [difficulty, setDifficulty] = useState(1)

  //when loading finishes, block has finished mining, can add it to state chain
  useEffect(() => {
    if (!loading) {
      setChain([...blockchain.current.chain])

      //log the generation log, in case needed
      console.log('block generation log', generationLog.current)

      //reset
      generationLog.current = []
    }
  }, [loading])

  //log blockchain on each render
  useEffect(() => {
    console.log('blockchain obj: ', blockchain)
  })

  return (
    <div className="App">
      {modalConfig && <Modal {...modalConfig} /> }
      {loading ? (<>
        <LoadingSpinner />
        <GenerationComments getGeneratorLog={() => generationLog.current} />
      </>) : null}
      <Header />
      <section data-title="Blockchain controls:" className="controls">
        <Button label="Add new block" action={() => addBlock(setModalConfig, blockchain.current, difficulty, setLoading)} />
        <Button label="Check validity" action={() => checkValidity(setModalConfig, chain, blockchain.current)} />
      </section>
      <section data-title="Blockchain configuartion:" className="config">
        <Button label={`Set hash difficulty (${difficulty})`} action={() => onSetDifficulty(setModalConfig, setDifficulty)} />
      </section>
      <section data-title="Blockchain blocks:" className="blocks">
        {chain.length > 0 ? (
          chain.map((block) =>
            (<Block
              key={block.hash}
              {...block}
              onDeleteBlock={(blockHash) => onDeleteBlock(blockHash, setChain, blockchain.current)}
              onEditBlock={(blockTimestamp, newDataValue) => onEditBlock(blockTimestamp, newDataValue, blockchain.current, setChain)}
            />)
          )
        ) : (
            <Label labelText="No blocks in the blockchain, add some!" />
          )}
      </section>
      <Wave position="right" />
      <Wave position="left" />
    </div>
  )
}
