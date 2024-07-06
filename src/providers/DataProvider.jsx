import { createContext, useReducer } from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case 'SITES':
            return { ...state, sites: action.payload }
        case 'CHIEFS':
            return { ...state, chiefs: action.payload }
        case 'WORKERS':
            return { ...state, workers: action.payload }
        case 'CATEGORIES':
            return { ...state, categories: action.payload }
        case 'MOVEMENTS':
            return { ...state, movements: action.payload }
        case 'USERS':
            return { ...state, users: action.payload }
        default:
            return state
    }
}

const initialState = {
    sites: JSON.parse(localStorage.getItem('solid_sites_storage') ?? '[]'),
    chiefs: JSON.parse(localStorage.getItem('solid_chiefs_storage') ?? '[]'),
    categories: [],
    workers: [],
    movements: [],
    users: []
}

export const DataContext = createContext({
    state: initialState,
    dispatch: () => { }
})

export function DataProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}