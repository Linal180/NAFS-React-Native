import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAFS } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

const MENU_ITEMS = [
  { label: 'Edit Profile', icon: '👤', color: NAFS.blue },
  { label: 'Notifications', icon: '🔔', color: '#FFB74D' },
  { label: 'App Settings', icon: '⚙️', color: NAFS.grey },
  { label: 'Help & Support', icon: '❓', color: '#26A69A' },
  { label: 'About', icon: 'ℹ️', color: '#5C6BC0' },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();

  const displayName = user?.displayName || 'User';
  const email = user?.email || '';
  const initials = getInitials(user?.displayName);
  const joinYear = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).getFullYear()
    : new Date().getFullYear();

  const handleLogout = async () => {
    try {
      await signOut();
      if (router.canDismiss()) router.dismissAll();
      router.replace('/(auth)/login');
    } catch {
      // error handled in context
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>Member since {joinYear}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '12' }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.logoutDisabled]}
          activeOpacity={0.85}
          onPress={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={NAFS.error} />
          ) : (
            <Text style={styles.logoutText}>Logout</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>NAFS v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAFS.lightBg,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2.5,
    borderColor: NAFS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: NAFS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: NAFS.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: NAFS.navy,
  },
  email: {
    fontSize: 14,
    color: NAFS.grey,
    marginTop: 4,
  },
  memberBadge: {
    backgroundColor: NAFS.lavender,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  memberText: {
    fontSize: 12,
    color: NAFS.navy,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: NAFS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: NAFS.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: NAFS.greyLight,
    gap: 14,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: NAFS.navy,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 22,
    color: NAFS.grey,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: NAFS.white,
    borderRadius: 16,
    padding: 17,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: NAFS.error,
  },
  logoutDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: NAFS.error,
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: NAFS.grey,
    fontSize: 12,
    marginTop: 20,
  },
});
