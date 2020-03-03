import React, { useRef, useEffect, useState } from 'react'
import styles from './wave.module.scss'

const waveConfig = {
    waveDelta: 25,                   
    speed: 0.55,                  
    wavePoints: 8,                  
}

const buildPath = (points, config) => {
    const { offsetHeight: height } = config

    let SVGString = 'M ' + points[0].x + ' ' + points[0].y //`M ${points[0].y} ${ points[0].x}`

    for (let i = 0; i < points.length - 1; i++) {

        //calc midpoints (not first or last tho)
        const cp1 = {
            x: (points[i].x + points[i+1].x) / 2,
            y: (points[i].y + points[i+1].y) / 2
        }

        SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i + 1].x + ' ' + points[i + 1].y 
    }

    SVGString += ` L ${height} ${height}`
    SVGString += ` L ${height} 0 Z`

    return SVGString
}

const calculateWavePoints = (factor, waveConfig) => {
    const points = []
    const { wavePoints, waveWidth, waveHeight, waveDelta, speed } = waveConfig

    for (let i = 0; i <= wavePoints; i++) {
        const yPos = i / wavePoints * waveHeight
        const sinSeed = (factor + (i + i % wavePoints)) * speed * 100
        const sinHeight = Math.sin(sinSeed / 100) * waveDelta
        const xPos = Math.sin(sinSeed / 100) * sinHeight + waveWidth

        points.push({ x: xPos, y: yPos })
    }

    return points
}

const Wave = ({ position }) => {
    const config = useRef({
        ...waveConfig,
        waveWidth: 0,
        waveHeight: 0, // Position from the top of container
    })
    const brain = useRef({
        totalTime: 0,
        factor: 1,
        lastUpdate: 0,
        path: ''
    })
    const container = useRef(null)
    const [pathD, setPathD] = useState("")

    useEffect(() => {
        //check if resized window and container width/height changed, if so re-set config
        config.current.waveWidth = 0
        config.current.waveHeight = container.current.offsetHeight  //pos from top of container

        const now = window.Date.now()
        const elapsed = (now - brain.current.lastUpdate) / 1000
        brain.current.lastUpdate = now
        brain.current.totalTime += elapsed
        brain.current.factor = brain.current.totalTime * Math.PI
        brain.current.path = buildPath(calculateWavePoints(brain.current.factor, config.current), container.current)

        window.requestAnimationFrame(() => setPathD(brain.current.path))
    }, [pathD])

    const classes = [
        styles.decoratorWave,
        styles[position] || ''
    ].join(' ').trim()

    return (
        <div className={classes} ref={container}>
            <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path id="wave" d={pathD} />
            </svg>
        </div>
    )
}

export default Wave