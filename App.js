/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView
} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

let Dimensionswidth = require('Dimensions').get('window').width;

let ImageData = require('./ImageData.json');


export default class App extends Component<{}> {


    constructor() {
        super();
        this.state = {
            currentPage: 0
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref='scrollview'
                    // 横向
                    horizontal={true}
                    // 隐藏滚动条
                    showsHorizontalScrollIndicator={false}
                    // 自动分页
                    pagingEnabled={true}
                    // 当一帧滚动结束
                    onMomentumScrollEnd={(e) => this.onAnimationEnd(e)}
                    // 开始拖拽
                    onScrollBeginDrag={() => this.onScrollBeginDrag()}
                    // 停止拖拽
                    onScrollEndDrag={() => this.onScrollEndDrag()}
                    >
                    {App.renderAllImage()}
                </ScrollView>
                {/*圆点*/}
                <View style={styles.pageView}>
                    {this.renderPageCircle()}
                </View>
            </View>
        );
    }

    startTimer() {
        // 获取scrollview
        let scrollview = this.refs.scrollview;
        let imageLength = ImageData.data.length;

        // 添加定时器
        this.timer = setInterval(() => {
            let activePage = 0;
            // 设置圆点
            if ((this.state.currentPage + 1) >= imageLength) {
                activePage = 0;
            } else {
                activePage = this.state.currentPage + 1;
            }

            this.setState({
                currentPage: activePage
            });

            let offSetX = activePage * Dimensionswidth;
            scrollview.scrollResponderScrollTo({x: offSetX, y: 0, animated: true})

        }, this.props.duration);
    }

    // 图片
    static renderAllImage() {
        let allImage = [];
        let imageArr = ImageData.data;
        for (let i = 0; i < imageArr.length; i++) {
            let imgItem = imageArr[i];
            allImage.push(
                <Image key={i} source={{uri: imgItem.img}} style={styles.imageStyle}/>
            )
        }
        return allImage;
    }

    // 圆点
    renderPageCircle() {
        let indicatorArr = [];
        let imageArr = ImageData.data;
        let style;
        for (let i = 0; i < imageArr.length; i++) {
            style = (i === this.state.currentPage) ? {color: 'orange'} : {color: '#FFFFFF'};
            indicatorArr.push(
                // 可以用数组方式添加多个style
                <Text key={i} style={[styles.indicatorStyle, style]}>&bull;</Text>
            )
        }
        return indicatorArr;
    }

    // 滚动一帧监听
    onAnimationEnd(e) {
        // 求出水平方向的偏移量
        let offSetX = e.nativeEvent.contentOffset.x;
        // 求出当前的页数
        let page = offSetX / Dimensionswidth;
        // 更新状态机，重新绘制UI
        this.setState({
            currentPage: page
        })
    }

    // 开始拖拽 停止定时器
    onScrollBeginDrag() {
        clearInterval(this.timer);
    }

    // 停止拖拽 开启定时器
    onScrollEndDrag() {
        this.startTimer();
    }

    // 实现复杂操作
    componentDidMount() {
        // 开启定时器
        this.startTimer();
    }
}

App.defaultProps = {
    duration: 1000
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25
    },

    imageStyle: {
        width: Dimensionswidth,
        height: 120
    },

    pageView: {
        width: Dimensionswidth,
        height: 25,
        backgroundColor: 'rgba(0,0,0,0.4)',
        // 绝对定位
        position: 'absolute',
        bottom: 0,
        // 主轴方向
        flexDirection: 'row',
        // 侧轴对齐方式
        alignItems: 'center',
    },

    indicatorStyle: {
        fontSize: 25,
    }
});