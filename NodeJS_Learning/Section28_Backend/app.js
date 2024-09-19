const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);

const { v4: uuid4 } = require(`uuid`);
const multer = require(`multer`);
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const { graphqlHTTP } = require(`express-graphql`);

const app = express();

const schemaGQL = require(`./graphQL/schema`);
const resolverGQL = require(`./graphQL/resolvers`);
const createError = require(`./utils/error`).createError;

const auth = require(`./middlewares/auth`);

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
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
        const error = createError("Not authenticated", [], 401);
        throw error;
    }
    if (!req.file) {
        return res.status(200).json({ message: `No file provided!` });
    }
    if (req.body.oldPath) {
        filePath = path.join(__dirname, `..`, req.body.oldPath);
        fs.unlink(filePath, (err) => console.log(err));
    }
    return res.status(201).json({ message: `File stored.`, filePath: req.file.path.replace(`\\`, `/`), });
})

app.use(`/graphql`, graphqlHTTP({
    schema: schemaGQL,
    rootValue: resolverGQL,
    graphiql: true,
    formatError(err) {
        if (!err.originalError) {
            return err;
        }
        return {
            message: err.message || `An error occurred!`,
            data: err.originalError.data || [],
            statusCode: err.originalError.statusCode
        }
    }
}));


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
        app.listen(8080);
    })
    .catch((err) => console.log(err));
