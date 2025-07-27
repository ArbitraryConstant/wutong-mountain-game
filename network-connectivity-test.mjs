import * as net from 'net';

function testNetworkConnectivity() {
    console.log('=== Network Connectivity Test ===');
    
    // Database connection details from environment
    var host = process.env.POSTGRES_HOST || 'ballast.proxy.rlwy.net';
    var port = parseInt(process.env.POSTGRES_PORT || '24764', 10);

    console.log('Attempting to connect to: ' + host + ':' + port);

    // Create a socket connection
    var socket = new net.Socket();

    socket.setTimeout(5000);

    socket.connect(port, host, function() {
        console.log('Network connection successful');
        socket.destroy();
    });

    socket.on('error', function(error) {
        console.error('Network connection failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        socket.destroy();
    });

    socket.on('timeout', function() {
        console.error('Connection timed out');
        socket.destroy();
    });
}

// Call the network connectivity test
testNetworkConnectivity();
