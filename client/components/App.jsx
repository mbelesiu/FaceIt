import React, { useState, useEffect } from 'react';
import Webcam from "react-webcam";

function App(){
  const [imageSrc, setImageSrc] = useState(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current.getScreenshot())
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
      {imageSrc ? <img src={imageSrc} /> : null}
    </div>
  )
}


export default App;