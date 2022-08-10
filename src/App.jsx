import {useRef, useState, createRef} from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Camera from './components/Camera.jsx'

import './App.css'
import {drawHand} from './utilities.js'

function App() {
  const cameraRef = createRef()
  const canvasRef = useRef(null)

  // States to toggle webcam
  const [on, setOn] = useState(true)
  const toggle = () => setOn(prevOn => !prevOn)

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
    <div className="App">
      <div className="camera">
        {on && <Camera ref={cameraRef} className="camera--main" />}
        <canvas ref={canvasRef} className="camera--main"/> 
  
        
        {!loaded && <h1 className="camera--loading">Loading hand pose model...</h1>}
      </div>


      <button onClick={toggle}>Toggle Webcam</button>
    </div>
  )
}

export default App
