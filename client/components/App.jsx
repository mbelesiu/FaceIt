import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import Gallery from './Gallery.jsx';

function App(){
  const [imageSrcList, setImageSrcList] = useState([]);
  const [loadCamera, setLoadCamera] = useState(false);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      setImageSrcList(imageSrcList => [...imageSrcList, webcamRef.current.getScreenshot()]);
    },
    [webcamRef]
  );

  const play = () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current
    const displaySize = { width: video.width, height: video.height }
    console.log(video)
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)

  }



  useEffect(()=>{
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(()=>setLoadCamera(true));
  },[])


  return (
    <Container>
      <Canvas
      ref={canvasRef}
      />
      {loadCamera ? <Webcam
      audio={false}
      height={720}
      ref={webcamRef}
      onUserMedia={()=>play()}
      screenshotFormat="image/jpeg"
      width={1280}
      videoConstraints={videoConstraints}
      /> : null}

      {/* <button onClick={capture}>Capture photo</button>
      <Gallery images={imageSrcList} />
      {imageSrcList.length >= 10 ? <button onClick={()=>console.log(imageSrcList.length)}>Train</button> : <button disabled>Train</button>} */}
    </Container>
  )
}

const Container = styled.div`

  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

`;

const Canvas = styled.canvas`
  position: absolute;
`

export default App;