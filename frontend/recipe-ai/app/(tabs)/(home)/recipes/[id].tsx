import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { dummyRecipes } from "@/utils/dummy-data";
import { useEffect, useState } from "react";
import { RecipeData } from "@/utils/types";
import Pill from "@/components/Pill";

const RecipeScreen = () => {
  const { id } = useLocalSearchParams();
  const [recipeData, setRecipeData] = useState<any>(null);

  console.log(id);

  // fetch recipe data here from database
  useEffect(() => {
    fetch(`http://128.61.70.242:5001/get_recipe_by_id?recipe_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error(response);
        }
        return response.json();
      })
      .then((data) => {
        setRecipeData(data);
      })
      .catch((error) => {
        console.error(error);
        setRecipeData(null);
      });
  }, [id]);

  if (!recipeData) {
    return null;
  }

  const {
    name,
    image,
    description,
    instructions,
    ingredients,
    cookedTime: time,
    difficulty,
    healthLabels: tags,
  } = recipeData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Image style={styles.image} source={{ uri: image }} />
        <View style={styles.descriptionContainer}>
          <Text style={styles.text}>{name}</Text>
          <View style={styles.pillContainer}>
            {difficulty && <Pill>{difficulty}</Pill>}
            {time && <Pill>{time}</Pill>}
            {tags.map((tag: any) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </View>
          <Text style={[styles.text, styles.textDescription]}>
            {description}
          </Text>
          <View>
            <Text style={[styles.text, { marginTop: 15 }]}>Ingredients</Text>
            {ingredients.map((ingredient: any) => (
              <Text key={ingredient} style={styles.textDescription}>
                - {ingredient}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    width: "100%",
    padding: 50,
    backgroundColor: "orange",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontFamily: "Inter_500Medium",
  },
  image: {
    width: "100%",
    height: "auto",
    aspectRatio: 1,
    borderRadius: 15,
  },
  descriptionContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
    gap: 10,
  },
  textDescription: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});

export default RecipeScreen;
