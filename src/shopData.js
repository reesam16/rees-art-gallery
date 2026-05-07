export const shopItems = [
    {
      id: 101,
      title: "fgw1",
      medium: "Oil on Canvas",
      dimensions: "9x12",
      price: 450,
      isSold: false,
      image: new URL('./assets/paintings/fgw1.jpg', import.meta.url).href
    },
    {
      id: 102,
      title: "fgw3",
      medium: "Oil on Canvas",
      dimensions: "9x12",
      price: 300,
      isSold: true, // This one will show as sold
      image: new URL('./assets/paintings/fgw3.jpg', import.meta.url).href
    }
  ];