import {useRef, useEffect, createRef, useCallback} from 'react'

import Camera from './Camera.jsx'
import * as handpose from '@tensorflow-models/handpose'
import {drawHand} from '../utilities.js'

function ImageCollection(props) {
  const cameraRef = createRef()
  const canvasRef = useRef(null)

  const {appData, setAppData, getHandPose} = props

  useEffect(() => {
    const loadModel = async () => {
      console.log("Loading handpose model...")
      const net = await handpose.load()
      console.log("Handpose model loaded.")
      setAppData(prevAppData => ({
        ...prevAppData,
        loaded: true,
        net: net
      }))
    }
    loadModel()
  }, [])

  // States to toggle webcam
  const toggleCamera = () => setAppData(prevAppData => {
    const ctx = canvasRef.current.getContext("2d")
    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    return {
      ...prevAppData,
      on: !prevAppData.on
    }
  })

  // Handle input
  const handleChange = (event) => {
    const {name, value, type} = event.target
    setAppData( prevAppData => ({
      ...prevAppData,
      formData: {
        [name]: value
      }
    }))
  }
  //console.log(appData.formData.classInput)
  
  // Take photo
  const addImage = useCallback(
    async () => {
      if (appData.formData.classInput.length === 0) return

      const imgSrc = cameraRef.current.getScreenshot()
      const htmlImg = new Image()
      htmlImg.src = imgSrc
      const net = await handpose.load()
      net.estimateHands(htmlImg).then(hand => {
        //console.log(hand)
        setAppData( prevAppData => ({
          ...prevAppData,
          count: prevAppData.count+1,
          imageData: [...prevAppData.imageData, {
            id: prevAppData.count,
            classifier: prevAppData.formData.classInput,
            img: imgSrc,
            hand: hand,
            width: htmlImg.width,
            height: htmlImg.height
          }]
        }))
      })
    },
    [cameraRef]
  ) 
  //console.log(appData.imageData)

  // Read camera and run handpose model
  const detect = async (net) => {
    // Check if data is available
    if (typeof cameraRef.current !=="undefined" &&
          cameraRef.current !== null &&
          cameraRef.current.video.readyState === 4 &&
          appData.loaded
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
      //if (!appData.loaded) setAppData(prevAppData => ({...prevAppData, loaded: true}))
      //console.log(hand)

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  // Load handpose model and run detect at intervals
  const runHandpose = async () => {
    if (appData.net) {
      setInterval(()=>{
        detect(appData.net)
      }, 50)
    }
  }

  runHandpose()

  return (
    <div className="ImageCollection">
      <div className="camera">
        {appData.on && <Camera ref={cameraRef} className="camera--main center" />}
        <canvas ref={canvasRef} className="camera--main center"/>
        {!appData.loaded && <h1 className="camera--loading center">Loading hand pose model...</h1>}
      </div>
      <div className="collection--panel">
        <input 
          name="classInput"
          className="panel--input" 
          type="text" 
          placeholder="Please input a class name." 
          onChange={handleChange}
          value={appData.formData.classInput.trim()}
        />
        <button className="panel--button" onClick={getHandPose}>📁 Download</button>
        <button className="panel--button" onClick={addImage}>📷</button>
        <button className="panel--button" onClick={toggleCamera}>🔌</button>
        
      </div>
    </div>
  )
} 

export default ImageCollection