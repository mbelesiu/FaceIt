const imageTaker = (camera) => {
  const images = [];

  for (let i = 0; i < 50; i++) {
    images.push(new Promise((resolve) => {
      setTimeout(() => {
        resolve(camera.getScreenshot())
      }, 1000)
    }));

  }

  return Promise.all(images)
    .then((results) => results);
}

export default imageTaker