import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@theme/ThemeProvider';
import TakafulForm from './TakafulForm';
import MedgulfForm from './MedgulfForm';
import OrientForm from './OrientForm';
import FidelityForm from './FidelityForm';
import { verticalScale } from '@constants/metrics';
import { CustomAccordion } from '@components/ui/CustomAccordion';

const HealthInsuranceForm = forwardRef(
  (
    { onSave, onCancel, companyId, policyData, setFormData, healthQuotesData },
    ref,
  ) => {
    const { theme } = useThemeContext();
    const styles = style(theme);
    const formRef = useRef(null);

    const companyName =
      healthQuotesData?.company?.companyName?.toLowerCase() || '';

    console.log('Selected Company:', companyName);

    // Expose submit method to parent
    useImperativeHandle(ref, () => ({
      submit: async () => {
        if (formRef.current) {
          return formRef.current.submit();
        }
        return Promise.reject(new Error('Form not initialized'));
      },
    }));

    // Render form based on company name
    const renderForm = () => {
      switch (companyName) {
        case 'takaful emarat':
          return (
            <TakafulForm
              ref={formRef}
              onSave={onSave}
              onCancel={onCancel}
              companyId={companyId}
              policyData={policyData}
              setFormData={setFormData}
            />
          );
        // case 'medgulf ':
        //   return (
        //     <MedgulfForm
        //       ref={formRef}
        //       onSave={onSave}
        //       onCancel={onCancel}
        //       companyId={companyId}
        //       policyData={policyData}
        //       setFormData={setFormData}
        //     />
        //   );
        case 'orient takaful':
          return (
            <OrientForm
              ref={formRef}
              onSave={onSave}
              onCancel={onCancel}
              companyId={companyId}
              policyData={policyData}
              setFormData={setFormData}
            />
          );
        // case 'fidelity':
        //   return (
        //     <FidelityForm
        //       ref={formRef}
        //       onSave={onSave}
        //       onCancel={onCancel}
        //       companyId={companyId}
        //       policyData={policyData}
        //       setFormData={setFormData}
        //     />
        //   );
        default:
          return null;
      }
    };

    return (
      <>
        {renderForm() && (
          <View
            style={{
              backgroundColor: theme.colors.backgroundColor,
              borderRadius: verticalScale(10),
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: theme.colors.border,
              flex: 1,
            }}
          >
            <CustomAccordion title="Company Form">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: verticalScale(8),
                  paddingBottom: verticalScale(15),
                  paddingHorizontal: verticalScale(15),
                }}
              >
                {renderForm()}
              </View>
            </CustomAccordion>
          </View>
        )}
      </>
    );
  },
);

HealthInsuranceForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  policyData: PropTypes.object,
  setFormData: PropTypes.func.isRequired,
  healthQuotesData: PropTypes.object,
};

HealthInsuranceForm.defaultProps = {
  policyData: {},
  healthQuotesData: {},
};

const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loaderContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
      zIndex: 1000,
    },
    errorText: {
      fontSize: 18,
      color: theme.colors.red,
      textAlign: 'center',
      marginTop: 20,
    },
  });

export default HealthInsuranceForm;
