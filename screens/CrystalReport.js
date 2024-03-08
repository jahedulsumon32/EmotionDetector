import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

const CrystalReport = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const fetchUserData = async () => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(route.params ? route.params.userId : user.uid)
        .get();
      if (snapshot.exists) {
        const data = snapshot.data();
        // Convert Firebase timestamp to JavaScript Date object
        if (data.dateofbirth) {
          data.dateofbirth = data.dateofbirth.toDate().toDateString();
        }
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const snapshot = await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get();
      const userPosts = snapshot.docs.map(doc => doc.data());
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts: ', error);
    }
  };

  const handleGenerateReport = () => {
    setShowUserInfo(true);
    fetchUserData();
    fetchUserPosts();
  };

  useEffect(() => {
    // You can fetch user data and posts here if you want to show them immediately
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crystal Report</Text>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateReport}>
        <Text style={styles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUserInfo}
        onRequestClose={() => setShowUserInfo(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.text}>{userData?.username}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.text}>{userData?.fname}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.text}>{userData?.lname}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>About:</Text>
              <Text style={styles.text}>{userData?.about}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.text}>{userData?.phone}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Country:</Text>
              <Text style={styles.text}>{userData?.country}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.text}>{userData?.dateofbirth}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>Division:</Text>
              <Text style={styles.text}>{userData?.division}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>City:</Text>
              <Text style={styles.text}>{userData?.cities}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.label}>No. of post:</Text>
              <Text style={styles.text}>{posts.length}</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowUserInfo(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonPrint]}
              onPress={() => console.log('Print')}>
              <Text style={styles.textStyle}>Print</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonPrint: {
    backgroundColor: 'green',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CrystalReport;
