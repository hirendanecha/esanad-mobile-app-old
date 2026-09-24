import * as React from 'react';
import { View } from 'react-native';
import OfferCarousel from './src/components/ui/OfferCarousel';
import { useThemeContext } from '@theme/ThemeProvider';

const data = [

  {
    image: {
      uri: 'https://www.detailingdevils.com/uploads/blogs/Ferrari-296GTB.webp',
    },
    name: 'Ferrari 296GTB',
    offer: '10% Off Servicing',
  },
  {
    image: {
      uri: 'https://www.detailingdevils.com/uploads/blogs/McLaren-750S.webp',
    },
    name: 'New McLaren 750S.',
    offer: 'Test Drive Today',
  },
  {
    image: {
      uri: 'https://www.detailingdevils.com/uploads/blogs/Ferrari-F8.webp',
    },
    name: 'Ferrari F8 Tributo.',
    offer: 'Exclusive Leasing',
  },
  {
    image: {
      uri: 'https://www.detailingdevils.com/uploads/blogs/McLaren-Artura.webp',
    },
    name: 'McLaren Artura',
    offer: 'Summer Deal',
  },
];

function Dummy() {
  const { theme } = useThemeContext();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundColor }}>
      <OfferCarousel data={data} />
    </View>
  );
}

export default Dummy;
