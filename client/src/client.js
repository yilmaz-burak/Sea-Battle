// METHODS & FUNCTIONS

const writeOnChatbox = (text) => {
  const parent = document.querySelector("#text");
  const child = document.createElement("p");
  child.innerHTML = text;
  parent.appendChild(child);
  parent.scrollTop = parent.scrollHeight - parent.clientHeight + 1000;
}

const messageSent = (e) => {
  e.preventDefault();

  const chatBox = document.getElementById("chatBox");
  const msg = chatBox.value;
  chatBox.value = "";
  console.log(msg);

  socket.emit("message", msg);
};

const sendShipPlacement = (e) => {
  e.preventDefault();
  const input = document.getElementById("shipInput");
  const coordinate = input.value;
  input.value = "";
  socket.emit("coordinate", coordinate);

}

const placeTheBox = (coordinate) => {
  document.getElementById(coordinate).style.backgroundColor = "grey";
}

const hitTheBox = (coordinate) => {
  const previousColor = document.getElementById(coordinate).style.backgroundColor;
   if(previousColor === "grey"){
     document.getElementById(coordinate).style.backgroundColor = "red";
   }
   else{
     document.getElementById(coordinate).style.backgroundColor = "green";
   }

}

// METHOD USAGES

writeOnChatbox("welcome to game!");

const socket = io();

socket.on("message", writeOnChatbox);

socket.on("placeShip", placeTheBox);

socket.on("hitCoordinate", hitTheBox);

socket.on("shipHit", ([color, coordinate])=>{
  document.getElementById(coordinate).style.backgroundColor = color;
});


document.getElementById("chatForm").addEventListener("submit", messageSent);

document.getElementById("shipForm").addEventListener("submit", sendShipPlacement);
