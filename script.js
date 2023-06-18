const peer = new Peer(
  `${Math.floor(Math.random() * 2 ** 18)
    .toString()
    .padStart(4, 0)}`,
  {
    host: location.hostname,
    debug: 1,
    path: "/myapp",
    port: 4043,
  }
);

function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = stream;
    })
    .catch((err) => {
      console.error(err);
    });
}
getLocalStream();
window.peer = peer;
console.log(peer);
peer.on("open", () => {
  window.caststatus.textContent = `You're device id is ${peer.id}`;
});
const audioContainer = document.querySelector(".call-container");
const callBtn = document.querySelector(".call-btn");
function showCallContent() {
  window.caststatus.textContent = `You're device id is ${peer.id}`;
  callBtn.hidden = false;
  audioContainer.hidden = true;
}
function showConnectedContent() {
  window.caststatus.textContent = `You're connected`;
  callBtn.hidden = true;
  audioContainer.hidden = false;
}
let code;
function getStreamCode() {
  code = window.prompt("Pleas enter sharing code");
}
let conn;
function connectPeers() {
  conn = peer.connect(code);
}
peer.on("connection", (connection) => {
  conn = connection;
});

callBtn.addEventListener("click", () => {
  getStreamCode();
  connectPeers();
  const call = peer.call(code, window.localStream);
  call.on("stream", (stream) => {
    window.remoteAudio.srcObject = stream;
    window.remoteAudio.autoplay = true;
    window.peerStream = stream;
    showConnectedContent();
  });
});
peer.on("call", (call) => {
  const answerCall = confirm("Do you want to answer ?");
  if (answerCall) {
    call.answer(window.localStream);
    showConnectedContent();
    call.on("stream", (stream) => {
      window.remoteAudio.srcObject = stream;
      window.remoteAudio.autoplay = true;
      window.peerStream = stream;
    });
  }
  else{
   console.log('call denied') 
  }
});
