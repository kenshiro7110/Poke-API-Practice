import React from 'react'
import './Card.css';
const Card = ({pokemon}) => {
  console.log(pokemon)
  return (
    <>
      <div className='Card'>
      <img className='Card_img' src={pokemon.sprites.front_default}></img>
      <li>No.{pokemon.id}</li>
      <li>{pokemon.name}</li>
      </div>
    </>
  )
}

export default Card