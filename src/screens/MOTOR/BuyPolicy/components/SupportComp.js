import { useThemeContext } from '@theme/ThemeProvider';
import { formatNumber } from '@utils/formateNumber';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// Info Row Component
export const InfoRow = ({ label, value, styles }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// Section Card Component
export const SectionCard = ({ title, children, styles }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export const PolicyInfoRow = ({
  label,
  value,
  valueColor,
  labelColor,
  styles,
}) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: labelColor }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
  </View>
);

export const FeatureItem = ({ title, amount, isIncluded = false, styles }) => {
  const { theme } = useThemeContext();

  return (
    <View style={styles.featureItem}>
      <View style={styles.featureTitle}>
        <Text style={styles.featureTitleText}>{title || '-'}</Text>
      </View>
      {/* <Text style={styles.featureAmount}>
        {isIncluded ? 'Included' : `+AED ${formatNumber(amount)}`}
      </Text> */}
      <Icon name="check" size={14} color={theme.colors.primary} />
    </View>
  );
};
