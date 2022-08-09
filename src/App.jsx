import {useRef, useState} from 'react'

import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'

import './App.css'
import {drawHand} from './utilities.js'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  // States to toggle webcam
  const [on, setOn] = useState(true)
  const toggle = () => setOn(prevOn => !prevOn)

  const detect = async (net) => {
    // Check if data is available
    if (typeof webcamRef.current !=="undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight

      // Set video dimensions
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas dimensions
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make detections
      const hand = await net.estimateHands(video);
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
        {on && <Webcam ref={webcamRef} className="camera--main" />}
        <canvas ref={canvasRef} className="camera--main"/> 
      </div>


      <button onClick={toggle}>Toggle Webcam</button>
    </div>
  )
}

export default App
