import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
);

const algolia = client.initIndex(process.env.REACT_APP_ALGOLIA_INDEX_NAME);

export default algolia;