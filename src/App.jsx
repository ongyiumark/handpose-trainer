import * as tf from '@tensorflow/tfjs'

import ImageCollection from './components/ImageCollection.jsx'
import Header from './components/Header.jsx'
import './App.css'

function App() {

  return (
    <div className="App">
      <Header />
      <ImageCollection />
    </div>
  )
}

export default App
