<template>
    <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-10 text-white">
      <div class="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-semibold mb-6 text-center">Document Translator</h1>
        <label class="block mb-4">
          <span class="text-gray-400">Upload a document to translate</span>
          <input
            type="file"
            @change="uploadDocument"
            class="block w-full mt-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-lg"
          />
        </label>
        <select
          v-model="targetLanguage"
          class="w-full bg-gray-900 text-gray-300 py-2 px-4 rounded-lg border border-gray-700 focus:ring focus:ring-blue-500 mb-4"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
        <button
          @click="translateDocument"
          class="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
          :disabled="!documentContent"
        >
          Translate Document
        </button>
        <div v-if="translatedDocument" class="mt-6 bg-gray-900 p-4 rounded-lg">
          <h2 class="text-lg font-medium">Translated Document</h2>
          <pre class="text-gray-300 whitespace-pre-wrap">{{ translatedDocument }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    setup() {
      const documentContent = ref("");
      const translatedDocument = ref("");
      const targetLanguage = ref("fr"); // Default to French
      const { languages } = useLanguages();
  
      const uploadDocument = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          documentContent.value = reader.result;
          console.log(reader  )
        };
        reader.readAsText(file);
      };
  
      const translateDocument = async () => {
        try {
          const translator = await self.translation.createTranslator({
            sourceLanguage: navigator.language.split("-")[0],
            targetLanguage: targetLanguage.value.split("-")[0],
          });
          translatedDocument.value = await translator.translate(documentContent.value);
          console.log(translatedDocument)
        } catch (error) {
          console.error("Document translation failed:", error);
          translatedDocument.value = "Error translating document.";
        }
      };
  
      return {
        documentContent,
        translatedDocument,
        targetLanguage,
        languages,
        uploadDocument,
        translateDocument,
      };
    },
  };
  </script>
  