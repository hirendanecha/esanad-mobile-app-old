import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import { useThemeContext } from '@theme/ThemeProvider';

const MembersDetails = ({ reviewDetails }) => {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  const TableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.flexCell]}>
        {item.fullName || '-'}
      </Text>
      <Text style={[styles.tableCell, styles.flexCell]}>
        {item.dateOfBirth ? dayjs(item.dateOfBirth).format('DD/MM/YYYY') : '-'}
      </Text>
      <Text style={[styles.tableCell, styles.flexCell]}>
        {item.gender || '-'}
      </Text>
    </View>
  );

  const SectionCard = ({ title, children }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="person" size={20} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Spouse Details */}
      {reviewDetails?.spouseDetails?.length > 0 && (
        <SectionCard title="Spouse Details">
          <View style={styles.cardContent}>
            <DetailRow
              label="Name"
              value={reviewDetails.spouseDetails[0]?.fullName}
            />
            <DetailRow
              label="Date Of Birth"
              value={
                reviewDetails.spouseDetails[0]?.dateOfBirth
                  ? dayjs(reviewDetails.spouseDetails[0].dateOfBirth).format(
                      'DD/MM/YYYY',
                    )
                  : '-'
              }
            />
            <DetailRow
              label="Gender"
              value={reviewDetails.spouseDetails[0]?.gender}
            />
          </View>
        </SectionCard>
      )}

      {/* Kids Details */}
      {reviewDetails?.kidsDetails?.length > 0 && (
        <SectionCard title="Kids Details">
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Full Name
              </Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>DOB</Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Gender
              </Text>
            </View>
            {reviewDetails.kidsDetails.map((kid, index) => (
              <TableRow key={index} item={kid} />
            ))}
          </View>
        </SectionCard>
      )}

      {/* Parents Details */}
      {reviewDetails?.parentDetails?.length > 0 && (
        <SectionCard title="Parents Details">
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Full Name
              </Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>DOB</Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Gender
              </Text>
            </View>
            {reviewDetails.parentDetails.map((parent, index) => (
              <TableRow key={index} item={parent} />
            ))}
          </View>
        </SectionCard>
      )}

      {/* Other Dependents Details */}
      {reviewDetails?.otherFamilyDependentsDetails?.length > 0 && (
        <SectionCard title="Other Dependents Details">
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Full Name
              </Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>DOB</Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Gender
              </Text>
            </View>
            {reviewDetails.otherFamilyDependentsDetails.map(
              (dependent, index) => (
                <TableRow key={index} item={dependent} />
              ),
            )}
          </View>
        </SectionCard>
      )}

      {/* Domestic Worker Details */}
      {reviewDetails?.domesticWorkerDetails?.length > 0 && (
        <SectionCard title="Domestic Worker Details">
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Full Name
              </Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>DOB</Text>
              <Text style={[styles.tableHeaderCell, styles.flexCell]}>
                Gender
              </Text>
            </View>
            {reviewDetails.domesticWorkerDetails.map((worker, index) => (
              <TableRow key={index} item={worker} />
            ))}
          </View>
        </SectionCard>
      )}
    </ScrollView>
  );
};

export default MembersDetails;

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
      marginBottom: 24,
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
    detailRow: {
      marginBottom: 16,
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
    tableContainer: {
      paddingHorizontal: 8,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: theme.colors.cardBg,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tableHeaderCell: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.description,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tableCell: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.colors.secondary,
    },
    flexCell: {
      flex: 1,
    },
  });
