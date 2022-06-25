const user = "user";
const tokens = "tokens";

const setUser = (data) => {
    const { role, username, accessToken, refreshToken } = data;

    const tokensData = { accessToken: accessToken.token, refreshToken: refreshToken };
    const isAdmin = role?.toLowerCase() === "administrator" ?? false;
    const userData = { name: username, isAdmin: isAdmin ?? false };
    localStorage.setItem(tokens, JSON.stringify(tokensData));
    localStorage.setItem(user, JSON.stringify(userData));
    return userData;
}

const removeUser = () => {
    localStorage.removeItem(user);
    localStorage.removeItem(tokens);
};

const getUser = () => JSON.parse(localStorage.getItem(user));

export { setUser, removeUser, getUser }