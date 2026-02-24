import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { validateSignup, type ValidationErrors } from '@/lib/validation';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    clearError();
  }, [name, email, password, confirmPassword]);

  const handleSignup = async () => {
    const errors = validateSignup(name, email, password, confirmPassword, agreed);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await signUp(email.trim(), password, name.trim());
      if (router.canDismiss()) router.dismissAll();
      router.replace('/(tabs)');
    } catch {
      // error is set in auth context
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/nafs_logo.png')}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
            <Text style={styles.title}>Create an account</Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, fieldErrors.name && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(197,198,239,0.4)"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
              {fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, fieldErrors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="rgba(197,198,239,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
              {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, fieldErrors.password && styles.inputError]}
                placeholder="Create a password"
                placeholderTextColor="rgba(197,198,239,0.4)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={[styles.input, fieldErrors.confirmPassword && styles.inputError]}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(197,198,239,0.4)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              {fieldErrors.confirmPassword && <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.7} disabled={isLoading}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>I agree to the Terms of Service</Text>
            </TouchableOpacity>
            {fieldErrors.agreed && <Text style={styles.fieldError}>{fieldErrors.agreed}</Text>}

            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={NAFS.white} />
              ) : (
                <Text style={styles.createButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.navy,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 12,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: NAFS.white,
    letterSpacing: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: NAFS.white,
  },
  form: {
    gap: 12,
  },
  errorBanner: {
    backgroundColor: 'rgba(239,83,80,0.15)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.3)',
  },
  errorBannerText: {
    color: '#EF5350',
    fontSize: 14,
    textAlign: 'center',
  },
  inputWrap: {
    gap: 5,
  },
  inputLabel: {
    color: NAFS.lavender,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: NAFS.white,
    borderWidth: 1,
    borderColor: 'rgba(197,198,239,0.15)',
  },
  inputError: {
    borderColor: '#EF5350',
  },
  fieldError: {
    color: '#EF5350',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: NAFS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: NAFS.blue,
    borderColor: NAFS.blue,
  },
  checkmark: {
    color: NAFS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  checkboxText: {
    color: NAFS.lavender,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: NAFS.blue,
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: NAFS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: NAFS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  footerText: {
    color: NAFS.grey,
    fontSize: 14,
  },
  footerLink: {
    color: NAFS.lavender,
    fontSize: 14,
    fontWeight: '600',
  },
});
