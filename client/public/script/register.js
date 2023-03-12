const wait = ms => new Promise(r => setTimeout(r, ms))
document.querySelector(".form-container").addEventListener("submit", async e => {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    e.target.querySelectorAll("input").forEach(input => input.value = '');
    const responseJSON = await (await fetch("http://45.141.151.164:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "username": formData.find(data => data.name === "username").value,
            "password": formData.find(data => data.name === "password").value
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
            text: "Kayıt başarılı, yönlendiriliyorsunuz...",
            duration: 2000,
            close: "true",
            gravity: "top",
            position: "right",
            style: {
                background: "green"
            }
        }).showToast();
        await wait(2000);
        window.location.replace("/")
    }
});