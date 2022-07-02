const user = "user";
const tokens = "tokens";

const setUserInStorage = (data) => {
    const { role, username, accessToken, refreshToken } = data;

    const tokensData = { accessToken: accessToken.token, refreshToken: refreshToken };
    const isAdmin = role?.toLowerCase() === "administrator" ?? false;
    const userData = { name: username, isAdmin: isAdmin ?? false };
    localStorage.setItem(tokens, JSON.stringify(tokensData));
    localStorage.setItem(user, JSON.stringify(userData));
    return userData;
}

const removeUserFromStorage = () => {
    localStorage.removeItem(user);
    localStorage.removeItem(tokens);
};

const getUserFromStorage = () => JSON.parse(localStorage.getItem(user));

const getTokensFromStorage = () => JSON.parse(localStorage.getItem(tokens));

export { 
    setUserInStorage,
    removeUserFromStorage,
    getUserFromStorage,
    getTokensFromStorage
 }