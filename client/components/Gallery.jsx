import React from 'react';
import styled from 'styled-components';

function Gallery({ images }) {

  return (
    <Container>
      {images.map((image)=>(<img src={image} width='320px' height='180px'/>))}
    </Container>
  )
}


export default Gallery;


const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;