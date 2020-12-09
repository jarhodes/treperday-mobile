import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { BarChart, Grid, PieChart, StackedBarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale'
import ApiContext from '../ApiContext';

export default function Statistics() {

    const apiVariables = React.useContext(ApiContext);
    const [stats, setStats] = React.useState({});
    const [pieData, setPieData] = React.useState([]);
    const [progressData, setProgressData] = React.useState([]);
    const [weekData, setWeekData] = React.useState([]);

    const fetchStats = () => {
        fetch(apiVariables.apiUrl + "/api/user/stats")
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            else {
                return Promise.reject("Response not OK");
            }
        })
        .then(responseText => {
            if (responseText.length) {
                console.log("Stats are ");
                console.log(JSON.parse(responseText));
                return JSON.parse(responseText);
            }
            else {
                return Promise.reject("Response not OK");
            }
        })
        .then(responseJson => {
            setStats(responseJson);
            generateChartData(responseJson);
        })
        .catch(error => console.log(error));
    }
    
    const colourScale = ["#d1e0fa", "#76a1ef", "#1b63e4", "#103b89", "#05142e"]

    const generateChartData = (responseJson) => {
        const rawValues = responseJson.categoryCount.map(item => item.num);
        
        const pieDataProcess = responseJson.categoryCount.map((item, index) => ({ 
            value: item.num, 
            svg: { 
                fill: colourScale[index], 
                onPress: () => console.log('press', index)
            },
            key: `pie-${index}`,
            label: item.category.name
        }));
        console.log(pieDataProcess);
        setPieData(pieDataProcess);

        const dataObj = [
            {
                numCompleted: responseJson.numCompleted,
                numTasks: (responseJson.numTasks - responseJson.numCompleted)
            }
        ];
        setProgressData(dataObj);

        const weekDataObj = responseJson.taskWeeks.map(item => ({ value: item.numCompleted, label: item.weekNum + " " + item.year }));
        console.log("Week data obj is ");
        console.log(weekDataObj);
        setWeekData(weekDataObj);
    }


    useFocusEffect(
        React.useCallback(() => {
            fetchStats();
        }, [])
    );

    return (
        <View style={styles.container}>
            {stats ? (
                <ScrollView>
                {stats.numCompleted ? (
                    <View style={styles.fullWidth}>
                        {progressData ? (
                        <View style={styles.chartHolder}>
                            <Text>You have completed {stats.numCompleted} of the {stats.numTasks} activities assigned to you</Text>
                            <View style={styles.chartHolder}>
                            <StackedBarChart style={{ height: 75 }} horizontal={true} 
                                data={progressData} 
                                keys={["numCompleted", "numTasks"]} colors={[colourScale[2], colourScale[0]]} />
                            </View>
                        </View>
                        ) : (<></>)}
                        {pieData ? (
                        <View style={styles.chartHolder}>
                            <Text>Your favourite types of activity</Text>
                            <View style={styles.chartHolder}>
                                <PieChart style={{ height: 150 }} data={pieData} />
                            </View>
                            <View style={styles.pieLegend}>
                                {pieData.map((item, index) => (
                                    <View key={index} style={styles.pieLegendItem}>
                                        <Avatar rounded containerStyle={{ backgroundColor: colourScale[index] }} />
                                        <Text style={{marginLeft: 5}}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        ) : ( <></> )}
                        {weekData ? (
                        <View style={styles.chartHolder}>
                            <Text>Number of activities completed each week</Text>
                            <View style={styles.chartHolder, { height: 200 }}>
                                <BarChart
                                    style={{ flex: 1 }}
                                    data={weekData}
                                    yAccessor={({ item }) => item.value}
                                    svg={{ fill: colourScale[1] }}
                                    contentInset={{ top: 10, bottom: 10 }}
                                    spacing={0.2}
                                    gridMin={0}
                                >
                                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                                </BarChart>
                                <XAxis
                                    data={weekData}
                                    xAccessor={({ index }) => index}
                                    scale={scale.scaleBand}
                                    spacing={0.2}
                                    formatLabel={(_, index) => weekData[index].label}
                                    labelStyle={{ color: "#555" }}  />
                            </View>
                        </View>
                        ) : (<></>)}
                    </View>
                    ) : (
                    <View style={styles.chartHolder}>
                        <Text>Statistics will appear here once you have completed your first activity.</Text>
                    </View>
                    )}
                </ScrollView>
            ) : (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#555" />
                </View>
            )}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 0,
        padding: 0
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    fullWidth: {
        width: Dimensions.get('screen').width
    },
    chartHolder: {
        padding: 10,
        margin: 10,
        backgroundColor: "white"
    },
    pieLegend: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    pieLegendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 5
    }
});