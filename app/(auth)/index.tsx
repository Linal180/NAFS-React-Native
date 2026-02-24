import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { NAFS } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const animationDone = useRef(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
      Animated.timing(taglineAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      animationDone.current = true;
    });
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const navigate = () => {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    };

    if (animationDone.current) {
      navigate();
    } else {
      const timer = setTimeout(navigate, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthReady, user]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('@/assets/images/nafs_logo.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: taglineAnim }]}>
        Know Your Mood
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: NAFS.white,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 16,
    color: NAFS.lavender,
    marginTop: 16,
    letterSpacing: 2,
  },
});
