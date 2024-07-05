import { useState, useRef } from "react";
import "./App.css";
import languages from "./Component/LanguageData.js";

//icons are taken from font-awesome web site (for which I added a script in html file)

function App() {
  const [fromText, setFromText] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en-GB");
  const [toText, setToText] = useState("");
  const [toLanguage, setToLanguage] = useState("hi-IN");

  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null); //used for selection effect
  const outputRef = useRef(null);

  const handleTranslate = async () => {
    setLoading(true);
    //my-memory translation api
    let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setToText(data.responseData.translatedText);
      setLoading(false);

      /* {this api gives result in this format.
            "responseData": {
              "translatedText": "Ciao Mondo!",
              "match": 1
            },
      */
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  //Speech synthesis web Api is used to utter (speak) the text.
  const handleSpeak = (text, language) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = language;
    speechSynthesis.speak(utterThis);
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="input">
            <textarea //input-textarea
              name="from"
              id="from"
              placeholder="Enter-text"
              ref={inputRef}
              onChange={(e) => setFromText(e.target.value)}
            ></textarea>

            <textarea //output-textarea
              name="to"
              id="to"
              placeholder=""
              ref={outputRef}
              value={toText}
              readOnly
            ></textarea>
          </div>

          <div className="functions">
            <div className="row-from"> 

              <i                        //voice button
                id="from"
                class="fa-solid fa-volume-high"
                onClick={() => handleSpeak(fromText, fromLanguage)}
              ></i>
              <i
                id="from"
                class="fa-regular fa-copy" //input copy button
                onClick={() => {
                  inputRef.current?.select(); //shows the selected area
                  window.navigator.clipboard.writeText(fromText);
                }}
              ></i>

              <select
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
              >
                {Object.entries(languages).map(
                  ([code, name] ) => (  //make option for select from language.js
                    <option key={code} value={code}> 
                      {name}
                    </option>
                  )
                )}
              </select>


            </div>

            <div className="exchange">
              <i
                class="fa-solid fa-right-left" //exhange icon
                onClick={() => {
                  setFromLanguage(toLanguage);
                  setToLanguage(fromLanguage);
                }}
              ></i>
            </div>

            <div className="row-to">
              <select
                value={toLanguage}
                onChange={(e) => setToLanguage(e.target.value)}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>

              <i
                id="to"               //output copy button
                class="fa-regular fa-copy"
                onClick={() => {
                  outputRef.current?.select();
                  window.navigator.clipboard.writeText(toText);
                }}
              ></i>

              <i
                id="to"             //output voice button
                class="fa-solid fa-volume-high"
                onClick={() => handleSpeak(toText, toLanguage)}
              ></i>
            </div>
          </div>
        </div>

        <button 
            onClick={handleTranslate} 
            disabled={loading} //disabled is a boolean attribute that specifies whether the button should be disabled or not. When disabled is true, the button is disabled, and when it's false, the button is enabled.
        >  
          {loading ? "Translating..." : "Translate Text"} 
        </button>
        
      </div>
    </>
  );
}

export default App;
