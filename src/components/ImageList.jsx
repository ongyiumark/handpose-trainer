import { useEffect } from "react"
import { drawHand } from "../utilities.js"

function ImageList(props) {
  const {images, classifier, setAppData} = props

  useEffect( () => {
    const allCanvas = document.querySelectorAll(".list--canvas")
    for (const canvas of allCanvas) {
      const ctx = canvas.getContext("2d")
      const hand = JSON.parse(canvas.dataset.hand)
      const [origWidth, origHeight, currWidth, currHeight] = [canvas.dataset.width, canvas.dataset.height, canvas.width, canvas.height]
      //console.log(`${origWidth} by ${origHeight} to ${currWidth} by ${currHeight}`)
      drawHand(hand, ctx, currWidth/origWidth, currHeight/origHeight)
    }
  }, [images])

  // Delete image
  const deleteImage = (event) => {
    const id = event.target.dataset.id
    setAppData( prevAppData => {
      const newImages = [] 
      prevAppData.imageData.forEach(data => {
        if (data.id == id) return
        newImages.push(data)
      })
      
      return {
        ...prevAppData,
        imageData: newImages
      }
    }) 
  }

  const imgElements = images.map(val => (
    <div key={val.id} className="list--img">
      <img 
        src={val.img} 
        className="list--img--photo"
        onDoubleClick={deleteImage}
      />
      <button 
        className="list--img--delete" 
        onClick={deleteImage}
        data-id={val.id}>X</button>
      <canvas 
        className="list--canvas" 
        data-hand={JSON.stringify(val.hand)} 
        data-id={val.id}
        data-width={val.width}
        data-height={val.height}
        />
    </div>
    )
  )

  return (
    <div className="ImageList">
      <h1 className="list--title">Classifier: {classifier}</h1>
      <div className="list--container">
        {imgElements}
      </div> 
    </div>
  )
}

export default ImageList