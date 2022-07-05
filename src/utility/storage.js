const user = "user";
const tokens = "tokens";

const setUserInStorage = (data) => {
    const { id, role, username, accessToken, refreshToken } = data;

    const tokensData = { accessToken: accessToken.token, refreshToken: refreshToken };
    const isAdmin = role?.toLowerCase() === "administrator" ?? false;
    const name = username.split(/(?=[A-Z])/).join(' ');
    const userData = { id: id, name, role: role, isAdmin: isAdmin ?? false };
    localStorage.setItem(tokens, JSON.stringify(tokensData));
    localStorage.setItem(user, JSON.stringify(userData));
    return {userData, tokensData};
}

const removeUserFromStorage = () => {
    localStorage.removeItem(user);
    localStorage.removeItem(tokens);
};

const getUserFromStorage = () => JSON.parse(localStorage.getItem(user));

const getTokensFromStorage = () => JSON.parse(localStorage.getItem(tokens));

const changeStoredTokens = (newTokens) => {
    localStorage.removeItem(tokens);
    localStorage.setItem(tokens, JSON.stringify(newTokens));
}

export { 
    setUserInStorage,
    removeUserFromStorage,
    getUserFromStorage,
    getTokensFromStorage,
    changeStoredTokens
 }