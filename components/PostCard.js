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
import {
  Alert,
  Modal,
  View,
  ScrollView,
  TextInput,
  Text,
  Button,
} from 'react-native';

const PostCard = ({item, onDelete, onPress, showDeleteButton}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkIfLiked();
    checkIfDisliked();
    fetchLikesCount();
    fetchDislikesCount();
    fetchComments();
  }, [liked, disliked, likesCount, dislikesCount, comments]);

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

  const fetchComments = async () => {
    // Fetch comments for the post
    const commentsRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('comments');
    const snapshot = await commentsRef.get();
    const commentsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComments(commentsData);
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

  var commenttext = 'comment';
  if (item.comments == 1) {
    commenttext = '1 Comment';
  } else if (item.comments > 1) {
    commenttext = item.comments + ' Comments';
  } else {
    commenttext = 'Comment';
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

  const handleComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      // Fetch user data to get fname and lname
      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then();
      const userData = userDoc.data();

      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('comments')
        .add({
          userId: user.uid,
          fname: userData.fname, // Add fname
          lname: userData.lname, // Add lname
          text: commentText,
          timestamp: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          console.log('Comment Added!');
          Alert.alert(
            'Comment published!',
            'Your comment has been published Successfully!',
          );
          setCommentText('');
          fetchComments();
        })
        .catch(error => {
          console.log(
            'Something went wrong with added post to firestore.',
            error,
          );
        });
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      // Access the comment document in Firestore using its ID and delete it
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('comments')
        .doc(commentId)
        .delete();

      // Optional: Fetch the comments again after deletion to refresh the UI
      fetchComments();

      console.log('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
          {/* <Interaction onPress={handleComment}>
            <Ionicons name="chatbubble-outline" size={20} />
            <InteractionText>{commentText}</InteractionText>
          </Interaction> */}

          <Interaction onPress={() => setModalVisible(true)}>
            <Ionicons name="chatbubble-outline" size={20} />
            <InteractionText>{`${comments.length} Comments`}</InteractionText>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '80%',
              }}>
              <ScrollView style={{maxHeight: 300}}>
                {comments.map((comment, index) => (
                  <View key={index} style={{marginBottom: 10}}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                      {comment.fname + ' ' + comment.lname}
                    </Text>

                    <Text style={{color: 'black'}}>{comment.text}</Text>
                    <Text style={{fontSize: 12, color: 'gray'}}>
                      {moment(comment.timestamp.toDate()).fromNow()}
                    </Text>
                    {/* Delete button (rendered only for the owner) */}
                    {user.uid === comment.userId && (
                      <Button
                        title="Delete comment"
                        onPress={() => handleDeleteComment(comment.id)}
                        color="#40e0d0"
                        style={{
                          width: 120,
                          height: 30,
                          borderRadius: 5,
                        }}
                      />
                    )}
                  </View>
                ))}
                <TextInput
                  placeholder="Add a comment..."
                  value={commentText}
                  onChangeText={text => setCommentText(text)}
                  onSubmitEditing={handleComment}
                  style={{
                    borderWidth: 4,
                    borderColor: 'gray',
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </ScrollView>
              {/* Wrapper View for Add Comment and Close buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/* Add Comment Button */}
                <Button
                  title="Add Comment"
                  onPress={handleComment}
                  color="#2e64e5"
                  style={{
                    marginTop: 20,
                    borderRadius: 5,
                    marginBottom: 10,
                    width: '48%', // Adjust width to accommodate spacing
                  }}
                />
                {/* Close Button */}
                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  color="#2e64e5"
                  style={{
                    marginTop: 20,
                    borderRadius: 5,
                    width: '48%', // Adjust width to accommodate spacing
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </Card>
    </GestureHandlerRootView>
  );
};

export default PostCard;
