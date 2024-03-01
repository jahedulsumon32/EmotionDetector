import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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

  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333';
  dislikeText = 'Dislike';
  emotion = 'Emotion';

  if (item.likes == 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
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

  const handleLike = () => {
    Alert.alert('Liked is clicked');
  };

  const handleDisLike = () => {
    Alert.alert('DisLiked is clicked');
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
          <Interaction active={item.liked} onPress={handleLike}>
            <Ionicons name={likeIcon} size={20} color={likeIconColor} />
            <InteractionText active={item.liked}>{likeText}</InteractionText>
          </Interaction>
          {/* Dislike button */}
          <Interaction onPress={handleDisLike}>
            <SimpleLineIcons name="dislike" size={20} />
            <InteractionText>{dislikeText}</InteractionText>
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
