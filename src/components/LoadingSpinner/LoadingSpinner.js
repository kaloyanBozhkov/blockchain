import React from 'react'
import styles from './loadingspinner.module.scss'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LoadingSpinner = () => (
    <div className={styles.spinner}>
        <FontAwesomeIcon icon={faCog} />
        <p>Mining the block hash! <br /> Please wait...</p>
    </div>
)

export default LoadingSpinner