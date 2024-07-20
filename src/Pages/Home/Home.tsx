import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import './Home.scss'; // Путь к вашему файлу со стилями

interface NewsItem {
  id: number;
  title: string;
  image: string;
  created_date: string;
  category: {
    id: number;
    name: string;
  };
  is_favorite: boolean;
}

interface NewsState {
  allNews: NewsItem[];
  loading: boolean;
  error: string | null;
  page: number;
  nextPage: string | null;
  previousPage: string | null;
  searchQuery: string;
}

const initialState: NewsState = {
  allNews: [],
  loading: false,
  error: null,
  page: 1,
  nextPage: null,
  previousPage: null,
  searchQuery: '',
};

const newsReducer = (state: NewsState, action: any): NewsState => {
  switch (action.type) {
    case 'FETCH_NEWS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_NEWS_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        allNews: action.payload.results, 
        nextPage: action.payload.next, 
        previousPage: action.payload.previous 
      };
    case 'FETCH_NEWS_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, page: 1 }; // Reset page to 1 on new search
    default:
      return state;
  }
};

const fetchNews = async (dispatch: any, page: number, searchQuery: string) => {
  dispatch({ type: 'FETCH_NEWS_START' });
  try {
    const response = await axios.get(`https://neobook.online/neonews/news/list/?page=${page}&format=json&search=${searchQuery}`);
    dispatch({ type: 'FETCH_NEWS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_NEWS_FAILURE', payload: error });
  }
};

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  useEffect(() => {
    fetchNews(dispatch, state.page, state.searchQuery);
  }, [state.page, state.searchQuery]);

  const handleNextPage = () => {
    if (state.nextPage) {
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
    }
  };

  const handlePreviousPage = () => {
    if (state.previousPage) {
      dispatch({ type: 'SET_PAGE', payload: state.page - 1 });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(dispatch, 1, state.searchQuery); // Reset to page 1 for new search
  };

  return (
    <div className="container">
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            value={state.searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search news..." 
            className="search-input"
          />
          <button type="submit" className="search-button"><FaSearch/></button>
        </form>
      </div>
      <div className="news">
        {state.loading ? (
          <p>Loading...</p>
        ) : state.error ? (
          <p>Error: {state.error}</p>
        ) : (
          <>
            {state.allNews.map((news: NewsItem) => (
              <div className="news-item" key={news.id}>
                <img src={news.image} alt={news.title} className="news-image" />
                <div className="news-content">
                  <div className="news-category">{news.category.name}</div>
                  <div className="news-title">{news.title}</div>
                  <div className="news-date">{news.created_date}</div>
                </div>
              </div>
            ))}
            <div className="pagination">
              <button 
                onClick={handlePreviousPage} 
                disabled={!state.previousPage}
                className="pagination-button"
              >
                <FiArrowLeft />
              </button>
              <span className="pagination-info"><b>{state.page}</b></span>
              <button 
                onClick={handleNextPage} 
                disabled={!state.nextPage}
                className="pagination-button"
              >
                <FiArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
