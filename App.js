import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList
} from "react-native";
import { Input, Card, Button, Icon } from "native-base";
import * as firebase from "firebase";
import { firebaseConfig } from "./firebaseConfig";

// //fireabse config
//Add  your configuration object from Firebase here or store in separate file named firebaseconfig.js

firebase.initializeApp(firebaseConfig);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: []
    };
  }
  //how we can send a message to a user
  sendMessage = message => {
    var messageListRef = firebase.database().ref("message_list");

    //push message to database
    var newMessageRef = messageListRef.push();
    newMessageRef.set({
      text: message,
      time: Date.now()
    });
    this.setState({
      message: ""
    });
  };

  //will update our constructors messagelist state
  updateList = messageList => {
    this.setState({
      messageList: messageList
    });
  };

  componentWillMount() {
    //tricky stuff goes here
    var messageListRef = firebase.database().ref("message_list");

    //whenever entry is made into database trigger is called internally
    messageListRef.on("value", dataSnapShot => {
      //into callback
      if (dataSnapShot.val()) {
        //if something is there or not
        //just to have this keyword trickery JS classic trick
        var self = this;

        //if node is present theere store in messagelist
        let messageList = Object.values(dataSnapShot.val());
        self.updateList(messageList.reverse());
      }
    });
  }

  render() {
    //inverted will actually inverts data list
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.header}>
          <Text style={styles.headerText}>Message Board</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.messageList}
            inverted
            keyExtractor={(item, index) => {
              item.time.toString();
            }}
            renderItem={({ item }) => (
              <Card style={styles.listItem}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timeText}>
                  {new Date(item.time).toLocaleDateString}
                </Text>
              </Card>
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            onChangeText={text => {
              this.setState({ message: text });
            }}
            value={this.state.message}
            placeholder="Enter Message"
          />
          <Button
            danger
            rounded
            icon
            onPress={() => {
              this.sendMessage(this.state.message);
            }}
          >
            <Icon name="arrow-forward" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    margin: 2,
    backgroundColor: "#01CBC6"
  },
  header: {
    backgroundColor: "#2B2B52",
    alignItems: "center",
    height: 40,
    justifyContent: "center"
  },
  headerText: {
    paddingHorizontal: 10,
    color: "#FFF",
    fontSize: 20
  },
  listContainer: {
    flex: 1,
    padding: 5
  },
  listItem: {
    padding: 10
  },
  messageText: {
    fontSize: 20
  },
  timeText: {
    fontSize: 10
  },
  inputContainer: {
    flexDirection: "row",
    padding: 5,
    borderWidth: 5,
    borderRadius: 15,
    borderColor: "#2B2B52",
    color: "#fff"
  }
});
