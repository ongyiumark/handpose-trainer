function ImageList(props) {
  const {images, classifier, setAppData} = props

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