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

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.chartTitle}>Number of Posts:</Text>
          <LineChart
            areaChart
            data={ptData} // Posts data
            rotateLabel
            width={300}
            hideDataPoints
            spacing={10}
            color="#007aff" // Set color for posts chart
            thickness={3}
            startFillColor="rgba(0,122,255,0.3)" // Set fill color
            endFillColor="rgba(0,122,255,0.01)"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            noOfSections={6}
            maxValue={Math.max(...ptData.map(data => data.value)) || 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{color: 'gray'}}
            yAxisSide="right"
            xAxisColor="lightgray"
            xAxisData={ptData.map(data => data.date)} // Map posts data to x-axis
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'black',
              pointerStripWidth: 4,
              pointerColor: 'lightgray',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: items => (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelDate}>{items[0].date}</Text>
                  <View style={styles.pointerValueContainer}>
                    <Text style={styles.pointerValue}>{items[0].value}</Text>
                  </View>
                </View>
              ),
            }}
          />

          <Text style={styles.chartTitle}>Number of Likes:</Text>
          <LineChart
            areaChart
            data={likesData}
            rotateLabel
            width={300}
            hideDataPoints
            spacing={10}
            color="#00ff83"
            thickness={3}
            startFillColor="rgba(20,105,81,0.3)"
            endFillColor="rgba(20,85,81,0.01)"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            noOfSections={6}
            maxValue={Math.max(...likesData.map(data => data.value)) || 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{color: 'gray'}}
            yAxisSide="right"
            xAxisColor="lightgray"
            xAxisData={likesData.map(data => data.date)}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'black',
              pointerStripWidth: 4,
              pointerColor: 'lightgray',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: items => (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelDate}>{items[0].date}</Text>
                  <View style={styles.pointerValueContainer}>
                    <Text style={styles.pointerValue}>{items[0].value}</Text>
                  </View>
                </View>
              ),
            }}
          />

          <Text style={styles.chartTitle}>Number of Dislikes:</Text>
          <LineChart
            areaChart
            data={dislikesData}
            rotateLabel
            width={300}
            hideDataPoints
            spacing={10}
            color="#ff3b30"
            thickness={3}
            startFillColor="rgba(255,59,48,0.3)"
            endFillColor="rgba(255,59,48,0.01)"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            noOfSections={6}
            maxValue={Math.max(...dislikesData.map(data => data.value)) || 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{color: 'gray'}}
            yAxisSide="right"
            xAxisColor="lightgray"
            xAxisData={dislikesData.map(data => data.date)}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'black',
              pointerStripWidth: 4,
              pointerColor: 'lightgray',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: items => (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelDate}>{items[0].date}</Text>
                  <View style={styles.pointerValueContainer}>
                    <Text style={styles.pointerValue}>{items[0].value}</Text>
                  </View>
                </View>
              ),
            }}
          />

          <Text style={styles.chartTitle}>Number of Comments:</Text>
          <LineChart
            areaChart
            data={commentsData}
            rotateLabel
            width={300}
            hideDataPoints
            spacing={10}
            color="#007aff"
            thickness={3}
            startFillColor="rgba(0,122,255,0.3)"
            endFillColor="rgba(0,122,255,0.01)"
            startOpacity={0.9}
            endOpacity={0.2}
            initialSpacing={0}
            noOfSections={6}
            maxValue={Math.max(...commentsData.map(data => data.value)) || 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{color: 'gray'}}
            yAxisSide="right"
            xAxisColor="lightgray"
            xAxisData={commentsData.map(data => data.date)}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'black',
              pointerStripWidth: 4,
              pointerColor: 'lightgray',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: items => (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelDate}>{items[0].date}</Text>
                  <View style={styles.pointerValueContainer}>
                    <Text style={styles.pointerValue}>{items[0].value}</Text>
                  </View>
                </View>
              ),
            }}
          />
          <View style={styles.bottomspace} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
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
