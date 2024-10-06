import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import firestore from '@react-native-firebase/firestore';
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
      const snapshot = await firestore()
        .collection('posts')
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
      thickness={4}
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
      animationDuration={500} // Add smooth animation
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
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.header}>User Statisitics</Text>
          <Text style={styles.chartTitle}>Number of Posts:</Text>
          {renderChart(ptData, '#007aff', 'rgba(0,122,255,0.3)')}

          <Text style={styles.chartTitle}>Number of Likes:</Text>
          {renderChart(likesData, '#00ff83', 'rgba(20,105,81,0.3)')}

          <Text style={styles.chartTitle}>Number of Dislikes:</Text>
          {renderChart(dislikesData, '#ff3b30', 'rgba(255,59,48,0.3)')}

          <Text style={styles.chartTitle}>Number of Comments:</Text>
          {renderChart(commentsData, '#ff9500', 'rgba(255,149,0,0.3)')}

          <View style={styles.bottomspace} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  pointerLabel: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  pointerLabelDate: {
    fontSize: 12,
    color: 'gray',
  },
  pointerValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  bottomspace: {
    height: 60,
  },
});

export default CrystalReport3;
