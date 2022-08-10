import {useState, useCallback} from 'react'

import * as tf from '@tensorflow/tfjs'

import ImageCollection from './components/ImageCollection.jsx'
import Header from './components/Header.jsx'
import ImageList from './components/ImageList.jsx'
import {downloadImages} from './utilities'
import './App.css'

function App() {

  // Initialize states
  const [appData, setAppData] = useState({
    loaded: false,
    on: true,
    count: 0,
    net: {},
    formData: {
      classInput: "testClass"
    },
    imageData: []
  })

  const sortedImages = {}
  appData.imageData.forEach(data => {
    const {id, img, classifier, hand} = data

    if (!sortedImages[classifier]) sortedImages[classifier] = []
    sortedImages[classifier].push({id, img, hand})
  })
  //console.log(sortedImages)

  const getHandPose = async () => {
    downloadImages(sortedImages)
  }

  const listElements = []
  for (const classifier in sortedImages) {
    listElements.push(
      <ImageList 
        key={classifier}
        images={sortedImages[classifier]} 
        classifier={classifier} 
        setAppData={setAppData}
      />
    )
  }

  return (
    <div className="App">
      <Header />
      <ImageCollection 
        appData={appData}
        setAppData={setAppData} 
        getHandPose={getHandPose}
      />
      {listElements}
    </div>
  )
}

export default App
