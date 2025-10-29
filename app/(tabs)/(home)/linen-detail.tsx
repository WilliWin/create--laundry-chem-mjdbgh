
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useLinens } from '@/hooks/useLinens';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LinenDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { linens, recordLinenAction, updateLinen } = useLinens();
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [actionData, setActionData] = useState({
    action: 'new' as 'new' | 'dirty' | 'thrown',
    count: '',
    date: new Date(),
    notes: '',
  });
  const [editData, setEditData] = useState({
    name: '',
  });

  const linen = linens.find(l => l.id === id);

  if (!linen) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>Linen not found</Text>
      </View>
    );
  }

  const handleRecordAction = async () => {
    if (!actionData.count) {
      Alert.alert('Error', 'Please enter count');
      return;
    }

    const count = parseInt(actionData.count);
    if (isNaN(count) || count <= 0) {
      Alert.alert('Error', 'Please enter a valid count');
      return;
    }

    await recordLinenAction(
      linen.id,
      actionData.action,
      count,
      actionData.date.toISOString(),
      actionData.notes
    );
    setActionData({ action: 'new', count: '', date: new Date(), notes: '' });
    setShowActionModal(false);
    Alert.alert('Success', 'Action recorded successfully');
  };

  const handleEdit = async () => {
    if (!editData.name) {
      Alert.alert('Error', 'Please enter linen name');
      return;
    }

    await updateLinen(linen.id, { name: editData.name });
    setShowEditModal(false);
    Alert.alert('Success', 'Linen updated successfully');
  };

  const openEditModal = () => {
    setEditData({ name: linen.name });
    setShowEditModal(true);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'new':
        return colors.success;
      case 'dirty':
        return colors.warning;
      case 'thrown':
        return colors.error;
      default:
        return colors.text;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'new':
        return 'plus.circle.fill';
      case 'dirty':
        return 'exclamationmark.circle.fill';
      case 'thrown':
        return 'trash.fill';
      default:
        return 'circle.fill';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: linen.name,
          headerShown: true,
          headerRight: () => (
            <Pressable onPress={openEditModal} style={styles.headerButton}>
              <IconSymbol name="pencil" size={22} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[commonStyles.card, styles.summaryCard]}>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{linen.currentBalance}</Text>
                <Text style={commonStyles.textSecondary}>Current Balance</Text>
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
            <View style={styles.openingBalance}>
              <Text style={commonStyles.textSecondary}>Opening Balance: {linen.openingBalance}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => {
                setActionData({ ...actionData, action: 'new' });
                setShowActionModal(true);
              }}
            >
              <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Add New</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.warning }]}
              onPress={() => {
                setActionData({ ...actionData, action: 'dirty' });
                setShowActionModal(true);
              }}
            >
              <IconSymbol name="exclamationmark.circle.fill" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Mark Dirty</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={() => {
                setActionData({ ...actionData, action: 'thrown' });
                setShowActionModal(true);
              }}
            >
              <IconSymbol name="trash.fill" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Throw Away</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>History</Text>
          </View>

          {linen.history.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="clock" size={48} color={colors.textSecondary} />
              <Text style={commonStyles.textSecondary}>No history records yet</Text>
            </View>
          ) : (
            linen.history
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <View key={record.id} style={[commonStyles.card, styles.recordCard]}>
                  <View style={styles.recordHeader}>
                    <View style={styles.recordInfo}>
                      <IconSymbol
                        name={getActionIcon(record.action)}
                        size={20}
                        color={getActionColor(record.action)}
                      />
                      <Text style={commonStyles.text}>
                        {record.action.charAt(0).toUpperCase() + record.action.slice(1)}
                      </Text>
                    </View>
                    <Text style={[commonStyles.subtitle, { color: getActionColor(record.action) }]}>
                      {record.action === 'thrown' ? '-' : '+'}{record.count}
                    </Text>
                  </View>
                  <Text style={commonStyles.textSecondary}>
                    {new Date(record.date).toLocaleDateString()}
                  </Text>
                  {record.notes && (
                    <Text style={[commonStyles.textSecondary, styles.recordNotes]}>
                      {record.notes}
                    </Text>
                  )}
                </View>
              ))
          )}
        </ScrollView>

        <Modal
          visible={showActionModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowActionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={commonStyles.title}>
                  {actionData.action === 'new' && 'Add New Items'}
                  {actionData.action === 'dirty' && 'Mark as Dirty'}
                  {actionData.action === 'thrown' && 'Throw Away Items'}
                </Text>
                <Pressable onPress={() => setShowActionModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Count"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={actionData.count}
                onChangeText={(text) => setActionData({ ...actionData, count: text })}
              />

              <Pressable
                style={[commonStyles.input, styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={commonStyles.text}>
                  {actionData.date.toLocaleDateString()}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={actionData.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setActionData({ ...actionData, date: selectedDate });
                    }
                  }}
                />
              )}

              <TextInput
                style={[commonStyles.input, styles.notesInput]}
                placeholder="Notes (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                value={actionData.notes}
                onChangeText={(text) => setActionData({ ...actionData, notes: text })}
              />

              <Pressable
                style={[buttonStyles.primary, styles.submitButton]}
                onPress={handleRecordAction}
              >
                <Text style={buttonStyles.text}>Record Action</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={commonStyles.title}>Edit Linen</Text>
                <Pressable onPress={() => setShowEditModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Linen Name"
                placeholderTextColor={colors.textSecondary}
                value={editData.name}
                onChangeText={(text) => setEditData({ ...editData, name: text })}
              />

              <Pressable style={[buttonStyles.primary, styles.submitButton]} onPress={handleEdit}>
                <Text style={buttonStyles.text}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 180,
  },
  headerButton: {
    padding: 8,
  },
  summaryCard: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  openingBalance: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  recordCard: {
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordNotes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButton: {
    justifyContent: 'center',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 10,
  },
});
