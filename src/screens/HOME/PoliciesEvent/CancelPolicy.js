import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CustomButton from '@components/ui/CustomButton';
import { useGetPolicyBySearch } from '@hooks/policy/useMotorPolicy';
import { SCREEN_NAMES } from '@constants/screenNames';
import moment from 'moment';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CancelPolicy = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [policyNumber, setPolicyNumber] = useState('');
  const [policyDetails, setPolicyDetails] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const { mutate: searchPolicy, isLoading: searchLoading } =
    useGetPolicyBySearch();

  const handleSearch = () => {
    if (!policyNumber.trim()) return;

    setErrorVisible(false);
    setPolicyDetails(null);

    searchPolicy(policyNumber, {
      onSuccess: response => {
        if (response && response.data && response.data.data) {
          const resData = response.data.data;
          setPolicyDetails(resData);
          setIsDocked(true);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        } else {
          setErrorVisible(true);
          setIsDocked(false);
        }
      },
      onError: error => {
        console.error('Search Policy Error:', error);
        setErrorVisible(true);
        setIsDocked(false);
      },
    });
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const formatDate = date => {
    if (!date) return '-';
    return moment(date).format('DD/MM/YYYY');
  };

  const renderPolicyContent = () => {
    if (!policyDetails) return null;

    // Pattern A: Standard/Global Structure
    if (policyDetails.POLICYNO) {
      return (
        <>
          <Section title="Policy Details">
            <DetailRow label="Company ID" value={policyDetails.COMPANYID} />
            <DetailRow
              label="Customer Name"
              value={policyDetails.CUSTOMERNAME}
            />
            <DetailRow
              label="Customer Type"
              value={policyDetails.CUSTOMERTYPE}
            />
            <DetailRow label="Insurance Code" value={policyDetails.INSCODE} />
            <DetailRow label="Insurance Name" value={policyDetails.INSNAME} />
            <DetailRow
              label="Policy Sub Group"
              value={policyDetails.POLICYSUBGROUP}
            />
            <DetailRow
              label="Policy Date"
              value={formatDate(policyDetails.POLICYDATE)}
            />
            <DetailRow label="Policy Group" value={policyDetails.POLICYGROUP} />
            <DetailRow
              label="Policy Type ID"
              value={policyDetails.POLICYTYPEID}
            />
            <DetailRow
              label="Start Date"
              value={formatDate(policyDetails.STARTDATE)}
            />
            <DetailRow
              label="Created At"
              value={formatDate(policyDetails.CREATEDATE)}
            />
            <DetailRow label="Insured" value={policyDetails.INSURED} />
            <DetailRow label="Discount" value={policyDetails.DISCOUNT} />
            <DetailRow
              label="Insurance Commission VAT"
              value={policyDetails.INSCOMMVAT}
            />
            <DetailRow
              label="Company Policy Number"
              value={policyDetails.companyPolicyNumber}
            />
            <DetailRow label="Policy Class" value={policyDetails.POLICYCLASS} />
            <DetailRow label="Policy Fee" value={policyDetails.POLICYFEE} />
            <DetailRow label="Policy Type" value={policyDetails.POLICYTYPE} />
            <DetailRow label="Premium" value={policyDetails.PREMIUM} />
            <DetailRow
              label="Expiry Date"
              value={formatDate(policyDetails.EXPIRYDATE)}
            />
          </Section>
        </>
      );
    }

    // Pattern B: Praktora Structure
    if (policyDetails.isPraktora) {
      return (
        <>
          <Section title="Policy Details">
            <DetailRow
              label="Customer Name"
              value={policyDetails.adminId?.fullName}
            />
            <DetailRow label="Email" value={policyDetails.adminId?.email} />
            <DetailRow
              label="Company Policy Number"
              value={policyDetails.companyPolicyNumber}
            />
            <DetailRow
              label="Insurance Type"
              value={policyDetails.quote?.insuranceType}
            />
            <DetailRow
              label="Policy Expiry Date"
              value={formatDate(policyDetails.policyExpiryDate)}
            />
            <DetailRow
              label="Marital Status"
              value={policyDetails.adminId?.maritalStatus}
            />
            <DetailRow
              label="Created At"
              value={formatDate(policyDetails.createdAt)}
            />
            <DetailRow
              label="Company Name"
              value={policyDetails.quote?.company?.companyName}
            />
            <DetailRow
              label="Mobile Number"
              value={policyDetails.adminId?.mobileNumber}
            />
            <DetailRow
              label="Policy Issue Date"
              value={formatDate(policyDetails.policyIssueDate)}
            />
            <DetailRow
              label="Occupation"
              value={policyDetails.adminId?.occupation}
            />
            <DetailRow
              label="Total Price"
              value={policyDetails.quote?.totalPrice}
            />
          </Section>
        </>
      );
    }

    // Pattern C: Generic/Other Structure (Most detailed)
    return (
      <>
        <Section title="Policy Overview">
          <DetailRow
            label="Company Name"
            value={
              policyDetails.quoteId?.company?.companyName ||
              policyDetails.quote?.company?.companyName
            }
          />
          <DetailRow
            label="Proposals Number"
            value={policyDetails.quote?.proposalId}
          />
          <DetailRow label="Policy Number" value={policyDetails.policyNumber} />
          <DetailRow
            label="Company Policy Number"
            value={
              policyDetails.companyPolicyNumber ||
              policyDetails.companyResponse?.Data?.PolicyNo
            }
          />
          <DetailRow
            label="Insurance Type"
            value={
              policyDetails.quoteId?.insuranceType === 'thirdparty'
                ? 'Third Party'
                : 'Comprehensive'
            }
          />
          <DetailRow
            label="Start Date"
            value={formatDate(policyDetails.response?.PolicyEffectiveDate)}
          />
          <DetailRow
            label="End Date"
            value={formatDate(policyDetails.response?.PolicyExpiryDate)}
          />
          <DetailRow
            label="Policy Holder"
            value={policyDetails.motorInfoId?.fullName || 'Policy holder name'}
          />
          <DetailRow
            label="Insured Declared Value"
            value={
              policyDetails.carId?.price || policyDetails.quoteId?.carValue
                ? `AED ${
                    policyDetails.carId?.price ||
                    policyDetails.quoteId?.carValue
                  }`
                : '-'
            }
          />
          <DetailRow
            label="Car Details"
            value={`${policyDetails.carId?.make || ''} ${
              policyDetails.carId?.model || ''
            }`}
          />
        </Section>

        <Section title="Car Details">
          <DetailRow label="Brand" value={policyDetails.carId?.make} />
          <DetailRow label="Model" value={policyDetails.carId?.model} />
          <DetailRow label="Year" value={policyDetails.carId?.year} />
          <DetailRow
            label="No. of Cylinders"
            value={policyDetails.carId?.cylinders}
          />
          <DetailRow
            label="Regional Spec"
            value={policyDetails.carId?.regionalSpec}
          />
          <DetailRow label="Body Type" value={policyDetails.carId?.bodyType} />
          <DetailRow
            label="Insure Type"
            value={policyDetails.carId?.insureType}
          />
          <DetailRow
            label="Policy Start Date"
            value={formatDate(policyDetails.carId?.policyEffectiveDate)}
          />
          <DetailRow
            label="Insurance Expiry Date"
            value={formatDate(policyDetails.carId?.insuranceExpiryDate)}
          />
          <DetailRow
            label="Registration Date"
            value={formatDate(policyDetails.carId?.registrationDate)}
          />
          <DetailRow
            label="Registration Emirate"
            value={policyDetails.carId?.registrationEmirate}
          />
          <DetailRow
            label="Plate Number"
            value={policyDetails.carId?.plateNumber}
          />
          <DetailRow
            label="Plate Code"
            value={policyDetails.carId?.plateCode}
          />
          <DetailRow
            label="Chassis No."
            value={
              policyDetails.carId?.chesisNo ||
              policyDetails.carId?.chassisNumber
            }
          />
          <DetailRow
            label="Engine Number"
            value={policyDetails.carId?.engineNumber}
          />
          <DetailRow label="Color" value={policyDetails.carId?.color} />
          <DetailRow
            label="No. of Passengers"
            value={policyDetails.carId?.noOfPassengers}
          />
          <DetailRow
            label="Reg. Card TC No."
            value={policyDetails.carId?.tcNo}
          />
          <DetailRow
            label="Use of Vehicle"
            value={policyDetails.carId?.useOfVehicle}
          />
        </Section>

        <Section title="Customer Details">
          <DetailRow
            label="Insured Name"
            value={
              policyDetails.motorInfoId?.fullName ||
              policyDetails.userId?.fullName
            }
          />
          <DetailRow
            label="Arabic Name"
            value={
              policyDetails.motorInfoId?.arabicName ||
              policyDetails.userId?.arabicName
            }
          />
          <DetailRow
            label="Insured Email"
            value={
              policyDetails.motorInfoId?.email || policyDetails.userId?.email
            }
          />
          <DetailRow
            label="Mobile No."
            value={
              policyDetails.motorInfoId?.mobileNumber ||
              policyDetails.userId?.mobileNumber
            }
          />
          <DetailRow
            label="Date of Birth"
            value={formatDate(
              policyDetails.motorInfoId?.dateOfBirth ||
                policyDetails.userId?.dateOfBirth,
            )}
          />
          <DetailRow
            label="Age"
            value={policyDetails.motorInfoId?.age || policyDetails.userId?.age}
          />
          <DetailRow
            label="Gender"
            value={
              policyDetails.motorInfoId?.gender || policyDetails.userId?.gender
            }
          />
          <DetailRow
            label="Nationality"
            value={
              policyDetails.motorInfoId?.nationality ||
              policyDetails.userId?.nationality
            }
          />
          <DetailRow
            label="Occupation"
            value={
              policyDetails.motorInfoId?.occupation ||
              policyDetails.userId?.occupation
            }
          />
          <DetailRow
            label="ID Number"
            value={
              policyDetails.motorInfoId?.emiratesId ||
              policyDetails.userId?.emiratesId
            }
          />
          <DetailRow
            label="ID Expiry"
            value={formatDate(
              policyDetails.motorInfoId?.emiratesIdExpiryDate ||
                policyDetails.userId?.emiratesIdExpiryDate,
            )}
          />
          <DetailRow
            label="Driving License No."
            value={
              policyDetails.motorInfoId?.licenceNo ||
              policyDetails.userId?.licenceNo
            }
          />
          <DetailRow
            label="Driving License Issue"
            value={formatDate(
              policyDetails.motorInfoId?.licenceIssueDate ||
                policyDetails.userId?.licenceIssueDate,
            )}
          />
          <DetailRow
            label="Driving License Expiry"
            value={formatDate(
              policyDetails.motorInfoId?.licenceExpiryDate ||
                policyDetails.userId?.licenceExpiryDate,
            )}
          />
          <DetailRow
            label="Driving License Source"
            value={
              policyDetails.motorInfoId?.placeOfIssueDL ||
              policyDetails.userId?.placeOfIssueDL
            }
          />
        </Section>

        <Section title="Additional Policy Details">
          <DetailRow
            label="Insurance Company"
            value={
              policyDetails.quoteId?.company?.companyName ||
              policyDetails.quote?.company?.companyName
            }
          />
          <DetailRow
            label="Policy Expiry"
            value={formatDate(policyDetails.response?.PolicyExpiryDate)}
          />
          <DetailRow
            label="Type"
            value={`${
              policyDetails.quote?.insuranceType === 'thirdparty'
                ? 'Third Party'
                : 'Comprehensive'
            }${policyDetails.quote?.basicQuote ? ' (Basic)' : ''}`}
          />
          <DetailRow
            label="Repair Type"
            value={
              policyDetails.quoteId?.basicQuote
                ? '-'
                : policyDetails.quoteId?.repairType
                ? policyDetails.quoteId?.repairType === 'nonagency'
                  ? 'Non Agency'
                  : 'Agency'
                : policyDetails.quoteId?.insuranceType === 'thirdparty'
                ? 'Third Party'
                : 'Non Agency'
            }
          />
          <DetailRow
            label="Policy Issue"
            value={formatDate(policyDetails.response?.PolicyEffectiveDate)}
          />
          <DetailRow
            label="Ref No"
            value={
              policyDetails.policyNumber || policyDetails.response?.PolicyNumber
            }
          />
          <DetailRow
            label="Source"
            value={policyDetails.quoteId?.source || policyDetails.quote?.source}
          />
        </Section>
      </>
    );
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Motor Cancellation" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isDocked && (
          <View style={styles.introContainer}>
            <Text style={styles.mainTitle}>Cancel Your Policy Here</Text>
            <Text style={styles.mainSubtitle}>
              Enter your policy number to search and initiate your policy
              cancellation request.
            </Text>
          </View>
        )}

        <View
          style={[
            styles.searchContainer,
            isDocked && styles.searchContainerDocked,
          ]}
        >
          <FloatingLabelInput
            label="Company Policy Number"
            value={policyNumber}
            onChangeText={text => {
              setPolicyNumber(text);
              if (errorVisible || policyDetails) {
                setErrorVisible(false);
                setPolicyDetails(null);
                setIsDocked(false);
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
              }
            }}
            style={styles.searchInput}
          />
          <CustomButton
            title="Search"
            onPress={handleSearch}
            disabled={!policyNumber.trim() || searchLoading}
            buttonStyle={styles.searchButton}
            loading={searchLoading}
          />
        </View>

        {errorVisible && (
          <View style={styles.errorCard}>
            <View style={styles.errorHeader}>
              <Text style={styles.errorHeaderText}>Policy Not Found</Text>
            </View>
            <Text style={styles.errorBodyText}>
              The policy number you entered could not be found. Please verify
              and try again.
            </Text>
          </View>
        )}

        {policyDetails && (
          <View style={styles.resultsContainer}>
            {renderPolicyContent()}

            <CustomButton
              title="Cancel Your Policy"
              onPress={() => {
                navigation.navigate(SCREEN_NAMES.CANCELLATION_POLICY, {
                  policyData: policyDetails,
                });
              }}
              buttonStyle={styles.cancelActionBtn}
              isShowIcon
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: verticalScale(40),
    },
    introContainer: {
      padding: moderateScale(20),
      alignItems: 'center',
      marginTop: verticalScale(40),
    },
    mainTitle: {
      fontSize: verticalScale(28),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: verticalScale(10),
    },
    mainSubtitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
      lineHeight: verticalScale(24),
    },
    searchContainer: {
      padding: moderateScale(20),
      gap: verticalScale(15),
    },
    searchContainerDocked: {
      marginTop: verticalScale(10),
    },
    searchInput: {
      backgroundColor: theme.colors.backgroundColor,
    },
    searchButton: {
      height: verticalScale(50),
    },
    errorCard: {
      margin: moderateScale(20),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      overflow: 'hidden',
    },
    errorHeader: {
      backgroundColor: theme.colors.red,
      padding: moderateScale(15),
    },
    errorHeaderText: {
      color: '#fff',
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(18),
      textAlign: 'center',
    },
    errorBodyText: {
      padding: moderateScale(20),
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      textAlign: 'center',
      lineHeight: verticalScale(22),
    },
    resultsContainer: {
      padding: moderateScale(15),
      gap: verticalScale(15),
    },
    sectionContainer: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      marginBottom: verticalScale(10),
    },
    sectionHeader: {
      backgroundColor: theme.colors.primary,
      padding: moderateScale(12),
    },
    sectionTitle: {
      color: '#fff',
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(16),
    },
    sectionContent: {
      padding: moderateScale(15),
      gap: verticalScale(10),
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    detailLabel: {
      flex: 1,
      fontFamily: 'Lato-Bold',
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
    },
    detailValue: {
      flex: 1.5,
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
      color: theme.colors.text,
      textAlign: 'right',
    },
    cancelActionBtn: {
      marginTop: verticalScale(15),
      backgroundColor: theme.colors.red || '#EE1122',
    },
  });

export default CancelPolicy;
