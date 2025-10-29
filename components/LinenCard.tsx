
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Linen } from '@/types/linen';
import { colors, commonStyles } from '@/styles/commonStyles';

interface LinenCardProps {
  linen: Linen;
  onPress: () => void;
  onDelete: () => void;
}

export function LinenCard({ linen, onPress, onDelete }: LinenCardProps) {
  const getIconName = () => {
    switch (linen.type) {
      case 'towel':
        return 'square.stack.3d.up.fill';
      case 'bedsheet':
        return 'bed.double.fill';
      default:
        return 'tshirt.fill';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Linen',
      `Are you sure you want to delete ${linen.name}?`,
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
          <IconSymbol name={getIconName()} size={24} color={colors.primary} />
          <View>
            <Text style={[commonStyles.subtitle, styles.title]}>{linen.name}</Text>
            <Text style={[commonStyles.textSecondary, styles.type]}>
              {linen.type.charAt(0).toUpperCase() + linen.type.slice(1)}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <IconSymbol name="trash" size={20} color={colors.error} />
        </Pressable>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{linen.currentBalance}</Text>
          <Text style={commonStyles.textSecondary}>Current</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.success }]}>{linen.newCount}</Text>
          <Text style={commonStyles.textSecondary}>New</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{linen.dirtyCount}</Text>
          <Text style={commonStyles.textSecondary}>Dirty</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.error }]}>{linen.thrownCount}</Text>
          <Text style={commonStyles.textSecondary}>Thrown</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[commonStyles.textSecondary, styles.footerText]}>
          Opening: {linen.openingBalance}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.footerText]}>
          {linen.history.length} records
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
  },
});
