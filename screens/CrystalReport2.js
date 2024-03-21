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
import {BarChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const CrystalReport2 = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);

  const [monthlyPosts, setMonthlyPosts] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const fetchUserPosts = async () => {
    try {
      const snapshot = await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get();
      const userPosts = snapshot.docs.map(doc => doc.data());

      // Calculate monthly posts
      const monthlyPostsData = new Array(12).fill(0);
      userPosts.forEach(post => {
        const postDate = post.postTime.toDate();
        const month = postDate.getMonth();
        monthlyPostsData[month]++;
      });
      setMonthlyPosts(monthlyPostsData);
    } catch (error) {
      console.error('Error fetching user posts: ', error);
    }
  };

  const handleGenerateReport = () => {
    setShowUserInfo(true);
    fetchUserPosts();
  };

  useEffect(() => {
    // Fetch user posts when the component mounts
    fetchUserPosts();
  }, []);
  // Define an array of colors for the bars
  const barColors = [
    '#FF5733',
    '#C70039',
    '#900C3F',
    '#581845',
    '#FFC300',
    '#FF5733',
    '#C70039',
    '#900C3F',
    '#581845',
    '#FFC300',
    '#FF5733',
    '#C70039',
  ];

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
            <BarChart
              data={{
                labels: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                datasets: [
                  {
                    data: monthlyPosts,
                  },
                ],
              }}
              width={screenWidth}
              height={400}
              yAxisLabel="#"
              chartConfig={{
                backgroundColor: '#f0f8ff',
                backgroundGradientFrom: '#f0f8ff',
                backgroundGradientTo: '#f0f8ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.5, // Adjust space between bars
                propsForLabels: {
                  fontSize: 12, // Adjust label font size
                },
                propsForVerticalLabels: {
                  fontSize: 12, // Adjust vertical label font size
                },
                propsForHorizontalLabels: {
                  fontSize: 12, // Adjust horizontal label font size
                },
                fillShadowGradient: '#0000ff', // Color of the bars
                barColors: barColors, // Set colors for each bar
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <View>
              <Text style={{color: 'black'}}>No. of Post per month by me</Text>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowUserInfo(false)}>
              <Text style={styles.textStyle}>Close</Text>
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
    color: 'black',
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
    width: '100%',
    height: '100%',
    margin: 20,
    backgroundColor: '#f0ffff',
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
export default CrystalReport2;
