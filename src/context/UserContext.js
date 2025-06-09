import React, { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    return (
        <UserContext.Provider value={{ loggedUserId:1 }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
