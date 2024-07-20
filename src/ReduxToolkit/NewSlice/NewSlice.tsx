import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Server/Server";

interface NewsState {
    allNews: any[]; 
}

const initialState: NewsState = {
    allNews: [],
};


interface NewsApiResponse {
    results: {
        id: number;
        title: string;
        description: string;
        created_date: string;
        is_favorite: boolean;
        image: string;
        category: null;
    }
}


export const getAllNews = createAsyncThunk(
    'allNews/getAllNews',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const res = await instance.get<NewsApiResponse>('/news/list/?format=json');
            dispatch(getNews(res.data.results)); 
        } catch (error) {
            return rejectWithValue(error); 
        }
    }
);

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        getNews: (state, action) => {
            state.allNews = [...action.payload];
        }
    }
});


export const { getNews } = newsSlice.actions; 
export default newsSlice.reducer;
