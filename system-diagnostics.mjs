function runDiagnostics() {
    console.log('=== System Diagnostics ===');
    
    // Node.js and environment info
    console.log('Node.js Version: ' + process.version);
    console.log('Platform: ' + process.platform);
    console.log('Architecture: ' + process.arch);

    // Environment variables (safely)
    console.log('\nSelected Environment Variables:');
    var selectedVars = ['DATABASE_URL', 'POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DB'];
    selectedVars.forEach(function(varName) {
        var value = process.env[varName];
        console.log(varName + ': ' + (value ? value.replace(/:(.*?)@/, ':****@') : 'Not set'));
    });
}

runDiagnostics();
