import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import SignatureCanvas from 'react-native-signature-canvas';
import Feather from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from '@constants/metrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { PDFDocument } from 'pdf-lib';
import { useThemeContext } from '@theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

// Polyfills for atob and btoa
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const atob = (input = '') => {
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 == 1) { throw new Error("'atob' failed: The string to be decoded is not correctly encoded."); }
  for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};
const btoa = (input = '') => {
  let str = input;
  let output = '';
  for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = '=', i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3/4);
    if (charCode > 0xFF) { throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."); }
    block = block << 8 | charCode;
  }
  return output;
};

const PDFSignatureComponent = ({ onClose, pdfUrl, onSubmit, healthInfo }) => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  const [loading, setLoading] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signature, setSignature] = useState(null);
  const [pdfWithSignatureUrl, setPdfWithSignatureUrl] = useState('');
  const [isSignatureAdded, setIsSignatureAdded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const signatureRef = useRef(null);

  // Load PDF when URL is available
  useEffect(() => {
    if (pdfUrl) {
      loadPdfDoc();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // Load PDF document
  const loadPdfDoc = async () => {
    try {
      setLoading(true);

      // Download PDF to local file
      const localFilePath = `${RNFS.DocumentDirectoryPath}/temp_pdf.pdf`;
      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: localFilePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        const pdfBase64 = await RNFS.readFile(localFilePath, 'base64');

        const binaryString = atob(pdfBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const doc = await PDFDocument.load(bytes);
        setPdfDoc(doc);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setLoading(false);
      Alert.alert('Error', 'Failed to load PDF document');
    }
  };

  // Handle signature confirmation
  const handleSignatureEnd = sig => {
    setSignature(sig);
    setShowSignaturePad(false);
  };

  // Clear signature
  const handleClearSignature = () => {
    setSignature(null);
    setIsSignatureAdded(false);
    setPdfWithSignatureUrl('');
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
  };

  // Embed signature into PDF
  const embedSignatureInPDF = async signatureDataUrl => {
    if (!pdfDoc) {
      Alert.alert('Error', 'PDF is not loaded.');
      return;
    }

    if (!signatureDataUrl || typeof signatureDataUrl !== 'string') {
      Alert.alert('Error', 'Invalid signature data.');
      return;
    }

    try {
      setLoading(true);

      // Load a copy of the PDF document
      const pdfDocCopy = await PDFDocument.load(await pdfDoc.save());
      const pages = pdfDocCopy.getPages();

      // Validate that PDF has pages
      if (!pages || pages.length === 0) {
        throw new Error('PDF has no pages');
      }

      // Use the last page for signature (or first page if only one exists)
      const pageIndex = Math.min(1, pages.length - 1);
      const page = pages[pageIndex];
      const { width: pageWidth, height: pageHeight } = page.getSize();

      console.log('Page dimensions:', { pageWidth, pageHeight, pageIndex });

      // Extract base64 data and detect image format
      const imageFormatMatch = signatureDataUrl.match(
        /^data:image\/(\w+);base64,/,
      );
      if (!imageFormatMatch) {
        throw new Error('Invalid signature data URL format');
      }

      const imageFormat = imageFormatMatch[1].toLowerCase();
      const base64Data = signatureDataUrl.replace(
        /^data:image\/\w+;base64,/,
        '',
      );

      console.log('Image format detected:', imageFormat);

      // Convert base64 to Uint8Array
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const signatureBytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        signatureBytes[i] = binaryString.charCodeAt(i);
      }

      // Embed image based on format
      let embeddedImage;
      if (imageFormat === 'png') {
        embeddedImage = await pdfDocCopy.embedPng(signatureBytes);
      } else if (imageFormat === 'jpg' || imageFormat === 'jpeg') {
        embeddedImage = await pdfDocCopy.embedJpg(signatureBytes);
      } else {
        throw new Error(`Unsupported image format: ${imageFormat}`);
      }

      // Calculate signature dimensions and position
      const signatureWidth = 100;
      const signatureHeight = 50;

      // Position signature in the bottom-right area with proper margins
      const xPosition = pageWidth - signatureWidth - 20; // 50px margin from right
      const yPosition = 200; // 100px from bottom

      console.log('Signature position:', {
        xPosition,
        yPosition,
        signatureWidth,
        signatureHeight,
      });

      // Draw the signature on the page
      page.drawImage(embeddedImage, {
        x: xPosition,
        y: yPosition,
        width: signatureWidth,
        height: signatureHeight,
      });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDocCopy.save();

      // Convert to base64
      let base64String = '';
      for (let i = 0; i < modifiedPdfBytes.length; i++) {
        base64String += String.fromCharCode(modifiedPdfBytes[i]);
      }
      const pdfBase64 = btoa(base64String);

      // Write to file
      const signedPdfPath = `${
        RNFS.DocumentDirectoryPath
      }/signed_pdf_${Date.now()}.pdf`;
      await RNFS.writeFile(signedPdfPath, pdfBase64, 'base64');

      console.log('Signed PDF saved to:', signedPdfPath);

      setPdfWithSignatureUrl(`file://${signedPdfPath}`);
      setIsSignatureAdded(true);
      setLoading(false);

      Alert.alert('Success', 'Signature added successfully!');
    } catch (err) {
      console.error('Error embedding signature in PDF:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
      });
      setLoading(false);
      Alert.alert(
        'Error',
        `Failed to embed signature: ${err.message || 'Unknown error'}`,
      );
    }
  };

  // Handle add signature button
  const handleAddSignature = () => {
    if (!signature) {
      Alert.alert('Error', 'Please provide your signature first');
      return;
    }
    embedSignatureInPDF(signature);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const filePath = pdfWithSignatureUrl.replace('file://', '');
      const fileStat = await RNFS.stat(filePath);

      const formData = new FormData();
      formData.append('healthInfoId', healthInfo?._id);
      formData.append('detailsToUpdate', 'ownerDetails');
      formData.append('detailsId', healthInfo?._id);
      formData.append('healthPdf', {
        uri:
          Platform.OS === 'ios'
            ? pdfWithSignatureUrl.replace('file://', '')
            : pdfWithSignatureUrl,
        type: 'application/pdf',
        name: `${healthInfo?.proposalNo}.pdf`,
        size: fileStat.size,
      });

      await onSubmit(formData);

      // try {
      //   await RNFS.unlink(filePath);
      //   await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/temp_pdf.pdf`);
      // } catch (cleanupError) {
      //   console.log('Cleanup error:', cleanupError);
      // }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Document</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather
            name="x"
            size={moderateScale(24)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pdfContainer}>
        {!showSignaturePad ? (
          pdfWithSignatureUrl || pdfUrl ? (
            <Pdf
              source={{ uri: pdfWithSignatureUrl || pdfUrl }}
              style={styles.pdf}
              trustAllCerts={false}
              onLoadComplete={numberOfPages => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onError={error => {
                console.log('PDF Error:', error);
                Alert.alert('Error', 'Failed to load PDF');
              }}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )
        ) : (
          <View style={styles.signaturePadContainer}>
            <Text style={styles.signatureTitle}>Please sign below:</Text>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignatureEnd}
              onEmpty={() => Alert.alert('Error', 'Please provide signature')}
              descriptionText=""
              clearText="Clear"
              confirmText="Save"
              webStyle={`
              .m-signature-pad {
                box-shadow: none;
                border: 1px solid ${theme.colors.description};
                border-radius: ${moderateScale(8)}px;
                background-color: ${theme.colors.backgroundColor};
              }
              .m-signature-pad--body {
                border: none;
              }
              .m-signature-pad--footer {
                display: none;
              }
            `}
              style={styles.signaturePad}
            />
            <View style={styles.signatureButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={handleClearSignature}
              >
                <Text style={styles.buttonOutlineText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => signatureRef.current?.readSignature()}
              >
                <Text style={styles.buttonText}>Save Signature</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Signature Status */}
      {signature && !showSignaturePad && !isSignatureAdded && (
        <View style={styles.signatureStatus}>
          <Feather name="alert-circle" size={20} color={theme.colors.star} />
          <Text style={styles.signatureStatusText}>
            Signature ready - Click "Add Signature" to embed
          </Text>
        </View>
      )}

      {isSignatureAdded && !showSignaturePad && (
        <View style={styles.signatureStatus}>
          <Feather name="check-circle" size={20} color={theme.colors.lableBg} />
          <Text style={styles.signatureStatusText}>
            Signature added to document
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowSignaturePad(true);
              setIsSignatureAdded(false);
              setSignature(null);
            }}
          >
            <Text style={styles.changeSignatureText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Please Sign Document and submit to proceed further!
        </Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={onClose}
          >
            <Text style={styles.buttonOutlineText}>Cancel</Text>
          </TouchableOpacity>

          {!signature && !isSignatureAdded && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => setShowSignaturePad(true)}
            >
              <Text style={styles.buttonText}>Add Signature</Text>
            </TouchableOpacity>
          )}

          {signature && !isSignatureAdded && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleAddSignature}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textSecondary} />
              ) : (
                <Text style={styles.buttonText}>Add Signature</Text>
              )}
            </TouchableOpacity>
          )}

          {isSignatureAdded && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textSecondary} />
              ) : (
                <Text style={styles.buttonText}>Save and Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PDFSignatureComponent;

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundColor,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: verticalScale(16),
      paddingVertical: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: 'Lato',
    },
    closeButton: {
      padding: moderateScale(8),
    },
    pdfContainer: {
      flex: 1,
      backgroundColor: theme.colors.floorBgColor,
    },
    pdf: {
      flex: 1,
      width: width,
      backgroundColor: theme.colors.floorBgColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.floorBgColor,
    },
    loadingText: {
      marginTop: verticalScale(12),
      fontSize: moderateScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato',
    },
    signaturePadContainer: {
      flex: 1,
      padding: verticalScale(16),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.floorBgColor,
    },
    signatureTitle: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: verticalScale(16),
      fontFamily: 'Lato',
    },
    signaturePad: {
      width: width - verticalScale(32),
      height: verticalScale(250),
      backgroundColor: theme.colors.backgroundColor,
      borderRadius: moderateScale(12),
    },
    signatureButtons: {
      flexDirection: 'row',
      gap: verticalScale(12),
      marginTop: verticalScale(16),
      width: '100%',
      paddingHorizontal: verticalScale(16),
    },
    signatureStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.floorBgColor,
      gap: verticalScale(8),
    },
    signatureStatusText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    changeSignatureText: {
      fontSize: moderateScale(14),
      color: theme.colors.primary,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    footer: {
      padding: verticalScale(16),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerText: {
      fontSize: moderateScale(13),
      color: theme.colors.description,
      textAlign: 'center',
      marginBottom: verticalScale(12),
    },
    footerButtons: {
      flexDirection: 'row',
      gap: verticalScale(12),
    },
    button: {
      flex: 1,
      height: verticalScale(45),
      borderRadius: moderateScale(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    buttonOutline: {
      backgroundColor: theme.colors.backgroundColor,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttonText: {
      color: theme.colors.textSecondary,
      fontSize: moderateScale(14),
      fontWeight: '700',
    },
    buttonOutlineText: {
      color: theme.colors.primary,
      fontSize: moderateScale(14),
      fontWeight: '700',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    loadingOverlayText: {
      marginTop: verticalScale(12),
      fontSize: moderateScale(16),
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
  });
