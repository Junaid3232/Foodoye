import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import { MyStorage } from "../helper/storage";
import { Form, FormField, SubmitButton } from "../components/forms";
import * as firebase from "firebase";
import "firebase/database";
import { getRelativePosts } from "../helper/firebasehandler";
import routes from "../navigation/routes";
import MapView from "react-native-maps";
import Icon from "../components/Icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

const validationSchema = Yup.object().shape({
  message: Yup.string().required().label("Message"),
});

function ListingDetailsScreen({ route, navigation }) {
  const listing = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    new MyStorage()
      .getUserData()
      .then((user) => {
        if (user) {
          setUser(JSON.parse(user));
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Please restart the app");
      });
  }, []);

  useEffect(() => {
    getRelativePosts(listing.category.label)
      .then((res) => {
        if (res.docs) {
          if (res.docs.length > 0) {
            let temp = res.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            });
            temp = temp.filter((a) => a.id !== listing.id);
            setPosts(temp);
          }
        }
      })
      .catch((err) => {
        console.log("error in getting relative posts are: ", err);
        alert("Something went wrong please try again");
      });
  }, [listing]);

  const sendMessage = (values, resetForm) => {
    if (values.message.trim() === "") {
      return;
    }
    setLoading(true);
    let searching = `${user.id}_${listing.user.id}`;
    if (parseInt(user.id) < parseInt(listing.user.id)) {
      searching = `${listing.user.id}_${user.id}`;
    }

    let data = {
      message: values.message,
      searching: `${searching}`,
      senderId: user.id,
      recieverId: listing.user.id,
      id: Date.now(),
      isRead: false,
      isSaw: false,
      createdAt: Date.now(),
    };
    firebase
      .database()
      .ref(`/chats/${searching}`)
      .set({
        lastMessage: values.message,
        createdAt: Date.now(),
        senderName: user.name,
        senderId: user.id,
        senderProfileImage: user.profileImage,
        recieverId: listing.user.id,
        recieverName: listing.user.name,
        recieverProfileImage: listing.user.profileImage,
      })
      .then(() => {
        firebase
          .database()
          .ref(`/messages/${searching}`)
          .push({
            ...data,
          })
          .then(() => {
            setLoading(false);
            Alert.alert("Done", "Message sent successfully");
            resetForm({
              message: "",
            });
          })
          .catch((err) => {
            console.log("error in adding messages is: ", err);
            setLoading(false);
            Alert.alert("Error", "Something went wrong please try again");
          });
      })
      .catch((err) => {
        console.log("error in chats is: ", err);
        setLoading(false);
        Alert.alert("Error", "Something went wrong please try again");
      });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
      >
        <Image
          source={{ uri: item.images[0] }}
          style={{ height: 130, width: 90, borderRadius: 10 }}
        />
      </TouchableOpacity>
    );
  };
  const renderRelativePosts = () => {
    return (
      <FlatList
        style={{ height: 150, paddingHorizontal: 8 }}
        horizontal={true}
        data={posts}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return <View style={{ width: 10 }} />;
        }}
        renderItem={renderItem}
      />
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Image style={styles.image} source={{ uri: listing.images[0] }} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>Rs:{listing.price}</Text>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            marginTop: -25,
          }}
        >
          <MaterialCommunityIcons name="phone" size={20} color="gray" />
          <Text style={styles.phone}>{listing.user.phone}</Text>
        </View>
        <View style={styles.userContainer}>
          <ListItem
            image={{ uri: listing.user.profileImage }}
            title={listing.user.name}
          />
        </View>
      </View>

      <View style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
        <Form
          initialValues={{ message: "" }}
          onSubmit={(values, { resetForm }) => sendMessage(values, resetForm)}
          validationSchema={validationSchema}
        >
          <FormField
            autoCorrect={false}
            icon="message-processing"
            name="message"
            placeholder="Type Message..."
            textContentType="name"
          />

          <SubmitButton title="Contact owner" loading={loading} />
        </Form>
        {posts.length > 0 && (
          <View style={{}}>
            <Text
              style={{
                marginHorizontal: 10,
                color: colors.dark,
                fontWeight: "bold",
                paddingBottom: 10,
              }}
            >
              Relative Foods
            </Text>
            {renderRelativePosts()}
          </View>
        )}
        <Text
          style={{
            marginHorizontal: 10,
            color: colors.dark,
            fontWeight: "bold",
            paddingBottom: 10,
          }}
        >
          Location
        </Text>
        {listing.postal && listing.postal.city && (
          <Text
            style={{ paddingBottom: 10, paddingLeft: 10, color: colors.medium }}
          >
            {listing.postal.city}
            {listing.postal.country ? `, ${listing.postal.country}` : ""}
          </Text>
        )}
        {listing.location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: listing.location.latitude,
              longitude: listing.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  image: {
    width: "100%",
    height: 250,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  userContainer: {},
  mapStyle: {
    // width: Dimensions.get('window').width,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    height: 200,
  },
  phone: {
    alignSelf: "flex-end",
    fontSize: 15,
    margin: 8,
    marginTop: -0,
  },
});

export default ListingDetailsScreen;
