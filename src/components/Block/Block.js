import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from './block.module.scss'

import Button from '../Button/Button'

const Block = ({
  timestamp,
  nonce,
  data,
  hash,
  previousHash,
  hashDifficulty,
  generationTime: { start, end },
  onDeleteBlock,
  onEditBlock
}) => {
  
  const [editing, setEditing] = useState(false)
  const dataInput = useRef(null)

  //display related logic
  const seconds = new Date(timestamp).getSeconds()
  const minutes = new Date(timestamp).getMinutes()
  const displayDate = new Date(timestamp).toDateString()
  const getDisplayTime = (timestamp, withMilliseconds = false) => `${new Date(timestamp).getHours()}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}${withMilliseconds ? ' and ' + new Date(timestamp).getMilliseconds() + 'ms': ''}`
  
  //controls handlers
  const onEditClick = () => {
    
    //is in editing mode, now click is to save
    if (editing) {

      //using timestamp to check for block, since hash will be changing on data change
      onEditBlock(timestamp, dataInput.current.value)
    }

    setEditing(!editing)
  }
  const onDeleteBlockClick = () => {
    if (window.confirm('Delete block?')) {
      onDeleteBlock(hash)
    }
  }

  return (
    <div className={styles.block}>
      <p>
        <span>{displayDate}</span>
        <span>{getDisplayTime(timestamp)}</span>
      </p>
      <p data-title="Hash">{hash}</p>
      <p data-title="Time Taken (to generate hash)">{end - start}ms {end - start > 500 ? '(' + ((end - start) / 1000) + 's)' : ''}</p>
      <div>
        <p data-title="Generation Time Start">{getDisplayTime(start, true)}</p>
        <p data-title="Generation Time End">{getDisplayTime(end, true)}</p>
      </div>
      <div>
        <p data-title="Nonce (tries)">{nonce}</p>
        <p data-title="Hash Difficulty">{hashDifficulty}</p>
      </div>
      <div>
        {editing ? <div data-title="Data (editing enabled, write something!)" className={styles.textareaWrapper}><textarea defaultValue={JSON.parse(data)} ref={dataInput} /></div> : <p data-title="Data">"{JSON.parse(data)}"</p>}
      </div>
      <p data-title="Previous Hash">{previousHash}</p>
      <div className={styles.blockControls} data-title="Block Controls">
       <Button modifier="editBlockButton" action={onEditClick} isActive={editing} label={editing ? 'Save Edits' : 'Edit Data'} />
       <Button modifier="deleteBlockButton" label="Delete Block" action={onDeleteBlockClick} />
      </div>
    </div>
  )
}

Block.propTypes = {
  timestamp: PropTypes.number.isRequired,
  nonce: PropTypes.number.isRequired,
  data: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  previousHash: PropTypes.string.isRequired,
  hashDifficulty: PropTypes.number.isRequired,
  generationTime: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired
  }),
  onDeleteBlock: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired
}

export default Block
