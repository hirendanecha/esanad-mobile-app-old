import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import CustomDependentOption from '@components/ui/CustomDependentOption';
import CustomSegment from '@components/ui/CustomSegment';

const ExtraDetailScreen = ({
  maritalStatus,
  details,
  error,
  onDetailsChange,
  renderSubmitButton,
}) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const isMarried = maritalStatus === 'Married';
  const showSpouseOption = isMarried;

  const DATA = isMarried
    ? [
        { label: 'Spouse', value: 'spouse' },
        { label: 'Kids', value: 'kids' },
      ]
    : [{ label: 'Kids', value: 'kids' }];

  const [selectedIndex, setSelectedIndex] = React.useState(DATA[0].value);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <CustomSegment
        options={DATA}
        onChange={value => {
          if (DATA.length == 2) {
            setSelectedIndex(value == 0 ? 'spouse' : 'kids');
          }
          if (DATA.length == 1) {
            setSelectedIndex('kids');
          }
        }}
        selectedIndex={
          DATA.length == 2 ? (selectedIndex == 'spouse' ? 0 : 1) : 0
        }
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={{ marginTop: verticalScale(15) }}>
        {showSpouseOption && selectedIndex === 'spouse' && (
          <CustomDependentOption
            type="Spouse"
            initialData={details?.spouse}
            onDependentsChange={list => onDetailsChange('spouse', list)}
            error={!!error}
            showErrorMessage={!!error}
          />
        )}

        {selectedIndex === 'kids' && (
          <CustomDependentOption
            type="Kids"
            initialData={details?.kids}
            onDependentsChange={list => onDetailsChange('kids', list)}
            error={!!error}
            showErrorMessage={!!error}
          />
        )}
      </View>
      {renderSubmitButton && renderSubmitButton()}
    </ScrollView>
  );
};

export default ExtraDetailScreen;

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: moderateScale(15),
    },
    errorText: {
      color: theme.colors.red,
      fontSize: moderateScale(14),
      textAlign: 'center',
      marginTop: verticalScale(15),
    },
  });
