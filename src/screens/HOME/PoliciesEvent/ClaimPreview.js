import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import CustomButton from '@components/ui/CustomButton';
import { useFinalClaimSubmit } from '@hooks/policy/useMotorClaim';
import { SCREEN_NAMES } from '@constants/screenNames';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pdf from 'react-native-pdf';
import { Image } from 'react-native';

const ClaimPreview = () => {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);
    const navigation = useNavigation();
    const route = useRoute();
    const { claimData } = route.params || {};
    const { documents } = claimData || {};

    const [loader, setLoader] = useState(false);
    const { mutate: submitClaim } = useFinalClaimSubmit();

    const DetailRow = ({ label, value }) => (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || '-'}</Text>
        </View>
    );

    const Section = ({ title, children, onEdit }) => (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {onEdit && (
                    <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                        <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );

    const handleSubmit = () => {
        setLoader(true);
        const formData = new FormData();

        // Add claim details
        Object.keys(claimData).forEach(key => {
            if (key !== 'documents') {
                formData.append(key, claimData[key]);
            }
        });

        // Add documents
        if (documents) {
            Object.keys(documents).forEach(key => {
                const file = documents[key];
                if (file) {
                    formData.append(key, {
                        uri: file.serverPath || file.uri || file.fileCopyUri,
                        type: file.type || 'image/jpeg',
                        name: file.name || `${key}_${Date.now()}.jpg`,
                    });
                }
            });
        }

        submitClaim(formData, {
            onSuccess: () => {
                setLoader(false);
                navigation.navigate(SCREEN_NAMES.THANKYOU_SCREEN, {
                    title: 'Claim Submitted!',
                    subtitle: 'Your motor insurance claim has been successfully submitted. Our team will review it and get back to you shortly.',
                });
            },
            onError: (error) => {
                setLoader(false);
                Alert.alert('Submission Failed', error?.message || 'Something went wrong while submitting your claim.');
            }
        });
    };

    const renderDocPreview = (file) => {
        if (!file) return null;
        const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');

        return (
            <View style={styles.docPreview}>
                {isPdf ? (
                    <View style={styles.pdfContainer}>
                        <Ionicons name="document-text" size={40} color={theme.colors.primary} />
                        <Text style={styles.docName} numberOfLines={1}>{file.name}</Text>
                    </View>
                ) : (
                    <Image source={{ uri: file.uri }} style={styles.imagePreview} resizeMode="cover" />
                )}
            </View>
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
            <Header title="Details Preview" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Section title="Claim Details" onEdit={() => navigation.navigate(SCREEN_NAMES.CLAIM_USER_DETAILS)}>
                    <DetailRow label="Customer Name" value={claimData?.customerName} />
                    <DetailRow label="Email" value={claimData?.customerEmail} />
                    <DetailRow label="Mobile No" value={claimData?.customerMobileNo} />
                    <DetailRow label="Policy Number" value={claimData?.policyNumber} />
                    <DetailRow label="Police Report Number" value={claimData?.policeReportNumber} />
                    <DetailRow label="Plate Code" value={claimData?.plateCode} />
                    <DetailRow label="Plate Number" value={claimData?.plateNumber} />
                    <DetailRow label="Preferred Location" value={claimData?.preferredGarageLocation} />
                    <DetailRow label="Selected Garage" value={claimData?.selectedGarage} />
                </Section>

                <Section title="Documents" onEdit={() => navigation.navigate(SCREEN_NAMES.MOTOR_DOCUMENT_UPLOAD)}>
                    <View style={styles.docsGrid}>
                        <View style={styles.docItem}>
                            <Text style={styles.docLabel}>Registration Card</Text>
                            {renderDocPreview(documents?.registrationCard)}
                        </View>
                        <View style={styles.docItem}>
                            <Text style={styles.docLabel}>Driving License</Text>
                            {renderDocPreview(documents?.drivingLicense)}
                        </View>
                        <View style={styles.docItem}>
                            <Text style={styles.docLabel}>Emirates ID</Text>
                            {renderDocPreview(documents?.emiratesId)}
                        </View>
                        <View style={styles.docItem}>
                            <Text style={styles.docLabel}>Police Report</Text>
                            {renderDocPreview(documents?.policeReport)}
                        </View>
                    </View>
                </Section>

                <CustomButton
                    title="Submit Claim"
                    onPress={handleSubmit}
                    loading={loader}
                    buttonStyle={styles.submitButton}
                    isShowIcon
                />
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
            padding: moderateScale(20),
            paddingBottom: verticalScale(40),
        },
        sectionContainer: {
            marginBottom: verticalScale(20),
            backgroundColor: theme.colors.backgroundColor,
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: moderateScale(15),
            backgroundColor: theme.colors.floorBgColor,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        sectionTitle: {
            fontSize: verticalScale(16),
            fontFamily: 'Lato-Bold',
            color: theme.colors.primary,
        },
        editButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: moderateScale(4),
        },
        editText: {
            fontSize: verticalScale(14),
            fontFamily: 'Lato-Regular',
            color: theme.colors.primary,
        },
        sectionContent: {
            padding: moderateScale(15),
        },
        detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: verticalScale(8),
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.floorBgColor,
        },
        detailLabel: {
            fontSize: verticalScale(14),
            fontFamily: 'Lato-Regular',
            color: theme.colors.textTertiary,
            flex: 1,
        },
        detailValue: {
            fontSize: verticalScale(14),
            fontFamily: 'Lato-Bold',
            color: theme.colors.text,
            flex: 2,
            textAlign: 'right',
        },
        docsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: moderateScale(15),
        },
        docItem: {
            width: '47%',
            gap: verticalScale(8),
        },
        docLabel: {
            fontSize: verticalScale(12),
            fontFamily: 'Lato-Bold',
            color: theme.colors.textTertiary,
        },
        docPreview: {
            height: verticalScale(100),
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.colors.floorBgColor,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        imagePreview: {
            width: '100%',
            height: '100%',
        },
        pdfContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: moderateScale(10),
        },
        docName: {
            fontSize: verticalScale(10),
            fontFamily: 'Lato-Regular',
            color: theme.colors.textTertiary,
            marginTop: verticalScale(4),
        },
        submitButton: {
            marginTop: verticalScale(10),
        },
    });

export default ClaimPreview;
