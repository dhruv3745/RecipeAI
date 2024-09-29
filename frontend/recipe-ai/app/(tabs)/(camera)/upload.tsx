import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-ui-lib";
import Loading from "@/components/Loading";

const UploadScreen = () => {
  const { imageURI } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (imageURI && !Array.isArray(imageURI)) {
      const splitImages = imageURI.split(",");
      setImages(splitImages);
    }
  }, [imageURI]);

  const onAddImage = () => {
    Alert.alert("Add Image", undefined, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Take Picture",
        onPress: () => takePicture(),
      },
      {
        text: "Choose from Library",
        onPress: () => pickImage(),
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      onDone(result);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      onDone(result);
    }
  };

  const onDone = (result: ImagePicker.ImagePickerSuccessResult) => {
    const uri = result.assets.map((asset) => asset.uri);

    setImages([...images, ...uri]);
  };

  const onSubmit = () => {
    if (images.length === 0) {
      Alert.alert("Please add at least one image.");
      return;
    }

    const data = new FormData();

    images.forEach((imageUri, index) => {
      data.append("files", {
        uri: imageUri,
        type: "image/jpeg", // You can dynamically detect the MIME type if necessary
        name: `image_${index}.jpg`, // Dynamic file names for each image
      } as any);
    });

    setLoading(true);

    fetch("http://128.61.70.242:5001/process_image", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(response);
        }
        return response.json();
      })
      .then((data: string[]) => {
        router.navigate({
          pathname: "/(tabs)/ingredients",
          params: { ingredients: JSON.stringify(data) },
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.text}>Images</Text>
        <GestureHandlerRootView style={styles.imageContainer}>
          <FlatList
            style={{ marginBottom: 20 }}
            data={images.concat("plus")}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              if (item !== "plus") {
                return (
                  <Image
                    source={{ uri: item }}
                    style={[styles.image, { margin: "1%" }]}
                  />
                );
              } else {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.add}
                    onPress={onAddImage}
                  >
                    <AntDesign name="pluscircleo" size={70} color="black" />
                  </TouchableOpacity>
                );
              }
            }}
            ItemSeparatorComponent={() => <View style={{ height: "0%" }} />}
            numColumns={2}
            scrollEnabled
          />
          {!loading ? (
            <Button
              label="Submit"
              style={{ backgroundColor: "#920003" }}
              onPress={onSubmit}
            />
          ) : (
            <Loading />
          )}
        </GestureHandlerRootView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  image: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  imageContainer: {
    flex: 1,
  },
  view: {
    flex: 1,
    padding: 20,
  },
  add: {
    flex: 1,
    width: "69%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 5,
    margin: "1%",
    borderColor: "lightgrey",
    backgroundColor: "white",
  },
});

export default UploadScreen;
