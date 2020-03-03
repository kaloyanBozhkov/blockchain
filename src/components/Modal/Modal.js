import React, { useRef, useEffect } from 'react'
import styles from './modal.module.scss'
import Button from '../Button/Button'

const Modal = ({ title, description, setModalConfig, withInput = true, buttonLabel = null, action = null, modifier = '' }) => {
    const inputRef = useRef(null)

    const closeModal = () => setModalConfig(null)

    const onActionClick = () => {
        action(withInput ? inputRef.current.value : undefined)
        setModalConfig(null)
    }

    //on load focus input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])


    const classes = [
        styles.modal,
        //modifier
        styles[modifier] || ''
    ].join(' ').trim()

    return (

        <div className={classes}>
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>

                {action && buttonLabel && (
                    <>
                        {withInput && <textarea ref={inputRef} />}
                        <div className={styles.controls}>
                            <Button label={buttonLabel} action={onActionClick} modifier="editBlockButton" />
                            <Button label="Cancel" action={closeModal} modifier="deleteBlockButton" />
                        </div>
                    </>
                )}

                {!action && !buttonLabel && (
                    <div className={styles.controls}>
                        <Button label="Ok" action={closeModal} modifier={modifier === 'error' ? 'deleteBlockButton' : 'editBlockButton'} />
                    </div>
                )}
            </div>
        </div >
    )
}

export default Modal