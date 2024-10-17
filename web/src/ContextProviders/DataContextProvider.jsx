import { createContext, useReducer } from "react";

const DataContext = createContext();

function DataContextProvider({ children }) {

    function dataReducer(state, action) {
        switch (action.type) {
            case "SET_QUOTES":
                return { ...state, quotes: action.payload }
            case "SET_BLOGS":
                return { ...state, blogs: action.payload }
            case "SET_IS_LOADING":
                return { ...state, isLoading: action.payload }
            default:
                return state
        }
    }

    const initialState = {
        isLoading: false,
        quotes: [],
        blogs: [],
        books: []
    }

    const [state, dispatch] = useReducer(dataReducer, initialState);
    return <DataContext.Provider value={{ state, dispatch }}>
        {children}
    </DataContext.Provider>
}

export { DataContextProvider, DataContext }