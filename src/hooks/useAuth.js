import { useContext } from "react";
import AuthContext from "../contexts/AuthContextProvider";

const useAuth = () => useContext(AuthContext);

export default useAuth;