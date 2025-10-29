
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useChemicals } from '@/hooks/useChemicals';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ChemicalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { chemicals, addUsage, updateChemical } = useChemicals();
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usageData, setUsageData] = useState({
    amount: '',
    date: new Date(),
    notes: '',
  });
  const [editData, setEditData] = useState({
    name: '',
    unit: '',
  });

  const chemical = chemicals.find(c => c.id === id);

  if (!chemical) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.text}>Chemical not found</Text>
      </View>
    );
  }

  const handleAddUsage = async () => {
    if (!usageData.amount) {
      Alert.alert('Error', 'Please enter usage amount');
      return;
    }

    const amount = parseFloat(usageData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amount > chemical.currentBalance) {
      Alert.alert('Error', 'Usage amount exceeds current balance');
      return;
    }

    await addUsage(
      chemical.id,
      amount,
      usageData.date.toISOString(),
      usageData.notes
    );
    setUsageData({ amount: '', date: new Date(), notes: '' });
    setShowUsageModal(false);
    Alert.alert('Success', 'Usage recorded successfully');
  };

  const handleEdit = async () => {
    if (!editData.name) {
      Alert.alert('Error', 'Please enter chemical name');
      return;
    }

    await updateChemical(chemical.id, {
      name: editData.name,
      unit: editData.unit,
    });
    setShowEditModal(false);
    Alert.alert('Success', 'Chemical updated successfully');
  };

  const openEditModal = () => {
    setEditData({
      name: chemical.name,
      unit: chemical.unit,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: chemical.name,
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
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSecondary}>Opening Balance</Text>
                <Text style={styles.summaryValue}>
                  {chemical.openingBalance} {chemical.unit}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSecondary}>Current Balance</Text>
                <Text style={[styles.summaryValue, chemical.currentBalance <= 1 && styles.lowStock]}>
                  {chemical.currentBalance} {chemical.unit}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSecondary}>Total Used</Text>
                <Text style={styles.summaryValue}>
                  {(chemical.openingBalance - chemical.currentBalance).toFixed(2)} {chemical.unit}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSecondary}>Usage Records</Text>
                <Text style={styles.summaryValue}>{chemical.usageHistory.length}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Usage History</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => setShowUsageModal(true)}
            >
              <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
            </Pressable>
          </View>

          {chemical.usageHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="chart.bar" size={48} color={colors.textSecondary} />
              <Text style={commonStyles.textSecondary}>No usage records yet</Text>
            </View>
          ) : (
            chemical.usageHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <View key={record.id} style={[commonStyles.card, styles.recordCard]}>
                  <View style={styles.recordHeader}>
                    <Text style={commonStyles.text}>
                      {new Date(record.date).toLocaleDateString()}
                    </Text>
                    <Text style={[commonStyles.subtitle, styles.recordAmount]}>
                      -{record.amount} {chemical.unit}
                    </Text>
                  </View>
                  {record.notes && (
                    <Text style={commonStyles.textSecondary}>{record.notes}</Text>
                  )}
                </View>
              ))
          )}
        </ScrollView>

        <Modal
          visible={showUsageModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUsageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={commonStyles.title}>Record Usage</Text>
                <Pressable onPress={() => setShowUsageModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder={`Amount (${chemical.unit})`}
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={usageData.amount}
                onChangeText={(text) => setUsageData({ ...usageData, amount: text })}
              />

              <Pressable
                style={[commonStyles.input, styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={commonStyles.text}>
                  {usageData.date.toLocaleDateString()}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={usageData.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setUsageData({ ...usageData, date: selectedDate });
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
                value={usageData.notes}
                onChangeText={(text) => setUsageData({ ...usageData, notes: text })}
              />

              <Pressable style={[buttonStyles.primary, styles.submitButton]} onPress={handleAddUsage}>
                <Text style={buttonStyles.text}>Record Usage</Text>
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
                <Text style={commonStyles.title}>Edit Chemical</Text>
                <Pressable onPress={() => setShowEditModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Chemical Name"
                placeholderTextColor={colors.textSecondary}
                value={editData.name}
                onChangeText={(text) => setEditData({ ...editData, name: text })}
              />

              <TextInput
                style={commonStyles.input}
                placeholder="Unit"
                placeholderTextColor={colors.textSecondary}
                value={editData.unit}
                onChangeText={(text) => setEditData({ ...editData, unit: text })}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  lowStock: {
    color: colors.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
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
  recordAmount: {
    color: colors.error,
    marginBottom: 0,
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
