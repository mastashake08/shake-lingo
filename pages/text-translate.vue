<template>
    <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-10 text-white">
      <div class="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-semibold mb-6 text-center">Text Translator</h1>
        <textarea
          v-model="inputText"
          class="w-full bg-gray-900 text-gray-300 py-2 px-4 rounded-lg border border-gray-700 focus:ring focus:ring-blue-500 mb-4"
          placeholder="Enter text to translate..."
          rows="5"
        ></textarea>
        <select
          v-model="targetLanguage"
          class="w-full bg-gray-900 text-gray-300 py-2 px-4 rounded-lg border border-gray-700 focus:ring focus:ring-blue-500 mb-4"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
        <button
          @click="translateText"
          class="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Translate
        </button>
        <div v-if="translatedText" class="mt-6 bg-gray-900 p-4 rounded-lg">
          <h2 class="text-lg font-medium">Translation</h2>
          <p class="text-gray-300">{{ translatedText }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    setup() {
      const inputText = ref("");
      const translatedText = ref("");
      const targetLanguage = ref("fr"); // Default to French
      const { languages } = useLanguages();
  
      const translateText = async () => {
        try {
          const translator = await self.translation.createTranslator({
            sourceLanguage: navigator.language.split("-")[0],
            targetLanguage: targetLanguage.value.split("-")[0],
          });
          translatedText.value = await translator.translate(inputText.value);
        } catch (error) {
          console.error("Translation failed:", error);
          translatedText.value = "Error translating text.";
        }
      };
  
      return {
        languages,
        inputText,
        translatedText,
        targetLanguage,
        languages,
        translateText,
      };
    },
  };
  </script>
  