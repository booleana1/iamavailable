import React from 'react';
import { StyleSheet } from 'react-native';


export default function Forms() {
  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>Create an account</h1>

        <div style={styles.addImage}>
          <div style={styles.addImageIcon}>
            <img src="path-to-your-icon.png" alt="Add image" style={styles.iconImage} />
          </div>
          <span style={styles.addImageText}>Add image</span>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input type="email" placeholder="Email" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input type="text" placeholder="Name" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input type="text" placeholder="Username" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="Password" style={styles.input} />
        </div>

        <button style={styles.doneButton}>Done</button>

        <p style={styles.footerText}>
          Already have an account? <a href="#" style={styles.signIn}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',

  },
  form: {
    width: '300px', // Ancho del formulario
    padding: '20px',
    backgroundColor: 'white',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '40px',
    textAlign: 'center',
  },
  addImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addImageIcon: {
    width: '100px',
    height: '100px',
    border: '2px dashed #ccc',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
  },
  iconImage: {
    width: '54px', // Ajusta el tamaño del icono según sea necesario
    height: '54px', // Ajusta el tamaño del icono según sea necesario
  },
  addImageText: {
    marginLeft: '10px',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
  },
  field: {
    marginBottom: '24px',
  },
  label: {
    fontSize: '20px',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    height: '50px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    paddingLeft: '12px',
    fontSize: '16px',
  },
  doneButton: {
    backgroundColor: '#00d084',
    width: 'calc(100% - 40px)',
    height: '50px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    marginLeft: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginTop: '30px',
    textAlign: 'center',
    fontSize: '14px',
  },
  signIn: {
    color: '#00d084',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
});
