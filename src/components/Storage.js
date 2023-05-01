const tokenKey = "token";
const userKey = "user";
const nameKey = "name"

export function saveToken(token) {
    saveToStorage(tokenKey, token);
}

export function getToken() {
    return getFromStorage(tokenKey);
}

export function saveUser(user){
    saveToStorage(userKey, user);
}

export function saveName(name){
    saveToStorage(nameKey, name);
};

export function getName() {
    return getFromStorage(nameKey);
}

export function getUsername() {
    return getFromStorage(userKey)
}

export function clearStorage() {
    localStorage.clear();
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
    const value = localStorage.getItem(key);

    if(!value) {
        return [];
    }

    return JSON.parse(value);
}