import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PersonalDetails from './PlanDetails/PersonalDetails';
import MembersDetails from './PlanDetails/MembersDetails';
import { useHealthStore } from '@store/HEALTH/healthStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '@constants/metrics';

const HealthMemberDetailsModal = ({ visible, handleClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { manualUser } = useHealthStore();
  const { theme } = useThemeContext();
  const styles = style(theme);
  const insets = useSafeAreaInsets();

  const showMembersTab = !(
    manualUser?.insurerType === 'Self' ||
    manualUser?.insurerType === 'Self (Investor)'
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { marginTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Members Details</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 0 && styles.activeTab]}
              onPress={() => setActiveTab(0)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 0 && styles.activeTabText,
                ]}
              >
                Personal Details
              </Text>
            </TouchableOpacity>

            {showMembersTab && (
              <TouchableOpacity
                style={[styles.tab, activeTab === 1 && styles.activeTab]}
                onPress={() => setActiveTab(1)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 1 && styles.activeTabText,
                  ]}
                >
                  Members Details
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.content}>
            {activeTab === 0 ? (
              <PersonalDetails reviewDetails={manualUser} />
            ) : (
              <MembersDetails reviewDetails={manualUser} />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HealthMemberDetailsModal;

const style = theme =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
    },
    modalContent: {
      flex: 1,
      margin: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      borderRadius:
        Platform.OS === 'ios' ? verticalScale(50) : verticalScale(20),
      borderTopLeftRadius: verticalScale(20),
      borderTopRightRadius: verticalScale(20),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.floorBgColor,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
      backgroundColor: theme.colors.floorBgColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      borderBottomWidth: 4,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.colors.secondary,
      textTransform: 'capitalize',
    },
    activeTabText: {
      color: theme.colors.primary,
    },
    content: {
      flex: 1,
    },
  });
