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
import {BarChart, PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CrystalReport2 = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);

  const [monthlyPosts, setMonthlyPosts] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const fetchUserPosts = async () => {
    try {
      const snapshot = await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get();

      const userPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));

      let likesCount = 0;
      let dislikesCount = 0;

      // Iterate over each user post
      for (const post of userPosts) {
        const postId = post.id;
        // Fetch likes for the current post
        const likesSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('likes')
          .get();
        likesCount += likesSnapshot.size;

        // Fetch dislikes for the current post
        const dislikesSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('dislikes')
          .get();
        dislikesCount += dislikesSnapshot.size;
      }

      console.log('Total Likes:', likesCount);
      console.log('Total Dislikes:', dislikesCount);

      setLikesCount(likesCount);
      setDislikesCount(dislikesCount);

      // Calculate monthly posts
      const monthlyPostsData = new Array(12).fill(0);
      userPosts.forEach(post => {
        const postDate = post.data.postTime.toDate();
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
            <View style={styles.chartContainer}>
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
                height={200}
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
                  barPercentage: 0.5,
                  propsForLabels: {
                    fontSize: 12,
                  },
                  propsForVerticalLabels: {
                    fontSize: 12,
                  },
                  propsForHorizontalLabels: {
                    fontSize: 12,
                  },
                  fillShadowGradient: '#0000ff',
                  barColors: barColors,
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <View style={styles.chartTitle}>
                <Text style={{color: 'black'}}>
                  No. of Posts per month by me
                </Text>
              </View>
              <View style={styles.pieChartContainer}>
                <PieChart
                  data={[
                    {
                      name: 'Likes',
                      count: likesCount,
                      color: '#4CAF50',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 15,
                    },
                    {
                      name: 'Dislikes',
                      count: dislikesCount,
                      color: '#F44336',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 15,
                    },
                  ]}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f0f8ff',
                    backgroundGradientFrom: '#f0f8ff',
                    backgroundGradientTo: '#f0f8ff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="count"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
              <View style={styles.likesDislikes}>
                <Text style={{color: 'black'}}>
                  Likes: {likesCount}, Dislikes: {dislikesCount}
                </Text>
              </View>
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
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    marginTop: 10,
  },
  pieChartContainer: {
    marginTop: 10,
  },
  likesDislikes: {
    marginTop: 10,
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
