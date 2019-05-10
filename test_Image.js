import React from "react";
import { GiftedChat } from "react-native-gifted-chat";

class test_Image extends React.Component {
  state = {
    messages: []
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
        //   text: "",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          },
          image:'content://com.chatapp.provider/root/storage/emulated/0/Pictures/images/image-61e29183-1834-4c6f-af00-0f533adc41d7.jpg'
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}
export default test_Image