import ImageToText
import re

def extract_words(text):
    # Find all sequences of alphabetic characters
    return re.findall(r'\b[A-Za-z]+\b', text)

words_only = extract_words(ImageToText.extracted_text)
print(words_only)

f = open('RawIngredients.txt', 'r')
official_ingredients = f.readlines()[0].split(',')
ingredients_only = [word for word in words_only if word.lower() in official_ingredients]
print(ingredients_only)