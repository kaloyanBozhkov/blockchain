import React, { useRef, useEffect } from 'react'
import styles from './modal.module.scss'
import Button from '../Button/Button'

const Modal = ({ title, description, setModalConfig, buttonLabel = null, action = null }) => {
    const inputRef = useRef(null)

    const closeModal = () => setModalConfig(null)

    const onActionClick = () => {
        action(inputRef.current.value)
        setModalConfig(null)
    }

    //on load focus input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (

        <div className={styles.modal}>
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>

                {action && buttonLabel && (
                    <>
                        <textarea ref={inputRef} />
                        <div className={styles.controls}>
                            <Button label={buttonLabel} action={onActionClick} modifier="editBlockButton" />
                            <Button label="Cancel" action={closeModal} modifier="deleteBlockButton" />
                        </div>
                    </>
                )}

                {!action && !buttonLabel && (
                    <div className={styles.controls}>
                        <Button label="Ok" action={closeModal} modifier="editBlockButton" />
                    </div>
                )}
            </div>
        </div >
    )
}

export default Modal