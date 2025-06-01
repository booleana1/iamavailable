import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    setDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import {db, auth} from '../../firebase.config';
import {ref, uploadString, getDownloadURL} from 'firebase/storage';

// -----------------------------------------------------------------------------
// RegisterForm – Lógica revisada mantendo o mesmo layout (return)
// -----------------------------------------------------------------------------
export default function RegisterForm() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);

    /* ---------- image picker ---------- */
    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
            quality: 0.6, // reduz o peso final da imagem
        });

        if (!res.canceled && res.assets?.[0]?.base64) {
            setPhoto(`data:image/jpeg;base64,${res.assets[0].base64}`);
        }
    };

    /* ---------- validações básicas ---------- */
    const validate = () => {
        const errors = [];

        if (!email.trim()) errors.push('E‑mail é obrigatório');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push('E‑mail inválido');

        if (!name.trim()) errors.push('Nome é obrigatório');

        if (!username.trim()) errors.push('Username é obrigatório');
        else if (username.includes(' '))
            errors.push('Username não deve conter espaços');

        if (password.length < 6)
            errors.push('Senha deve ter pelo menos 6 caracteres');

        return errors;
    };

    /* ---------- verifica se já existe username igual ---------- */
    const usernameExists = async (uname) => {
        const q = query(collection(db, 'users'), where('hashtag', '==', uname));
        const snap = await getDocs(q);
        return !snap.empty;
    };

    /* ---------- gera id incremental ---------- */
    const getNextUserId = async () => {
        const counterRef = doc(db, 'counters', 'users');
        return await runTransaction(db, async (tx) => {
            const snap = await tx.get(counterRef);
            const next = (snap.data()?.value || 0) + 1;
            tx.set(counterRef, {value: next});
            return next;
        });
    };

    /* ---------- submit ---------- */
    const handleSubmit = async () => {
        const fieldErrors = validate();
        if (fieldErrors.length) {
            Alert.alert('Validação', fieldErrors.join('\n'));
            return;
        }

        setLoading(true);
        try {
            // username duplicado?
            if (await usernameExists(username)) {
                throw new Error('Username já está em uso');
            }

            // cria usuário no Auth
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            // upload de avatar (opcional)
            let photoURL = null;
            if (photo) {
                const storageRef = ref(storage, `avatars/${cred.user.uid}.jpg`);
                await uploadString(storageRef, photo, 'data_url');
                photoURL = await getDownloadURL(storageRef);
            }

            // id interno
            const nextId = await getNextUserId();

            // salva documento do usuário
            await setDoc(doc(db, 'users', cred.user.uid), {
                id: nextId,
                name,
                hashtag: username,
                email,
                photo_url: photoURL,
                created_at: serverTimestamp(),
            });

            // atualiza perfil Auth para conveniência
            await updateProfile(cred.user, {displayName: name, photoURL});

            // sucesso!
            Alert.alert('Sucesso', 'Conta criada!');
            navigation.dispatch(
                CommonActions.reset({index: 0, routes: [{name: 'Home'}]})
            );
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------------------------------------------------------
       RETURN – Permanece igual para não quebrar layout/estilização
    --------------------------------------------------------------------------- */
    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Create an account</Text>

                <TouchableOpacity style={styles.addImage} onPress={pickImage}>
                    {photo ? (
                        <Image source={{uri: photo}} style={styles.photo}/>
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Text>Add image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* inputs */}
                <Input
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    keyboard="email-address"
                />
                <Input label="Name" value={name} onChange={setName}/>
                <Input label="Username" value={username} onChange={setUsername}/>
                <Input
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    secure
                />

                <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <Text style={styles.doneTxt}>Done</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footer}>
                    Already have an account?{' '}
                    <Text
                        style={styles.signIn}
                        onPress={() => navigation.navigate('Login')}
                    >
                        Sign in
                    </Text>
                </Text>
            </View>
        </View>
    );
}

/* ---------- tiny reusable input ---------- */
const Input = ({
                   label,
                   value,
                   onChange,
                   secure,
                   keyboard = 'default',
                   ...p
               }) => (
    <View style={{marginBottom: 20}}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            secureTextEntry={secure}
            keyboardType={keyboard}
            onChangeText={onChange}
            {...p}
        />
    </View>
);

/* ---------- styles ---------- */
const styles = StyleSheet.create({


    photo: {width: 100, height: 100, borderRadius: 50},
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },



    doneBtn: {
        backgroundColor: '#00d084',
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    doneTxt: {color: '#fff', fontSize: 16, fontWeight: '700'},

    footer: {marginTop: 20, textAlign: 'center', fontSize: 13},

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    form: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    addImage: {
        alignItems: 'center',
        marginBottom: 20,
    },
    addImageIcon: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderStyle: 'dashed',
    },
    addImageText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    field: {
        marginBottom: 24,
    },
    label: {
        fontSize: 20,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 12,
        fontSize: 16,
    },
    doneButton: {
        backgroundColor: '#00d084',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 14,
    },
    signIn: {
        color: '#00d084',
        fontWeight: 'bold',
    },
    feedback: {
        marginTop: 10,
        textAlign: 'center',
        color: 'green',
    },


});
