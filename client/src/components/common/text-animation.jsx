import React, { useState, useEffect } from 'react';

const TextReplacer = ({ text, initialTimeout, finalTimeout }) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    let tempText = text;
    let currentIndex = 0;
    let parseStatus = false;
    let waitTime = finalTimeout;
    let secondCurrentIndex = 0;

    const replaceCharacters = () => {
        if (currentIndex < text.length && !parseStatus) {

          tempText = tempText.substring(0, currentIndex) + '*' + tempText.substring(currentIndex + 1);
          setDisplayedText(tempText);
          setTimeout(replaceCharacters, 200);
          currentIndex++;
        } else {
          parseStatus = true;
          if(secondCurrentIndex < text.length) {
            setTimeout(() => {
              tempText = text.substring(0, secondCurrentIndex)  + tempText.substring(secondCurrentIndex, text.length);
              setDisplayedText(tempText);
              setTimeout(replaceCharacters, 200);
              waitTime = 0;
              secondCurrentIndex++;
            }, waitTime)
          } else {
            parseStatus = true;
            setDisplayedText(text)
          }
        }
    };
    setTimeout(() => {
      replaceCharacters();
    }, initialTimeout);
  }, [initialTimeout, text, finalTimeout]);

  return <h1>{displayedText}</h1>;
};

export default TextReplacer;
