import { http } from '../../utils/http.js';

export const createImagesService = () => {
  return {
    async uploadImage({ file }) {
      return await http('images', {
        method: 'POST',
        body: file,
      });
    },
  };
};

export const imagesService = createImagesService();
