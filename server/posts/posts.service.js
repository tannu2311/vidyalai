
const axios = require('axios').default;

/**
 * Fetches posts from a remote API.
 * @async
 * @param {Object} [params] - The parameters for fetching posts.
 * @param {number} [params.start=0] - The start index of posts to fetch.
 * @param {number} [params.limit=10] - The maximum number of posts to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
async function fetchPosts(params) {
  const { start = 0, limit = 10 } = params || {};
  const { data: posts } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts',
    {
      params: {
        _start: start,
        _limit: limit,
      },
    },
  );

  const { data: photos } = await axios.get('https://jsonplaceholder.typicode.com/albums/1/photos');

  const users = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
  
  ];

  const postsWithImagesAndUserInfo = posts.map((post, index) => ({
    ...post,
    images: photos.map(photo => ({ url: photo.url })),
    user: users[index % users.length],
  }));

  return postsWithImagesAndUserInfo;
}

module.exports = { fetchPosts };