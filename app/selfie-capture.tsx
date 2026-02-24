import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { analyzeMood } from '@/lib/gemini';
import { NAFS } from '@/constants/theme';

export default function SelfieCaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
      setPhotoUri(photo.uri);
      setPhotoBase64(photo.base64 ?? null);
      setError(null);
    } catch (e) {
      console.error('Failed to take picture:', e);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 ?? null);
      setError(null);
    }
  };

  const analyzeAndContinue = async () => {
    if (!photoUri || !photoBase64) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeMood(photoBase64);
      router.push({
        pathname: '/mood-result',
        params: {
          imageUrl: photoUri,
          mood: result.mood,
          emoji: result.emoji,
          confidence: String(result.confidence),
          description: result.description,
        },
      });
    } catch (e) {
      console.error('Mood analysis failed:', e);
      setError('Could not analyze mood. Please try again.');
      setAnalyzing(false);
    }
  };

  // Permission not yet determined
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need camera access to check your mood through a selfie.
          </Text>
          <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
            <Text style={styles.grantButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Photo preview + analyze
  if (photoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={analyzing}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.previewContent}>
          {analyzing ? (
            <>
              <ActivityIndicator size="large" color={NAFS.lavender} style={{ marginBottom: 20 }} />
              <Text style={styles.title}>Analyzing Your Mood...</Text>
              <Text style={styles.subtitle}>Gemini is reading your expression</Text>
              <View style={styles.previewFrame}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Looking Good!</Text>
              <Text style={styles.subtitle}>Analyze this selfie to check your mood</Text>
              <View style={styles.previewFrame}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              </View>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              <View style={styles.previewControls}>
                <TouchableOpacity style={styles.retakeButton} onPress={() => { setPhotoUri(null); setPhotoBase64(null); }}>
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.analyzeButton} onPress={analyzeAndContinue}>
                  <Text style={styles.analyzeButtonText}>Analyze Mood</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Camera view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Check Your Mood</Text>
        <Text style={styles.subtitle}>Take a clear photo of your face</Text>

        <View style={styles.cameraArea}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            mirror={facing === 'front'}
          />
          <View style={styles.faceGuideOverlay}>
            <View style={styles.faceGuideOval} />
            <Text style={styles.cameraHint}>Position your face here</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideButton} activeOpacity={0.7} onPress={pickFromGallery}>
            <Text style={styles.sideIcon}>🖼️</Text>
            <Text style={styles.sideText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} activeOpacity={0.85} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideButton}
            activeOpacity={0.7}
            onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
          >
            <Text style={styles.sideIcon}>🔄</Text>
            <Text style={styles.sideText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.navy,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: NAFS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: NAFS.lavender,
    marginBottom: 36,
  },
  cameraArea: {
    width: 280,
    height: 340,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(197,198,239,0.2)',
    marginBottom: 40,
  },
  faceGuideOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceGuideOval: {
    width: 160,
    height: 210,
    borderRadius: 80,
    borderWidth: 2.5,
    borderColor: 'rgba(197,198,239,0.5)',
    borderStyle: 'dashed',
  },
  cameraHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  sideButton: {
    alignItems: 'center',
    gap: 4,
  },
  sideIcon: {
    fontSize: 24,
  },
  sideText: {
    color: NAFS.lavender,
    fontSize: 11,
    fontWeight: '500',
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: NAFS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAFS.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: NAFS.white,
  },
  // Permission screen
  permissionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: NAFS.white,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 15,
    color: NAFS.lavender,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  grantButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 16,
  },
  grantButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  backLink: {
    paddingVertical: 8,
  },
  backLinkText: {
    color: NAFS.lavender,
    fontSize: 14,
    fontWeight: '500',
  },
  // Preview screen
  previewContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  previewFrame: {
    width: 280,
    height: 340,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: NAFS.lavender,
    marginBottom: 36,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  errorBanner: {
    backgroundColor: 'rgba(239,83,80,0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.3)',
  },
  errorText: {
    color: '#EF5350',
    fontSize: 14,
    textAlign: 'center',
  },
  previewControls: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(197,198,239,0.3)',
  },
  retakeButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: NAFS.blue,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
