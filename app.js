const express = require("express");
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./database");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const creatorRouter = require("./api/creator/routes");
const productRouter = require("./api/product/routes");
const receiptRouter = require("./api/Receipt/routes");
const notificationRouter = require("./api/notification/routes");

const app = express();

connectDB();

// middlewares before routers
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);
app.use("/media", express.static(path.join(__dirname, "media")));

//  routers
app.use("/product", productRouter);
app.use("/creator", creatorRouter);
app.use("/receipt", receiptRouter);
app.use("/notifications", notificationRouter);
// middlewares after routers

app.use(notFound);
app.use(errorHandler);

app.listen(8001, () => {
  console.log("The application is running on localhost:8001");
});
