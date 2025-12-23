## How to Run the Project Locally

Follow the steps below to set up and run both the frontend and backend on your local machine.
### 1. Clone the Repository

```
git clone https://github.com/VaibhavPatil01/ToDo-Application.git
cd ToDo-Application
```

### 2. Backend Setup
```
cd server
npm install
```
Create a .env file in the backend/ folder with the following:  
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
VITE_FRONTEND_URL=http://localhost:5173
```  
Start the backend server:    
```
npm start
```  

### 2. Frontend Setup  
```
cd client
npm install
```
Create a .env file in the frontend/ folder with the following:  
```
VITE_API_URL=http://localhost:3000
```  
Start the frontend server:  
```
npm run dev
```  