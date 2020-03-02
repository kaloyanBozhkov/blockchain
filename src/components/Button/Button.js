import React from 'react'

import styles from './button.module.scss'

const Button = ({ label, action, modifier = '', isActive = false }) => {
  const classes = [
    modifier === '' ? styles.button : '',
    modifier !== ''  && styles.hasOwnProperty(modifier) ? styles[modifier] : '',
    isActive ? styles.activeBtn : '',
  ].join(' ').trim()

  return (
    <div className={classes} onClick={action}>
      <p>{label}</p>
    </div>
  )
}

export default Button