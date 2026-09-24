import { StyleSheet } from 'react-native';
import { verticalScale } from '@constants/metrics';
import { getBottomMargin } from '@utils/paddingBottom';

export const Style = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      gap: verticalScale(20),
      padding: verticalScale(20),
      paddingBottom: getBottomMargin(),
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(16),
      marginHorizontal: verticalScale(16),
      marginBottom: verticalScale(16),
    },
    backIcon: {
      width: verticalScale(20),
      height: verticalScale(20),
      backgroundColor: theme.colors.text,
      borderRadius: verticalScale(10),
    },
    backText: {
      color: theme.colors.textSecondary,
      fontSize: verticalScale(14),
      fontWeight: '500',
    },
    mainCard: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(16),
    },
    mainCardTitle: {
      fontSize: verticalScale(20),
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: verticalScale(16),
    },
    card: {
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: verticalScale(10),
      padding: verticalScale(16),
    },
    pricingCard: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    cardTitle: {
      fontSize: verticalScale(18),
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    detailsContainer: {
      marginTop: verticalScale(8),
    },
    detailsGrid: {
      flexDirection: 'row',
      marginBottom: verticalScale(12),
      gap: verticalScale(8),
    },
    detailColumn: {
      flex: 1,
    },
    infoRow: {
      marginBottom: verticalScale(8),
    },
    infoLabel: {
      fontSize: verticalScale(14),
      color: theme.colors.primary,
      fontFamily: 'Lato-Regular',
    },
    infoValue: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Regular',
      color: theme.colors.description,
      textTransform: 'capitalize',
    },
    policyInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(12),
    },
    policyInfoLabel: {
      fontSize: verticalScale(14),
      fontWeight: '600',
    },
    policyInfoValue: {
      fontSize: verticalScale(14),
      fontWeight: '600',
    },
    memberSection: {
      paddingVertical: verticalScale(12),
    },
    memberSectionBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderStyle: 'dashed',
      marginTop: verticalScale(12),
    },
    documentsContainer: {
      gap: verticalScale(16),
    },
    documentsTitle: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.cardBg,
      marginVertical: verticalScale(12),
    },
    benefitItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: verticalScale(8),
      paddingHorizontal: verticalScale(8),
    },
    benefitIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: verticalScale(8),
    },
    benefitName: {
      fontSize: verticalScale(14),
      color: theme.colors.textTertiary,
      fontFamily: 'Lato-Regular',
      flex: 1,
    },
    benefitValue: {
      fontSize: verticalScale(14),
      color: theme.colors.text,
      fontFamily: 'Lato-Regular',
    },
    noBenefitsText: {
      fontSize: verticalScale(16),
      fontWeight: '500',
      color: theme.colors.text,

      textAlign: 'center',
      paddingVertical: verticalScale(16),
    },
    pricingContainer: {
      marginTop: verticalScale(8),
    },
    contactPriceText: {
      fontSize: verticalScale(16),
      fontWeight: '600',
      color: theme.colors.border,
      marginVertical: verticalScale(8),
    },
    totalSection: {
      backgroundColor: theme.colors.primary,
      marginHorizontal: verticalScale(-16),
      marginBottom: verticalScale(-16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(8),
      paddingHorizontal: verticalScale(16),
      borderBottomLeftRadius: verticalScale(10),
      borderBottomRightRadius: verticalScale(10),
    },
    termsCard: {
      backgroundColor: theme.colors.floorBgColor,
      borderRadius: verticalScale(20),
      padding: verticalScale(16),
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: verticalScale(16),
    },
    termsContainer: {
      gap: verticalScale(16),
    },
    termsText: {
      fontSize: verticalScale(14),
      fontWeight: '500',
      color: theme.colors.border,
      lineHeight: verticalScale(20),
    },
    termsLink: {
      color: theme.colors.primary,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },

    // Sign Document
    signDocumentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: verticalScale(8),
      paddingVertical: verticalScale(8),
    },
    signDocumentText: {
      fontSize: verticalScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.primary,
    },
    promoContainer: {
      gap: verticalScale(12),
      paddingTop: verticalScale(8),
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: verticalScale(8),
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(12),
      fontSize: verticalScale(14),
      color: theme.colors.text,

      backgroundColor: theme.colors.backgroundColor,
    },
    loaderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
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
      fontSize: verticalScale(20),
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: verticalScale(14),
      color: theme.colors.description,
      marginBottom: verticalScale(16),
      textAlign: 'center',
    },
  });
