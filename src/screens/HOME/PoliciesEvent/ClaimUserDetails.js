import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';
import Header from '@components/ui/Header';
import FloatingLabelInput from '@components/ui/FloatingLabelInput';
import CustomButton from '@components/ui/CustomButton';
import CountryPhoneInput from '@components/ui/CountryPhoneInput';
import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import WrapKeyboardAwareScrollView from '@components/ui/WrapKeyboardAwareScrollView';
import { SCREEN_NAMES } from '@constants/screenNames';

const UAE_STATES = [
    'Abu Dhabi',
    'Ajman',
    'Dubai',
    'Fujairah',
    'Ras Al Khaimah',
    'Sharjah',
    'Umm Al Quwain',
];

const PLATE_CODES = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '50', 'A', 'AA', 'B', 'C', 'D', 'DC', 'DU', 'DXB', 'E',
    'EX', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'RN', 'S', 'T', 'TC', 'TL', 'U',
    'V', 'W', 'X', 'Y', 'Z',
];

const ClaimUserDetails = () => {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);
    const navigation = useNavigation();
    const route = useRoute();
    const { policyData, garageList = [] } = route.params || {};

    const [formData, setFormData] = useState({
        policyId: policyData?._id || '',
        customerName: policyData?.motorInfoId?.fullName || policyData?.userId?.fullName || '',
        customerEmail: policyData?.motorInfoId?.email || policyData?.userId?.email || '',
        customerMobileNo: policyData?.motorInfoId?.mobileNumber || policyData?.userId?.mobileNumber || '',
        plateCode: policyData?.carId?.plateCode || '',
        plateNumber: policyData?.carId?.plateNumber || '',
        policeReportNumber: '',
        policyNumber: policyData?.policyNumber || '',
        preferredGarageLocation: '',
        selectedGarage: '',
    });

    const [garages, setGarages] = useState(garageList);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocationChange = location => {
        handleInputChange('preferredGarageLocation', location);
        handleInputChange('selectedGarage', ''); // Reset garage selection
    };

    const isFormValid = () => {
        return (
            formData.customerName &&
            formData.customerEmail &&
            formData.customerMobileNo &&
            formData.plateCode &&
            formData.plateNumber &&
            formData.policeReportNumber &&
            formData.policyNumber &&
            formData.preferredGarageLocation &&
            formData.selectedGarage
        );
    };

    const handleNext = () => {
        navigation.navigate(SCREEN_NAMES.MOTOR_DOCUMENT_UPLOAD, { claimData: formData });
    };

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 2 }}
            locations={[0.1, 0.2]}
            colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
            style={styles.container}
        >
            <Header title="Customer Details" onBack={() => navigation.goBack()} />

            <WrapKeyboardAwareScrollView >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Customer Details</Text>
                        <Text style={styles.subtitle}>Please fill all the fields related to you and your loss.</Text>
                    </View>

                    <View style={styles.formSection}>
                        <FloatingLabelInput
                            label="Customer Name"
                            value={formData.customerName}
                            onChangeText={val => handleInputChange('customerName', val)}
                            editable={false}
                        />

                        <FloatingLabelInput
                            label="Customer Email"
                            value={formData.customerEmail}
                            onChangeText={val => handleInputChange('customerEmail', val)}
                        />

                        <CountryPhoneInput
                            value={formData.customerMobileNo}
                            onChange={data => handleInputChange('customerMobileNo', data.phone)}
                        />

                        <Text style={styles.label}>Plate Code</Text>
                        <CustomDropDownList
                            title="Select Plate Code"
                            data={PLATE_CODES}
                            value={formData.plateCode}
                            onItemPress={val => handleInputChange('plateCode', val)}
                            absolute
                        />

                        <FloatingLabelInput
                            label="Plate Number"
                            value={formData.plateNumber}
                            onChangeText={val => handleInputChange('plateNumber', val)}
                        />

                        <FloatingLabelInput
                            label="Police Report Number"
                            value={formData.policeReportNumber}
                            onChangeText={val => handleInputChange('policeReportNumber', val)}
                        />

                        <FloatingLabelInput
                            label="Policy Number"
                            value={formData.policyNumber}
                            onChangeText={val => handleInputChange('policyNumber', val)}
                        />

                        <Text style={styles.label}>Preferred Repair location</Text>
                        <CustomDropDownList
                            title="Select City"
                            data={UAE_STATES}
                            value={formData.preferredGarageLocation}
                            onItemPress={handleLocationChange}
                            showSearch={false}
                        />

                        <Text style={styles.label}>Garage Selection</Text>
                        <CustomDropDownList
                            title="Select Garage"
                            data={garages}
                            value={formData.selectedGarage}
                            onItemPress={val => handleInputChange('selectedGarage', val)}
                            showSearch={false}
                        />
                    </View>

                    <CustomButton
                        title="Next"
                        onPress={handleNext}
                        disabled={!isFormValid()}
                        buttonStyle={styles.nextButton}
                        isShowIcon
                    />
                </ScrollView>
            </WrapKeyboardAwareScrollView>
        </LinearGradient>
    );
};

const getStyles = theme =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            padding: moderateScale(20),
            paddingBottom: verticalScale(40),
        },
        headerSection: {
            marginBottom: verticalScale(20),
        },
        title: {
            fontSize: verticalScale(24),
            fontFamily: 'Lato-Bold',
            color: theme.colors.primary,
            marginBottom: verticalScale(8),
        },
        subtitle: {
            fontSize: verticalScale(14),
            fontFamily: 'Lato-Regular',
            color: theme.colors.textTertiary,
            lineHeight: verticalScale(20),
        },
        formSection: {
            gap: verticalScale(15),
            marginBottom: verticalScale(20),
        },
        label: {
            fontSize: verticalScale(13),
            fontFamily: 'Lato-Bold',
            color: theme.colors.textTertiary,
            marginBottom: verticalScale(-10),
            marginTop: verticalScale(5),
        },
        nextButton: {
            marginTop: verticalScale(20),
        },
    });

export default ClaimUserDetails;
