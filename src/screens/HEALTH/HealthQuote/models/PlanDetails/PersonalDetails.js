import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import { useThemeContext } from '@theme/ThemeProvider';

const PersonalDetails = ({ reviewDetails }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const DetailItem = ({ label, value }) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Icon name="person" size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Proposal Details</Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <DetailItem label="Email" value={reviewDetails?.email} />

          <DetailItem
            label="Mobile Number"
            value={reviewDetails?.mobileNumber}
          />

          <DetailItem label="Monthly Income" value={reviewDetails?.salary} />

          <DetailItem
            label="Marital Status"
            value={reviewDetails?.maritalStatus}
          />

          <DetailItem
            label="Nationality (Self)"
            value={reviewDetails?.nationality}
          />

          <DetailItem label="City (Self)" value={reviewDetails?.city} />

          <DetailItem
            label="Date of Birth (Self)"
            value={
              reviewDetails?.dateOfBirth
                ? dayjs(reviewDetails.dateOfBirth).format('DD/MM/YYYY')
                : '-'
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PersonalDetails;

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 10,
      marginTop: 8,
      marginBottom: 16,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.cardBg,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      gap: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    cardContent: {
      padding: 16,
    },
    detailItem: {
      marginBottom: 20,
    },
    label: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.description,
      marginBottom: 4,
    },
    value: {
      fontSize: 15,
      fontWeight: '400',
      color: theme.colors.secondary,
    },
  });
