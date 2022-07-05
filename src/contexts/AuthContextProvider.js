import { createContext, useEffect, useState } from "react";
import { 
    getUserFromStorage,
    removeUserFromStorage, 
    setUserInStorage, 
    getTokensFromStorage,
    changeStoredTokens } from "../utility/storage";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const auth = useAuthState();

    return (
        <AuthContext.Provider value={ auth }>
            {children}
        </AuthContext.Provider>
    )
}

const useAuthState = () => {
    const [stateLoading, setStateLoading] = useState(true);
    const [currentUser, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);

    useEffect(() => {
        if (currentUser === null) {
            setUser(getUserFromStorage);
            setStateLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (tokens === null){
            setTokens(getTokensFromStorage);
        }
    }, [tokens])

    const signIn = (data) => {
        const {userData, tokensData} = setUserInStorage(data);
        setUser(userData);
        setTokens(tokensData);
    }
    
    const signOut = () => {
        removeUserFromStorage();
        setUser(null);
        setTokens(null);
    }

    const changeTokens = (newTokens) => {
        changeStoredTokens(newTokens);
        setTokens(newTokens);
    }

    return {
        stateLoading,
        currentUser,
        tokens,
        signIn,
        signOut,
        changeTokens
    }
}
export default AuthContext;
export { AuthProvider }