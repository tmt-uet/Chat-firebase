  sendImageToFb(message){
    var now = new Date().getTime();
    this.chatRef.push({
      _id: now,
      text: message.text,
      createdAt: now,
      user:message.user,
      // uid: this.user.uid,
      // order: -1 * now,
      messageType:message.messageType,
      image: message.image

      
    });
  }

  pickImage(){
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
        const message={}
        let now = new Date().getTime();
        message.createdAt=now,

        message._id=now
        message.text=''
        message.user={}
        message.user._id=this.user.uid
        // message.user.avatar='https://placeimg.com/640/480/people'
        // message.order = -1*now
        message.image=source.uri
        // message.messageType='image'
        // console.log("object cua anh nayyyyyyyy          "+message.image)
        // You can also display the image using data:
        
        // this.setState({
        //   avatarSource: source,
        // });

        this.setState({
          // messages: [message, ...this.state.messages]
          messages: GiftedChat.append(this.state.messages, message),

      });
      console.log(this.state.messages)
      this.sendImageToFb(message)

      }
    });
  
  } 