import { StatusBar } from 'react-native';
import { AppProviders } from './src/providers/app-providers';
import { colors } from './src/theme/colors';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppProviders />
    </>
  );
}

export default App;
