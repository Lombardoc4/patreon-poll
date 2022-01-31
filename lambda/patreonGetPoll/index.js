// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;


// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.
const MONGODB_URI = "mongodb+srv://patreon:patreon@willramos.og9cd.mongodb.net/patreon?retryWrites=true&w=majority"


// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI);

  // Specify which database we want to use
  const db = await client.db("patreon");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {

  /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
  context.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const {id} = JSON.parse(event.body);

  if (id.length !== 24 ) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({err: 'No Poll'}),
    };

    return response;
  }

  // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
  const poll = await db.collection("polls").findOne({_id: new ObjectId(id)});

  if (!poll) {
    poll.err = 'No poll'
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(poll),
  };

  return response;
};