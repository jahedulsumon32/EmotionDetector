import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressiveImage from './ProgressiveImage';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect hook
import {AirbnbRating} from 'react-native-ratings';

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
  const [totalcomments, setTotalComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [existingRatings, setExistingRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [modalVisibleRating, setModalVisibleRating] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false); // State to track if user has already rated

  // Pagination Control
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);

  useEffect(() => {
    fetchComments();
  }, [currentPage]); // Fetch comments whenever currentPage changes

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    fetchComments();
  };

  const checkIfLiked = async () => {
    try {
      const likesRef = firestore()
        .collection('posts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid);
      const doc = await likesRef.get();
      if (doc.exists) {
        setLiked(true);
      }
    } catch {
      console.log('Error occur during liked check');
    }
  };

  const checkIfDisliked = async () => {
    try {
      const dislikesRef = firestore()
        .collection('posts')
        .doc(item.id)
        .collection('dislikes')
        .doc(user.uid);
      const doc = await dislikesRef.get();
      if (doc.exists) {
        setDisliked(true);
      }
    } catch {
      console.log('Error occur during disliked check');
    }
  };

  const fetchLikesCount = async () => {
    try {
      const likesRef = firestore()
        .collection('posts')
        .doc(item.id)
        .collection('likes');
      const querySnapshot = await likesRef.get();
      setLikesCount(querySnapshot.size);
    } catch {
      console.log('Error while fetch like');
    }
  };

  const fetchDislikesCount = async () => {
    try {
      const dislikesRef = firestore()
        .collection('posts')
        .doc(item.id)
        .collection('dislikes');
      const querySnapshot = await dislikesRef.get();
      setDislikesCount(querySnapshot.size);
    } catch {
      console.log('Error while fetch dislike');
    }
  };

  const fetchComments = async () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    // Fetch comments for the post
    const commentsRef = firestore()
      .collection('posts')
      .doc(item.id)
      .collection('comments')
      .orderBy('timestamp', 'desc') // Order comments by timestamp in descending order
      .limit(endIndex); // Limit to the end index

    try {
      const snapshot = await commentsRef.get();
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const paginatedComments = commentsData.slice(startIndex, endIndex);
      setComments(paginatedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchAllComments = async () => {
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
    setTotalComments(commentsData);
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
    checkIfLiked();
    checkIfDisliked();
    fetchLikesCount();
    fetchDislikesCount();
    fetchAllComments();
    fetchExistingRatings();
  }, []);

  // Use useFocusEffect to refetch user information when the postcard screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, []),
  );

  useEffect(() => {
    // Check if the user has already rated this post
    const userRating = existingRatings.find(
      rating => rating.userId === user.uid,
    );
    setUserHasRated(!!userRating);
  }, [existingRatings]);

  const fetchExistingRatings = async () => {
    try {
      const ratingsRef = firestore()
        .collection('posts')
        .doc(item.id)
        .collection('ratings');
      const querySnapshot = await ratingsRef.get();
      const ratingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExistingRatings(ratingsData);
    } catch (error) {
      console.error('Error fetching existing ratings: ', error);
    }
  };

  const submitRating = async () => {
    try {
      // Fetch user data to get fname and lname
      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then();
      const userData = userDoc.data();

      // Check if the user has already rated this post
      if (userHasRated) {
        Alert.alert('You have already rated this post.');
        return;
      }

      // Add new rating to Firestore
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('ratings')
        .add({
          userId: user.uid,
          rating: newRating,
          fname: userData.fname, // Add fname
          lname: userData.lname, // Add lname
          timestamp: firestore.Timestamp.fromDate(new Date()),
        });
      Alert.alert('Rating submitted successfully!');
      setNewRating(0); // Reset rating after submission
      fetchExistingRatings();
    } catch (error) {
      console.error('Error submitting rating: ', error);
    }
  };

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
    } else {
      setLiked(false);
      // Remove user ID from 'likes' array
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('likes')
        .doc(user.uid)
        .delete();

      setDisliked(true);
    }
    fetchDislikesCount();
    fetchLikesCount();
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
    } else {
      setDisliked(false);
      // Remove user ID from 'dislikes' array
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('dislikes')
        .doc(user.uid)
        .delete();

      liked(true);
    }
    fetchLikesCount();
    fetchDislikesCount();
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
          fetchAllComments();
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
      fetchAllComments();

      console.log('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteRating = async ratingId => {
    try {
      // Delete the rating document from Firestore
      await firestore()
        .collection('posts')
        .doc(item.id)
        .collection('ratings')
        .doc(ratingId)
        .delete();

      // Fetch the existing ratings again after deletion to refresh the UI
      fetchExistingRatings();

      console.log('Rating deleted successfully!');
    } catch (error) {
      console.error('Error deleting rating:', error);
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
            <InteractionText>{`${totalcomments.length} Comments`}</InteractionText>
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

        {/* Rating button */}
        <InteractionWrapper>
          <Interaction onPress={() => setModalVisibleRating(true)}>
            <MaterialIcons name="insert-emoticon" size={20} />
            <InteractionText>Rate this post</InteractionText>
          </Interaction>
        </InteractionWrapper>

        {/* Rating Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleRating}
          onRequestClose={() => setModalVisibleRating(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '100%',
              }}>
              <ScrollView style={{marginBottom: 10}}>
                {existingRatings.map((rating, index) => (
                  <View
                    key={index}
                    style={{
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    <Text
                      style={{marginRight: 5, color: 'black', fontSize: 20}}>
                      {rating.fname} {rating.lname} gives {rating.rating} stars.
                    </Text>
                    {/* Delete button (rendered only for the owner) */}
                    {user.uid === rating.userId && (
                      <Button
                        title="Delete rating"
                        onPress={() => handleDeleteRating(rating.id)}
                        color="#ff4500"
                        style={{
                          width: 120,
                          height: 30,
                          borderRadius: 5,
                        }}
                      />
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* Rating */}
              <Text style={{marginBottom: 10, color: 'black'}}>
                Rate this post:
              </Text>
              <AirbnbRating
                count={5}
                reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']}
                defaultRating={newRating}
                size={30}
                onFinishRating={rating => setNewRating(rating)}
              />

              {/* Submit Button */}
              <View style={{marginTop: 20, marginBottom: 20}}>
                <Button
                  title="Submit Rating"
                  onPress={submitRating}
                  color="#2e64e5"
                />
              </View>

              {/* Close Button */}
              <Button
                title="Close"
                onPress={() => setModalVisibleRating(false)}
                color="#2e64e5"
                style={{marginTop: 10}}
              />
            </View>
          </View>
        </Modal>

        {/* Comment Modal */}
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
                flex: 1,
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '100%',
              }}>
              <ScrollView>
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
                        color="#c71585"
                        style={{
                          width: 120,
                          height: 30,
                          borderRadius: 5,
                        }}
                      />
                    )}
                  </View>
                ))}

                {/* Pagination controls */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 10,
                    color: 'blue',
                  }}>
                  <Button
                    title="Previous"
                    onPress={() => {
                      console.log('Previous button clicked');
                      paginate(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                  />
                  <Button
                    title="Next"
                    onPress={() => {
                      console.log('Next button clicked');
                      paginate(currentPage + 1);
                    }}
                    disabled={
                      currentPage * commentsPerPage >= totalcomments.length
                    }
                  />
                </View>
              </ScrollView>

              <TextInput
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={text => setCommentText(text)}
                onPress={handleComment}
                style={{
                  borderWidth: 4,
                  borderColor: 'gray',
                  borderRadius: 5,
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />

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
