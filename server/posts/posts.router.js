const express = require('express');
const { fetchPosts } = require('../posts/posts.service');
const { fetchUserById } = require('../users/users.service'); // Assuming this service fetches user details

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts(); // Fetch posts
    const postsWithUserDetails = await enrichPostsWithUserDetails(posts); // Enrich posts with user details
    res.json(postsWithUserDetails);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

async function enrichPostsWithUserDetails(posts) {
  try {
    const enrichedPosts = await Promise.all(posts.map(async (post) => {
      const user = await fetchUserById(post.userId); // Fetch user details by userId
      if (user) {
        const userNameInitials = getInitials(user.name); // Get initials of user's name
        const userEmailInitials = getInitials(user.email); // Get initials of user's email
        return {
          ...post,
          userName: userNameInitials,
          userEmail: userEmailInitials,
        };
      } else {
        return {
          ...post,
          userName: '',
          userEmail: '',
        };
      }
    }));
    return enrichedPosts;
  } catch (error) {
    console.error('Error enriching posts with user details:', error);
    return posts; // Return original posts in case of error
  }
}

function getInitials(name) {
  const names = name.split(' ');
  const firstNameInitial = names[0] ? names[0].charAt(0) : '';
  const lastNameInitial = names.length > 1 && names[names.length - 1] ? names[names.length - 1].charAt(0) : '';
  return `${firstNameInitial}${lastNameInitial}`;
}

module.exports = router;
