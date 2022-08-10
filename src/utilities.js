import JSZip from "jszip"
import { saveAs } from 'file-saver'
import { v4 as uuidv4 } from 'uuid'

export function drawHand(predictions, ctx, xRatio=1, yRatio=1) {
  if (predictions.length===0) return

  predictions.forEach((prediction)=>{
    const landmarks = prediction.landmarks

    const annotations = prediction.annotations
    // Draw fingers
    for (const finger in annotations) {
      if (finger === "palmBase") continue
      const fingerArr = annotations[finger]
      
      const [baseX, baseY] = annotations["palmBase"][0]
      const [startX, startY] = fingerArr[0]

      ctx.beginPath()
      ctx.moveTo(baseX*xRatio, baseY*yRatio)
      ctx.lineTo(startX*xRatio, startY*yRatio)
      ctx.strokeStyle = "aqua"
      ctx.lineWidth = xRatio < 1 ? 1 : 2
      ctx.stroke()

      for (let i=0; i<fingerArr.length-1; i++) {
        const [x0, y0] = fingerArr[i]
        const [x1, y1] = fingerArr[i+1]
        
        ctx.beginPath()
        ctx.moveTo(x0*xRatio, y0*yRatio)
        ctx.lineTo(x1*xRatio, y1*yRatio)
        ctx.strokeStyle = "aqua"
        ctx.lineWidth = xRatio < 1 ? 1 : 2
        ctx.stroke()
      }
    }

    // Draw landmarks
    for (const landmark of landmarks) {
      const [x,y] = landmark
      
      ctx.beginPath()
      ctx.arc(x*xRatio, y*yRatio, xRatio < 1 ? 2 : 4, 0, 2*Math.PI)

      ctx.fillStyle="red"
      ctx.fill()
    }
  })
} 


export function downloadImages(downloadObj) {
  const zip = new JSZip()
  const root = `handpose-images`
  for (const classifier in downloadObj) {
    const dataArr = downloadObj[classifier]
    const folder = zip.folder(`${root}/${classifier}`)
    for (const data of dataArr) {
      const {img, hand, id} = data
      const base64Img = img.substr(img.indexOf(',')+1)
      const uniqueId = uuidv4()
      folder.file(`${classifier}-${uniqueId}.jpeg`, base64Img, {base64: true})
      folder.file(`${classifier}-${uniqueId}.json`, JSON.stringify(hand))
    }
  }

  zip.generateAsync({type: "blob"}).then(content => {
    saveAs(content, `handpose-trainer-${uuidv4()}.zip`);
  });
}