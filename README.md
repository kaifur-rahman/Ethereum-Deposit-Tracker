<h1>Ethereum Deposit Tracker</h1>

<p>This project is an Ethereum Deposit Tracker that monitors and records ETH deposits to the Beacon Deposit Contract. The tracker integrates with Ethereum RPC methods (using Alchemy or Infura), stores deposit details in MongoDB, and sends Telegram notifications when a new deposit is detected.</p>

<p><strong>Task provided by:</strong> Luganodes</p>

<p><strong>Developer:</strong> Kaifur Rahman<br>
<strong>Registration Number:</strong> 21BRS1147 <br>
<strong>College:</strong> VIT, Chennai</p>

<p>It is fully containerized using Docker, making it easy to set up and run on any machine.</p>

<p><strong>Detailed Documentation:</strong> <a href="https://docs.google.com/document/d/1HIqHSEATZBJC4JukrxAfqUzqZXoIO1LHjZMuF43Kf-Q/edit?usp=sharing">View Detailed Documentation</a></p>

<h2>Architecture</h2>
<p>Below is an architecture diagram of the project, showcasing the connections between Alchemy, MongoDB, Telegram, and the Ethereum contract:</p>

<img src="https://ik.imagekit.io/59xbpq5u9/Ethereum%20Tracker%20Architecture(1).png?updatedAt=1725946399931" alt="Project Architecture" width="600" />


<h2>Table of Contents</h2>
<ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#environment-variables">Environment Variables</a></li>
    <li><a href="#running-the-project">Running the Project</a></li>
    <li><a href="#testing-the-project">Testing the Project</a></li>
    <li><a href="#logging-and-error-handling">Logging and Error Handling</a></li>
    <li><a href="#bonus-dockerization">Bonus: Dockerization</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#contributing">Contributing</a></li>
</ul>

<h2 id="features">Features</h2>
<ul>
    <li>Monitors the Beacon Deposit Contract for ETH deposits.</li>
    <li>Stores deposit details (blockNumber, timestamp, fee, hash, pubkey) in MongoDB.</li>
    <li>Sends Telegram notifications for each new deposit.</li>
    <li>Full Docker support for easy deployment and scalability.</li>
    <li>Proper error handling and logging.</li>
</ul>

<h2 id="project-structure">Project Structure</h2>
<pre><code>
ETH-DEPOSIT-TRACKER/
├── config/
│   └── db.js                  # MongoDB connection setup
├── models/
│   └── Deposit.js             # Mongoose schema for storing deposit information
├── services/
│   └── depositService.js      # Service to process deposits and send notifications
├── utils/
│   └── logger.js              # Winston logger for logging
├── .env                       # Environment variables (not included, see section on ENV)
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Dockerfile for Node.js app
├── index.js                   # Main server file (Express app)
├── package.json               # Project dependencies and scripts
└── README.md                  # Documentation
</code></pre>

<h2 id="prerequisites">Prerequisites</h2>
<p>Ensure you have the following installed on your system:</p>
<ul>
    <li>Node.js (version 16.x or higher)</li>
    <li>MongoDB (if not using Docker for MongoDB)</li>
    <li>Docker (if using Docker)</li>
    <li>An Alchemy or Infura Account for Ethereum RPC access</li>
</ul>

<h2 id="installation">Installation</h2>

<h3>Clone the Repository</h3>
<pre><code>
git clone &lt;repository-url&gt;
cd eth-deposit-tracker
</code></pre>

<h3>Install Dependencies</h3>
<p>Make sure you have Node.js installed. Run the following command to install the required Node packages:</p>
<pre><code>
npm install
</code></pre>

<h3>Environment Variables Setup</h3>
<p>Create a <code>.env</code> file in the root directory with the following contents:</p>

<pre><code>
ALCHEMY_API_KEY=your_alchemy_api_key
MONGODB_URI=mongodb://mongo:27017/eth-deposits
BEACON_CONTRACT=0x00000000219ab540356cBB839Cbe05303d7705Fa
ALCHEMY_SIGNING_KEY=your_alchemy_signing_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
</code></pre>

<ul>
    <li><strong>Alchemy API Key</strong>: Sign up at <a href="https://www.alchemy.com/">Alchemy</a> and create an Ethereum project to get your API key.</li>
    <li><strong>MongoDB URI</strong>: Either use a local MongoDB instance or a cloud instance (e.g., MongoDB Atlas).</li>
    <li><strong>Telegram Bot Token</strong>: Create a Telegram bot using <a href="https://core.telegram.org/bots#botfather">BotFather</a> and get the bot token.</li>
    <li><strong>Telegram Chat ID</strong>: Use the bot to get your chat ID, you can find your chat ID by using the <code>/getChatID</code> command in your bot.</li>
</ul>

<h2 id="running-the-project">Running the Project</h2>

<h3>Option 1: Running Locally</h3>

<h4>Start MongoDB</h4>
<p>If you have MongoDB running locally, you can start the MongoDB service:</p>

<pre><code>
mongod
</code></pre>

<h4>Start the Node.js App</h4>
<p>Run the following command to start the server:</p>

<pre><code>
npm start
</code></pre>

<h4>Access the Application</h4>
<p>The app will run on <a href="http://localhost:5000">http://localhost:5000</a>.</p>

<h3>Option 2: Running with Docker</h3>

<h4>Build and Start Containers</h4>
<p>Docker will handle running both the Node.js application and MongoDB. Use Docker Compose to build and start the containers:</p>

<pre><code>
docker-compose up --build
</code></pre>

<h4>Access the Application</h4>
<p>The application will be available on <a href="http://localhost:5000">http://localhost:5000</a>, and MongoDB will be accessible on <code>localhost:27017</code>.</p>

<h2 id="environment-variables">Environment Variables</h2>

<p>This project relies on environment variables that are defined in the <code>.env</code> file:</p>

<ul>
    <li><strong>ALCHEMY_API_KEY</strong>: Your Alchemy Ethereum API key for RPC communication.</li>
    <li><strong>MONGODB_URI</strong>: MongoDB connection string (defaults to <code>mongodb://mongo:27017/eth-deposits</code> when using Docker).</li>
    <li><strong>BEACON_CONTRACT</strong>: Ethereum Beacon Deposit Contract address (set to <code>0x00000000219ab540356cBB839Cbe05303d7705Fa</code>).</li>
    <li><strong>ALCHEMY_SIGNING_KEY</strong>: Signing key to verify webhook signatures from Alchemy.</li>
    <li><strong>TELEGRAM_BOT_TOKEN</strong>: Token for the Telegram bot that will send deposit notifications.</li>
    <li><strong>TELEGRAM_CHAT_ID</strong>: Your chat ID for receiving Telegram notifications.</li>
</ul>

<h3>How to Get the Variables:</h3>
<ul>
    <li><strong>Alchemy API Key</strong>: Create an account at <a href="https://www.alchemy.com/">Alchemy</a>, create a new Ethereum app, and retrieve the API key from your dashboard.</li>
    <li><strong>Telegram Bot Token</strong>: Use <a href="https://core.telegram.org/bots#botfather">BotFather</a> to create a bot and get the token.</li>
    <li><strong>Telegram Chat ID</strong>: Use the bot to send a message to your Telegram account, and retrieve the Chat ID by visiting the <a href="https://core.telegram.org/bots/api#getchat">Telegram API</a>.</li>
</ul>

<h2 id="testing-the-project">Testing the Project</h2>

<p>You can simulate Ethereum transactions to the Beacon Deposit Contract and check the logs to verify if the transactions are being tracked correctly.</p>

<p>Use tools like:</p>
<ul>
    <li><a href="https://etherscan.io">Etherscan</a> to view deposit contract transactions.</li>
    <li>Simulate deposits using Alchemy’s Ethereum testnet tools.</li>
</ul>

<h2 id="logging-and-error-handling">Logging and Error Handling</h2>

<ul>
    <li><strong>Logging</strong>: The project uses <code>winston</code> for logging. Logs are stored both in the console and in <code>error.log</code>.</li>
    <li><strong>Error Handling</strong>: The project uses <code>try-catch</code> blocks to handle exceptions in API calls and RPC interactions. Errors are logged using <code>winston</code>.</li>
</ul>

<h2 id="bonus-dockerization">Bonus: Dockerization</h2>

<p>This project is fully containerized using Docker, which makes it easier for anyone to run the project without worrying about dependency conflicts.</p>

<h3>Docker Compose</h3>
<ul>
    <li><code>docker-compose.yml</code> handles the setup for both the MongoDB service and the Node.js app.</li>
</ul>
<p>To build and start the project using Docker:</p>

<pre><code>
docker-compose up --build
</code></pre>

<h3>Volumes</h3>
<p>MongoDB data is persisted in the <code>mongo-data</code> volume, which ensures that data is not lost when containers are stopped or restarted.</p>

<h2 id="api-endpoints">API Endpoints</h2>

<ul>
    <li><strong>Webhook for Deposit Notifications</strong>: <code>/api/webhook</code>
        <ul>
            <li>This endpoint is used by Alchemy to send deposit notifications. It verifies the signature and processes the deposit.</li>
        </ul>
    </li>
</ul>

<h2 id="contributing">Contributing</h2>

<p>If you wish to contribute to this project, feel free to fork the repository and submit a pull request. Make sure to document any new features or improvements.</p>
