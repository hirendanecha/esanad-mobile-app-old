import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  useYearList,
  useGetBrandList,
  useGetModelList,
  useGetTrimList,
  useGetCarDetails,
  useSaveCarAndGetValuation,
} from '@hooks/motorflow/useMotorFlow';

import { useGetTopBrandList } from '@hooks/motorflow/useMotorFlowTop';
import { useMotorStore } from '@store/MOTOR/motorStore';
import { useThemeContext } from '@theme/ThemeProvider';
import { moderateScale, verticalScale } from '@constants/metrics';

import { CustomDropDownList } from '@components/ui/CustomDropDownList';
import CustomOptionList from '@components/ui/CustomOptionList';
import CustomButton from '@components/ui/CustomButton';
import CustomRadio from '@components/ui/CustomRadio';
import { ScrollView } from 'react-native-gesture-handler';

const CarDetails = () => {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const {
    regionalSpace,
    registeredYear,
    isRenewing,
    isNewCar,
    updateYear,
    updateBrand,
    updateModel,
    updateTrim,
    updateRegionalSpace,
    updateRegisteredYear,
    updateIsRenewing,
    updateIsNewCar,
    updateStep,
    updateSubStep,
  } = useMotorStore();

  const [year, setYear] = useState(null);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [trim, setTrim] = useState(null);
  const [brandListData, setBrandListData] = useState([]);
  const [topBrandListData, setTopBrandListData] = useState([]);
  const [modelListData, setModelListData] = useState([]);
  const [trimListData, setTrimListData] = useState([]);
  const [carDetailsData, setCarDetailsData] = useState(null);

  const { data: yearList = [] } = useYearList();
  const { mutate: brandList } = useGetBrandList();
  const { mutate: topBrandList } = useGetTopBrandList();
  const { mutate: modelList } = useGetModelList();
  const { mutate: trimList } = useGetTrimList();
  const { mutate: carDetails } = useGetCarDetails();
  const { mutate: saveCarAndGetValuation } = useSaveCarAndGetValuation();

  const yearItems = useMemo(
    () => yearList.map(y => ({ label: y, value: y })),
    [yearList],
  );
  const brandItems = useMemo(
    () => brandListData.map(b => ({ label: b, value: b })),
    [brandListData],
  );
  const modelItems = useMemo(
    () => modelListData.map(m => ({ label: m, value: m })),
    [modelListData],
  );
  const trimItems = useMemo(
    () => trimListData.map(t => ({ label: t, value: t })),
    [trimListData],
  );

  const handleYearSelect = val => {
    updateYear(val);
    setYear(val);
    brandList(
      { year: val },
      {
        onSuccess: data => {
          console.log('data brandList', data);

          setBrandListData(data?.data?.data);
        },
      },
    );
    topBrandList(
      { year: val },
      {
        onSuccess: data => {
          console.log('data topBrandList', data);
          setTopBrandListData(data?.data?.data);
        },
      },
    );
  };
  const handleBrandSelect = val => {
    updateBrand(val);
    setBrand(val);
    modelList(
      { year, make: val },
      {
        onSuccess: data => {
          console.log('data modelList', data);
          setModelListData(data?.data?.data);
        },
      },
    );
  };
  const handleModelSelect = val => {
    updateModel(val);
    setModel(val);
    trimList(
      { year, make: brand, model: val },
      {
        onSuccess: data => {
          console.log('data trimList', data);
          setTrimListData(data?.data?.data);
        },
      },
    );
  };
  const handleTrimSelect = val => {
    updateTrim(val);
    setTrim(val);
    carDetails(
      { year, make: brand, model, trim: val },
      {
        onSuccess: data => {
          console.log('data carDetails', data);
          setCarDetailsData(data?.data?.data);
        },
      },
    );
  };

  const handleSubmit = () => {
    saveCarAndGetValuation({
      bodyType: carDetailsData?.bodyType,
      cylinders: carDetailsData?.cylinders,
      engineSize: carDetailsData?.engineSize,
      make: brand,
      model,
      trim,
      year,
      noOfDoors: carDetailsData?.noOfDoors,
      noOfPassengers: carDetailsData?.noOfPassengers,
      regionalSpec: regionalSpace,
      transmission: carDetailsData?.transmission,
    });

    updateStep(1);
    updateSubStep(1);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Section>
        <CustomDropDownList
          title="Select Year"
          value={year}
          data={yearItems}
          handleSelect={handleYearSelect}
          showSearch={false}
          absolute
        />
        <CustomOptionList
          column={4}
          items={yearItems}
          value={year}
          onPress={i => handleYearSelect(i?.value)}
        />
      </Section>

      {brandListData.length > 0 && (
        <Section>
          <CustomDropDownList
            title="Select Brand"
            value={brand}
            data={brandItems}
            handleSelect={handleBrandSelect}
            showSearch={false}
            absolute
          />
          <CustomOptionList
            items={topBrandListData?.map(b => ({ label: b, value: b }))}
            value={brand}
            onPress={i => handleBrandSelect(i?.value)}
          />
        </Section>
      )}

      {modelListData.length > 0 && (
        <Section>
          <CustomDropDownList
            title="Select Model"
            value={model}
            data={modelItems}
            handleSelect={handleModelSelect}
            showSearch={false}
            absolute
          />
          <CustomOptionList
            items={modelItems}
            value={model}
            onPress={i => handleModelSelect(i?.value)}
          />
        </Section>
      )}

      {trimListData.length > 0 && (
        <Section>
          <CustomDropDownList
            title="Select Trim"
            value={trim}
            data={trimItems}
            handleSelect={handleTrimSelect}
            showSearch={false}
            absolute
          />
          <CustomOptionList
            items={trimItems}
            value={trim}
            onPress={i => handleTrimSelect(i?.value)}
          />
        </Section>
      )}

      {trimListData.length > 0 && (
        <>
          <Section>
            <Text style={styles.radioLabel}>
              What is Your Vehicle's Specification ?
            </Text>
            <CustomRadio
              options={[
                { label: 'GCC', value: 'GCC' },
                { label: 'Non-GCC', value: 'Non-GCC' },
              ]}
              value={regionalSpace}
              onSelect={o => updateRegionalSpace(o.value)}
            />
          </Section>

          <Section>
            <Text style={styles.radioLabel}>
              Are you renewing your insurance?
            </Text>
            <CustomRadio
              options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]}
              value={isRenewing}
              onSelect={val => {
                updateIsRenewing(val);
                if (val) {
                  updateIsNewCar(true);
                  updateRegisteredYear(null);
                }
              }}
            />
          </Section>

          <CustomButton
            title="Next"
            disabled={
              !year ||
              !brand ||
              !model ||
              !trim ||
              !regionalSpace ||
              (isRenewing === false && isNewCar === false && !registeredYear)
            }
            onPress={handleSubmit}
            isShowIcon
            buttonStyle={{ width: '55%', alignSelf: 'center' }}
          />
        </>
      )}
    </ScrollView>
  );
};

export default CarDetails;

const Section = ({ children }) => (
  <View style={{ gap: verticalScale(10) }}>{children}</View>
);

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      borderRadius: verticalScale(10),
      padding: moderateScale(15),
      gap: verticalScale(30),
    },
    radioLabel: {
      fontSize: verticalScale(16),
      color: theme.colors.text,
      fontFamily: 'Lato-Bold',
    },
  });
