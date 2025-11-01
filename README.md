# Luxe - Modern AI-Powered E-commerce Application

## 🌟 Overview

**Luxe** is a full-featured, high-performance e-commerce platform built with **Next.js** and deployed entirely on **Azure cloud services**. It showcases a robust, scalable architecture with a focus on a seamless user experience, including cutting-edge **AI integration** for personalized product recommendations.

<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/a0e9cfc3-8e59-4d5e-88ce-3871bbe76578" />

This project demonstrates proficiency in building and deploying a complex, full-stack application leveraging serverless technologies, NoSQL databases, and modern front-end frameworks.

## ✨ Key Features

* **Core E-commerce Functionality:** Implements all essential features of a retail application, including:
    * User Authentication (Sign-up/Login)
    * Product Catalog and Detail Pages
    * **Shopping Cart** and **Checkout** Flow
    * **Wishlist** Management
    <img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/d7c1e83d-2e33-4138-8b03-320b1b60c07b" />

* **AI Recommendation Chatbot:** A first-of-its-kind feature using a **GPT-4o-mini** model (via Azure AI Foundry) to act as a personal shopper. Users can describe their needs in natural language, and the chatbot provides intelligent, context-aware product recommendations.
<img width="388" height="629" alt="image" src="https://github.com/user-attachments/assets/bf05b4fb-b7a3-4e97-8300-d2d34a114045" />

* **Performance:** Utilizes Next.js's powerful rendering capabilities (SSR/SSG/ISR) for fast page loads and a smooth, modern shopping experience.
* **Scalability:** Built on a serverless and managed Azure infrastructure, allowing the application to scale seamlessly with traffic demands.

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** | React Framework for performance (Hybrid Rendering, API Routes) |
| **Database** | **Azure CosmosDB** | Globally-distributed NoSQL database for product, user, and order data |
| **AI/ML** | **Azure AI Foundry** | Hosting and managing the integrated **GPT-4o-mini** model |
| **Hosting** | **Azure Static Web Apps** | High-performance, global hosting for the Next.js application |
| **Language** | **TypeScript** | Primary language for the entire stack |

## ⚙️ Architecture

The Luxe application follows a modern cloud-native architecture:

1.  **Client (Next.js):** Served globally via **Azure Static Web Apps** for fast content delivery.
2.  **Data (CosmosDB):** Used as the primary, highly available database for persistence and real-time data access.
3.  **Backend Services:** Next.js **API Routes** handle business logic, interfacing with CosmosDB.
4.  **AI Integration:** The recommendation engine is powered by a large language model hosted and managed through **Azure AI Foundry**, providing an API endpoint for the chatbot feature.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* Node.js (v18+)
* npm or yarn
* A GitHub Account
* An Azure Subscription (for full deployment)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/kvaibhav114/luxe-store.git](https://github.com/kvaibhav114/luxe-store.git)
    cd luxe-store
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env.local` in the root directory and add your credentials. (A sample `.env.example` file is recommended to show required keys, e.g., `COSMOSDB_ENDPOINT`, `COSMOSDB_KEY`, `AI_FOUNDRY_CHAT_API_KEY`).

    ```
    # .env.local example
    COSMOSDB_ENDPOINT="[Your CosmosDB Endpoint]"
    COSMOSDB_KEY="[Your CosmosDB Primary Key]"
    AI_FOUNDRY_CHAT_API_KEY="[Your Azure AI Foundry Key]"
    # ... other NextAuth or app-specific variables
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will be accessible at `http://localhost:3000`.

## ☁️ Azure Deployment

This project is configured for continuous deployment using GitHub Actions integrated with **Azure Static Web Apps**.

1.  **Provision Azure Resources:** Create instances for **CosmosDB** and an **Azure Static Web App** resource through the Azure Portal.
2.  **Configure AI Foundry:** Deploy or link a **GPT-4o-mini** model via Azure AI Foundry and retrieve the necessary API key.
3.  **Set GitHub Secrets:** Store your Azure credentials and environment variables (e.g., `COSMOSDB_KEY`, `AI_FOUNDRY_CHAT_API_KEY`) as **GitHub Repository Secrets** for the GitHub Actions workflow to use during deployment.
4.  **Push to main:** Merging or pushing code to the `main` branch will automatically trigger the CI/CD pipeline to build and deploy the application to Azure Static Web Apps.

## 🤝 Contribution
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---
