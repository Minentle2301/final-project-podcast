import React, { useEffect, useState } from 'react'; 
import { fetchPreviews } from '../utils/api';
import PodcastPreview from '../components/PodcastPreview';
import './HomePage.css';

export const genreTitles = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

const HomePage = ({ favorites, addFavorite, removeFavorite }) => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // New state for sort order

  useEffect(() => {
    fetchPreviews()
      .then((response) => {
        const sortedShows = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setPreviews(sortedShows);
        setFilteredPreviews(sortedShows);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle genre selection change
  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);
    filterPodcasts(genreId, searchQuery);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterPodcasts(selectedGenre, query);
  };

  // Filter podcasts based on genre and search query
  const filterPodcasts = (genreId, query) => {
    let filtered = previews;

    if (genreId) {
      filtered = filtered.filter((show) =>
        show.genres.includes(parseInt(genreId))
      );
    }

    if (query) {
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(query)
      );
    }

    // Apply current sort order
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Trigger slide-in animation
    setAnimationClass('animate-slide');
    setTimeout(() => setAnimationClass(''), 500); // Remove animation class after animation ends

    setFilteredPreviews(filtered);
  };

  // Handle sorting
  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = [...filteredPreviews].sort((a, b) =>
      order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setFilteredPreviews(sorted);
  };

  return (
    <div className="home-page">
      <h1>Podcasts</h1>

      {/* Genre Filter Dropdown */}
      <div className="filter">
        <label htmlFor="genre">Filter by Genre: </label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {Object.entries(genreTitles).map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="search">
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search podcasts..."
        />
      </div>

      {/* Sorting Buttons */}
      <div className="sorting">
        <button onClick={() => handleSort('asc')} className={sortOrder === 'asc' ? 'active' : ''}>
          Sort A-Z
        </button>
        <button onClick={() => handleSort('desc')} className={sortOrder === 'desc' ? 'active' : ''}>
          Sort Z-A
        </button>
      </div>

      {/* Podcast Grid */}
      <div className={`podcast-grid ${animationClass}`}>
        {filteredPreviews.length > 0 ? (
          filteredPreviews.map((show) => (
            <PodcastPreview
              key={show.id}
              show={show}
              isFavorite={favorites.includes(show.id)}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
            />
          ))
        ) : (
          <p>No podcasts available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;


