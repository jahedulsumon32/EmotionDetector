import React, {useState} from 'react';
import {Modal, ScrollView, Text, TextInput, View, Button} from 'react-native';
import moment from 'moment';

const CommentModal = ({
  modalVisible,
  setModalVisible,
  comments,
  handleComment,
  commentText,
  setCommentText,
}) => {
  return (
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
                <Text>{comment.comment}</Text>
                <Text style={{fontSize: 12, color: 'gray'}}>
                  {moment(comment.timestamp.toDate()).fromNow()}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TextInput
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={text => setCommentText(text)}
            onSubmitEditing={handleComment}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 5,
              padding: 10,
              marginTop: 10,
            }}
          />
          <Button
            title="Add Comment"
            onPress={handleComment}
            color="#2e64e5"
            style={{
              marginTop: 10,
              borderRadius: 5,
            }}
          />
          <Button
            title="Close"
            onPress={() => setModalVisible(false)}
            color="#2e64e5"
            style={{
              marginTop: 10,
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;
