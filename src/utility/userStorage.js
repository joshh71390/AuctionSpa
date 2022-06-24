const user = "user";

const setUser = (response) => {
    const data = response.data;

    const token = data.accessToken;
    const jwtParams = JSON.parse(Buffer.from(accessToken.split(".")[1], 'base64'));
    const id = jwtParams.id;
    const isAdmin = jwtParams.role?.toLowerCase().includes("administrator");
    const userData = { id: id, isAdmin: isAdmin ?? false };
    localStorage.setItem(user, JSON.stringify(userData));
    return userData;
}

const removeUser = () => localStorage.removeItem(user);

const getUser = () => JSON.parse(localStorage.getItem(user));

export { setUser, removeUser, getUser }