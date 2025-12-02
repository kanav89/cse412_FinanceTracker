**Setup Instructions**

**1. Clone the repository**
```
git clone https://github.com/kanav89/cse412_FinanceTracker.git
```
**2. Navigate to the repository directory**
```
cd cse412_FinanceTracker
```

**3. Create a .env file**
```
cp .env.example .env
Fill in the values for the environment variables
```
**4. Database**
```
createdb project
```
```
psql -d project -f schemaswithdata.sql
```
If schemaswithdata.sql fails on very old Postgres with transaction_timeout, delete that line from the file and rerun.


**5. Open two terminal windows**
You will run the backend and frontend separately.

### **Backend**

1. Navigate to the `/backend` directory

   ```
   cd backend
   ```
2. Create a virtual environment

   ```
   python -m venv venv
   ```
3. Activate the virtual environment

   ```
   source venv/bin/activate
   ```
4. Install dependencies

   ```
   pip install -r requirements.txt
   ```
5. Start the server

   ```
   python app.py
   ```

### **Frontend (UI)**

1. Navigate to the `/ui/project-ui` directory

   ```
   cd ui/project-ui
   ```
2. Install packages

   ```
   npm install
   ```
3. Start the development server

   ```
   npm run dev
   ```
If npm is not installed, install it from [here](https://nodejs.org/en/download/)

### **Test Credentials**

* Email: **a@c**
* Password: **a**
