const wait = ms => new Promise(r => setTimeout(r, ms));
const fileInput = document.querySelector("input[type='file']");
let file;
fileInput.onchange = () => {
    file = fileInput.files[0];
    const { size, type } = file;
    if (size > 0 && type.split("/")[0] === "image")
        document.querySelector(".form-container").style.backgroundImage = `url("${URL.createObjectURL(file)}")`
};
document.querySelector(".form-container").addEventListener("submit", async e => {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const isForget = !!formData.find(i => i.name === "forget-me");
    e.target.querySelectorAll("input").forEach(input => input.value = '');
    const responseJSON = await (await fetch("http://45.141.151.164:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "username": formData.find(data => data.name === "username").value,
            "password": formData.find(data => data.name === "password").value,
            "isForget": isForget,
            "file": URL.createObjectURL(file)
        })
    })).json();
    if (responseJSON.error && (errorMessage = responseJSON.message)) {
        Toastify({
            text: errorMessage,
            duration: 2000,
            close: "true",
            gravity: "top",
            position: "right",
            style: {
                background: "rgb(255, 95, 109)"
            }
        }).showToast();
    } else {
        Toastify({
            text: "Giriş başarılı, yönlendiriliyorsunuz...",
            duration: 2000,
            close: "true",
            gravity: "top",
            position: "right",
            style: {
                background: "green"
            }
        }).showToast();
        await wait(2000);
        window.location.reload();
    }
})