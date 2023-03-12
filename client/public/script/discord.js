document.querySelector("button.log-out").addEventListener("click", async () => {
    fetch("http://45.141.151.164:8000/logout").then(() => {
        window.location.reload();
    })
})

const socket = io("http://45.141.151.164:8000");

socket.on("connect", () => {
    document.querySelector(".server-connection").style.display = "none";
    document.querySelector("input[name='message']").disabled = false;
})

socket.on("message", message => {
    if (message) {
		const messageWrapper = document.querySelector(".chat-container .message-wrapper");
        messageWrapper.innerHTML = message;
		new Audio("/public/assets/message_sound.mp3").play();
    }
})

socket.on("disconnect", () => {
    document.querySelector(".server-connection").style.display = "block";
    document.querySelector("input[name='message']").disabled = true;
});

document.querySelectorAll(".server-img").forEach(serverImage => {
    serverImage.addEventListener("click", () => {
        document.querySelector(".server-img[selected]")?.removeAttribute("selected");
        serverImage.setAttribute("selected", "")
    })
});
