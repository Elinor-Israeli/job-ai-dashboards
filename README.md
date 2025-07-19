# job ai dashboards

## Setup steps
1. To the project database (jobskill) Import `./transformedFeeds.json` to your collection and name it jobskill-logs.
2. Change timestamp from string type to Date type with compass aggregation pipeline UI (this is needed since this help us to filter later by dates in queries (I also changed _id to be of type ObjectId)
3. Get your Gemini API key from: [Google Gemini Console](https://ai.google.dev/gemini-api/docs/api-key?hl=he "Google Gemini Console")
4. Copy `backend/.env.example` to `backend/.env` and change `MONGODB_URI` and `GEMINI_API_KEY`.
   
   > [!NOTE]
   > Your .env is already in .gitignore. Never commit it.
6. Inside `backend` folder: `npm install` and then `node app.js`
7. Inside `frontend` folder: `npm install` and then `npm run dev`


Dashboard address: http://localhost:5173/
ChatUI address : http://localhost:5173/aichat/

