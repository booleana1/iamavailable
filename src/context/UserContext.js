import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

export const UserContext = createContext({
    loggedUserId: null,
    user: null,
    loading: true,
    logout: async () => {},
});

export const UserProvider = ({ children }) => {
    const [state, setState] = useState({ loggedUserId: null, user: null, loading: true });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const uid = firebaseUser.uid;
                let userDoc = null;

                try {
                    const snap = await getDoc(doc(db, 'users', uid));
                    userDoc = snap.exists() ? snap.data() : null;
                } catch (err) {
                    console.error('[UserContext] Falha ao buscar documento do usuário', err);
                }

                setState({ loggedUserId: uid, user: userDoc, loading: false });
            } else {
                setState({ loggedUserId: null, user: null, loading: false });
            }
        });

        return unsubscribe; // limpeza
    }, []);

    /* ---------- logout ---------- */
    const logout = async () => {
        try {
            await signOut(auth);
            // onAuthStateChanged cuidará de limpar o state
        } catch (err) {
            console.error('[UserContext] Falha ao fazer logout', err);
            throw err;
        }
    };

    return (
        <UserContext.Provider value={{ ...state, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
