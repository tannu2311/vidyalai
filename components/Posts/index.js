import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const MAX_POSTS = 30; // Maximum number of posts to load initially

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const { isSmallerDevice } = useWindowWidth();
  const limit = 5; // Set the limit to 5 posts per page
  const [isLoading, setIsLoading] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });
      setPosts([...posts, ...data]);
      // Check if all posts are loaded or exceeded the maximum limit
      if (posts.length >= MAX_POSTS || data.length < limit) {
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [isSmallerDevice, start]);

  const handleClick = () => {
    setStart(prevStart => prevStart + limit);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {!allPostsLoaded && posts.length < MAX_POSTS && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading || posts.length >= MAX_POSTS}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
