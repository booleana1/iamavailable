import { StyleSheet } from 'react-native';
import { SIZES, COLORS, FONTS } from './theme';

export const GLOBAL = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.title, 
    color: COLORS.text,    
    fontFamily: FONTS.bold, 
  },
});
