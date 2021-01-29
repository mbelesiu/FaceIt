import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import Gallery from './Gallery.jsx';
import imageTaker from '../scripts/imageTaker.js'


function App() {
  const [imageSrcList, setImageSrcList] = useState([]);
  const [loadCamera, setLoadCamera] = useState(false);
  const [forTesting, setForTesting] = useState(true);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const capture = React.useCallback(() => {
      imageTaker(webcamRef.current)
      .then((results)=>{
        setImageSrcList(results)
      });
      // setImageSrcList(imageSrcList => [...imageSrcList, webcamRef.current.getScreenshot()]);
    },
    [webcamRef]
  );

  const play = () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100);

  };

  const train = ()=>{
    setForTesting(!forTesting);
  }



  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(() => setLoadCamera(true));
  }, [])


  return (
    <div>
      <Container>
        <Canvas
          ref={canvasRef}
        />
        {loadCamera ? <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          onUserMedia={() => play()}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        /> : null}

      </Container>

      <ButtonContainer>
        {imageSrcList.length >= 0 ? <button onClick={train}>Train</button> : <button disabled>Train</button>}
        <button onClick={capture}>Capture photo</button>
        <Gallery images={imageSrcList} />

      </ButtonContainer>
    </div>
  )
}

const Container = styled.div`
  margin: 0;
  padding: 0;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;
const ButtonContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Canvas = styled.canvas`
  position: absolute;
`

export default App;