const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


export default {
  container: {
    backgroundColor: "#FFF"
  },
  mb10: {
    marginBottom: 10
  },
  drawerCover: {
    alignSelf: "stretch",
    height: 180,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerUserContainer: {
    position: "absolute",
    // left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    left: 20,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    resizeMode: "cover"
  },
  username: {
    color:"#fff",
    marginTop: 12
  },
  small: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  }

};