import React from 'react'
import styles from './label.module.scss'

const Label = ({ labelText }) => (
    <h1 className={styles.label}>{labelText}</h1>
)

export default Label