# Generate secure random secrets

function Generate-Secret {
    # Generate a cryptographically secure random string
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# Generate and display secrets
Write-Output "API_SECRET_KEY=$(Generate-Secret)"
Write-Output "JWT_SECRET=$(Generate-Secret)"
Write-Output "CLAUDE_API_KEY=sk-ant-replace-with-your-anthropic-api-key"
