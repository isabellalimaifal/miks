const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3009;
const SECRET_KEY = "segredo123";

// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware de debug
app.use((req, res, next) => {
    console.log(`Acessando: ${req.method} ${req.path}`);
    next();
});

// Rotas
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
    const { txtUsername, txtPassword } = req.body;
    
    if (txtUsername === "fulano" && txtPassword === "123456") {
        const token = jwt.sign({ username: txtUsername }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/principal");
    } else {
        res.redirect("/login");
    }
});

app.get("/principal", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    
    try {
        jwt.verify(token, SECRET_KEY);
        res.sendFile(path.join(__dirname, "public", "principal.html"));
    } catch (error) {
        res.redirect("/login");
    }
});

app.get("/clientes", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    
    try {
        jwt.verify(token, SECRET_KEY);
        res.sendFile(path.join(__dirname, "public", "clientes.html"));
    } catch (error) {
        res.redirect("/login");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Arquivos disponíveis na pasta public:`, fs.readdirSync(path.join(__dirname, "public")));
});