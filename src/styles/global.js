import { StyleSheet } from 'react-native';
import { SIZES, COLORS, FONTS } from './theme';

export const GLOBAL = StyleSheet.create({
  settings_container: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.text,
    marginTop: 40,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 30,
  },
});
