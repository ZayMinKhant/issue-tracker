import { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { AppProviders } from './src/providers/app-providers';
import { StartupScreen } from './src/components/startup-screen';
import { colors } from './src/theme/colors';

const minimumSplashDurationMs = 900;

function App() {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [hasReachedMinimumDuration, setHasReachedMinimumDuration] = useState(false);
  const [isStartupVisible, setIsStartupVisible] = useState(true);
  const startupOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasReachedMinimumDuration(true);
    }, minimumSplashDurationMs);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isNavigationReady || !hasReachedMinimumDuration || !isStartupVisible) {
      return;
    }

    Animated.timing(startupOpacity, {
      duration: 220,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setIsStartupVisible(false);
    });
  }, [hasReachedMinimumDuration, isNavigationReady, isStartupVisible, startupOpacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppProviders onReady={() => setIsNavigationReady(true)} />
      {isStartupVisible ? (
        <Animated.View style={[styles.startupOverlay, { opacity: startupOpacity }]}>
          <StartupScreen />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  startupOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
