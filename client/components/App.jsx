import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Webcam from "react-webcam";

import Gallery from './Gallery.jsx'

function App(){
  const [imageSrcList, setImageSrcList] = useState([]);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      // const temp = [...imageSrcList];
      // temp.push(webcamRef.current.getScreenshot());
      // setImageSrcList(temp);
      setImageSrcList(imageSrcList => [...imageSrcList, webcamRef.current.getScreenshot()]);
    },
    [webcamRef]
  );


  return (
    <div>
      <Webcam
      audio={false}
      height={720}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={1280}
      videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      <Gallery images={imageSrcList} />
    </div>
  )
}


export default App;