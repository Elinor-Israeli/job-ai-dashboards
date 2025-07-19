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

## Photos

### Dashboard
<img width="1915" height="931" alt="Dashboard table" src="https://github.com/user-attachments/assets/fa6d0991-7145-46d6-bc3e-ffc33d8cfd99" />
<img width="1885" height="873" alt="Dashboard charts" src="https://github.com/user-attachments/assets/615ed6bc-6aa6-4e9a-b94b-0d62bc0481fd" />

### Chat response
<img width="1916" height="947" alt="Bar Chart in Chat" src="https://github.com/user-attachments/assets/f4847570-11d1-471b-9403-6e14613623e0" />
<img width="730" height="814" alt="Table in chat" src="https://github.com/user-attachments/assets/82af3764-4ea5-4e7e-8986-f2dc09a8c51c" />
<img width="1914" height="924" alt="Line Chart In Chat" src="https://github.com/user-attachments/assets/1707e6bb-8b92-4fb0-9144-3c0fc95399a8" />

