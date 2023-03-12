import React from 'react'
import './Card.css';
const Card = ({pokemon}) => {
  return (
    <>
      <div className='Card'>
      <img className='Card_img' src={pokemon.sprites.front_default}></img>
      <li>{pokemon.name}</li>
      </div>
    </>
  )
}

export default Card