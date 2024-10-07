import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import {useFocusEffect} from '@react-navigation/native';

const CrystalReport3 = () => {
  const [ptData, setPtData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [dislikesData, setDislikesData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const currentUser = auth().currentUser; // Get current logged-in user
      const userId = currentUser ? currentUser.uid : null;

      if (!userId) {
        throw new Error('User not logged in');
      }

      const snapshot = await firestore()
        .collection('posts')
        .where('userId', '==', userId) // Filter by logged-in user ID
        .orderBy('postTime', 'desc')
        .get();

      const userPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));

      let totalLikes = 0;
      let totalDislikes = 0;
      let totalComments = 0;

      const likesMonthlyCount = new Array(13).fill(0);
      const dislikesMonthlyCount = new Array(13).fill(0);
      const commentsMonthlyCount = new Array(13).fill(0);

      for (const post of userPosts) {
        const postId = post.id;

        const likesSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('likes')
          .get();
        totalLikes += likesSnapshot.size;

        const postDate = post.data.postTime.toDate();
        const monthIndex = postDate.getMonth();
        likesMonthlyCount[monthIndex + 1] += likesSnapshot.size;

        const dislikesSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('dislikes')
          .get();
        totalDislikes += dislikesSnapshot.size;
        dislikesMonthlyCount[monthIndex + 1] += dislikesSnapshot.size;

        const commentsSnapshot = await firestore()
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .get();
        totalComments += commentsSnapshot.size;
        commentsMonthlyCount[monthIndex + 1] += commentsSnapshot.size;
      }

      setLikesCount(totalLikes);
      setDislikesCount(totalDislikes);
      setCommentsCount(totalComments);

      const likesChartData = likesMonthlyCount.map((count, index) => ({
        value: count,
        date: new Date(0, index + 1, 0).toLocaleString('default', {
          month: 'short',
        }),
      }));

      const dislikesChartData = dislikesMonthlyCount.map((count, index) => ({
        value: count,
        date: new Date(0, index + 1, 0).toLocaleString('default', {
          month: 'short',
        }),
      }));

      const commentsChartData = commentsMonthlyCount.map((count, index) => ({
        value: count,
        date: new Date(0, index + 1, 0).toLocaleString('default', {
          month: 'short',
        }),
      }));

      const monthlyPostsData = new Array(13).fill(0);
      userPosts.forEach(post => {
        const postDate = post.data.postTime.toDate();
        const month = postDate.getMonth();
        monthlyPostsData[month]++;
      });

      const postChartData = monthlyPostsData.map((count, index) => ({
        value: count,
        date: new Date(0, index + 1, 0).toLocaleString('default', {
          month: 'short',
        }),
      }));

      setPtData(postChartData);
      setLikesData(likesChartData);
      setDislikesData(dislikesChartData);
      setCommentsData(commentsChartData);
    } catch (error) {
      console.error('Error fetching user posts: ', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserPosts();
    }, []),
  );

  const renderChart = (data, chartColor, fillColor) => (
    <LineChart
      areaChart
      data={data}
      rotateLabel
      width={350}
      height={250}
      hideDataPoints={false}
      dataPointsColor={chartColor}
      dataPointsRadius={4}
      startFillColor={fillColor}
      endFillColor={fillColor}
      startOpacity={0.5}
      endOpacity={0.2}
      initialSpacing={0}
      spacing={30}
      thickness={6}
      color={chartColor}
      noOfSections={6}
      xAxisColor="lightgray"
      xAxisData={data.map(d => d.date)}
      yAxisColor="transparent"
      yAxisThickness={0}
      yAxisTextStyle={{color: 'gray'}}
      rulesColor="lightgray"
      rulesType="solid"
      showVerticalLines={false}
      showReferenceLine={false}
      animationDuration={700} // Smoother animation duration
      pointerConfig={{
        pointerStripHeight: 250,
        pointerStripColor: chartColor,
        pointerStripWidth: 2,
        pointerColor: 'lightgray',
        radius: 6,
        pointerLabelWidth: 100,
        pointerLabelHeight: 80,
        activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: items => (
          <View style={styles.pointerLabel}>
            <Text style={styles.pointerLabelDate}>{items[0].date}</Text>
            <View style={styles.pointerValueContainer}>
              <Text style={[styles.pointerValue, {color: chartColor}]}>
                {items[0].value}
              </Text>
            </View>
          </View>
        ),
      }}
    />
  );

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Loading Data...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>User Statistics</Text>

          <View style={styles.card}>
            <Text style={styles.chartTitle}>Number of Posts</Text>
            {renderChart(ptData, '#007aff', 'rgba(0,122,255,0.3)')}
          </View>

          <View style={styles.card}>
            <Text style={styles.chartTitle}>Number of Likes</Text>
            {renderChart(likesData, '#00ff83', 'rgba(20,105,81,0.3)')}
          </View>

          <View style={styles.card}>
            <Text style={styles.chartTitle}>Number of Dislikes</Text>
            {renderChart(dislikesData, '#ff3b30', 'rgba(255,59,48,0.3)')}
          </View>

          <View style={styles.card}>
            <Text style={styles.chartTitle}>Number of Comments</Text>
            {renderChart(commentsData, '#ff9500', 'rgba(255,149,0,0.3)')}
          </View>

          <View style={styles.bottomspace} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  pointerLabel: {
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerLabelDate: {
    fontSize: 12,
    color: '#888',
  },
  pointerValueContainer: {
    flexDirection: 'row',
  },
  pointerValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  bottomspace: {
    marginVertical: 20,
  },
});

export default CrystalReport3;
