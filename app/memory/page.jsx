"use client";
import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
import ResultWithSources from "../components/ResultWithSources";
import "../globals.css";

const Memory = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [firstMsg, setFirstMsg] = useState(true);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! What's your name and fav place?",
      type: "bot",
    },
  ]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmitPrompt = async () => {
    console.log("Sending", prompt);
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: "user", sourceDocuments: null },
      ]);

      const response = await fetch("/api/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt, firstMsg }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      setPrompt("");
      setFirstMsg(false);
      const searchResult = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: searchResult.output.response, type: "bot", sourceDocuments: null },
      ]);

      console.log({ searchResult });
      setError("");
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };
  return (
    <>
      <Title headingText={"Memory"} emoji="🧠" />

      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="I remember everything"
              boldText="Let's see if it can remember your name and fav place. This tool will let you ask anything contained in a PDF."
              description="This tool uses Buffer Memory and Conversation Chain."
            />
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={messages} pngFile="brain" />
            <PromptBox
              prompt={prompt}
              handleSubmit={handleSubmitPrompt}
              handlePromptChange={handlePromptChange}
              error={error}
            />
          </>
        }
      />
    </>
  );
};

export default Memory;
