import { createContext, useEffect, useState } from "react";
import { getUserFromStorage, removeUserFromStorage, setUserInStorage } from "../utility/storage";

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
    const [currentUser, setUser] = useState(null);

    useEffect(() => {
        if (currentUser === null) {
            setUser(getUserFromStorage);
        }
    }, [currentUser]);

    const signIn = (data) => {
        const user = setUserInStorage(data);
        setUser(user);
    }
    
    const signOut = () => {
        removeUserFromStorage();
        setUser(null);
    }

    return {
        currentUser,
        signIn,
        signOut
    }
}
export default AuthContext;
export { AuthProvider }