import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GLOBAL } from './src/styles/global';


export default function App() {
  return (
    <View style={GLOBAL.container}>
      <Text style={GLOBAL.title}>I am Available</Text>
      <StatusBar style="auto" />
    </View>
  );
}
