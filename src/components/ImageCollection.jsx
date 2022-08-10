import {useRef, useState, createRef} from 'react'

import Camera from './Camera.jsx'
import * as handpose from '@tensorflow-models/handpose'
import {drawHand} from '../utilities.js'

function ImageCollection() {
  const cameraRef = createRef()
  const canvasRef = useRef(null)

  // States to toggle webcam
  const [on, setOn] = useState(true)
  const toggle = () => setOn(prevOn => {
    const ctx = canvasRef.current.getContext("2d")
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return !prevOn
  })

  // States to check if model loaded.
  const [loaded, setLoaded] = useState(false)

  const detect = async (net) => {
    // Check if data is available
    if (typeof cameraRef.current !=="undefined" &&
          cameraRef.current !== null &&
          cameraRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = cameraRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight

      // Set video dimensions
      cameraRef.current.video.width = videoWidth
      cameraRef.current.video.height = videoHeight

      // Set canvas dimensions
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make detections
      const hand = await net.estimateHands(video);
      if (!loaded) setLoaded(true)
      //console.log(hand)

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  const runHandpose = async () => {
    const net = await handpose.load()
    console.log("Handpose model loaded.")
    setInterval(()=>{
      detect(net)
    }, 50)
  }

  runHandpose()

  return (
    <div className="ImageCollection">
      <div className="camera">
        {on && <Camera ref={cameraRef} className="camera--main center" />}
        <canvas ref={canvasRef} className="camera--main center"/>
        {!loaded && <h1 className="camera--loading center">Loading hand pose model...</h1>}
      </div>
      <div className="collection--panel">
        <button className="panel--button">📷</button>
        <button onClick={toggle} className="panel--button">🔌</button>
      </div>
    </div>
  )
} 

export default ImageCollection