import { withController } from '@cofn/controllers';
import { searchService } from './search.service.js';

const toViewModel = ({
  author_name: authorName,
  first_publish_year: firstPublishYear,
  title,
}) => ({
  authorName: authorName[0],
  firstPublishYear,
  title,
});

const createBookListController = ({ state }) => {
  state.isLoading = false;
  state.books = [];
  state.error = undefined;

  return {
    async search({ query }) {
      try {
        state.isLoading = true;
        state.error = undefined;
        const result = await searchService.search({ query });
        state.books = result.docs.map(toViewModel);
      } catch (err) {
        state.error = err;
      } finally {
        state.isLoading = false;
      }
    },
  };
};

export const withBookListController = withController(createBookListController);
