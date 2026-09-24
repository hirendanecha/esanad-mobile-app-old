import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { useThemeContext } from '@theme/ThemeProvider';
import { verticalScale } from '@constants/metrics';
import { useHealthStore } from '@store/HEALTH/healthStore';
import { useAuthStore } from '@store/authStore';

function CustomBox({ onShare, proposalId }) {
  const { theme } = useThemeContext();
  const styles = style(theme);

  const { user } = useAuthStore();

  console.log(proposalId);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[theme.colors.linear1, theme.colors.linear2]}
      style={styles.container}
    >
      <View style={styles.proposalCard}>
        <Text style={styles.proposalText}>{user?.fullName} </Text>

        <View>
          <Text style={styles.proposalId}>#{proposalId}</Text>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.editButton} onPress={onShare}>
        <Icon name="edit-3" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity> */}
    </LinearGradient>
  );
}

const style = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    proposalCard: {
      flex: 1,
      padding: verticalScale(10),
      paddingHorizontal: verticalScale(20),
      gap: verticalScale(5),
      alignSelf: 'center',
    },
    proposalText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
    },
    proposalId: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
    },
    editButton: {
      marginRight: verticalScale(15),
      padding: verticalScale(10),
      borderRadius: verticalScale(20),
      backgroundColor: theme.colors.backgroundColor + '30',
    },
  });

export default CustomBox;
