import * as net from 'net';

function testNetworkConnectivity() {
    console.log('=== Network Connectivity Test ===');
    
    // Database connection details
    const host = process.env.POSTGRES_HOST || 'ballast.proxy.rlwy.net';
    const port = parseInt(process.env.POSTGRES_PORT || '24764', 10);

    console.log('Attempting to connect to: ' + host + ':' + port);

    // Create a socket connection
    const socket = new net.Socket();

    socket.setTimeout(5000);

    socket.connect(port, host, () => {
        console.log('Network connection successful');
        socket.destroy();
    });

    socket.on('error', (error) => {
        console.error('Network connection failed:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.error('Connection timed out');
        socket.destroy();
    });
}

// Run the network test
testNetworkConnectivity();
