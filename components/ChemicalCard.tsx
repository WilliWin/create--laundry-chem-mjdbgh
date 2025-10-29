
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Chemical } from '@/types/chemical';
import { colors, commonStyles } from '@/styles/commonStyles';

interface ChemicalCardProps {
  chemical: Chemical;
  onPress: () => void;
  onDelete: () => void;
}

export function ChemicalCard({ chemical, onPress, onDelete }: ChemicalCardProps) {
  const isLowStock = chemical.currentBalance <= 1;

  const handleDelete = () => {
    Alert.alert(
      'Delete Chemical',
      `Are you sure you want to delete ${chemical.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Pressable onPress={onPress} style={[commonStyles.card, styles.card]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <IconSymbol name="flask.fill" size={24} color={colors.primary} />
          <Text style={[commonStyles.subtitle, styles.title]}>{chemical.name}</Text>
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <IconSymbol name="trash" size={20} color={colors.error} />
        </Pressable>
      </View>

      <View style={styles.infoRow}>
        <Text style={commonStyles.textSecondary}>Opening Balance:</Text>
        <Text style={commonStyles.text}>{chemical.openingBalance} {chemical.unit}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={commonStyles.textSecondary}>Current Balance:</Text>
        <Text style={[commonStyles.text, isLowStock && styles.lowStockText]}>
          {chemical.currentBalance} {chemical.unit}
        </Text>
      </View>

      {isLowStock && (
        <View style={[commonStyles.badge, styles.lowStockBadge]}>
          <Text style={commonStyles.badgeText}>⚠️ LOW STOCK</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[commonStyles.textSecondary, styles.footerText]}>
          {chemical.usageHistory.length} usage records
        </Text>
        <Text style={[commonStyles.textSecondary, styles.footerText]}>
          Updated: {new Date(chemical.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    marginBottom: 0,
  },
  deleteButton: {
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lowStockText: {
    color: colors.error,
    fontWeight: '700',
  },
  lowStockBadge: {
    backgroundColor: colors.error,
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
  },
});
