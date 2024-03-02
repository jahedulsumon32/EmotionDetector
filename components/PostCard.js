import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressiveImage from './ProgressiveImage';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect hook

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';

import {AuthContext} from '../navigation/AuthProvider';

import moment from 'moment';
import {
  TouchableOpacity,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

const PostCard = ({item, onDelete, onPress, showDeleteButton}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  useEffect(() => {
    checkIfLiked();
    checkIfDisliked();
    fetchLikesCount();
    fetchDislikesCount();
  }, [liked, disliked, likesCount, dislikesCount]);

  const checkIfLiked = async () => {
    const likesRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('likes')
      .doc(user.uid);
    const doc = await likesRef.get();
    if (doc.exists) {
      setLiked(true);
    }
  };

  const checkIfDisliked = async () => {
    const dislikesRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('dislikes')
      .doc(user.uid);
    const doc = await dislikesRef.get();
    if (doc.exists) {
      setDisliked(true);
    }
  };

  const fetchLikesCount = async () => {
    const likesRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('likes');
    const querySnapshot = await likesRef.get();
    setLikesCount(querySnapshot.size);
  };

  const fetchDislikesCount = async () => {
    const dislikesRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('dislikes');
    const querySnapshot = await dislikesRef.get();
    setDislikesCount(querySnapshot.size);
  };

  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333';
  dislikeText = 'Dislike';
  likeText = 'Like';
  emotion = 'Emotion';

  if (likesCount === 1) {
    likeText = '1 Like';
  } else if (likesCount > 1) {
    likeText = likesCount + ' Likes';
  } else {
    likeText = 'Like';
  }

  if (dislikesCount === 1) {
    dislikeText = '1 Dislike';
  } else if (dislikesCount > 1) {
    dislikeText = dislikesCount + ' Dislikes';
  } else {
    dislikeText = 'dislike';
  }

  if (item.comments == 1) {
    commentText = '1 Comment';
  } else if (item.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  // Use useFocusEffect to refetch user information when the postcard screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, []),
  );

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      // Add user ID to the 'likes' array in Firestore
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .set({});
      // Remove user ID from 'dislikes' array if user has disliked before
      if (disliked) {
        await firestore()
          .collection('posts')
          .doc(item.id)
          .collection('dislikes')
          .doc(user.uid)
          .delete();
        setDisliked(false);
      }
      fetchLikesCount();
    } else {
      setLiked(false);
      // Remove user ID from 'likes' array
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .delete();
      fetchLikesCount();
    }
  };

  const handleDislike = async () => {
    if (!disliked) {
      setDisliked(true);
      // Add user ID to the 'dislikes' array in Firestore
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('dislikes')
        .doc(user.uid)
        .set({});
      // Remove user ID from 'likes' array if user has liked before
      if (liked) {
        await firestore()
          .collection('posts')
          .doc(item.id)
          .collection('likes')
          .doc(user.uid)
          .delete();
        setLiked(false);
      }
      fetchDislikesCount();
    } else {
      setDisliked(false);
      // Remove user ID from 'dislikes' array
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('dislikes')
        .doc(user.uid)
        .delete();
      fetchDislikesCount();
    }
  };

  const handleComment = () => {
    Alert.alert('Comment is clicked');
  };

  const handleEmotion = () => {
    Alert.alert('This button add a tag to the post according to the emotion');
  };
  return (
    <GestureHandlerRootView>
      <Card key={item.id}>
        <UserInfo>
          <UserImg
            source={{
              uri: userData
                ? userData.userImg ||
                  'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
            }}
          />
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName>
                {userData ? userData.fname || 'Test' : 'Test'}{' '}
                {userData ? userData.lname || 'User' : 'User'}
              </UserName>
            </TouchableOpacity>
            <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.post}</PostText>
        {item.postImg != null ? (
          <ProgressiveImage
            defaultImageSource={require('../assets/default-img.jpg')}
            source={{uri: item.postImg}}
            style={{width: '100%', height: 250}}
            resizeMode="cover"
          />
        ) : (
          <Divider />
        )}

        <InteractionWrapper>
          {/* like button */}
          <Interaction active={liked} onPress={handleLike}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? '#2e64e5' : '#333'}
            />
            <InteractionText active={liked}>{likeText}</InteractionText>
          </Interaction>
          {/* Dislike button */}
          <Interaction active={disliked} onPress={handleDislike}>
            <AntDesign
              name={disliked ? 'dislike1' : 'dislike2'}
              size={20}
              color={disliked ? '#2e64e5' : '#333'}
            />
            <InteractionText active={disliked}>{dislikeText}</InteractionText>
          </Interaction>

          {/* Comment button */}
          <Interaction onPress={handleComment}>
            <Ionicons name="chatbubble-outline" size={20} />
            <InteractionText>{commentText}</InteractionText>
          </Interaction>

          {/* Emtion Button */}
          <Interaction onPress={handleEmotion}>
            <MaterialIcons name="insert-emoticon" size={20} />
            <InteractionText>{emotion}</InteractionText>
          </Interaction>

          {/* Delete button */}
          {showDeleteButton && user.uid == item.userId ? (
            <Interaction onPress={() => onDelete(item.id)}>
              <Ionicons name="trash-bin" size={20} />
            </Interaction>
          ) : null}
        </InteractionWrapper>
      </Card>
    </GestureHandlerRootView>
  );
};

export default PostCard;
