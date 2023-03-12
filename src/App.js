import './App.css';
import { getAllPokemon, getPokemon } from './utility/pokemon.js'
import { useEffect } from 'react';
import { useState } from 'react';
import Card from './Cards/Card';
function App() {
  const intialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setloading] = useState(true);
  const [pokemons, setpokemons] = useState([]);
  const [nextURL, setnextURL] = useState("");
  const [prevURL, setprevURL] = useState("");
  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(intialURL);
      // 各ポケモンの詳細データを取得
      loadPokemon(res.results);
      setnextURL(res.next);
      setprevURL(res.previous);//null
      setloading(false);
    }
    fetchPokemonData(intialURL);
  }, [])

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    ).then(async (res) => {
      let _pokemon_detail = await Promise.all(
        res.map((pokemon) => {
          let detail_pokemonRecord = getPokemon(pokemon.species.url);
          return detail_pokemonRecord;
        })
      )
      changeLang(res, _pokemon_detail)
      return res;
    })
    setpokemons(_pokemonData);
  }

  // 名前だけ日本語にする関数
  const changeLang = (change_pokemons, change_pokemons_detail) => {
    change_pokemons.map((pokemon, i) => {
      return pokemon.name = change_pokemons_detail[i].names[0].name;
    })
  }

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setloading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setnextURL(data.next);
    setprevURL(data.previous);
    setloading(false);
  };
  const handleNextPage = async () => {
    setloading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setprevURL(data.previous);
    setnextURL(data.next);
    setloading(false);
  };

  console.log(pokemons)
  return (
    <div className="App">
      {loading ? (
        <h1 className='loading'>Now Loading...</h1>
      ) : (
        <>
          <ul className='App_cards'>
            {pokemons.map((pokemon, i) => {
              return (
                <Card pokemon={pokemon} key={i} />
              )
            })}
          </ul>
          <div className='btn'>
            <button className='prev' onClick={handlePrevPage}>前へ</button>
            <button className='next' onClick={handleNextPage}>次へ</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
