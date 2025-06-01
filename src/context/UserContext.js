import React, { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children, loggedUserId }) => {
    return (
        <UserContext.Provider value={{ loggedUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
