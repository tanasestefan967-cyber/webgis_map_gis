import React, { useState, useEffect } from 'react';

const SearchComponent = ({ markerRefs, mapRef }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchAutocompleteResults = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery
          )}&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSearchResults(data.length > 0 ? data : []);
      } catch {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAutocompleteResults();
  }, [debouncedQuery]);

  const handleResultClick = (lat, lon, display_name) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([lat, lon], 17, { animate: true, duration: 1 });

      const marker = markerRefs[display_name] || null;
      if (marker) marker.setLatLng([lat, lon]).openPopup();

      L.popup()
        .setLatLng([lat, lon])
        .setContent(`Location: ${display_name}`)
        .openOn(map);
    }
    setSearchResults([]);
  };

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: '260px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* SEARCH BUTTON + INPUT */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          style={{
            background: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: '#333',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? (
            <div style={spinnerStyle}></div>
          ) : (
            '🔍'
          )}
        </button>

        {isSearchVisible && (
          <input
            type="text"
            placeholder="Caută o locație..."
            value={searchQuery}
            onChange={handleInputChange}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#ffffff',
              color: '#333',
              fontSize: '15px',
              outline: 'none',
              width: '200px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#24d0ff';
              e.target.style.boxShadow =
                '0 0 0 3px rgba(36,208,255,0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ccc';
              e.target.style.boxShadow =
                '0 2px 6px rgba(0,0,0,0.05)';
            }}
          />
        )}
      </div>

      {/* RESULTS PANEL */}
      {isSearchVisible && searchResults.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            width: '100%',
            fontFamily: "'Roboto', sans-serif",
            color: '#333',
            marginTop: '10px',
            boxSizing: 'border-box',
          }}
        >
          {error && (
            <p
              style={{
                color: '#d32f2f',
                marginTop: '10px',
                fontSize: '14px',
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              borderTop: '1px solid #eee',
              paddingTop: '10px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleResultClick(
                      result.lat,
                      result.lon,
                      result.display_name
                    )
                  }
                  style={{
                    padding: '10px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    border: '1px solid #eee',
                    boxShadow:
                      '0 2px 6px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      '#f0f7ff';
                    e.currentTarget.style.borderColor =
                      '#24d0ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      '#f9f9f9';
                    e.currentTarget.style.borderColor =
                      '#eee';
                  }}
                >
                  <strong
                    style={{
                      fontSize: '14px',
                      color: '#222',
                    }}
                  >
                    {result.display_name}
                  </strong>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0,
                      marginTop: '3px',
                    }}
                  >
                    {result.lat}, {result.lon}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const spinnerStyle = {
  width: '16px',
  height: '16px',
  border: '3px solid #e0e0e0',
  borderTop: '3px solid #24d0ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default SearchComponent;