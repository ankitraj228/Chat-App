// import React from "react";

// function MessageSelf({ props }) {
//   // console.log("Message self Prop : ", props);
//   return (
//     <div className="self-message-container">
//       <div className="messageBox">
//         <p style={{ color: "black" }}>{props.content}</p>
//         {/* <p className="self-timeStamp" style={{ color: "black" }}>
//           12:00am
//         </p> */}
//       </div>
//     </div>
//   );
// }

// export default MessageSelf;


import React from "react";

function MessageSelf({ props }) {
  return (
    <div className="self-message-container">
      <div className="messageBox">
        <p style={{ color: "black" }}>{props.content}</p>
        {props.file && (
          <div>
            <p style={{ color: "black" }}>File:</p>
            <a href={props.file.url} target="_blank" rel="noopener noreferrer">
              {props.file.name}
            </a>
          </div>
        )}
        {/* <p className="self-timeStamp" style={{ color: "black" }}>
          12:00am
        </p> */}
      </div>
    </div>
  );
}

export default MessageSelf;
