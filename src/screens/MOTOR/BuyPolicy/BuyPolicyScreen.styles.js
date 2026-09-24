import { getBottomMargin } from '@utils/paddingBottom';

const { verticalScale, moderateScale } = require('@constants/metrics');
const { StyleSheet } = require('react-native');

export const style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme?.colors?.backgroundColor,
    },
    scrollView: {
      flexGrow: 1,
      padding: verticalScale(20),
      gap: verticalScale(20),
      paddingBottom: getBottomMargin(),
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(16),
      marginHorizontal: moderateScale(16),
      marginBottom: verticalScale(16),
    },
    backIcon: {
      width: moderateScale(20),
      height: moderateScale(20),
      backgroundColor: theme.colors.text,
      borderRadius: moderateScale(10),
    },
    backText: {
      marginLeft: moderateScale(8),
      fontSize: moderateScale(16),
      color: theme.colors.text,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: moderateScale(16),
    },
    detailsBox: {
      gap: verticalScale(10),
    },
    detailsTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    detailRow: { flexDirection: 'row' },
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
    mainContent: {
      flex: 1,
    },
    mainCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(20),
      marginBottom: verticalScale(16),
      gap: verticalScale(16),
    },
    mainCardTitle: {
      fontSize: moderateScale(20),
      fontWeight: '600',
      color: theme.colors.text,
    },
    sectionCard: {
      backgroundColor: theme.colors.border + '20',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(3),
    },
    sectionHeader: {
      padding: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    sectionContent: {
      padding: verticalScale(16),
    },
    twoColumnContainer: {
      gap: verticalScale(5),
    },
    column: {
      flex: 1,
      paddingRight: moderateScale(16),
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: verticalScale(12),
    },
    infoLabel: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      flex: 1,
    },
    infoValue: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.text,
      flex: 1,
    },
    valueContainer: {
      marginBottom: verticalScale(12),
    },
    valueLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoIcon: {
      width: verticalScale(18),
      height: verticalScale(18),
      marginLeft: verticalScale(4),
      tintColor: theme.colors.primary,
    },
    kycContainer: {
      gap: verticalScale(20),
    },
    kycField: {
      gap: verticalScale(8),
    },
    kycLabel: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
    },
    kycValue: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    radioGroup: {
      flexDirection: 'row',
      gap: moderateScale(16),
      marginTop: verticalScale(8),
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    radioCircle: {
      width: verticalScale(20),
      height: verticalScale(20),
      borderRadius: verticalScale(10),
      borderWidth: verticalScale(2),
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: theme.colors.primary,
    },
    radioInner: {
      width: verticalScale(10),
      height: verticalScale(10),
      borderRadius: verticalScale(5),
      backgroundColor: theme.colors.primary,
    },
    radioLabel: {
      fontSize: moderateScale(13),
      color: theme.colors.text,
    },
    radioDisabled: {
      opacity: 0.5,
    },
    radioLabelDisabled: {
      color: theme.colors.description,
    },
    inputContainer: {
      marginBottom: verticalScale(16),
    },
    inputLabel: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(4),
      padding: verticalScale(12),
      fontSize: moderateScale(14),
      backgroundColor: theme.colors.backgroundColor,
      color: theme.colors.text,
    },
    textInputError: {
      borderColor: theme.colors.red,
    },
    dropdown: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: verticalScale(4),
      backgroundColor: theme.colors.backgroundColor,
      minHeight: verticalScale(50),
    },
    dropdownError: {
      borderColor: theme.colors.red,
    },
    dropdownContainer: {
      borderColor: theme.colors.border,
      borderRadius: verticalScale(4),
      backgroundColor: theme.colors.backgroundColor,
    },
    dropdownText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    dropdownPlaceholder: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
    },
    selectedItemContainer: {
      backgroundColor: theme.colors.border + '20',
    },
    selectedItemLabel: {
      fontWeight: '500',
    },
    arrowIcon: {
      width: moderateScale(20),
      height: moderateScale(20),
    },
    tickIcon: {
      width: moderateScale(20),
      height: moderateScale(20),
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.red,
      marginTop: verticalScale(4),
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: verticalScale(16),
      borderRadius: verticalScale(10),
      alignItems: 'center',
      marginTop: verticalScale(16),
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: theme.colors.textSecondary,
      fontSize: moderateScale(16),
      fontWeight: '700',
    },
    documentsCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(20),
      marginBottom: verticalScale(16),
    },
    documentsTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: verticalScale(16),
      paddingBottom: verticalScale(16),
      borderBottomWidth: verticalScale(1),
      borderBottomColor: theme.colors.border,
    },
    documentsDescription: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      lineHeight: verticalScale(20),
    },
    documentsNotice: {
      backgroundColor: theme.colors.border + '60',
      padding: verticalScale(16),
      borderRadius: verticalScale(4),
    },
    documentsNoticeText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      lineHeight: verticalScale(18),
    },
    carSelectorContainer: {},
    documentsListContainer: {
      gap: verticalScale(12),
    },
    documentsListTitle: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.primary,
    },
    documentsList: {
      gap: verticalScale(5),
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: moderateScale(8),
    },
    documentBullet: {
      fontSize: moderateScale(16),
      color: theme.colors.description,
      fontWeight: '700',
    },
    documentText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      fontWeight: '700',
      flex: 1,
      lineHeight: verticalScale(20),
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.modalOverlay,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      margin: 20,
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: 20,
      padding: 20,
    },
    modalCloseButton: {
      alignSelf: 'flex-end',
      marginBottom: verticalScale(10),
    },
    modalTitle: {
      fontSize: moderateScale(20),
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      marginBottom: verticalScale(16),
      textAlign: 'center',
    },
  });

export const policyCartStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
      paddingHorizontal: moderateScale(16),
    },
    scrollContainer: {
      padding: moderateScale(16),
      paddingBottom: verticalScale(32),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    loadingText: {
      marginTop: verticalScale(16),
      fontSize: moderateScale(16),
      color: theme.colors.primary,
      fontWeight: '500',
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(10),
      padding: moderateScale(16),
      marginBottom: verticalScale(16),
    },
    pricingCard: {
      borderWidth: moderateScale(1),
      borderColor: theme.colors.primary,
    },
    cardTitle: {
      fontSize: moderateScale(18),
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: verticalScale(16),
    },
    detailsContainer: { gap: verticalScale(8) },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
    },
    infoValue: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      textTransform: 'uppercase',
      color: theme.colors.primary,
    },
    divider: {
      height: verticalScale(1),
      backgroundColor: theme.colors.border,
      marginVertical: verticalScale(16),
    },
    featureItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: verticalScale(4),
      marginBottom: verticalScale(8),
      marginHorizontal: verticalScale(20),
    },
    featureTitle: { flex: 1, paddingRight: moderateScale(16) },
    featureTitleText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      textTransform: 'capitalize',
    },
    featureAmount: {
      fontSize: moderateScale(14),
      fontWeight: '400',
      color: theme.colors.primary,
    },
    pricingContainer: {
      gap: verticalScale(8),
      marginBottom: verticalScale(16),
    },
    totalSection: {
      backgroundColor: theme.colors.primary,
      marginHorizontal: -moderateScale(16),
      marginBottom: -verticalScale(16),
      padding: moderateScale(16),
      borderBottomLeftRadius: moderateScale(10),
      borderBottomRightRadius: moderateScale(10),
    },
    termsCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: moderateScale(1),
      borderColor: theme.colors.primary,
      borderRadius: moderateScale(20),
      padding: moderateScale(16),
      marginBottom: verticalScale(16),
    },
    termsText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: theme.colors.description,
      lineHeight: verticalScale(20),
    },
    termsLink: { color: theme.colors.primary, fontWeight: '600' },
    paymentButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(16),
    },
    paymentButton: {
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: moderateScale(12),
      borderRadius: moderateScale(8),
    },
    disabledButton: {
      opacity: 0.5,
      backgroundColor: theme.colors.border,
    },
    textSecondary: {
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginHorizontal: moderateScale(8),
    },
    promoCodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(8),
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: moderateScale(5),
      padding: moderateScale(8),
      marginRight: moderateScale(8),
      color: theme.colors.text,
    },
    textInputError: { borderColor: theme.colors.red },
    applyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      padding: moderateScale(10),
      borderRadius: moderateScale(5),
    },
    applyButtonText: {
      color: theme.colors.textSecondary,
      marginRight: moderateScale(4),
    },
    termsContainer: {
      alignItems: 'center',
      marginTop: verticalScale(8),
      gap: verticalScale(15),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButton: { backgroundColor: theme.colors.border },
    cancelButtonText: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: moderateScale(14),
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: verticalScale(16),
    },
  });

export const documentStyles = theme =>
  StyleSheet.create({
    docsContainer: {
      padding: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      gap: verticalScale(15),
    },
    docsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    docsTitle: {
      fontSize: verticalScale(16),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
    },
    typeSelectionContainer: {
      flexDirection: 'row',
      gap: verticalScale(10),
    },
    vehicleTypeContainer: {
      flex: 1,
      gap: verticalScale(10),
    },
    documentTypeContainer: {
      flex: 1,
      gap: verticalScale(10),
    },
    uploadSection: {
      gap: verticalScale(15),
    },
    documentContainer: {
      padding: verticalScale(15),
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(10),
      gap: verticalScale(12),
    },
    documentUploadContainer: {
      gap: verticalScale(10),
    },
    documentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    documentTitle: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
      marginBottom: verticalScale(10),
    },
    uploadButton: {
      borderRadius: verticalScale(7),
      borderWidth: 2,
      borderStyle: 'dashed',
      height: verticalScale(120),
      justifyContent: 'center',
      borderColor: theme.colors.border, // Added default, dynamic in component
      backgroundColor: theme.colors.backgroundColor, // Added default
    },
    uploadButtonText: {
      position: 'absolute',
      top: -verticalScale(10),
      left: verticalScale(10),
      backgroundColor: theme.colors.backgroundColor,
      paddingHorizontal: verticalScale(5),
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      color: theme.colors.textTertiary, // Added default
    },
    uploadContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: verticalScale(10),
    },
    uploadTextContainer: {
      alignItems: 'center',
      gap: verticalScale(5),
    },
    uploadDescription: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    browseText: {
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    fileFormatInfo: {
      fontFamily: 'Lato-Regular',
      fontSize: verticalScale(12),
      color: theme.colors.description,
    },
    fileCount: {
      position: 'absolute',
      top: verticalScale(10),
      right: verticalScale(10),
      fontSize: verticalScale(12),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
    },
    uploadedFilesContainer: {
      gap: verticalScale(10),
      marginTop: verticalScale(5),
      flexDirection: 'row',
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: verticalScale(10),
      padding: verticalScale(10),
      backgroundColor: theme.colors.bgSecondary,
      borderRadius: verticalScale(8),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    fileName: {
      flex: 1,
      fontSize: verticalScale(12),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    uploadActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: verticalScale(5),
    },
    scanButton: {
      paddingHorizontal: verticalScale(10),
      paddingVertical: verticalScale(10),
      backgroundColor: theme.colors.primary,
      borderRadius: verticalScale(20),
      alignItems: 'center',
    },
    validationError: {
      color: theme.colors.red,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Regular',
      marginLeft: verticalScale(5),
    },
    scanAllButton: {
      alignSelf: 'flex-end',
      paddingHorizontal: verticalScale(20),
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.primary,
      borderRadius: verticalScale(5),
      marginTop: verticalScale(10),
    },
    scanAllButtonText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
    },
    statusIndicator: {
      position: 'absolute',
      bottom: verticalScale(0),
      right: verticalScale(0),
      paddingHorizontal: verticalScale(8),
      paddingVertical: verticalScale(4),
      borderRadius: verticalScale(8),
    },
    statusText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    imagePreviewContainer: {
      alignItems: 'center',
    },
    imagePreview: {
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: verticalScale(8),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statusBadge: {
      // Kept for compatibility if user doesn't update component immediately
      paddingHorizontal: moderateScale(8),
      paddingVertical: verticalScale(4),
      borderRadius: moderateScale(4),
      overflow: 'hidden',
    },
  });
