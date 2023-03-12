const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server, {
    cors: { origin: "http://localhost" }
});

app.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: false
}));
const cookieParser = require("cookie-parser");
app.use(cookieParser("secret"));
app.use("/public", express.static(path.join(__dirname, "../client/public")));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));
app.use(require("express-fileupload")())

const users = [];
let messages;

app.get("/", (req, res) => {
    if (req.session.authenticated) return res.render("discord", {
        "session": req.session.user,
        "messages": messages
    });
    res.sendFile(path.join(__dirname, "../client/login.html"))
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/register.html"))
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({
            message: "Çıkış başarılı"
        })
    });
})

app.post("/login", (req, res) => {
    const { username, password, isForget } = req.body;
    if (req.session.authenticated) return res.json(req.session);
    if (user = users.find(user => user.username === username)) {
        if (user.password === password) {
            req.session.authenticated = true;
            req.session.user = { username, password };
            if (isForget) {
                req.session.cookie.expires = false;
                req.session.cookie.maxAge = (30 * 24 * 60 * 60) * 1000;
            }
            res.json(req.session);
        } else res.json({
            error: true,
            message: "Şifre yanlış"
        })
    } else res.json({
        error: true,
        message: "Kullanıcı bulunamadı"
    })
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (req.session.authenticated) return res.json(req.session);
    if (users.find(user => user.username === username)) return res.json({
        error: true,
        message: "Kullanıcı zaten kayıtlı"
    });
    users.push({
        username, password
    });
    res.json({
        message: "Kayıt başarılı, yönlendiriliyorsunuz..."
    });
});

socketIO.on("connection", socket => {
	if(messages) socketIO.sockets.emit("message", messages);
    socket.on("message", data => {
		messages = data;
        socket.broadcast.emit("message", data);
    })
})

server.listen(8000, () => console.log("Server listening..."))