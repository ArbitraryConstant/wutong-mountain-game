#!/bin/bash
# Generate secure random secrets

# Function to generate a secure random string
generate_secret() {
    openssl rand -base64 32
}

echo "API_SECRET_KEY="
echo "JWT_SECRET="
echo "CLAUDE_API_KEY=sk-ant-replace-with-your-anthropic-api-key"
