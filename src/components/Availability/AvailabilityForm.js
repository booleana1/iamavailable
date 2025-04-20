import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../styles/theme';

const Forms = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    group: '',
    link: '',
  });

  useImperativeHandle(ref, () => ({
    getFormData() {
      return formData;
    }
  }));

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };


  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create a new Availability</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput placeholder="Name" style={styles.input} value={formData.name} onChangeText={text => setFormData({ ...formData, name: text })}/>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Role</Text>
          <TextInput placeholder="Role" style={styles.input} value={formData.role} onChangeText={text => setFormData({ ...formData, role: text })}/>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Group</Text>
          <TextInput placeholder="Group" style={styles.input} value={formData.group} onChangeText={text => setFormData({ ...formData, group: text })}/>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Link (if online)</Text>
          <TextInput placeholder="Link" style={styles.input} value={formData.link} onChangeText={text=>setFormData({ ...formData, link: text })} />
        </View>
      </View>
    </View>
  );
});
export default Forms;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    left: 150,
    top: 100,
    backgroundColor: COLORS.background,
  },
  form: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 40,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    marginLeft: '12.5%',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    width: '75%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingLeft: 12,
    marginLeft: '12.5%',
    fontFamily: FONTS.regular,
  },

});