import "../App.css";
import hexagonGrey from "../assets/hexagonGrey.svg";
import hexagonYellow from "../assets/hexagonYellow.svg";
import React, { useEffect, useState } from "react";

export default function SpellingBee() {
  const [messaging, setMessaging] = useState("");
  const [centre, setCentre] = useState();
  const [letters, setLetters] = useState([]);
  const [wordCount, setWordCount] = useState();
  const [totalPoints, setTotalPoints] = useState();
  const [wordList, setWordList] = useState(["You have found 0 words"]);
  const [input, setInput] = useState("");
  const [successfulGuesses, setSuccessfulGuesses] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState("");

  useEffect(() => {
    getSpellingBee();
  }, []);

  useEffect(() => {
    if (totalPoints) {
      getLocalStorage();
    }
  }, [totalPoints]);

  useEffect(() => {
    if (userPoints) {
      localStorage.setItem("userPoints", userPoints);
      var elem = document.getElementById("myBar");
      const percentage = (userPoints / totalPoints) * 100;
      elem.style.width = percentage + "%";
      getUserRank(percentage);
    } else {
      getUserRank(0);
    }
  }, [totalPoints, userPoints]);

  function getUserRank(percentage) {
    if (percentage >= 0) setUserRank("Beginner");
    if (percentage > 10) setUserRank("Moving Up");
    if (percentage > 20) setUserRank("Good");
    if (percentage > 30) setUserRank("Solid");
    if (percentage > 40) setUserRank("Nice");
    if (percentage > 50) setUserRank("Great");
    if (percentage > 60) setUserRank("Amazing");
    if (percentage > 70) setUserRank("Genius");
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkGuess();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      /*removes event listener on cleanup*/
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [input]);

  const handleChange = (event) => {
    setInput(event.target.value.toUpperCase());
    setMessaging("");
  };

  function getLocalStorage() {
    const ls = localStorage.getItem("successfulGuesses");
    const sameDay = parseInt(localStorage.getItem("totalPoints"));
    if (sameDay === totalPoints && ls) {
      setSuccessfulGuesses(JSON.parse(ls));
      setUserPoints(parseInt(localStorage.getItem("userPoints")));
    } else {
      localStorage.setItem("successfulGuesses", "");
    }
    localStorage.setItem("totalPoints", totalPoints);
  }

  function calculatePoints(input) {
    if (input.length === 4) {
      setUserPoints(userPoints + 1);
    } else setUserPoints(userPoints + input.length);
  }

  function checkGuess() {
    const lowerInput = input.toLowerCase();
    setInput("");
    setTimeout(() => {
      setMessaging("");
    }, 2000);
    if (lowerInput.length < 4) {
      setMessaging("Too short");
      return;
    }
    if (!lowerInput.includes(centre)) {
      setMessaging("Missing centre letter");
      return;
    }
    // Check word is in list
    if (wordList.includes(lowerInput)) {
      // Check word hasn't been there before
      if (!successfulGuesses.includes(lowerInput)) {
        const newSuccessfulGuesses = [...successfulGuesses, lowerInput].sort();

        setSuccessfulGuesses(newSuccessfulGuesses);
        localStorage.setItem(
          "successfulGuesses",
          JSON.stringify(newSuccessfulGuesses)
        );
        if (containsEveryLetter()) {
          setMessaging("Pangram!");
          setUserPoints(userPoints + lowerInput.length + 7);
        } else {
          setMessaging("Success!");
          calculatePoints(lowerInput);
        }
      } else {
        setMessaging("You've already guessed that");
      }
    } else {
      setMessaging("Not in word list");
    }
  }

  function shuffle() {
    const shuffle = [...letters].sort(() => Math.random() - 0.5);
    setLetters(shuffle);
  }

  function containsEveryLetter() {
    const totalLettersArray = [...letters, centre];
    const inputArray = [...input.toLowerCase()];
    return (
      totalLettersArray.filter(function (each) {
        return inputArray.indexOf(each) === -1;
      }).length === 0
    );
  }

  function deleteLetter() {
    setInput(input.slice(0, -1));
  }

  function getSpellingBee() {
    fetch("https://freebee.fun/cgi-bin/today")
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setCentre(res.center);
          setWordList(res.wordlist);
          setLetters([...res.letters]);
          setWordCount(res.words);
          setTotalPoints(res.total);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  function getListOfGuesses() {
    return (
      <ul className="guessList">
        {successfulGuesses.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    );
  }

  function letterTiles() {
    if (letters)
      return letters.map((letter, index) => (
        <div className="hive-cell" key={letter} id={"cell" + index}>
          <div
            className="hive-cell-content"
            onClick={() => {
              setInput(input + letter.toUpperCase());
              setMessaging("");
            }}
          >
            <img src={hexagonGrey} alt="hexagon" className="hexagon" />
            <span className="cell-letter">{letter}</span>
          </div>
        </div>
      ));
  }

  function getMessaging() {
    if (messaging) {
      return (
        <div className="message-box">
          <p className="message" style={{ background: "black" }}>
            {messaging}
          </p>
        </div>
      );
    } else {
      return (
        <div className="message-box">
          <p className="message" style={{ background: "white" }}>
            {messaging}
          </p>
        </div>
      );
    }
  }

  return (
    <>
      <div className="progressArea">
        <span className="rank">{userRank}</span>
        <div className="myProgress">
          <div className="myBar" id="myBar">
            <div className="circle">{userPoints}</div>
          </div>
        </div>
      </div>
      {getListOfGuesses()}
      {getMessaging()}
      <input placeholder="Enter word" value={input} onChange={handleChange} />
      <div className="hive">
        <div className="hive-cell" id="cell6">
          <div
            className="hive-cell-content"
            onClick={() => {
              setInput(input + centre.toUpperCase());
            }}
          >
            <img src={hexagonYellow} alt="hexagon" className="hexagon" />
            <span className="cell-letter">{centre}</span>
          </div>
        </div>
        {letterTiles()}
      </div>
      <div className="hive-actions">
        {/* Delete */}
        <button
          className="hive-action"
          onClick={() => {
            deleteLetter();
          }}
        >
          Delete
        </button>

        {/* Shuffle */}
        <button
          className="hive-action"
          onClick={() => {
            shuffle();
          }}
        >
          Shuffle
        </button>
        {/* Enter */}
        <button
          className="hive-action"
          onClick={() => {
            checkGuess();
          }}
        >
          Enter
        </button>
      </div>
    </>
  );
}
