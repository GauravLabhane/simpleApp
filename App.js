import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, PanResponder, Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {notification, Button, Modal } from 'antd';
// import {notification } from '@ant-design/react-native';
import cat from './assets/cat.png'
import heart from './assets/heart.png'

// import  Cat  from './components/cat.component';
export default function App() {
  // Set up state variables
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isConnected, setIsConnected] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hideCat, setHideCat] = useState(false);
  const [currentCompleted, setCurrentCompleted] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [life, setLife] = useState(5);




  // useEffect(() => {
  //   // Subscribe to network state updates
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log(state)
  //     if(!state.isConnected && state.isInternetReachable !== null &&  !state.isInternetReachable && !isConnected) {
  //       console.log('Inside connected')
  //       setIsConnected(false)
  //       console.log(offline,'offline', showAlert, 'showAlert')
  //     } else if(state.isConnected && state.isInternetReachable) {
  //       setIsConnected(true);
  //     }
  //   });
  //   return () => {
  //     // Unsubscribe to network state updates
  //     unsubscribe();
  //   };
  // }, [isConnected]);


  // Set up game loop
  useEffect(() => {

    // const unsubscribe = NetInfo.addEventListener((state) => {
    //   console.log(state)
    //   if(!state.isConnected && state.isInternetReachable !== null &&  !state.isInternetReachable && !isConnected) {
    //     console.log('Inside connected')
    //     setIsConnected(false)
    //     console.log(isConnected,'offline', 'showAlert')
    //   } else if(state.isConnected && state.isInternetReachable) {
    //     setIsConnected(true);
    //   }
    // });
    // // return () => {
    //   // Unsubscribe to network state updates
    //   unsubscribe();
    // // };

    // const subscribe = NetInfo.addEventListener(state => {

    //   if(state.isConnected) {
    //     setIsConnected(true);
    //   } else {
    //     setIsConnected(false);
    //   }
    // });
    // subscribe();

    window.addEventListener("offline", (event) => {
      setIsConnected(false);
    });
    
    window.addEventListener("online", (event) => {
      setIsConnected(true);
    });

    if(!isConnected && !isGameStarted && !isGameOver) {
      console.log('show, notification');
      // setIsGameStarted(true);
      notification.open({
        message: 'No Internet Connection. Play a game meanwhile ?',
        duration: 0,
        placement: 'topRight',
        description: <Button type="primary" size="small" onClick={() => {setIsGameStarted(true); notification.destroy()}}>Play</Button>
      })

      
      // Alert.alert('No Internet', 'No Internet Connection. Play a game meanwhile ?', [
      //   {
      //     text: 'Play',
      //     onPress: () => {setIsGameStarted(true);},
      //     // style: 'cancel',
      //   }
      // ]);
    }

    if(isConnected && isGameStarted) {

      notification.open({
        message: 'Internet is Back !!',
        duration: 0,
        placement: 'topRight',
        description: <Button type="primary" size="small" onClick={() => setIsGameStarted(false)}>Go To App</Button>
      })

      // Alert.alert('Connected', 'Internet is Back !!', [
      //   {
      //     text: 'Go To App',
      //     onPress: () => () => {setIsGameStarted(true);},
      //     // style: 'cancel',
      //   }
      // ]);

    }

    console.log({isConnected, isGameStarted, speed}, 2);   


    let gameLoop = null;
    if(!isConnected && isGameStarted) {
       gameLoop = setInterval(moveCat, adjustSpeed(score) * 1500);
      return () => clearInterval(gameLoop);
    }       
    if(life <= 0) {
      return () => clearInterval(gameLoop);
    }

  }, [speed, score, isConnected, isGameStarted, currentCompleted, life, hideCat, highestScore]);


  const adjustSpeed = (score) => {
    if(score < 10) {
      return 1;
    }
    if(score < 15) {
      return 0.8;
    }
    if(score < 20) {
      return 0.6;
    } 
    return 0.5;
  }

  // Move the cat
  const moveCat = (speed) => {

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const catWidth = 150;
    const catHeight = 150;
    const maxX = screenWidth - catWidth;
    const maxY = screenHeight - catHeight;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    if(!hideCat) {
      const newLIfe = life -1;
      setLife(newLIfe);

      if(newLIfe == 0) {
      setIsGameStarted(false);
      setIsGameOver(true);
      setHighestScore(Math.max(score,highestScore));


      // Alert.alert('Game Over',  `Game Over \nYour Score is ${score}`, [
      //   {
      //     text: 'Restart',
      //     onPress: () => {setIsGameStarted(true); setLife(5); setScore(0); }  ,
      //     // style: 'cancel',
      //   },
      // ]);

        notification.open({
          message: `Game Over \n Your Score is ${score}`,
          duration: 0,
          placement: 'topRight',
          description: <Button type="primary" size="small" onClick={() => {setIsGameStarted(true); setLife(5); setScore(0);  notification.destroy()} }>Restart</Button>
        }) 
      }

    }
    setHideCat(false);

    console.log({ x: x, y: y });
    console.log({score});

    setCatPosition({ x: x, y: y });
  };

  const  fall = async (column, speed) => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const catWidth = 100;
    const catHeight = 100;
    const maxX = screenWidth - catWidth;
    const maxY = screenHeight - catHeight;
    const x = Math.floor(Math.random() * maxX);
    let y = Math.floor(Math.random() * maxY);

    let sectionWidth = maxX/3;
    y = 0;
    


    let max = false;
    setCurrentCompleted(false);
    const fallLoop = setInterval(()=> {
      if(y < screenHeight) {
        y+=10;
        console.log({ x: sectionWidth * column, y: y});
        setCatPosition({ x: sectionWidth * column - sectionWidth , y: y})
      } else {
        max = true;
      }
    }, speed);
    if(max) {
      clearInterval(fallLoop);
    }
    setCurrentCompleted(true);

    return true;
  };


  // Handle clicks on the cat
  const handleClick = () => {
    setScore(score + 1);
    setHideCat(true);
  }




let lifeArray = [];
for(let i=0; i<life; i++) {
  lifeArray.push((
    <Image source= {heart} key={i} style={styles.lifeImage} />
  ))
}

if(isGameStarted) {
  return (
    <View style={styles.container} > 
    <Text style={styles.gameName}>CATch me if you can !!</Text>
    <Text style={styles.scoreText}>Best Score: {highestScore}</Text>
    <View style={styles.header} >
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.life}>
          {lifeArray }
      </Text>
    </View>

    <TouchableOpacity onPress={handleClick}>
      {!hideCat ? <Image source={cat} style={[styles.cat, { left: catPosition.x, top: catPosition.y }]} /> : <></> }
      
    </TouchableOpacity>
    </View> 
  )
} else {
  return (
  <View style = {styles.activeContainer}>
      {<Image source= {cat} style={[styles.catMain, { left: 0, top: 0 }]} />}
      {<Image source= {heart} style={styles.heartImage} />}
      <Text style={styles.activeText}>App is Active</Text>
  </View> 

    

  )
}
  

}

const styles = StyleSheet.create({
  activeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  container: {
    flex: 2,
    marginTop: 50,
    marginHorizontal: 10,
    backgroundColor: 'aliceblue',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gameName: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 20
  },
  life: {
    textAlign: 'right',
    marginBottom: 10,
    fontSize: 24
  },
  lifeImage: {
    width: 15,
    height: 15,
  },
  scoreText: {
    textAlign: 'left',
    marginBottom: 10,
    fontSize: 20,
    paddingRight: 10
  },

  cat: {
    width: 100,
    height: 100
  },
  catMain: {
    width: 100,
    height: 100,
    marginLeft: 150,
  },




  activeText: {
    fontSize: 24,
    marginBottom: 20,
    marginLeft:135
    // justifyContent: 'center',
    // alignItems: 'center',
  },


  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
    
  },
});
