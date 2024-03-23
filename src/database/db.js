import mongoose from 'mongoose'

const connectDb = () => {
  console.log("Trying connect to database");

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((err) =>
      console.error(`MongoDB Atlas Connection Failed. Err: ${err}`)
    );
};

export default connectDb;
