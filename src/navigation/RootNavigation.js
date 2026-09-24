import React, { use, useEffect } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { SCREEN_NAMES } from '@constants/screenNames';

import SplashScreen from '@screens/AUTH/SplashScreen/SplashScreen';
import HomeScreen from '@screens/HOME/HomeScreen';

// AUTH
import LogInScreen from '@screens/AUTH/LogInScreen/LogInScreen';
import OTPVerificationScreen from '@screens/AUTH/OTPVerificationScreen/OTPVerificationScreen';

// MOTOR
import MotorFlowScreen from '@screens/MOTOR/MotorInsurance/ManualFlow/MotorFlowScreen';
import InsuranceListScreen from '@screens/MOTOR/InsuranceListScreen/InsuranceListScreen';
import CompanyProfileScreen from '@screens/MOTOR/CompanyProfile/CompanyProfileScreen';
import PolicyDetailScreen from '@screens/MOTOR/PolicyDetails/PolicyDetailScreen';
import BuyPolicyScreen from '@screens/MOTOR/BuyPolicy/BuyPolicyScreen';
import InsuranceComparisonScreen from '@screens/MOTOR/InsuranceCompare/InsuranceComparisonScreen';

// HEALTH
import HealthFlowScreen from '@screens/HEALTH/HealthInsurance/HealthFlowScreen';
import HealthQuoteScreen from '@screens/HEALTH/HealthQuote/HealthQuoteScreen';
import HealthInsuranceComparisonScreen from '@screens/HEALTH/HealthInsuranceCompare/HealthInsuranceComparisonScreen';
import HealthPolicyBuy from '@screens/HEALTH/HealthPolicyBuy/HealthPolicyBuy';
import DrawerNavigation from './DrawerNavigation';
import BottomTabs from './BottomTabs';
import EditProfile from '@screens/PROFILE/EditProfile/EditProfile';
import LoyaltyPoints from '@screens/PROFILE/LoyaltyPoints/LoyaltyPoints';
import QuotationScreen from '@screens/PROFILE/Quotations/QuotationScreen';
import PrivacyPolicy from '@screens/PROFILE/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '@screens/PROFILE/TermsAndConditions/TermsAndConditions';
import FaqsScreen from '@screens/PROFILE/Faqs/FaqsScreen';
import EsanasdClub from '@screens/PROFILE/EsanasdClub/EsanasdClub';
import TermsAndConditionsClub from '@screens/PROFILE/EsanasdClub/pages/TermsAndConditions';
import ByOffers from '@screens/PROFILE/EsanasdClub/pages/ByOffers';
import ByPartners from '@screens/PROFILE/EsanasdClub/pages/ByPartners';
import OffersDetails from '@screens/PROFILE/EsanasdClub/pages/OffersDetails';
import TravelPolicyDetails from '@screens/PRODUCT/MyPolicies/detailsPages/TravelPolicyDetails';
import AboutUs from '@screens/PROFILE/AboutUs/AboutUs';
import MotorPolicyDetails from '@screens/PRODUCT/MyPolicies/detailsPages/MotorPolictDetails';
import HealthPolicyDetails from '@screens/PRODUCT/MyPolicies/detailsPages/HealthPolicyDetails';
import MusatahaPolicyDetails from '@screens/PRODUCT/MyPolicies/detailsPages/MusatahaPolicyDetails';
import OnboardingScreen from '@screens/AUTH/OnboardingScreen/OnboardingScreen';
import HelpAndSupport from '@screens/PROFILE/Help/HelpAndSupport';
import SettingsScreen from '@screens/PROFILE/Settings/SettingsScreen';
import RateUs from '@screens/PROFILE/RateUS/RateUs';
import CarInsurance from '@screens/MOTOR/MotorInsurance/CarInsurance';
import InsuraceFor from '@screens/HEALTH/HealthInsurance/InsuraceFor';
import HealthInsuranceDetails from '@screens/HEALTH/HealthInsuranceDetails/HealthInsuranceDetails';
import ThankYou from '@screens/THANKYOU/ThankYou';
import FetchPolicies from '@screens/AUTH/FetchPolicies';
import FineCal from '@screens/HOME/screens/FineCal';
import RSA from '@screens/HOME/screens/RSA';
import ActivePolicy from '@screens/PRODUCT/MyPolicies/pages/ActivePolicy';
import ExpiredPolicy from '@screens/PRODUCT/MyPolicies/pages/ExpiredPolicy';
import ExpiringPolicy from '@screens/PRODUCT/MyPolicies/pages/ExpiringPolicy';
import CancelledPolicy from '@screens/PRODUCT/MyPolicies/pages/CancelledPolicy';
import OfflinePolicy from '@screens/PRODUCT/MyPolicies/pages/OfflinePolicy';
import CarDetailsFetch from '@screens/PROFILE/CarDetailsFetch/CarDetailsFetch';
import CarDetailView from '@screens/PROFILE/CarDetailsFetch/CarDetailView';
import NewUserForm from '@screens/AUTH/NewUserForm';
import CancellationPolicy from '@screens/PRODUCT/MyPolicies/pages/CancellationPolicy';
import ThatkYouCancelPolicy from '@screens/PRODUCT/MyPolicies/pages/ThatkYouCancelPolicy';
import ClaimPolicy from '@screens/HOME/PoliciesEvent/ClaimPolicy';
import CancelPolicy from '@screens/HOME/PoliciesEvent/CancelPolicy';
import ClaimUserDetails from '@screens/HOME/PoliciesEvent/ClaimUserDetails';
import MotorDocumentUpload from '@screens/HOME/PoliciesEvent/MotorDocumentUpload';
import ClaimPreview from '@screens/HOME/PoliciesEvent/ClaimPreview';
import UsefulLinks from '@screens/HOME/screens/UsefulLinks';
import Tools from '@screens/HOME/screens/Tools';
import VoucherScreen from '@screens/HOME/screens/VoucherScreen';
import MyVoucher from '@screens/HOME/screens/MyVoucher';
import VoucherDetails from '@screens/HOME/screens/PurchaseVoucher';
import Refer from '@screens/HOME/screens/Refer';
import NotificationScreen from '@screens/HOME/screens/NotificationScreen';
import AwardsLink from '@screens/HOME/screens/AwardsLink';
import WeatherScreen from '@screens/HOME/screens/WeatherScreen';
import ExchangeRateScreen from '@screens/HOME/screens/ExchangeRateScreen';
import HolidaysScreen from '@screens/HOME/screens/HolidaysScreen';
import InsuranceBlogs from '@screens/HOME/screens/InsuranceBlogs';
import RtaFines from '@screens/HOME/screens/RtaFines';
import EmergencyScreen from '@screens/HOME/screens/EmergencyScreen';
import InsurancePartners from '@screens/HOME/screens/InsurancePartners';

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.SPLASH_SCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={SCREEN_NAMES.SPLASH_SCREEN}
        component={SplashScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.ONBOARDING_SCREEN}
        component={OnboardingScreen}
      />
      <Stack.Screen name={SCREEN_NAMES.LOGIN_SCREEN} component={LogInScreen} />
      <Stack.Screen
        name={SCREEN_NAMES.OTP_VERIFICATION_SCREEN}
        component={OTPVerificationScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.FETCH_POLICIES}
        component={FetchPolicies}
      />
      <Stack.Screen name={SCREEN_NAMES.NEW_USER_FORM} component={NewUserForm} />
      <Stack.Screen
        name={SCREEN_NAMES.BOTTOM_TABS}
        component={DrawerNavigation}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.THANKYOU_SCREEN}
        component={ThankYou}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name={SCREEN_NAMES.FINE_CAL} component={FineCal} />
      <Stack.Screen
        name={SCREEN_NAMES.RSA_SCREEN}
        component={RSA}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.ACTIVE_POLICY}
        component={ActivePolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.EXPIRED_POLICY}
        component={ExpiredPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.EXPIRING_POLICY}
        component={ExpiringPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CANCELLED_POLICY}
        component={CancelledPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.OFFLINE_POLICY}
        component={OfflinePolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CANCELLATION_POLICY}
        component={CancellationPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.THANKYOU_CANCEL_POLICY}
        component={ThatkYouCancelPolicy}
      />
      <Stack.Screen name={SCREEN_NAMES.REFER} component={Refer} />

      {/* HOME FLOW */}
      <Stack.Screen name={SCREEN_NAMES.USEFUL_LINKS} component={UsefulLinks} />
      <Stack.Screen name={SCREEN_NAMES.TOOLS_SCREEN} component={Tools} />
      <Stack.Screen
        name={SCREEN_NAMES.VOUCHER_SCREEN}
        component={VoucherScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.NOTIFICATION_SCREEN}
        component={NotificationScreen}
      />
      <Stack.Screen name={SCREEN_NAMES.AWARDS_LINK} component={AwardsLink} />
      <Stack.Screen
        name={SCREEN_NAMES.WEATHER_SCREEN}
        component={WeatherScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.EXCHANGE_RATE_SCREEN}
        component={ExchangeRateScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HOLIDAYS_SCREEN}
        component={HolidaysScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.INSURANCE_BLOGS}
        component={InsuranceBlogs}
      />
      <Stack.Screen name={SCREEN_NAMES.RTA_FINES} component={RtaFines} />
      <Stack.Screen
        name={SCREEN_NAMES.EMERGENCY_SCREEN}
        component={EmergencyScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.INSURANCE_PARTNERS}
        component={InsurancePartners}
      />

      {/* MOTOR FLOW */}
      <Stack.Screen
        name={SCREEN_NAMES.CAR_INSURANCE_SCREEN}
        component={CarInsurance}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MOTOR_FLOW_SCREEN}
        component={MotorFlowScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.INSURANCE_LIST_SCREEN}
        component={InsuranceListScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.COMPANY_PROFILE_SCREEN}
        component={CompanyProfileScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.POLICY_DETAIL_SCREEN}
        component={PolicyDetailScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.BUY_POLICY_SCREEN}
        component={BuyPolicyScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.INSURANCE_COMPARISON_SCREEN}
        component={InsuranceComparisonScreen}
      />

      {/* HEALTH FLOW */}
      <Stack.Screen name={SCREEN_NAMES.INSURACE_FOR} component={InsuraceFor} />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_FLOW_SCREEN}
        component={HealthFlowScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_QUOTE_SCREEN}
        component={HealthQuoteScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_INSURANCE_COMPARISON_SCREEN}
        component={HealthInsuranceComparisonScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_POLICY_BUY_SCREEN}
        component={HealthPolicyBuy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_INSURANCE_DETAILS}
        component={HealthInsuranceDetails}
      />

      {/* PROFILE SCREEN */}
      <Stack.Screen name={SCREEN_NAMES.EDIT_PROFILE} component={EditProfile} />
      <Stack.Screen
        name={SCREEN_NAMES.LOYALTY_POINTS}
        component={LoyaltyPoints}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MY_VOUCHER}
        component={MyVoucher}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.VOUCHER_DETAILS}
        component={VoucherDetails}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.GET_CAR_DETAILS}
        component={CarDetailsFetch}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CAR_DETAIL_VIEW}
        component={CarDetailView}
      />

      <Stack.Screen
        name={SCREEN_NAMES.QUOTATION_SCREEN}
        component={QuotationScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.PRIVACY_POLICY}
        component={PrivacyPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.TERMS_AND_CONDITIONS}
        component={TermsAndConditions}
      />
      <Stack.Screen name={SCREEN_NAMES.FAQ_SCREEN} component={FaqsScreen} />
      <Stack.Screen
        name={SCREEN_NAMES.HELP_AND_SUPPORT}
        component={HelpAndSupport}
      />
      <Stack.Screen name={SCREEN_NAMES.ABOUT_US} component={AboutUs} />
      <Stack.Screen name={SCREEN_NAMES.ESANASD_CLUB} component={EsanasdClub} />
      <Stack.Screen
        name={SCREEN_NAMES.TERMS_AND_CONDITIONS_CLUB}
        component={TermsAndConditionsClub}
      />
      <Stack.Screen name={SCREEN_NAMES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={SCREEN_NAMES.RATE_US} component={RateUs} />

      {/* ============================ */}

      <Stack.Screen name={SCREEN_NAMES.BY_OFFERS} component={ByOffers} />
      <Stack.Screen name={SCREEN_NAMES.BY_PARTNERS} component={ByPartners} />
      <Stack.Screen
        name={SCREEN_NAMES.OFFERS_DETAILS}
        component={OffersDetails}
      />

      {/* ============================ */}

      {/* ============================ */}

      <Stack.Screen
        name={SCREEN_NAMES.TRAVEL_INSURANCE_DETAIL}
        component={TravelPolicyDetails}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MOTOR_INSURANCE_DETAIL}
        component={MotorPolicyDetails}
      />
      <Stack.Screen
        name={SCREEN_NAMES.HEALTH_INSURANCE_DETAIL}
        component={HealthPolicyDetails}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MUSATAHA_POLICY_DETAIL}
        component={MusatahaPolicyDetails}
      />
      <Stack.Screen name={SCREEN_NAMES.CLAIM_POLICY} component={ClaimPolicy} />
      <Stack.Screen
        name={SCREEN_NAMES.CANCEL_POLICY}
        component={CancelPolicy}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CLAIM_USER_DETAILS}
        component={ClaimUserDetails}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MOTOR_DOCUMENT_UPLOAD}
        component={MotorDocumentUpload}
      />
      <Stack.Screen
        name={SCREEN_NAMES.CLAIM_PREVIEW}
        component={ClaimPreview}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
