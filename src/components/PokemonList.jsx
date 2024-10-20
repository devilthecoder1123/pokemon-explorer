import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Change this to adjust Pokémon per page

  // Fetch Pokémon list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        const results = response.data.results;

        // Fetch details of each Pokémon
        const pokemonData = await Promise.all(
          results.map(async (pokemon) => {
            const pokeDetails = await axios.get(pokemon.url);
            return {
              name: pokeDetails.data.name,
              imageUrl: pokeDetails.data.sprites.front_default,
              types: pokeDetails.data.types.map(
                (typeInfo) => typeInfo.type.name
              ),
            };
          })
        );

        setPokemonList(pokemonData);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Pokémon data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Pokémon types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        setTypes(response.data.results.map((type) => type.name));
      } catch (error) {
        setError("Failed to fetch Pokémon types");
      }
    };

    fetchTypes();
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter Pokémon based on search term and selected type
  const filteredPokemon = pokemonList
    .filter((pokemon) => pokemon.name.includes(debouncedTerm.toLowerCase()))
    .filter((pokemon) =>
      selectedType ? pokemon.types.includes(selectedType) : true
    );

  // Pagination Logic
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemon = filteredPokemon.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle Page Change
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <p className="text-center text-xl font-bold">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-bold">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Pokémon Explorer</h1>

      {/* Search Input */}
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="border border-gray-400 p-2 w-5/12 mb-4 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-400 p-2 mb-6 rounded-lg w-5/12"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Pokémon List */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {currentPokemon.map((pokemon) => (
          <div
            key={pokemon.name}
            className="border p-4 rounded-lg shadow-md bg-white text-center transition transform hover:scale-105"
          >
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="mx-auto mb-2 w-24 h-24"
            />
            <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
            <p className="text-sm text-gray-500">{pokemon.types.join(", ")}</p>
          </div>
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No Pokémon found.</p>
      )}

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
      />
    </div>
  );
};

export default App;
