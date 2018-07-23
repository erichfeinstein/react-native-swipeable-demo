import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Artists = [
  { id: "1", uri: require('./assets/c.jpg')},
  { id: "2", uri: require('./assets/mm.jpg')},
  { id: "3", uri: require('./assets/p.jpg')},
  { id: "4", uri: require('./assets/t.jpg')},
  { id: "5", uri: require('./assets/tfn.jpg')},
]

export default class App extends React.Component {

  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH/2,0,SCREEN_WIDTH/2],
      outputRange:['-10deg','0deg','10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform:[{
        rotate:this.rotate
      },
    ...this.position.getTranslateTransform()
    ]
    }
  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder:(evt,gestureState) =>true,
      onPanResponderMove:(evt,gestureState)=> {
        this.position.setValue({x:gestureState.dx, y:gestureState.dy})
      },
      onPanResponderRelease:(evt,gestureState)=> {
          if (gestureState.dx > 150) {
            Animated.spring(this.position,{
              toValue:{x:SCREEN_WIDTH+100, y:gestureState.dy}
            }).start(()=>{
              this.setState({currentIndex:this.state.currentIndex+1},()=>{
                this.position.setValue({x: 0, y: 0})
              })
            })
          }

          if (gestureState.dx < -150) {
            Animated.spring(this.position,{
              toValue:{x:-SCREEN_WIDTH-100, y:gestureState.dy}
            }).start(()=>{
              this.setState({currentIndex:this.state.currentIndex+1},()=>{
                this.position.setValue({x: 0, y: 0})
              })
            })
          }

          else {
            Animated.spring(this.position,{
              toValue: { x: 0, y: 0},
              friction: 7
            }).start()
          }
      }
    })
  }

  renderArtists = () => {
    return Artists.map((item, i)=>{
    	if (i < this.state.currentIndex) {
    		return null
    	}

    	else if (i == this.state.currentIndex) {
    		return(
        	<Animated.View
        		{...this.PanResponder.panHandlers}
          		key={item.id} style={[this.rotateAndTranslate,{height:SCREEN_HEIGHT-120,
           		width:SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>
          		<Image
            		style = {{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
            		source = {item.uri} />
        	</Animated.View>
        )
    	}

      else {
    		return(
        	<Animated.View
          		key={item.id} style={[{height:SCREEN_HEIGHT-120,
           		width:SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>
          		<Image
            		style = {{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
            		source = {item.uri} />
        	</Animated.View>
        )
    	}

    }).reverse()
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{height:60}}>

        </View>

        <View style={{flex:1}}>
          {this.renderArtists()}
        </View>

        <View style={{height:60}}>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
