


import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { myContext } from "./MainContainer";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";

var socket, chat;
function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    const formData = new FormData();
    formData.append("file", selectedFile);

    if (selectedFile) {
      axios.post("http://localhost:8080/upload", formData, config)
        .then((response) => {
          const fileMessage = {
            content: "File: " + response.data.filename,
            chatId: chat_id,
          };
          axios.post("http://localhost:8080/message/", fileMessage, config)
            .then(({ data }) => {
              console.log("File sent successfully");
              socket.emit("newMessage", data);
            })
            .catch((error) => {
              console.error("Error sending file message:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }

    if (messageContent.trim() !== '') {
      axios.post("http://localhost:8080/message/", {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        console.log("Message sent successfully");
        socket.emit("newMessage", data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    }

    setMessageContent('');
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() =>{
    socket=io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () =>{
      setSocketConnectionStatus(!socketConnectionStatus);
    });
  },[]);

  useEffect(() =>{
    socket.on("message recieved", (newMessage) => {
      if(!allMessagesCopy || allMessagesCopy._id !== newMessage._id){

      }else {
        setAllMessages([...allMessages], newMessage);
      }
    });
  });

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get("http://localhost:8080/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
        socket.emit("join chat" , chat_id);
      });
      setAllMessagesCopy(allMessages);
  }, [refresh, chat_id, userData.data.token,allMessages]);

  useEffect(() => {
    if (transcript !== '') {
      setMessageContent(transcript);
    }
  }, [transcript]);

  const handleChange = (newMessage) => {
    setMessageContent(newMessage);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() !== '') {
      console.log('Sending message:', messageContent);
      setMessageContent('');
    }
  };

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
          </div>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={"messages-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <InputEmoji
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="file">
            <IconButton component="span">
              <AttachFileIcon className={"icon" + (lightTheme ? "" : " dark")} />
            </IconButton>
          </label>
          <IconButton
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
          <IconButton className="send-icon" onClick={handleSpeechRecognition}>
            <KeyboardVoiceIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
