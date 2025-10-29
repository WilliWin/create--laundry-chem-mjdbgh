
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useChemicals } from '@/hooks/useChemicals';
import { useLinens } from '@/hooks/useLinens';

export default function HomeScreen() {
  const router = useRouter();
  const { chemicals, getLowStockChemicals } = useChemicals();
  const { linens } = useLinens();

  const lowStockChemicals = getLowStockChemicals();

  const menuItems = [
    {
      title: 'Chemical Management',
      description: 'Track chemical stock and usage',
      icon: 'flask.fill',
      color: colors.primary,
      route: '/chemicals',
      badge: lowStockChemicals.length > 0 ? `${lowStockChemicals.length} Low` : undefined,
    },
    {
      title: 'Linen Management',
      description: 'Manage towels, bedsheets and more',
      icon: 'tshirt.fill',
      color: colors.secondary,
      route: '/linens',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Laundry Management',
          headerShown: Platform.OS === 'ios',
        }}
      />
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={commonStyles.title}>Welcome to Laundry Manager</Text>
          <Text style={commonStyles.textSecondary}>
            Manage your laundry chemicals and linen inventory efficiently
          </Text>
        </View>

        {lowStockChemicals.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.error} />
              <Text style={[commonStyles.subtitle, styles.alertTitle]}>Low Stock Alert</Text>
            </View>
            <Text style={commonStyles.text}>
              {lowStockChemicals.length} chemical{lowStockChemicals.length > 1 ? 's' : ''} running low on stock
            </Text>
            <Pressable 
              style={styles.alertButton}
              onPress={() => router.push('/chemicals')}
            >
              <Text style={styles.alertButtonText}>View Details</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="flask.fill" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{chemicals.length}</Text>
            <Text style={commonStyles.textSecondary}>Chemicals</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="tshirt.fill" size={32} color={colors.secondary} />
            <Text style={styles.statValue}>{linens.length}</Text>
            <Text style={commonStyles.textSecondary}>Linen Items</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={[commonStyles.card, styles.menuCard]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <IconSymbol name={item.icon} size={32} color="#ffffff" />
              </View>
              <View style={styles.menuContent}>
                <View style={styles.menuHeader}>
                  <Text style={commonStyles.subtitle}>{item.title}</Text>
                  {item.badge && (
                    <View style={[commonStyles.badge, { backgroundColor: colors.error }]}>
                      <Text style={commonStyles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={commonStyles.textSecondary}>{item.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  alertCard: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    color: colors.error,
    marginBottom: 0,
  },
  alertButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  alertButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 8,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
});
