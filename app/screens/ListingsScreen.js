import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import * as firebase from "firebase";
import CategoryPickerItem from "../components/CategoryPickerItem";
import { useFormikContext } from "formik";
import { Form, FormPicker as Picker } from "../components/forms";
import "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
const categories = [
  {
    backgroundColor: "green",
    icon: "ballot-outline",
    label: "All",
    value: 0,
  },
  {
    backgroundColor: "#fc5c65",
    icon: "rice",
    label: "Rice",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "oar",
    label: "Chicken",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "fish",
    label: "Fish",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "hamburger",
    label: "Burger",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "cookie",
    label: "Sweet Dish",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "tea",
    label: "Tea",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "bowl",
    label: "Soup",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "pizza",
    label: "Pizza",
    value: 8,
  },
  {
    backgroundColor: "#fc5cd5",
    icon: "food-fork-drink",
    label: "Juices",
    value: 9,
  },
  {
    backgroundColor: "#9ed330",
    icon: "coffee",
    label: "Coffee",
    value: 10,
  },
  {
    backgroundColor: "#778ca3",
    icon: "cow",
    label: "Beef",
    value: 11,
  },
  {
    backgroundColor: "#678923",
    icon: "application",
    label: "Other",
    value: 12,
  },
];

function ListingsScreen({ navigation }) {
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState([]);
  const [dataClone, setDataClone] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .onSnapshot(
        (res) => {
          if (res && res.docs && res.docs) {
            let posts = res.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            });
            posts = posts.sort((a, b) => {
              return a.createdAt < b.createdAt;
            });
            setData(posts);
            setDataClone(posts);
            setFetching(false);
          } else {
            setFetching(false);
          }
        },
        (err) => {
          setFetching(false);
          alert(err.message);
          console.log("error in getting posts is: ", err);
        }
      );
  }, []);

  const handleSearch = (value, item) => {
    setTimeout(() => {
      if (item.label === "All") {
        setData(dataClone);
      } else {
        let temp = dataClone.filter((a) => {
          return item.label === a.category.label;
        });
        setData(temp);
      }
    }, 500);
  };
  return (
    <Screen style={styles.screen}>
      {fetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View>
            <Form
              initialValues={{
                category: null,
              }}
              onSubmit={(values, { resetForm }) => {
                console.log("values is: ", values);
                // handlePosting(values, resetForm)
              }}
              // validationSchema={validationSchema}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              >
                <Picker
                  items={categories}
                  listing={true}
                  handle={(value, item) => {
                    handleSearch(value, item);
                  }}
                  name="category"
                  numberOfColumns={3}
                  PickerItemComponent={CategoryPickerItem}
                  placeholder="Search"
                  width="100%"
                />
              </View>
            </Form>
          </View>
          <FlatList
            contentContainerStyle={{ flex: 1 }}
            style={{ flex: 1 }}
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(listing) => listing.id.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={"Rs:" + item.price}
                image={
                  item.images && item.images.length > 0 ? item.images[0] : null
                }
                onPress={() =>
                  navigation.navigate(routes.LISTING_DETAILS, item)
                }
              />
            )}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 40,
                  }}
                >
                  <Text>No food items are available in this area</Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;
