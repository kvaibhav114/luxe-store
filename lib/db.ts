import { connectDB } from "./mongoose"

// Ensure a single mongoose connection for all API routes that import this file
// Importing this module will initialize the connection once per server runtime.
void connectDB()
