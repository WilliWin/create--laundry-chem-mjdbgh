
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { ChemicalCard } from '@/components/ChemicalCard';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useChemicals } from '@/hooks/useChemicals';
import { generateChemicalsPDF } from '@/utils/pdfGenerator';

export default function ChemicalsScreen() {
  const router = useRouter();
  const { chemicals, loading, addChemical, deleteChemical } = useChemicals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    openingBalance: '',
    unit: 'L',
  });

  const handleAddChemical = async () => {
    if (!formData.name || !formData.openingBalance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const balance = parseFloat(formData.openingBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert('Error', 'Please enter a valid opening balance');
      return;
    }

    await addChemical(formData.name, balance, formData.unit);
    setFormData({ name: '', openingBalance: '', unit: 'L' });
    setShowAddModal(false);
    Alert.alert('Success', 'Chemical added successfully');
  };

  const handleGeneratePDF = async () => {
    if (chemicals.length === 0) {
      Alert.alert('No Data', 'Add some chemicals first to generate a report');
      return;
    }

    try {
      await generateChemicalsPDF(chemicals);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chemical Management',
          headerShown: Platform.OS === 'ios',
          headerRight: () => (
            <Pressable onPress={handleGeneratePDF} style={styles.headerButton}>
              <IconSymbol name="doc.text.fill" size={22} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={commonStyles.title}>Chemical Inventory</Text>
            <Text style={commonStyles.textSecondary}>
              Track and manage your chemical stock
            </Text>
          </View>

          {chemicals.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="flask" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.subtitle, styles.emptyText]}>No chemicals yet</Text>
              <Text style={commonStyles.textSecondary}>
                Add your first chemical to start tracking
              </Text>
            </View>
          ) : (
            chemicals.map((chemical) => (
              <ChemicalCard
                key={chemical.id}
                chemical={chemical}
                onPress={() => router.push(`/chemical-detail?id=${chemical.id}`)}
                onDelete={() => deleteChemical(chemical.id)}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.fabContainer}>
          <Pressable
            style={styles.fab}
            onPress={() => setShowAddModal(true)}
          >
            <IconSymbol name="plus" size={28} color="#ffffff" />
          </Pressable>
        </View>

        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={commonStyles.title}>Add New Chemical</Text>
                <Pressable onPress={() => setShowAddModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Chemical Name"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <TextInput
                style={commonStyles.input}
                placeholder="Opening Balance"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={formData.openingBalance}
                onChangeText={(text) => setFormData({ ...formData, openingBalance: text })}
              />

              <View style={styles.unitSelector}>
                {['L', 'mL', 'kg', 'g'].map((unit) => (
                  <Pressable
                    key={unit}
                    style={[
                      styles.unitButton,
                      formData.unit === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, unit })}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        formData.unit === unit && styles.unitButtonTextActive,
                      ]}
                    >
                      {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={[buttonStyles.primary, styles.submitButton]} onPress={handleAddChemical}>
                <Text style={buttonStyles.text}>Add Chemical</Text>
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
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 180,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 180,
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 8,
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
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  unitButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    marginTop: 10,
  },
});
