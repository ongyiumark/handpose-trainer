import Webcam from 'react-webcam'
import { forwardRef } from 'react'

const Camera = forwardRef((props, ref) => {
  const width = props.width ? props.width : 640
  const height = props.height ? props.height : 480
  
  //console.log(`${width} by ${height}`)

  const videoConstraints = {
    video: {
      width: {exact: width},
      height: {exact: height}
    },
    facingMode: "user"
  }

  return (
    <Webcam 
      ref={ref}
      audio={false}
      height={height}
      width={width}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      className={props.className}
    />
  )
})

export default Camera