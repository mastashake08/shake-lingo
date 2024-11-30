# **Multilingual Conversational Assistant**

This application is a **multilingual conversational assistant** built with **Nuxt 3**. It leverages Chrome's **Prompt API** for generating AI-powered responses and real-time streaming, the **Web Speech API** for speech-to-text and text-to-speech functionality, and the **Translation API** for translating responses into the desired language.

---

## **Features**

1. **Multilingual Support**:
   - Select a target language from the dynamically populated list.
   - Translate AI responses into the selected language.

2. **Real-Time Streaming**:
   - AI responses are streamed incrementally for a faster and more engaging experience.

3. **Speech Recognition**:
   - Use your microphone to interact with the assistant via spoken input.

4. **Text-to-Speech**:
   - Listen to responses in the translated language.

5. **Conversation History**:
   - View a log of past interactions with the assistant.
   - Download conversation history as a JSON file.
   - Upload and restore conversation history.

6. **Auto Speak Responses**:
   - Enable a toggle to automatically speak translated responses.

---

## **Requirements**

- **Browser**: Chrome or a Chromium-based browser with support for the Prompt API.
- **Experimental Flags**:
  - Enable the **Prompt API** in Chrome by navigating to:
    ```plaintext
    chrome://flags/#enable-prompt-api
    ```
- **Permissions**:
  - Microphone access for speech recognition.

---

## **Installation**

### **Clone the Repository**
```bash
git clone https://github.com/mastashake08/shake-lingo.git
cd shake-lingo
```

### **Install Dependencies**
```bash
npm install
```

### **Run the Development Server**
```bash
npm run dev
```

Access the app at `http://localhost:3000`.

---

## **Usage**

### **Basic Steps**
1. **Select Language**:
   - Choose the target language from the dropdown.
2. **Speak to the Assistant**:
   - Click the **Speak** button and say your query.
3. **View and Listen to Responses**:
   - Responses will stream in real-time.
   - Translated responses are displayed alongside the original text.
   - If auto-speak is enabled, responses will be read aloud.
4. **Manage Conversation History**:
   - Download the chat history using the **Download Chat History** button.
   - Upload a previously saved chat history using the **Upload Chat History** button.

---

## **Features in Detail**

### **Speech Recognition**
The app uses the **Web Speech API** for capturing user input via the microphone. Recognized speech is displayed and processed as input for the assistant.

### **Real-Time Streaming**
Responses from the assistant are streamed incrementally using the `session.promptStreaming()` method of the Prompt API.

### **Translation**
The **Translation API** translates the AI's response into the selected target language. Both the original and translated text are displayed.

### **Text-to-Speech**
The **Web Speech API** is used to synthesize speech from the translated response. You can enable or disable automatic speech via the toggle.

### **Conversation History Management**
- Conversations are stored locally in `localStorage`.
- You can download and upload conversations for offline management.

---

## **Code Highlights**

### **Streaming AI Responses**
The `session.promptStreaming()` method streams AI responses incrementally:
```javascript
const stream = await session.promptStreaming(userInput);
for await (const chunk of stream) {
  streamingResponse.value += chunk;
}
```

### **Error Handling**
Graceful error handling ensures the app provides meaningful feedback to the user:
```javascript
try {
  session = await self.ai.languageModel.create({
    systemPrompt: "You are a multilingual assistant.",
  });
} catch (error) {
  console.error("Error creating session:", error);
  alert("An error occurred. Please try again.");
}
```

---

## **Troubleshooting**

### **Common Issues**

#### **1. Model Download Errors**
- Ensure the **Prompt API** flag is enabled in Chrome.
- Check your network connection.

#### **2. Speech Recognition Not Working**
- Ensure your browser has microphone permissions enabled.
- Verify the **Web Speech API** is supported in your browser.

#### **3. Missing Voices**
- Some browsers may require a refresh to load all available voices:
  ```javascript
  speechSynthesis.onvoiceschanged = () => {
    // Reload available voices
  };
  ```

---

## **Contributing**

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## **License**

This project is licensed under the MIT License.

---

### **Contact**

For issues or feature requests, please open an issue on GitHub or contact [jyrone.parker@gmail.com].

