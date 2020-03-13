import React, { useState, useRef, useEffect } from 'react'
import styles from './generationcomments.module.scss'

const GenerationComments = ({ getGeneratorLog }) => {
    const text = useRef(null)
    const [updatedArr, setUpdatedArr] = useState(getGeneratorLog())

    // every 300ms get updated log from ref obj through func with closure over it
    useEffect(() => {
        const interval = setInterval(() => setUpdatedArr([
            ...getGeneratorLog()
        ]), 300)

        return () => window.clearInterval(interval)
    }, [getGeneratorLog])

    // when container updates with new logs, keep the scroll to bottom
    useEffect(() => {
        text.current.scrollTop = text.current.scrollHeight
    }, [updatedArr])


    return (
        <div className={styles.commentSection}>
            <p>Generation Process Log</p>
            <textarea ref={text} value={updatedArr.join("\r\n")} readOnly />
        </div>
    )
}

export default GenerationComments
