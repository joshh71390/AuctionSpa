import { createContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
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

    const client = useQueryClient();

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

    const signInMutation = useMutation((data) => {
        const {userData, tokensData} = setUserInStorage(data);
        setUser(userData);
        setTokens(tokensData);
    }, {
        onSuccess: () => client.invalidateQueries(['owned', 'participated'])
    })

    const signIn = (data) => signInMutation.mutate(data);
    
    const signOutMutation = useMutation(() => {
        removeUserFromStorage();
        setUser(null);
        setTokens(null);
    }, {
        onSuccess: () => client.invalidateQueries(['owned', 'participated'])
    })

    const signOut = () => signOutMutation.mutate();

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