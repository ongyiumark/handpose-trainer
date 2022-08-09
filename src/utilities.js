export function drawHand(predictions, ctx) {
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
      ctx.moveTo(baseX, baseY)
      ctx.lineTo(startX, startY)
      ctx.strokeStyle = "aqua"
      ctx.lineWidth = 3
      ctx.stroke()

      for (let i=0; i<fingerArr.length-1; i++) {
        const [x0, y0] = fingerArr[i]
        const [x1, y1] = fingerArr[i+1]
        
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.strokeStyle = "aqua"
        ctx.lineWidth = 3
        ctx.stroke()
      }
    }

    // Draw landmarks
    for (const landmark of landmarks) {
      const [x,y] = landmark
      
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 3*Math.PI)

      ctx.fillStyle="red"
      ctx.fill()
    }
  })
} 