import algoliasearch from "algoliasearch";

const client = algoliasearch("Application ID","Search-Only API Key"); // setting algolia API Keys

const algolia = client.initIndex("Index name"); // search Index name

export default algolia;