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
  const [pageNum, setpageNum] = useState(1);
  const [displayPageNum, setdisplaypageNum] = useState(1);
  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(intialURL);
      // 各ポケモンの詳細データを取得
      loadPokemon(res.results);
      setnextURL(res.next);
      setprevURL(res.previous);
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
    if (pageNum > 1) {
      setpageNum(pageNum - 1);
      setdisplaypageNum(pageNum - 1);
    }
    if (!prevURL) return;
    setloading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setnextURL(data.next);
    setprevURL(data.previous);
    setloading(false);
  };
  const handleNextPage = async () => {
    setpageNum(pageNum + 1);
    setdisplaypageNum(pageNum + 1);
    setloading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setprevURL(data.previous);
    setnextURL(data.next);
    setloading(false);
  };

  const search = async () => {
    if (!pageNum) {
      setpageNum(parseInt(1));
      setdisplaypageNum(parseInt(1));
    } else {
      setdisplaypageNum(pageNum);
    }
    const offset = (pageNum - 1) * 20;
    setloading(true);
    let data = await getAllPokemon("https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=20");
    await loadPokemon(data.results);
    setprevURL(data.previous);
    setnextURL(data.next);
    setloading(false);
  }


  return (
    <div className="App">
      {loading ? (
        <h1 className='loading'>Now Loading...</h1>
      ) : (
        <>
          <header className='header'>
            <h2 className='title'>ポケモン図鑑</h2>
            <div className="header_wrap">
              <h2 className='pageNum'>
                {displayPageNum}ページ
              </h2>
              <h2 className='pageID'>
                No.{(displayPageNum - 1) * 20 + 1}〜{displayPageNum * 20}
              </h2>
            </div>
            <div className='search'>
              <p>ページ数検索</p>
              <input type="number" placeholder='半角数字' value={pageNum} onChange={(event) => setpageNum(parseInt(event.target.value))}></input>
              <button type="button" onClick={search}>送信</button>
            </div>
          </header>
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
