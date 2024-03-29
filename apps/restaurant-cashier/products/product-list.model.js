export const fromForm = (form) => {
  const formData = new FormData(form);
  return {
    sku: formData.get('sku'),
    price: {
      amountInCents: Number(formData.get('price')) * 100,
      currency: '$',
    },
    title: formData.get('title'),
    ...(formData.get('description') !== ''
      ? { description: formData.get('description') }
      : {}),
    ...(formData.get('image') !== ''
      ? {
          image: { url: formData.get('image') },
        }
      : {}),
  };
};

export const productSkus = ({ products }) => products.map(({ sku }) => sku);
