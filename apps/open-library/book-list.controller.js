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
  // initial state
  state.isLoading = false;
  state.books = [];
  state.error = undefined;

  return {
    async search({ query }) {
      try {
        state.isLoading = true;
        state.error = undefined;
        const { docs } = await searchService.search({ query });
        state.books = docs.map(toViewModel);
      } catch (err) {
        state.error = err;
      } finally {
        state.isLoading = false;
      }
    },
  };
};

export const withBookListController = withController(createBookListController);
