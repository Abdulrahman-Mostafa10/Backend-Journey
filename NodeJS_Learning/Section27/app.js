const express = require(`express`);
const path = require(`path`);

const { v4: uuid4 } = require(`uuid`);
const multer = require(`multer`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);

const app = express();

const feedRoutes = require(`./routes/feed`);
const authRoutes = require(`./routes/auth`);

const MONGODB_URI = ``;

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `images`);
    },
    filename: (req, file, cb) => {
        cb(null, uuid4() + `-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === `image/png` ||
        file.mimetype === `image/jpg` ||
        file.mimetype === `image/jpeg`
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({ storage: diskStorage, fileFilter: fileFilter }).single(`image`));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(
        `Access-Control-Allow-Methods`,
        `OPTIONS ,GET, POST, PUT, PATCH, DELETE`
    );
    res.setHeader(`Access-Control-Allow-Headers`, `Content-Type, Authorization`);
    next();
});

app.use(`/feed`, feedRoutes);
app.use(`/auth`, authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        const server = app.listen(8080);
        const io = require('./socket').init(server, {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        });
        io.on('connection', (socket) => {
            console.log('Client connected!');
        });

    })
    .catch((err) => console.log(err));
