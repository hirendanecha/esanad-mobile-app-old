import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber } from '@utils/formateNumber';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import { CustomAccordion } from '@components/ui/CustomAccordion';
import CustomCheckBox from '@components/ui/CustomCheckBox';
import CustomButton from '@components/ui/CustomButton';
import { Style } from './HealthPolicyBuy.styles';
import { PolicyInfoRow } from './components/SupportComp';
import DocumentUploader from './components/DocumentUploader';
import { HEALTH_CONSTANTS } from '@constants/Static/healthJson';
import {
  useContactAgentHealth,
  useGetHealthQuote,
  useUploadDocument,
} from '@hooks/HEALTH/healthFlow/useHealthFlow';
import { SCREEN_NAMES } from '@constants/screenNames';
import PDFSignatureComponent from './components/PDFSignatureComponent';
import { env } from '@config/index';
import HealthInsuranceForm from './insuranceForm/HealthInsuranceForm';
import axios from 'axios';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import OrDivider from '@components/ui/OrDivider';
import RNBlobUtil from 'react-native-blob-util';
import { getBottomMargin } from '@utils/paddingBottom';
import { ageCalculator } from '@utils/ageCalculator';

const HealthBuyPolicyScreen = ({ route, navigation }) => {
  const { theme } = useThemeContext();
  const styles = Style(theme);

  const { policy_id } = route?.params || {};

  const { data: healthQuotesData = {}, refetch } = useGetHealthQuote({
    reqId: policy_id,
  });
  const { mutate: uploadDocument } = useUploadDocument();
  const { mutate: contactAgent } = useContactAgentHealth();

  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [fileDocsLoader, setFileDocsLoader] = useState({});
  const [isPDFView, setIsPDFView] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [healthQuotes, setHealthQuotes] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setHealthQuotes(healthQuotesData);
    if (healthQuotesData?.healthInfo?.healthPdf?.link) {
      let url = healthQuotesData.healthInfo.healthPdf.link;

      if (url.startsWith('http://') || url.startsWith('https://')) {
        setPdfUrl(url);
      } else {
        const API_URL = env.API_URL;
        setPdfUrl(`${API_URL}${url}`);
      }
    }
  }, [healthQuotesData]);

  useEffect(() => {
    if (
      healthQuotes?.voucher &&
      healthQuotes?.discountPrice &&
      healthQuotes?.totalPrice
    ) {
      setDiscountAmount(
        +healthQuotes?.totalPrice - +healthQuotes?.discountPrice,
      );
    }
  }, [
    healthQuotes?.voucher,
    healthQuotes?.totalPrice,
    healthQuotes?.discountPrice,
  ]);

  const handleFileUpload = async (file, personKey, personId, docsKey) => {
    setFileDocsLoader(prev => ({ ...prev, [`${personId}-${docsKey}`]: true }));

    const payload = {
      healthInfoId: healthQuotes?.healthInfo?._id,
      detailsToUpdate: personKey,
      detailsId: personId,
      [docsKey]: file,
    };

    const formData = new FormData();
    formData.append('healthInfoId', payload.healthInfoId);
    formData.append('detailsToUpdate', payload.detailsToUpdate);
    formData.append('detailsId', payload.detailsId);
    formData.append(docsKey, file);

    uploadDocument(formData, {
      onSuccess: () => {
        refetch();
        setFileDocsLoader(prev => ({
          ...prev,
          [`${personId}-${docsKey}`]: false,
        }));
      },
    });
  };

  const handlePDFSubmit = async formData => {
    try {
      uploadDocument(formData, {
        onSuccess: () => {
          console.log('Signed PDF uploaded successfully');
          refetch();
          setTimeout(() => {
            setIsPDFView(false);
          }, 250);
        },
        onError: error => {
          console.error('Error uploading signed PDF:', error);
          setTimeout(() => {
            setIsPDFView(false);
          }, 250);
        },
      });
    } catch (error) {
      console.error('Error submitting PDF:', error);
    }
  };

  const handleSave = async formData => {
    try {
      const res = await axios.post(
        `${env.API_URL}api/health-insurance/generatepdf`,
        formData,
        {
          responseType: 'blob',
        },
      );

      console.log('PDF generated successfully', res);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      Linking.openURL(url);
      console.log('Generated PDF URL:', url);
    } catch (error) {
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        Alert.alert('Error', 'Network error occurred while generating PDF');
      } else {
        console.error('Failed to generate PDF:', error);
      }
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const checkAllDocsHandler = () => {
    if (!healthQuotes) {
      return true;
    }

    const docsUploadData = HEALTH_CONSTANTS.DOCS_UPLOADED_DATA;
    const insurerType = healthQuotes?.healthInfo?.insurerType;
    const visaStatus = healthQuotes?.healthInfo?.visaStatus;

    if (
      !insurerType ||
      !visaStatus ||
      !docsUploadData?.[insurerType]?.[visaStatus]
    ) {
      return true;
    }

    const requiredDocs = docsUploadData[insurerType][visaStatus];

    const isDocumentRequired = (doc, cityName) => {
      if (doc.require) return true;

      if (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName)) {
        return true;
      }

      if (doc.ownerRequire) return true;

      return false;
    };

    const cityName = healthQuotes?.healthInfo?.city;

    for (const doc of requiredDocs) {
      if (isDocumentRequired(doc, cityName)) {
        if (!healthQuotes?.healthInfo?.[doc.key]) {
          console.log(`Missing owner document: ${doc.label}`);
          return false;
        }
      }
    }

    if (
      healthQuotesData?.healthInfo?.insurerType !== 'Self' &&
      healthQuotes?.healthInfo?.kidsDetails?.length > 0
    ) {
      for (const kid of healthQuotes.healthInfo.kidsDetails) {
        for (const doc of requiredDocs) {
          const isRequired =
            doc.require ||
            (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName));

          if (isRequired && !kid[doc.key]) {
            console.log(
              `Missing kid document: ${doc.label} for kid: ${kid._id}`,
            );
            return false;
          }
        }
      }
    }

    if (
      healthQuotesData?.healthInfo?.insurerType !== 'Self' &&
      healthQuotes?.healthInfo?.spouseDetails?.length > 0
    ) {
      for (const spouse of healthQuotes.healthInfo.spouseDetails) {
        for (const doc of requiredDocs) {
          const isRequired =
            doc.require ||
            (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName));

          if (isRequired && !spouse[doc.key]) {
            console.log(
              `Missing spouse document: ${doc.label} for spouse: ${spouse._id}`,
            );
            return false;
          }
        }
      }
    }

    if (healthQuotes?.healthInfo?.domesticWorkerDetails?.length > 0) {
      for (const worker of healthQuotes.healthInfo.domesticWorkerDetails) {
        for (const doc of requiredDocs) {
          const isRequired =
            doc.require ||
            (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName));

          if (isRequired && !worker[doc.key]) {
            console.log(`Missing domestic worker document: ${doc.label}`);
            return false;
          }
        }
      }
    }

    if (healthQuotes?.healthInfo?.otherFamilyDependentsDetails?.length > 0) {
      for (const dependent of healthQuotes.healthInfo
        .otherFamilyDependentsDetails) {
        for (const doc of requiredDocs) {
          const isRequired =
            doc.require ||
            (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName));

          if (isRequired && !dependent[doc.key]) {
            console.log(`Missing dependent document: ${doc.label}`);
            return false;
          }
        }
      }
    }

    if (healthQuotes?.healthInfo?.parentsDetails?.length > 0) {
      for (const parent of healthQuotes.healthInfo.parentsDetails) {
        for (const doc of requiredDocs) {
          const isRequired =
            doc.require ||
            (doc.requireCity?.length > 0 && doc.requireCity.includes(cityName));

          if (isRequired && !parent[doc.key]) {
            console.log(`Missing parent document: ${doc.label}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const onContactAgentSubmit = () => {
    const isValid = checkAllDocsHandler();
    if (!isValid) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    if (!healthQuotes?.healthInfo?.isHealthPdfSignatureDone) {
      Alert.alert('Error', 'Please sign the document first');
      return;
    }

    contactAgent(
      { reqId: healthQuotes?._id, data: { isContact: true } },
      {
        onSuccess: () => {
          navigation.navigate(SCREEN_NAMES.THANKYOU_SCREEN);
        },
        onError: error => {
          console.log('Error', error?.message || 'Failed to submit');
        },
      },
    );
  };

  const calculateTotalPayable = () => {
    if (!healthQuotes?.price) return '0';

    return formatNumber(
      healthQuotes?.price * 1.05 +
        +(healthQuotes?.fineCharges || 0) +
        (healthQuotes?.ICPFee || healthQuotes?.bashmahFee || 0) -
        (discountAmount || 0),
    );
  };

  const getAllBenefits = () => {
    if (!healthQuotes) return [];
    return [
      ...(healthQuotes?.includedCovers || []),
      ...(healthQuotes?.extraCovers || []),
    ];
  };

  const renderDocumentUpload = (data, personKey) => {
    const insurerType = healthQuotes?.healthInfo?.insurerType;
    const visaStatus = healthQuotes?.healthInfo?.visaStatus;

    if (
      !insurerType ||
      !visaStatus ||
      !HEALTH_CONSTANTS.DOCS_UPLOADED_DATA[insurerType]
    ) {
      return null;
    }

    const requiredDocs =
      HEALTH_CONSTANTS.DOCS_UPLOADED_DATA[insurerType][visaStatus] || [];

    return (
      <View style={styles.documentsContainer}>
        <Text style={styles.documentsTitle}>Documents:</Text>
        {requiredDocs.map((doc, index) => (
          <DocumentUploader
            key={index}
            label={doc.label}
            isRequired={doc.require}
            isUploaded={!!data?.[doc.key]}
            isLoading={fileDocsLoader[`${data?._id}-${doc.key}`]}
            onUpload={file =>
              handleFileUpload(file, personKey, data?._id, doc.key)
            }
          />
        ))}
      </View>
    );
  };

  const USER_DATA = [
    {
      label: 'Name:',
      value: healthQuotesData?.healthInfo?.fullName,
    },
    {
      label: 'Mobile:',
      value: `+${healthQuotesData?.healthInfo?.countryCode || '971'} ${
        healthQuotesData?.healthInfo?.mobileNumber
      }`,
    },
    {
      label: 'Email:',
      value: healthQuotesData?.healthInfo?.email,
    },
    {
      label: 'Date of Birth:',
      value: moment(healthQuotesData?.healthInfo?.dateOfBirth).format(
        'DD/MM/YYYY',
      ),
    },
    {
      label: 'Age:',
      value:
        healthQuotesData?.healthInfo?.age ||
        ageCalculator(healthQuotesData?.healthInfo?.dateOfBirth),
    },
    {
      label: 'Nationality:',
      value: healthQuotesData?.healthInfo?.nationality,
    },
    {
      label: 'gender:',
      value: healthQuotesData?.healthInfo?.gender,
    },
  ];

  const SPOUSE_DATA = [
    {
      label: 'Name:',
      value: healthQuotesData?.spouse?.[0]?.person?.fullName,
    },

    {
      label: 'Date of Birth:',
      value: moment(healthQuotesData?.spouse?.[0]?.person?.dateOfBirth).format(
        'DD/MM/YYYY',
      ),
    },
    {
      label: 'Age:',
      value: healthQuotesData?.spouse?.[0]?.person?.age,
    },
    {
      label: 'gender:',
      value: healthQuotesData?.spouse?.[0]?.person?.gender,
    },
  ];

  const POLICY_DETAILS = [
    {
      label: 'Insurer:',
      value: healthQuotesData?.companyData?.companyName || '-',
    },
    {
      label: 'Type:',
      value: healthQuotesData?.healthInfo?.insurerType || '-',
    },
    {
      label: 'TPA:',
      value: healthQuotesData?.TPA?.TPAName || '-',
    },
    {
      label: 'Network:',
      value: healthQuotesData?.network?.networkName || '-',
    },
    {
      label: 'Plan:',
      value: healthQuotesData?.plan?.planName || '-',
    },
    {
      label: 'City:',
      value: healthQuotesData?.city?.cityName || '-',
    },
  ];

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Plan Review Detail" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: verticalScale(10),
            padding: verticalScale(15),
            gap: verticalScale(20),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(20),
              fontFamily: 'Lato-Bold',
              color: theme.colors.text,
            }}
          >
            Review Details
          </Text>

          <View style={{ gap: verticalScale(10) }}>
            <Text
              style={{
                fontSize: verticalScale(16),
                fontFamily: 'Lato-Bold',
                color: theme.colors.text,
              }}
            >
              Personal
            </Text>
            {USER_DATA.map(({ label, value }, index) => (
              <View key={index} style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.textTertiary,
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.text,
                  }}
                >
                  {value ?? '-'}
                </Text>
              </View>
            ))}
          </View>

          {renderDocumentUpload(healthQuotesData?.healthInfo, 'ownerDetails')}

          {healthQuotesData?.spouse?.length > 0 && (
            <>
              <OrDivider simple />

              <View style={{ gap: verticalScale(10) }}>
                <Text
                  style={{
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Bold',
                    color: theme.colors.text,
                  }}
                >
                  Spouse Details
                </Text>
                {SPOUSE_DATA.map(({ label, value }, index) => (
                  <View key={index} style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: verticalScale(16),
                        fontFamily: 'Lato-Regular',
                        color: theme.colors.textTertiary,
                      }}
                    >
                      {label}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: verticalScale(16),
                        fontFamily: 'Lato-Regular',
                        color: theme.colors.text,
                      }}
                    >
                      {value ?? '-'}
                    </Text>
                  </View>
                ))}
              </View>

              {healthQuotesData?.healthInfo?.spouseDetails?.map(
                (spouse, index) => (
                  <React.Fragment key={index}>
                    {renderDocumentUpload(spouse, 'spouseDetails')}
                  </React.Fragment>
                ),
              )}
            </>
          )}

          {healthQuotesData?.kids?.length > 0 && (
            <>
              <OrDivider simple />

              <View style={{ gap: verticalScale(10) }}>
                <Text
                  style={{
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Bold',
                    color: theme.colors.text,
                  }}
                >
                  Kids Details
                </Text>
                {healthQuotesData?.kids?.map((item, kidIndex) => {
                  const KIDS_DATA = [
                    {
                      label: 'Name:',
                      value: item?.person?.fullName,
                    },
                    {
                      label: 'Date of Birth:',
                      value: moment(item?.person?.dateOfBirth).format(
                        'DD/MM/YYYY',
                      ),
                    },
                    {
                      label: 'Age:',
                      value: item?.person?.age,
                    },
                    {
                      label: 'gender:',
                      value: item?.person?.gender,
                    },
                  ];

                  return (
                    <React.Fragment key={kidIndex}>
                      {kidIndex > 0 && <OrDivider simple />}
                      {KIDS_DATA?.map(({ label, value }, dataIndex) => (
                        <View key={dataIndex} style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: verticalScale(16),
                              fontFamily: 'Lato-Regular',
                              color: theme.colors.textTertiary,
                            }}
                          >
                            {label}
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: verticalScale(16),
                              fontFamily: 'Lato-Regular',
                              color: theme.colors.text,
                            }}
                          >
                            {value ?? '-'}
                          </Text>
                        </View>
                      ))}
                    </React.Fragment>
                  );
                })}
              </View>

              {healthQuotesData?.healthInfo?.kidsDetails
                ?.sort((a, b) => (b._id > a._id ? -1 : 1))
                .map((kid, index) => (
                  <React.Fragment key={index}>
                    {renderDocumentUpload(kid, 'kidsDetails')}
                  </React.Fragment>
                ))}
            </>
          )}
        </View>

        <HealthInsuranceForm
          onSave={handleSave}
          onCancel={handleCancel}
          companyId={route?.params?.companyId}
          policyData={healthQuotesData}
          setFormData={setFormData}
          formData={formData}
          healthQuotesData={healthQuotesData}
        />

        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: verticalScale(10),
            padding: verticalScale(15),
            gap: verticalScale(20),
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(20),
              fontWeight: '600',
              color: theme.colors.text,
            }}
          >
            Policy Details
          </Text>

          <View style={{ gap: verticalScale(10) }}>
            {POLICY_DETAILS.map(({ label, value }, index) => (
              <View key={index} style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.textTertiary,
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: verticalScale(16),
                    fontFamily: 'Lato-Regular',
                    color: theme.colors.text,
                  }}
                >
                  {value ?? '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            borderRadius: moderateScale(10),
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <CustomAccordion title="View Benefits">
            {getAllBenefits()?.length > 0 ? (
              getAllBenefits().map((benefit, index) => {
                const benefitName = benefit?.benefit?.name
                  ?.split('\n')
                  .slice(0, 4)
                  .map((line, i) =>
                    i === 0 ? line.substring(0, 50) + '...' : line,
                  )
                  .join('\n');

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: moderateScale(8),
                      paddingBottom: moderateScale(15),
                      paddingHorizontal: moderateScale(15),
                    }}
                  >
                    <MaterialCommunityIcons
                      name="pill"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.benefitName}>{benefitName}</Text>
                    <Text style={styles.benefitValue}>
                      {benefit?.value
                        ? benefit.value
                        : benefit?.limitAmount && benefit?.limitAmount !== 0
                        ? `${benefit.limitAmount} AED`
                        : '---'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noBenefitsText}>No benefits available</Text>
            )}
          </CustomAccordion>
        </View>

        <View style={[styles.card, styles.pricingCard]}>
          <Text style={styles.cardTitle}>Policy Details</Text>

          {healthQuotes?.isReferral ? (
            <Text style={styles.contactPriceText}>Contact us for price.</Text>
          ) : healthQuotes?.isPremiumRequestUpon ? (
            <Text style={styles.contactPriceText}>Price upon request</Text>
          ) : (
            <View style={styles.pricingContainer}>
              <PolicyInfoRow
                label="Premium"
                value={`AED ${formatNumber(healthQuotes?.price)}`}
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={styles}
              />

              {healthQuotes?.voucher && (
                <PolicyInfoRow
                  label={`Discount ${
                    healthQuotes?.voucher?.discountType === 'percentage'
                      ? `${healthQuotes?.voucher?.discountValue} %`
                      : ''
                  }`}
                  value={`- AED ${formatNumber(
                    Math.floor(parseInt(discountAmount * 100) / 100) || 0,
                  )}`}
                  labelColor={theme.colors.primary}
                  valueColor={theme.colors.red}
                  styles={styles}
                />
              )}

              <PolicyInfoRow
                label="Vat 5%"
                value={`AED ${formatNumber(healthQuotes?.price * 0.05)}`}
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={styles}
              />

              <PolicyInfoRow
                label="Fine Charges"
                value={
                  healthQuotes?.fineCharges
                    ? `AED ${healthQuotes?.fineCharges}`
                    : 'AED 0'
                }
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={styles}
              />

              {healthQuotes?.ICPFee && (
                <PolicyInfoRow
                  label="ICP Fee"
                  value={`AED ${formatNumber(healthQuotes?.ICPFee)}`}
                  labelColor={theme.colors.description}
                  valueColor={theme.colors.text}
                  styles={styles}
                />
              )}

              {healthQuotes?.bashmahFee && (
                <PolicyInfoRow
                  label="Bashmah Fee"
                  value={`AED ${formatNumber(healthQuotes?.bashmahFee)}`}
                  labelColor={theme.colors.description}
                  valueColor={theme.colors.text}
                  styles={styles}
                />
              )}

              <PolicyInfoRow
                label="eSanad Club"
                value="AED 0"
                labelColor={theme.colors.description}
                valueColor={theme.colors.text}
                styles={styles}
              />
            </View>
          )}

          {!healthQuotes?.isReferral && !healthQuotes?.isPremiumRequestUpon && (
            <View style={styles.totalSection}>
              <PolicyInfoRow
                label="Total Payable"
                value={`AED ${calculateTotalPayable()}`}
                labelColor={theme.colors.textSecondary}
                valueColor={theme.colors.textSecondary}
                styles={styles}
              />
            </View>
          )}
        </View>

        <LinearGradient
          colors={theme.colors.infoBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          useAngle
          angle={140}
          style={{
            borderRadius: verticalScale(10),
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View
            style={{
              gap: verticalScale(20),
              padding: verticalScale(15),
            }}
          >
            <Text
              style={{
                color: theme.colors.textTertiary,
                fontSize: verticalScale(14),
                fontFamily: 'Lato-Regular',
              }}
            >
              By proceeding, you agree to our
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: 'Lato-Bold',
                }}
                onPress={() => console.log('terms')}
              >
                {' '}
                Terms & Conditions{' '}
              </Text>
              and provide your consent to process your personal data as per the
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: 'Lato-Bold',
                }}
                onPress={() => console.log('privacy')}
              >
                {' '}
                Privacy Policy
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.signDocumentRow}
              onPress={() => {
                if (!healthQuotes?.healthInfo?.isHealthPdfSignatureDone) {
                  if (!pdfUrl) {
                    Alert.alert('Error', 'PDF document not available');
                    return;
                  }
                  setIsPDFView(true);
                } else {
                  Alert.alert('Info', 'Signed Document already uploaded!');
                }
              }}
            >
              <Text style={styles.signDocumentText}>Sign Document</Text>
              <Feather
                name={
                  healthQuotes?.healthInfo?.isHealthPdfSignatureDone
                    ? 'check-circle'
                    : 'circle'
                }
                size={20}
                color={
                  healthQuotes?.healthInfo?.isHealthPdfSignatureDone
                    ? theme.colors.lableText
                    : theme.colors.secondary
                }
              />
            </TouchableOpacity>

            <CustomCheckBox
              label="I agree on eSanad private policy and terms & conditions."
              onChange={checked => {
                if (!healthQuotes?.healthInfo?.isHealthPdfSignatureDone) {
                  Alert.alert('Error', 'Please Sign Document first!');
                  return;
                }
                setIsCheckBoxSelected(checked);
              }}
              value={isCheckBoxSelected}
              checkedColor={theme.colors.primary}
              disabledColor={theme.colors.border}
            />

            <CustomButton
              onPress={onContactAgentSubmit}
              disabled={!isCheckBoxSelected}
              title="Submit"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.textSecondary}
            />
          </View>
        </LinearGradient>
      </ScrollView>

      {/* PDF Signature Modal */}
      {isPDFView && (
        <PDFSignatureComponent
          visible={isPDFView}
          onClose={() =>
            setTimeout(() => {
              setIsPDFView(false);
            }, 250)
          }
          pdfUrl={pdfUrl}
          onSubmit={handlePDFSubmit}
          healthInfo={healthQuotes?.healthInfo}
          proposalNo={healthQuotes?.proposalNo}
        />
      )}
    </LinearGradient>
  );
};

export default HealthBuyPolicyScreen;
