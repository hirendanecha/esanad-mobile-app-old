// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Linking,
//   FlatList,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { moderateScale, verticalScale } from '@constants/metrics';
// import { useThemeContext } from '@theme/ThemeProvider';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Header from '@components/ui/Header';
// import dayjs from 'dayjs';
// import { formatNumber } from '@utils/formateNumber';
// import { useGetMotorPolicyDetails } from '@hooks/profile/usePolicyProfile';
// import LinearGradient from 'react-native-linear-gradient';
// import OrDivider from '@components/ui/OrDivider';
// import { env } from '@config/index';
// import moment from 'moment';
// import CustomButton from '@components/ui/CustomButton';

// const MotorPolicyDetails = ({ route }) => {
//   const navigation = useNavigation();
//   const { theme } = useThemeContext();
//   const styles = getStyles(theme);
//   const { policyId, data } = route.params;
//   const { data: getPolicyDetails } = useGetMotorPolicyDetails({ id: policyId });
//   const [activeTab, setActiveTab] = useState(0);

// //   console.log('Motor Policy Details:', policyId, getPolicyDetails, data = {
// //     "_id": "6985982fa6f4003583f3d95b",
// //     "EID": "784-1996-3628047-5",
// //     "InsuredName": "MAHA AHMAD MOHD ABDULLA ALMULLA",
// //     "Email": "",
// //     "Mobile": "",
// //     "DateOfBirth": null,
// //     "Nationality": "UNITED ARAB EMIRATES",
// //     "Source": "Ahmed",
// //     "InsuranceCompany": "Insurance House Non-Agency Comp.",
// //     "Products": "Comp",
// //     "DateOfIssue": "2025-11-11T18:30:00.000Z",
// //     "StartDate": "2025-11-11T18:30:00.000Z",
// //     "ExpiryDate": "2026-12-11T18:30:00.000Z",
// //     "DueDate": "2025-11-11T18:30:00.000Z",
// //     "PolicyNo": "DP/01/1001/25/28974",
// //     "RepairType": "Non Agency",
// //     "BasePremium": "1991.59",
// //     "RoadAssistance": "",
// //     "PolicyFee": "",
// //     "VatPrecentage": "5",
// //     "VehicleMake": "LANDROVER",
// //     "VehicleModel": "RANGE ROVER SPORT, 4WD, 8 Cyl, 5 Passengers ",
// //     "BodyType": "4WD",
// //     "YearofManufacture": "2017",
// //     "UserofVehicle": "",
// //     "VehicleValue": "",
// //     "CommissionPercentage": "15",
// //     "CommissionAmount": "298.7385",
// //     "InsCoPreceiptNo": "DP/01/1001/25/28974",
// //     "RVAmount": "2091.1695",
// //     "TAXInvoice": "DP/01/1001/25/28974",
// //     "CommissionInvoices": "CN-UW-AD-202561455-25",
// //     "Category": "Individual",
// //     "SeatingCapacity": "5",
// //     "Color": "BLACK",
// //     "ChassisNumber": "SALWA2FV0HA678655",
// //     "EngineNumber": "17022808352309PS",
// //     "createdAt": "2026-02-06T07:28:47.867Z",
// //     "updatedAt": "2026-02-09T13:15:30.286Z",
// //     "userId": "6615bbd01e1bcd02b3c27521"
// // });

//   const openPdf = async () => {
//     try {
//       const pdfPath = getPolicyDetails?.policyFile?.path;
//       if (!pdfPath) return;

//       const canOpen = await Linking.canOpenURL(pdfPath);
//       if (canOpen) {
//         await Linking.openURL(pdfPath);
//       }
//     } catch (e) {
//       console.log('PDF Error:', e);
//     }
//   };

//   const DetailRow = ({ label, value }) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabels}>{label}</Text>
//       <Text style={styles.detailValues}>{value}</Text>
//     </View>
//   );

//   const overviewList = [
//     {
//       id: 'effectiveDate',
//       label: 'Effective Date:',
//       value: getPolicyDetails?.policyEffectiveDate
//         ? dayjs(getPolicyDetails.policyEffectiveDate).format('DD/MM/YYYY')
//         : '-',
//     },
//     {
//       id: 'company',
//       label: 'Insurance Company:',
//       value: getPolicyDetails?.quoteId?.company?.companyName || '-',
//     },
//     {
//       id: 'insuranceType',
//       label: 'Current Insurance Type:',
//       value:
//         getPolicyDetails?.quoteId?.insuranceType === 'comprehensive'
//           ? 'Comprehensive'
//           : getPolicyDetails?.quoteId?.insuranceType === 'thirdparty'
//           ? 'Third Party'
//           : '-',
//     },
//     {
//       id: 'emirate',
//       label: 'Emirates:',
//       value:
//         getPolicyDetails?.carId?.emirate ||
//         getPolicyDetails?.carId?.registrationEmirate ||
//         '-',
//     },
//     {
//       id: 'nationality',
//       label: 'Nationality:',
//       value: getPolicyDetails?.userId?.nationality || '-',
//     },
//     {
//       id: 'excess',
//       label: 'Excess:',
//       value: getPolicyDetails?.quoteId?.excessPrice
//         ? `AED ${getPolicyDetails.quoteId.excessPrice}`
//         : '-',
//     },
//     {
//       id: 'refNo',
//       label: 'Policy Number:',
//       value: getPolicyDetails?.policyNumber || '-',
//     },
//     {
//       id: 'value',
//       label: 'Insured declared value',
//       value: `AED ${formatNumber(
//         getPolicyDetails?.quoteId?.carValue ||
//           getPolicyDetails?.quoteId?.response?.Offers?.[0]?.MaximumCarValue ||
//           0,
//       )}`,
//     },
//   ];

//   const carDetailsList = [
//     {
//       id: 'brand',
//       label: 'Brand:',
//       value: getPolicyDetails?.carId?.make || '-',
//     },
//     {
//       id: 'model',
//       label: 'Model:',
//       value: getPolicyDetails?.carId?.model || '-',
//     },
//     {
//       id: 'year',
//       label: 'Year:',
//       value: getPolicyDetails?.carId?.year || '-',
//     },
//     {
//       id: 'seats',
//       label: 'No. of Seat:',
//       value: getPolicyDetails?.carId?.noOfPassengers || '-',
//     },
//     {
//       id: 'doors',
//       label: 'No. of Doors:',
//       value: getPolicyDetails?.carId?.noOfDoors || '-',
//     },
//     {
//       id: 'cylinders',
//       label: 'Cylinders:',
//       value: getPolicyDetails?.carId?.cylinders || '-',
//     },
//     {
//       id: 'value',
//       label: 'Value:',
//       value: getPolicyDetails?.carId?.originalPrice
//         ? `${getPolicyDetails.carId.originalPrice} AED`
//         : '-',
//     },
//     {
//       id: 'trim',
//       label: 'Trim:',
//       value: getPolicyDetails?.carId?.trim || '-',
//     },
//     {
//       id: 'chassis',
//       label: 'Chassis No:',
//       value:
//         getPolicyDetails?.carId?.chassisNumber ||
//         getPolicyDetails?.carId?.chesisNo ||
//         '-',
//     },
//     {
//       id: 'regionalSpec',
//       label: 'Regional Spec:',
//       value: getPolicyDetails?.carId?.regionalSpec || '-',
//     },
//     {
//       id: 'tcNo',
//       label: 'Reg. Card TC No:',
//       value: getPolicyDetails?.carId?.tcNo || '-',
//     },
//     {
//       id: 'bodyType',
//       label: 'Body Type:',
//       value: getPolicyDetails?.carId?.bodyType || '-',
//     },
//     {
//       id: 'regDate',
//       label: 'Car Reg. Date:',
//       value: getPolicyDetails?.carId?.dateOfFirstRegister
//         ? dayjs(getPolicyDetails.carId.dateOfFirstRegister).format('DD/MM/YYYY')
//         : '-',
//     },
//     {
//       id: 'expiryDate',
//       label: 'Reg. Card Expiry:',
//       value: getPolicyDetails?.carId?.regCardExpiryDate
//         ? dayjs(getPolicyDetails.carId.regCardExpiryDate).format('DD/MM/YYYY')
//         : '-',
//     },
//   ];

//   const holderDetailsList = [
//     {
//       id: 'name',
//       label: 'Name:',
//       value: getPolicyDetails?.userId?.fullName || '-',
//     },
//     {
//       id: 'mobile',
//       label: 'Mobile:',
//       value: getPolicyDetails?.userId?.mobileNumber
//         ? `+${getPolicyDetails?.userId?.countryCode || '971'} ${
//             getPolicyDetails?.userId?.mobileNumber
//           }`
//         : '-',
//     },
//     {
//       id: 'email',
//       label: 'Email:',
//       value: getPolicyDetails?.userId?.email || '-',
//     },
//     {
//       id: 'dob',
//       label: 'Date of Birth:',
//       value: getPolicyDetails?.userId?.dateOfBirth
//         ? dayjs(getPolicyDetails.userId.dateOfBirth).format('DD/MM/YYYY')
//         : '-',
//     },
//     {
//       id: 'age',
//       label: 'Age:',
//       value: getPolicyDetails?.userId?.age || '-',
//     },
//     {
//       id: 'nationality',
//       label: 'Nationality:',
//       value: getPolicyDetails?.userId?.nationality || '-',
//     },
//     {
//       id: 'policyDate',
//       label: 'Policy Issue Date:',
//       value: getPolicyDetails?.policyEffectiveDate
//         ? dayjs(getPolicyDetails.policyEffectiveDate).format('DD/MM/YYYY')
//         : '-',
//     },
//     {
//       id: 'carValue',
//       label: 'Car Value:',
//       value: getPolicyDetails?.quoteId?.carValue
//         ? `${formatNumber(getPolicyDetails.quoteId.carValue)} AED`
//         : '-',
//     },
//     {
//       id: 'noClaim',
//       label: 'Year of No. Claim:',
//       value: getPolicyDetails?.carId?.yearOfNoClaim || '-',
//     },
//   ];

//   const renderCoverageItem = ({ item }) => (
//     <View style={styles.coverageItem}>
//       <View style={styles.coverageIconContainer}>
//         <Icon
//           name="local-offer"
//           size={moderateScale(24)}
//           color={theme.colors.primary}
//         />
//       </View>

//       <View style={styles.coverageContent}>
//         <Text style={styles.coverageTitle}>{item?.Title || '-'}</Text>
//         <Text style={styles.coverageDescription}>
//           {item?.coverageDetail?.description || '-'}
//         </Text>
//       </View>
//     </View>
//   );

//   const renderBenefitItem = ({ item }) => (
//     <View style={styles.coverageItem}>
//       <View style={styles.coverageIconContainer}>
//         <Icon
//           name="check-circle"
//           size={moderateScale(24)}
//           color={theme.colors.primary}
//         />
//       </View>

//       <View style={styles.coverageContent}>
//         <Text style={styles.coverageTitle}>{item?.Title || '-'}</Text>
//         <Text style={styles.coveragePrice}>
//           (AED {formatNumber(item?.Amount || 0)})
//         </Text>

//         <Text style={styles.coverageDescription}>
//           {item?.benifitDetail?.description || '-'}
//         </Text>
//       </View>
//     </View>
//   );

//   const renderAddOnItem = ({ item }) => (
//     <View style={styles.coverageItem}>
//       <View style={styles.coverageIconContainer}>
//         <Icon
//           name="add-circle"
//           size={moderateScale(24)}
//           color={theme.colors.primary}
//         />
//       </View>

//       <View style={styles.coverageContent}>
//         <Text style={styles.coverageTitle}>{item?.productName || '-'}</Text>

//         <Text style={styles.coveragePrice}>
//           (AED {formatNumber(item?.price || 0)})
//         </Text>

//         <Text style={styles.coverageDescription}>
//           {item?.description || '-'}
//         </Text>
//       </View>
//     </View>
//   );

//   const renderOverviewTab = () => (
//     <View style={styles.tabContent}>
//       <View style={styles.detailsBox}>
//         <Text style={styles.detailsTitle}>Current policy</Text>
//         {overviewList.map(({ label, value }, index) => (
//           <View key={index} style={styles.detailRow}>
//             <Text style={styles.detailLabel}> {label} </Text>
//             <Text style={styles.detailValue}>{value ?? '-'}</Text>
//           </View>
//         ))}
//       </View>

//       <OrDivider simple />

//       <View style={styles.detailsBox}>
//         <Text style={styles.detailsTitle}>Car details</Text>
//         {carDetailsList.map(({ label, value }, index) => (
//           <View key={index} style={styles.detailRow}>
//             <Text style={styles.detailLabel}> {label} </Text>
//             <Text style={styles.detailValue}>{value ?? '-'}</Text>
//           </View>
//         ))}
//       </View>

//       <OrDivider simple />

//       <View style={styles.detailsBox}>
//         <Text style={styles.detailsTitle}>Policy holder details</Text>
//         {holderDetailsList.map(({ label, value }, index) => (
//           <View key={index} style={styles.detailRow}>
//             <Text style={styles.detailLabel}> {label} </Text>
//             <Text style={styles.detailValue}>{value ?? '-'}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );

//   const renderCoveragesTab = () => (
//     <View style={styles.tabContent}>
//       <FlatList
//         data={getPolicyDetails?.quoteId?.response?.IncludedFeatures || []}
//         renderItem={renderCoverageItem}
//         keyExtractor={(item, index) => `coverage-${index}`}
//         scrollEnabled={false}
//         ListEmptyComponent={
//           <Text style={styles.noDataText}>No coverages available</Text>
//         }
//       />

//       {getPolicyDetails?.quoteId?.extraFeatures?.length > 0 && (
//         <FlatList
//           data={getPolicyDetails?.quoteId?.extraFeatures || []}
//           renderItem={renderBenefitItem}
//           keyExtractor={(item, index) => `benefit-${index}`}
//           scrollEnabled={false}
//         />
//       )}
//     </View>
//   );

//   const renderAddOnTab = () => (
//     <View style={styles.tabContent}>
//       <FlatList
//         data={getPolicyDetails?.quoteId?.addOns || []}
//         renderItem={renderAddOnItem}
//         keyExtractor={(item, index) => `addon-${index}`}
//         scrollEnabled={false}
//         ListEmptyComponent={
//           <Text style={styles.noDataText}>No Add-Ons purchased</Text>
//         }
//       />
//     </View>
//   );

//   const renderDocumentsTab = () => {
//     const docs = [
//       {
//         title: 'Policy Schedule',
//         file: getPolicyDetails?.policyFile?.path,
//         isLink: true,
//       },
//       { title: 'Tax Invoice', file: getPolicyDetails?.taxInvoiceFile?.path },
//       { title: 'Credit Note', file: getPolicyDetails?.creditNoteFile?.path },
//       {
//         title: 'Payment Receipt',
//         file: getPolicyDetails?.paymentReceipt?.path,
//       },
//       {
//         title: 'Proof of Payment',
//         file: getPolicyDetails?.proofOfPayment?.path,
//       },
//       {
//         title: 'Registration Card',
//         file:
//           getPolicyDetails?.carId?.registrationCard?.path ||
//           getPolicyDetails?.carId?.registrationCard,
//       },
//     ];

//     console.log(
//       'getPolicyDetails?.policyFile?.path',
//       getPolicyDetails?.policyFile?.path,
//     );

//     const availableDocs = docs.filter(doc => doc.file);

//     return (
//       <View style={styles.tabContent}>
//         {availableDocs.length > 0 ? (
//           availableDocs.map((doc, index) => (
//             <React.Fragment key={index}>
//               {index > 0 && <OrDivider simple />}
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={async () => {
//                   try {
//                     if (doc.isLink) {
//                       const url = `${doc.file}`;
//                       if (!url) return;
//                       Linking.openURL(url);
//                     } else {
//                       const url = `${env.API_URL}${doc.file}`;
//                       if (!url) return;
//                       Linking.openURL(url);
//                     }
//                   } catch (e) {
//                     console.log('Document Error:', e);
//                   }
//                 }}
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   paddingVertical: verticalScale(5),
//                 }}
//               >
//                 <View style={styles.pdfIconBox}>
//                   <Icon
//                     name={
//                       doc.title.includes('Receipt') ||
//                       doc.title.includes('Invoice')
//                         ? 'receipt-long'
//                         : 'description'
//                     }
//                     size={moderateScale(24)}
//                     color={theme.colors.primary}
//                   />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.pdfTitle}>{doc.title}</Text>
//                   <Text style={styles.pdfSubtitle}>PDF Document</Text>
//                 </View>
//                 <Icon
//                   name="file-download"
//                   size={moderateScale(24)}
//                   color={theme.colors.description}
//                 />
//               </TouchableOpacity>
//             </React.Fragment>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No documents available</Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <LinearGradient
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 2 }}
//       locations={[0.1, 0.2]}
//       colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
//       style={styles.safeArea}
//     >
//       <Header title="Motor Policy" onBack={() => navigation.goBack()} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.container}
//       >
//         <View style={styles.card}>
//           <View style={styles.rowBetween}>
//             <Image
//               source={{
//                 uri:
//                   env.API_URL + getPolicyDetails?.currentCompany?.logoImg?.path,
//               }}
//               resizeMode="contain"
//               style={{
//                 width: moderateScale(60),
//                 height: moderateScale(40),
//                 borderRadius: moderateScale(5),
//                 borderWidth: 1,
//                 borderColor: theme.colors.border,
//               }}
//             />

//             <View style={{ gap: verticalScale(5) }}>
//               <Text style={styles.company}>
//                 {getPolicyDetails?.quoteId?.company?.companyName || 'Company'}
//               </Text>

//               <View
//                 style={{
//                   gap: verticalScale(5),
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Text style={styles.title}>
//                   {`${getPolicyDetails?.carId?.make || ''} ${
//                     getPolicyDetails?.carId?.model || ''
//                   }`.trim() || 'Car Name'}
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: verticalScale(12),
//                     color: theme.colors.textTertiary,
//                     backgroundColor: `${theme.colors.border}90`,
//                     padding: verticalScale(3),
//                     borderRadius: verticalScale(5),
//                   }}
//                 >
//                   {getPolicyDetails?.quote?.insuranceType == 'comprehensive'
//                     ? 'Comprehensive'
//                     : 'Third Party'}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.detailsRow}>
//             <View style={[styles.detailColumn, styles.detailBorder]}>
//               <Text
//                 style={{
//                   fontSize: verticalScale(12),
//                   fontFamily: 'Lato-Regular',
//                   color: theme.colors.textTertiary,
//                 }}
//               >
//                 Start date
//               </Text>
//               <Text
//                 style={{
//                   fontSize: verticalScale(14),
//                   fontFamily: 'Lato-Bold',
//                   color: theme.colors.lableText,
//                 }}
//               >
//                 {moment(getPolicyDetails?.policyEffectiveDate).format(
//                   'DD/MM/YYYY',
//                 ) || '-'}
//               </Text>
//             </View>

//             <View style={[styles.detailColumn]}>
//               <Text
//                 style={{
//                   fontSize: verticalScale(12),
//                   fontFamily: 'Lato-Regular',
//                   color: theme.colors.textTertiary,
//                 }}
//               >
//                 End date
//               </Text>
//               <Text
//                 style={{
//                   fontSize: verticalScale(14),
//                   fontFamily: 'Lato-Bold',
//                   color: theme.colors.red,
//                 }}
//               >
//                 {moment(getPolicyDetails?.policyExpiryDate).format(
//                   'DD/MM/YYYY',
//                 ) || '-'}
//               </Text>
//             </View>
//           </View>

//           <View
//             style={[
//               {
//                 backgroundColor: theme.colors.bgSecondary,
//                 padding: verticalScale(10),
//                 gap: verticalScale(5),
//               },
//             ]}
//           >
//             <DetailRow
//               label="Policy holder:"
//               value={getPolicyDetails?.userId?.fullName || '-'}
//             />
//             <DetailRow
//               label="Insured declared value:"
//               value={`AED ${formatNumber(
//                 getPolicyDetails?.quoteId?.carValue ||
//                   getPolicyDetails?.quoteId?.response?.Offers?.[0]
//                     ?.MaximumCarValue ||
//                   0,
//               )}`}
//             />
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//             }}
//           >
//             {getPolicyDetails?.policyFile && (
//               <CustomButton
//                 title="Download Policy"
//                 onPress={openPdf}
//                 icon={
//                   <Icon
//                     name="file-download"
//                     size={moderateScale(20)}
//                     color={theme.colors.backgroundColor}
//                   />
//                 }
//                 textStyle={{
//                   fontFamily: 'Lato-Bold',
//                   fontSize: verticalScale(14),
//                 }}
//                 buttonStyle={{
//                   height: verticalScale(40),
//                   width: (Dimensions.get('screen').width - 60) / 2,
//                 }}
//               />
//             )}
//             {getPolicyDetails?.proofOfPayment && (
//               <CustomButton
//                 title="Proof of Payment"
//                 onPress={async () => {
//                   try {
//                     const pdfPath =
//                       env.API_URL + getPolicyDetails?.proofOfPayment?.path;
//                     if (!pdfPath) return;

//                     const canOpen = await Linking.canOpenURL(pdfPath);
//                     if (canOpen) {
//                       await Linking.openURL(pdfPath);
//                     }
//                   } catch (e) {
//                     console.log('PDF Error:', e);
//                   }
//                 }}
//                 type={'secondary'}
//                 icon={
//                   <Icon
//                     name="file-download"
//                     size={moderateScale(20)}
//                     color={theme.colors.primary}
//                   />
//                 }
//                 textStyle={{
//                   fontFamily: 'Lato-Bold',
//                   fontSize: verticalScale(14),
//                 }}
//                 buttonStyle={{
//                   height: verticalScale(40),
//                   width: (Dimensions.get('screen').width - 80) / 2,
//                 }}
//               />
//             )}
//           </View>
//         </View>

//         <View style={styles.tabSelector}>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.tabsList}
//             data={['Overview', 'Coverages', 'Add-ons', 'Documents']}
//             renderItem={({ item, index }) => (
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => setActiveTab(index)}
//                 style={[
//                   styles.tabSelectorButton,
//                   activeTab === index && styles.tabSelectorButtonActive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.tabSelectorText,
//                     activeTab === index && styles.tabSelectorTextActive,
//                   ]}
//                 >
//                   {item}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </View>

//         {activeTab === 0
//           ? renderOverviewTab()
//           : activeTab === 1
//           ? renderCoveragesTab()
//           : activeTab === 2
//           ? renderAddOnTab()
//           : renderDocumentsTab()}
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const getStyles = theme =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//     },
//     container: {
//       paddingBottom: verticalScale(40),
//     },
//     center: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingHorizontal: verticalScale(20),
//     },
//     card: {
//       backgroundColor: theme.colors.backgroundColor,
//       borderWidth: 1,
//       borderColor: theme.colors.border,
//       borderRadius: verticalScale(10),
//       padding: verticalScale(15),
//       gap: verticalScale(15),
//       margin: verticalScale(15),
//     },
//     row: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },
//     rowBetween: {
//       gap: verticalScale(10),
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     company: {
//       color: theme.colors.text,
//       fontSize: verticalScale(14),
//       fontFamily: 'Lato-Bold',
//     },
//     title: {
//       fontSize: verticalScale(14),
//       fontFamily: 'Lato-Regular',
//       textTransform: 'uppercase',
//       color: theme.colors.text,
//     },
//     dateWrapper: {
//       marginBottom: verticalScale(16),
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//     dateItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: verticalScale(12),
//     },
//     dateIcon: {
//       width: moderateScale(44),
//       height: moderateScale(44),
//       borderRadius: moderateScale(22),
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: verticalScale(12),
//     },
//     dateLabel: {
//       fontSize: moderateScale(14),
//       color: theme.colors.description,
//     },
//     dateValue: {
//       fontSize: moderateScale(16),
//       fontFamily: 'Lato-Bold',
//       color: theme.colors.text,
//     },
//     detailsBox: {
//       borderRadius: moderateScale(12),
//       marginBottom: verticalScale(12),
//       gap: verticalScale(5),
//     },
//     detailsTitle: {
//       fontSize: verticalScale(16),
//       fontFamily: 'Lato-Bold',
//       color: theme.colors.text,
//     },
//     detailRow: {
//       flexDirection: 'row',
//     },
//     detailLabels: {
//       flex: 1,
//       fontSize: verticalScale(12),
//       fontFamily: 'Lato-Regular',
//       color: theme.colors.textTertiary,
//     },
//     detailValues: {
//       flex: 1,
//       fontSize: verticalScale(14),
//       fontFamily: 'Lato-Bold',
//       color: theme.colors.text,
//     },
//     detailLabel: {
//       flex: 1,
//       fontSize: verticalScale(16),
//       fontFamily: 'Lato-Regular',
//       color: theme.colors.textTertiary,
//     },
//     detailValue: {
//       flex: 1,
//       fontSize: verticalScale(16),
//       fontFamily: 'Lato-Regular',
//       color: theme.colors.text,
//     },
//     pdfBtn: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       padding: moderateScale(16),
//       borderRadius: moderateScale(12),
//       borderWidth: 1,
//       borderColor: theme.colors.border,
//     },
//     pdfIconBox: {
//       width: moderateScale(44),
//       height: moderateScale(44),
//       borderRadius: moderateScale(12),
//       backgroundColor: theme.colors.bgSecondary,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: verticalScale(12),
//     },
//     pdfTitle: {
//       fontSize: moderateScale(16),
//       fontFamily: 'Lato-Bold',
//       color: theme.colors.text,
//     },
//     pdfSubtitle: {
//       fontSize: moderateScale(13),
//       color: theme.colors.description,
//     },
//     tab: {
//       alignItems: 'center',
//       backgroundColor: theme.colors.floorBgColor,
//       borderRadius: moderateScale(12),
//       paddingVertical: verticalScale(14),
//       marginBottom: verticalScale(10),
//     },
//     tabText: {
//       fontSize: verticalScale(16),
//       fontWeight: '600',
//       color: theme.colors.primary,
//     },
//     tabContent: {
//       backgroundColor: theme.colors.backgroundColor,
//       margin: verticalScale(20),
//       padding: verticalScale(10),
//       borderRadius: verticalScale(10),
//       borderWidth: 1,
//       borderColor: theme.colors.border,
//       gap: verticalScale(10),
//     },
//     tabSelector: {
//       height: verticalScale(45),
//       borderTopWidth: 1,
//       borderBottomWidth: 1,
//       borderColor: theme.colors.border,
//       backgroundColor: theme.colors.backgroundColor,
//     },
//     tabsList: {
//       flexGrow: 1,
//     },
//     tabSelectorButton: {
//       flex: 1,
//       paddingHorizontal: verticalScale(30),
//       borderBottomWidth: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       borderBottomColor: theme.colors.border,
//     },
//     tabSelectorButtonActive: {
//       borderBottomColor: theme.colors.primary,
//     },
//     tabSelectorText: {
//       fontSize: verticalScale(16),
//       color: theme.colors.textTertiary,
//       fontFamily: 'Lato-Bold',
//     },
//     tabSelectorTextActive: {
//       color: theme.colors.primary,
//     },
//     sectionTitle: {
//       fontSize: moderateScale(18),
//       fontWeight: '700',
//       color: theme.colors.primary,
//     },
//     detailsRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: verticalScale(10),
//     },
//     detailColumn: {
//       flex: 1,
//       gap: verticalScale(5),
//     },
//     detailBorder: {
//       borderRightWidth: 1,
//       borderRightColor: theme.colors.description,
//     },
//     coverageItem: {
//       flexDirection: 'row',
//       marginBottom: verticalScale(20),
//       paddingVertical: verticalScale(12),
//     },
//     coverageIconContainer: {
//       width: moderateScale(44),
//       height: moderateScale(44),
//       borderRadius: moderateScale(22),
//       backgroundColor: theme.colors.floorBgColor,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: verticalScale(12),
//     },
//     coverageContent: { flex: 1 },
//     coverageTitle: {
//       fontSize: moderateScale(16),
//       fontWeight: '600',
//       color: theme.colors.primary,
//       marginBottom: verticalScale(4),
//     },
//     coveragePrice: {
//       fontSize: moderateScale(14),
//       fontWeight: '500',
//       color: theme.colors.primary,
//       marginBottom: verticalScale(4),
//     },
//     coverageDescription: {
//       fontSize: moderateScale(14),
//       color: theme.colors.description,
//       lineHeight: moderateScale(20),
//     },
//     noDataText: {
//       fontSize: moderateScale(14),
//       color: theme.colors.description,
//       textAlign: 'center',
//       margin: verticalScale(20),
//     },
//     cancelButton: {
//       backgroundColor: theme.colors.red,
//       marginHorizontal: verticalScale(15),
//       paddingVertical: verticalScale(16),
//       borderRadius: moderateScale(12),
//       alignItems: 'center',
//       marginTop: verticalScale(10),
//       marginBottom: verticalScale(20),
//     },
//     cancelButtonText: {
//       color: theme.colors.textSecondary,
//       fontSize: moderateScale(16),
//       fontWeight: '600',
//     },
//   });

// export default MotorPolicyDetails;

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@components/ui/Header';
import dayjs from 'dayjs';
import { formatNumber } from '@utils/formateNumber';
import { useGetMotorPolicyDetails } from '@hooks/profile/usePolicyProfile';
import LinearGradient from 'react-native-linear-gradient';
import OrDivider from '@components/ui/OrDivider';
import { env } from '@config/index';
import moment from 'moment';
import CustomButton from '@components/ui/CustomButton';

const MotorPolicyDetails = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const { policyId, data } = route.params;
  const { data: getPolicyDetails } = useGetMotorPolicyDetails({ id: policyId });
  const [activeTab, setActiveTab] = useState(0);

  // Merge getPolicyDetails with fallback data
  const policyData = useMemo(() => {
    console.log(getPolicyDetails?.currentCompany == null);

    if (getPolicyDetails?.currentCompany !== null) {
      return getPolicyDetails;
    }

    // Map fallback data to expected structure
    if (data) {
      return {
        policyEffectiveDate: data.StartDate,
        policyExpiryDate: data.ExpiryDate,
        policyNumber: data.PolicyNo,
        currentCompany: {
          logoImg: { path: '' }, // You may need to handle company logo separately
        },
        quoteId: {
          company: {
            companyName: data.InsuranceCompany,
          },
          insuranceType:
            data.Products?.toLowerCase() === 'comp'
              ? 'comprehensive'
              : 'thirdparty',
          excessPrice: null,
          carValue: data.VehicleValue || null,
          response: {
            Offers: [
              {
                MaximumCarValue: data.VehicleValue || null,
              },
            ],
            IncludedFeatures: [],
          },
          extraFeatures: [],
          addOns: [],
        },
        carId: {
          make: data.VehicleMake,
          model: data.VehicleModel,
          year: data.YearofManufacture,
          emirate: null,
          registrationEmirate: null,
          noOfPassengers: data.SeatingCapacity,
          noOfDoors: null,
          cylinders: null,
          originalPrice: data.VehicleValue,
          trim: null,
          chassisNumber: data.ChassisNumber,
          chesisNo: data.ChassisNumber,
          regionalSpec: null,
          tcNo: data.EID,
          bodyType: data.BodyType,
          dateOfFirstRegister: null,
          regCardExpiryDate: null,
          yearOfNoClaim: null,
          registrationCard: null,
        },
        userId: {
          fullName: data.InsuredName,
          mobileNumber: data.Mobile,
          countryCode: '971',
          email: data.Email,
          dateOfBirth: data.DateOfBirth,
          age: null,
          nationality: data.Nationality,
        },
        policyFile: null,
        taxInvoiceFile: null,
        creditNoteFile: null,
        paymentReceipt: null,
        proofOfPayment: null,
      };
    }

    return null;
  }, [getPolicyDetails, data]);

  const openPdf = async () => {
    try {
      const pdfPath = policyData?.policyFile?.path;
      if (!pdfPath) return;

      const canOpen = await Linking.canOpenURL(pdfPath);
      if (canOpen) {
        await Linking.openURL(pdfPath);
      }
    } catch (e) {
      console.log('PDF Error:', e);
    }
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabels}>{label}</Text>
      <Text style={styles.detailValues}>{value}</Text>
    </View>
  );

  const overviewList = [
    {
      id: 'effectiveDate',
      label: 'Effective Date:',
      value: policyData?.policyEffectiveDate
        ? dayjs(policyData.policyEffectiveDate).format('DD/MM/YYYY')
        : '-',
    },
    {
      id: 'company',
      label: 'Insurance Company:',
      value: policyData?.quoteId?.company?.companyName || '-',
    },
    {
      id: 'insuranceType',
      label: 'Current Insurance Type:',
      value:
        policyData?.quoteId?.insuranceType === 'comprehensive'
          ? 'Comprehensive'
          : policyData?.quoteId?.insuranceType === 'thirdparty'
          ? 'Third Party'
          : '-',
    },
    {
      id: 'emirate',
      label: 'Emirates:',
      value:
        policyData?.carId?.emirate ||
        policyData?.carId?.registrationEmirate ||
        '-',
    },
    {
      id: 'nationality',
      label: 'Nationality:',
      value: policyData?.userId?.nationality || '-',
    },
    {
      id: 'excess',
      label: 'Excess:',
      value: policyData?.quoteId?.excessPrice
        ? `AED ${policyData.quoteId.excessPrice}`
        : '-',
    },
    {
      id: 'refNo',
      label: 'Policy Number:',
      value: policyData?.policyNumber || '-',
    },
    {
      id: 'value',
      label: 'Insured declared value',
      value: `AED ${formatNumber(
        policyData?.quoteId?.carValue ||
          policyData?.quoteId?.response?.Offers?.[0]?.MaximumCarValue ||
          0,
      )}`,
    },
  ];

  const carDetailsList = [
    {
      id: 'brand',
      label: 'Brand:',
      value: policyData?.carId?.make || '-',
    },
    {
      id: 'model',
      label: 'Model:',
      value: policyData?.carId?.model || '-',
    },
    {
      id: 'year',
      label: 'Year:',
      value: policyData?.carId?.year || '-',
    },
    {
      id: 'seats',
      label: 'No. of Seat:',
      value: policyData?.carId?.noOfPassengers || '-',
    },
    {
      id: 'doors',
      label: 'No. of Doors:',
      value: policyData?.carId?.noOfDoors || '-',
    },
    {
      id: 'cylinders',
      label: 'Cylinders:',
      value: policyData?.carId?.cylinders || '-',
    },
    {
      id: 'value',
      label: 'Value:',
      value: policyData?.carId?.originalPrice
        ? `${policyData.carId.originalPrice} AED`
        : '-',
    },
    {
      id: 'trim',
      label: 'Trim:',
      value: policyData?.carId?.trim || '-',
    },
    {
      id: 'chassis',
      label: 'Chassis No:',
      value:
        policyData?.carId?.chassisNumber || policyData?.carId?.chesisNo || '-',
    },
    {
      id: 'regionalSpec',
      label: 'Regional Spec:',
      value: policyData?.carId?.regionalSpec || '-',
    },
    {
      id: 'tcNo',
      label: 'Reg. Card TC No:',
      value: policyData?.carId?.tcNo || '-',
    },
    {
      id: 'bodyType',
      label: 'Body Type:',
      value: policyData?.carId?.bodyType || '-',
    },
    {
      id: 'regDate',
      label: 'Car Reg. Date:',
      value: policyData?.carId?.dateOfFirstRegister
        ? dayjs(policyData.carId.dateOfFirstRegister).format('DD/MM/YYYY')
        : '-',
    },
    {
      id: 'expiryDate',
      label: 'Reg. Card Expiry:',
      value: policyData?.carId?.regCardExpiryDate
        ? dayjs(policyData.carId.regCardExpiryDate).format('DD/MM/YYYY')
        : '-',
    },
  ];

  const holderDetailsList = [
    {
      id: 'name',
      label: 'Name:',
      value: policyData?.userId?.fullName || '-',
    },
    {
      id: 'mobile',
      label: 'Mobile:',
      value: policyData?.userId?.mobileNumber
        ? `+${policyData?.userId?.countryCode || '971'} ${
            policyData?.userId?.mobileNumber
          }`
        : '-',
    },
    {
      id: 'email',
      label: 'Email:',
      value: policyData?.userId?.email || '-',
    },
    {
      id: 'dob',
      label: 'Date of Birth:',
      value: policyData?.userId?.dateOfBirth
        ? dayjs(policyData.userId.dateOfBirth).format('DD/MM/YYYY')
        : '-',
    },
    {
      id: 'age',
      label: 'Age:',
      value: policyData?.userId?.age || '-',
    },
    {
      id: 'nationality',
      label: 'Nationality:',
      value: policyData?.userId?.nationality || '-',
    },
    {
      id: 'policyDate',
      label: 'Policy Issue Date:',
      value: policyData?.policyEffectiveDate
        ? dayjs(policyData.policyEffectiveDate).format('DD/MM/YYYY')
        : '-',
    },
    {
      id: 'carValue',
      label: 'Car Value:',
      value: policyData?.quoteId?.carValue
        ? `${formatNumber(policyData.quoteId.carValue)} AED`
        : '-',
    },
    {
      id: 'noClaim',
      label: 'Year of No. Claim:',
      value: policyData?.carId?.yearOfNoClaim || '-',
    },
  ];

  const renderCoverageItem = ({ item }) => (
    <View style={styles.coverageItem}>
      <View style={styles.coverageIconContainer}>
        <Icon
          name="local-offer"
          size={moderateScale(24)}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.coverageContent}>
        <Text style={styles.coverageTitle}>{item?.Title || '-'}</Text>
        <Text style={styles.coverageDescription}>
          {item?.coverageDetail?.description || '-'}
        </Text>
      </View>
    </View>
  );

  const renderBenefitItem = ({ item }) => (
    <View style={styles.coverageItem}>
      <View style={styles.coverageIconContainer}>
        <Icon
          name="check-circle"
          size={moderateScale(24)}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.coverageContent}>
        <Text style={styles.coverageTitle}>{item?.Title || '-'}</Text>
        <Text style={styles.coveragePrice}>
          (AED {formatNumber(item?.Amount || 0)})
        </Text>

        <Text style={styles.coverageDescription}>
          {item?.benifitDetail?.description || '-'}
        </Text>
      </View>
    </View>
  );

  const renderAddOnItem = ({ item }) => (
    <View style={styles.coverageItem}>
      <View style={styles.coverageIconContainer}>
        <Icon
          name="add-circle"
          size={moderateScale(24)}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.coverageContent}>
        <Text style={styles.coverageTitle}>{item?.productName || '-'}</Text>

        <Text style={styles.coveragePrice}>
          (AED {formatNumber(item?.price || 0)})
        </Text>

        <Text style={styles.coverageDescription}>
          {item?.description || '-'}
        </Text>
      </View>
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Current policy</Text>
        {overviewList.map(({ label, value }, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}> {label} </Text>
            <Text style={styles.detailValue}>{value ?? '-'}</Text>
          </View>
        ))}
      </View>

      <OrDivider simple />

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Car details</Text>
        {carDetailsList.map(({ label, value }, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}> {label} </Text>
            <Text style={styles.detailValue}>{value ?? '-'}</Text>
          </View>
        ))}
      </View>

      <OrDivider simple />

      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Policy holder details</Text>
        {holderDetailsList.map(({ label, value }, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}> {label} </Text>
            <Text style={styles.detailValue}>{value ?? '-'}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCoveragesTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={policyData?.quoteId?.response?.IncludedFeatures || []}
        renderItem={renderCoverageItem}
        keyExtractor={(item, index) => `coverage-${index}`}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No coverages available</Text>
        }
      />

      {policyData?.quoteId?.extraFeatures?.length > 0 && (
        <FlatList
          data={policyData?.quoteId?.extraFeatures || []}
          renderItem={renderBenefitItem}
          keyExtractor={(item, index) => `benefit-${index}`}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  const renderAddOnTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={policyData?.quoteId?.addOns || []}
        renderItem={renderAddOnItem}
        keyExtractor={(item, index) => `addon-${index}`}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No Add-Ons purchased</Text>
        }
      />
    </View>
  );

  const renderDocumentsTab = () => {
    const docs = [
      {
        title: 'Policy Schedule',
        file: policyData?.policyFile?.path,
        isLink: true,
      },
      { title: 'Tax Invoice', file: policyData?.taxInvoiceFile?.path },
      { title: 'Credit Note', file: policyData?.creditNoteFile?.path },
      {
        title: 'Payment Receipt',
        file: policyData?.paymentReceipt?.path,
      },
      {
        title: 'Proof of Payment',
        file: policyData?.proofOfPayment?.path,
      },
      {
        title: 'Registration Card',
        file:
          policyData?.carId?.registrationCard?.path ||
          policyData?.carId?.registrationCard,
      },
    ];

    const availableDocs = docs.filter(doc => doc.file);

    return (
      <View style={styles.tabContent}>
        {availableDocs.length > 0 ? (
          availableDocs.map((doc, index) => (
            <React.Fragment key={index}>
              {index > 0 && <OrDivider simple />}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  try {
                    if (doc.isLink) {
                      const url = `${doc.file}`;
                      if (!url) return;
                      Linking.openURL(url);
                    } else {
                      const url = `${env.API_URL}${doc.file}`;
                      if (!url) return;
                      Linking.openURL(url);
                    }
                  } catch (e) {
                    console.log('Document Error:', e);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: verticalScale(5),
                }}
              >
                <View style={styles.pdfIconBox}>
                  <Icon
                    name={
                      doc.title.includes('Receipt') ||
                      doc.title.includes('Invoice')
                        ? 'receipt-long'
                        : 'description'
                    }
                    size={moderateScale(24)}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pdfTitle}>{doc.title}</Text>
                  <Text style={styles.pdfSubtitle}>PDF Document</Text>
                </View>
                <Icon
                  name="file-download"
                  size={moderateScale(24)}
                  color={theme.colors.description}
                />
              </TouchableOpacity>
            </React.Fragment>
          ))
        ) : (
          <Text style={styles.noDataText}>No documents available</Text>
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
      style={styles.safeArea}
    >
      <Header title="Motor Policy" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Image
              source={{
                uri: env.API_URL + policyData?.currentCompany?.logoImg?.path,
              }}
              resizeMode="contain"
              style={{
                width: moderateScale(60),
                height: moderateScale(40),
                borderRadius: moderateScale(5),
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            />

            <View
              style={{
                gap: verticalScale(5),
                flex: 1,
              }}
            >
              <Text style={styles.company} numberOfLines={1}>
                {policyData?.quoteId?.company?.companyName || 'Company'}
              </Text>

              <View
                style={{
                  gap: verticalScale(5),
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      maxWidth: '40%',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {`${policyData?.carId?.make || ''} ${
                    policyData?.carId?.model || ''
                  }`.trim() || 'Car Name'}
                </Text>

                <Text
                  style={{
                    fontSize: verticalScale(12),
                    color: theme.colors.textTertiary,
                    backgroundColor: `${theme.colors.border}90`,
                    padding: verticalScale(3),
                    borderRadius: verticalScale(5),
                  }}
                >
                  {policyData?.quoteId?.insuranceType === 'comprehensive'
                    ? 'Comprehensive'
                    : 'Third Party'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={[styles.detailColumn, styles.detailBorder]}>
              <Text
                style={{
                  fontSize: verticalScale(12),
                  fontFamily: 'Lato-Regular',
                  color: theme.colors.textTertiary,
                }}
              >
                Start date
              </Text>
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.lableText,
                }}
              >
                {moment(policyData?.policyEffectiveDate).format('DD/MM/YYYY') ||
                  '-'}
              </Text>
            </View>

            <View style={[styles.detailColumn]}>
              <Text
                style={{
                  fontSize: verticalScale(12),
                  fontFamily: 'Lato-Regular',
                  color: theme.colors.textTertiary,
                }}
              >
                End date
              </Text>
              <Text
                style={{
                  fontSize: verticalScale(14),
                  fontFamily: 'Lato-Bold',
                  color: theme.colors.red,
                }}
              >
                {moment(policyData?.policyExpiryDate).format('DD/MM/YYYY') ||
                  '-'}
              </Text>
            </View>
          </View>

          <View
            style={[
              {
                backgroundColor: theme.colors.bgSecondary,
                padding: verticalScale(10),
                gap: verticalScale(5),
              },
            ]}
          >
            <DetailRow
              label="Policy holder:"
              value={policyData?.userId?.fullName || '-'}
            />
            <DetailRow
              label="Insured declared value:"
              value={`AED ${formatNumber(
                policyData?.quoteId?.carValue ||
                  policyData?.quoteId?.response?.Offers?.[0]?.MaximumCarValue ||
                  0,
              )}`}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {policyData?.policyFile && (
              <CustomButton
                title="Download Policy"
                onPress={openPdf}
                icon={
                  <Icon
                    name="file-download"
                    size={moderateScale(20)}
                    color={theme.colors.backgroundColor}
                  />
                }
                textStyle={{
                  fontFamily: 'Lato-Bold',
                  fontSize: verticalScale(14),
                }}
                buttonStyle={{
                  height: verticalScale(40),
                  width: (Dimensions.get('screen').width - 60) / 2,
                }}
              />
            )}
            {policyData?.proofOfPayment && (
              <CustomButton
                title="Proof of Payment"
                onPress={async () => {
                  try {
                    const pdfPath =
                      env.API_URL + policyData?.proofOfPayment?.path;
                    if (!pdfPath) return;

                    const canOpen = await Linking.canOpenURL(pdfPath);
                    if (canOpen) {
                      await Linking.openURL(pdfPath);
                    }
                  } catch (e) {
                    console.log('PDF Error:', e);
                  }
                }}
                type={'secondary'}
                icon={
                  <Icon
                    name="file-download"
                    size={moderateScale(20)}
                    color={theme.colors.primary}
                  />
                }
                textStyle={{
                  fontFamily: 'Lato-Bold',
                  fontSize: verticalScale(14),
                }}
                buttonStyle={{
                  height: verticalScale(40),
                  width: (Dimensions.get('screen').width - 80) / 2,
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.tabSelector}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
            data={['Overview', 'Coverages', 'Add-ons', 'Documents']}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTab(index)}
                style={[
                  styles.tabSelectorButton,
                  activeTab === index && styles.tabSelectorButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabSelectorText,
                    activeTab === index && styles.tabSelectorTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {activeTab === 0
          ? renderOverviewTab()
          : activeTab === 1
          ? renderCoveragesTab()
          : activeTab === 2
          ? renderAddOnTab()
          : renderDocumentsTab()}
      </ScrollView>
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingBottom: verticalScale(40),
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: verticalScale(20),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      padding: verticalScale(15),
      gap: verticalScale(15),
      margin: verticalScale(15),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowBetween: {
      gap: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    company: {
      color: theme.colors.text,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
    },
    title: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      textTransform: 'uppercase',
      color: theme.colors.text,
    },
    dateWrapper: {
      marginBottom: verticalScale(16),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(12),
    },
    dateIcon: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    dateLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
    },
    dateValue: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailsBox: {
      borderRadius: moderateScale(12),
      marginBottom: verticalScale(12),
      gap: verticalScale(5),
    },
    detailsTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailRow: {
      flexDirection: 'row',
    },
    detailLabels: {
      flex: 1,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    detailValues: {
      flex: 1,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailLabel: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary,
    },
    detailValue: {
      flex: 1,
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Regular',
      color: theme.colors.text,
    },
    pdfBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(16),
      borderRadius: moderateScale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pdfIconBox: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(12),
      backgroundColor: theme.colors.bgSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    pdfTitle: {
      fontSize: moderateScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    pdfSubtitle: {
      fontSize: moderateScale(13),
      color: theme.colors.description,
    },
    tab: {
      alignItems: 'center',
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(14),
      marginBottom: verticalScale(10),
    },
    tabText: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
    },
    tabContent: {
      backgroundColor: theme.colors.backgroundColor,
      margin: verticalScale(20),
      padding: verticalScale(10),
      borderRadius: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: verticalScale(10),
    },
    tabSelector: {
      height: verticalScale(45),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
    },
    tabsList: {
      flexGrow: 1,
    },
    tabSelectorButton: {
      flex: 1,
      paddingHorizontal: verticalScale(30),
      borderBottomWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: theme.colors.border,
    },
    tabSelectorButtonActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabSelectorText: {
      fontSize: verticalScale(16),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Bold',
    },
    tabSelectorTextActive: {
      color: theme.colors.primary,
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(10),
    },
    detailColumn: {
      flex: 1,
      gap: verticalScale(5),
    },
    detailBorder: {
      borderRightWidth: 1,
      borderRightColor: theme.colors.description,
    },
    coverageItem: {
      flexDirection: 'row',
      marginBottom: verticalScale(20),
      paddingVertical: verticalScale(12),
    },
    coverageIconContainer: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      backgroundColor: theme.colors.floorBgColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
    coverageContent: { flex: 1 },
    coverageTitle: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: verticalScale(4),
    },
    coveragePrice: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.primary,
      marginBottom: verticalScale(4),
    },
    coverageDescription: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      lineHeight: moderateScale(20),
    },
    noDataText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      textAlign: 'center',
      margin: verticalScale(20),
    },
    cancelButton: {
      backgroundColor: theme.colors.red,
      marginHorizontal: verticalScale(15),
      paddingVertical: verticalScale(16),
      borderRadius: moderateScale(12),
      alignItems: 'center',
      marginTop: verticalScale(10),
      marginBottom: verticalScale(20),
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
  });

export default MotorPolicyDetails;
