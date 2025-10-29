
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { LinenCard } from '@/components/LinenCard';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useLinens } from '@/hooks/useLinens';
import { generateLinensPDF } from '@/utils/pdfGenerator';

export default function LinensScreen() {
  const router = useRouter();
  const { linens, loading, addLinen, deleteLinen } = useLinens();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'towel' as 'towel' | 'bedsheet' | 'other',
    openingBalance: '',
  });

  const handleAddLinen = async () => {
    if (!formData.name || !formData.openingBalance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const balance = parseInt(formData.openingBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert('Error', 'Please enter a valid opening balance');
      return;
    }

    await addLinen(formData.name, formData.type, balance);
    setFormData({ name: '', type: 'towel', openingBalance: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Linen item added successfully');
  };

  const handleGeneratePDF = async () => {
    if (linens.length === 0) {
      Alert.alert('No Data', 'Add some linen items first to generate a report');
      return;
    }

    try {
      await generateLinensPDF(linens);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Linen Management',
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
            <Text style={commonStyles.title}>Linen Inventory</Text>
            <Text style={commonStyles.textSecondary}>
              Manage towels, bedsheets and other linens
            </Text>
          </View>

          {linens.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="tshirt" size={64} color={colors.textSecondary} />
              <Text style={[commonStyles.subtitle, styles.emptyText]}>No linen items yet</Text>
              <Text style={commonStyles.textSecondary}>
                Add your first linen item to start tracking
              </Text>
            </View>
          ) : (
            linens.map((linen) => (
              <LinenCard
                key={linen.id}
                linen={linen}
                onPress={() => router.push(`/linen-detail?id=${linen.id}`)}
                onDelete={() => deleteLinen(linen.id)}
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
                <Text style={commonStyles.title}>Add New Linen</Text>
                <Pressable onPress={() => setShowAddModal(false)}>
                  <IconSymbol name="xmark" size={24} color={colors.text} />
                </Pressable>
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Linen Name"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <View style={styles.typeSelector}>
                {[
                  { value: 'towel', label: 'Towel', icon: 'square.stack.3d.up.fill' },
                  { value: 'bedsheet', label: 'Bedsheet', icon: 'bed.double.fill' },
                  { value: 'other', label: 'Other', icon: 'tshirt.fill' },
                ].map((type) => (
                  <Pressable
                    key={type.value}
                    style={[
                      styles.typeButton,
                      formData.type === type.value && styles.typeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: type.value as any })}
                  >
                    <IconSymbol
                      name={type.icon}
                      size={24}
                      color={formData.type === type.value ? '#ffffff' : colors.text}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === type.value && styles.typeButtonTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                style={commonStyles.input}
                placeholder="Opening Balance (quantity)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={formData.openingBalance}
                onChangeText={(text) => setFormData({ ...formData, openingBalance: text })}
              />

              <Pressable style={[buttonStyles.primary, styles.submitButton]} onPress={handleAddLinen}>
                <Text style={buttonStyles.text}>Add Linen</Text>
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
    backgroundColor: colors.secondary,
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
    minHeight: 450,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    marginTop: 10,
  },
});
