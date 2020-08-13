
//Udp configuration
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const MULTICAST_ADDR = "230.185.192.108";
const PORT = "41848";

export const netMixins = {
    data: function () {
        return {
            configuration: null
        };
    },
    mounted() {
        this.configuration = this.$settings.get("configuration");
    },
    methods: {
        setUdpService() {
            socket.on('message', (msg, rinfo) => {
                console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
                var message = JSON.parse(new TextDecoder("utf-8").decode(msg));
                this.processMessage(message.operation, rinfo, message.data)
            });

            socket.on('listening', () => {
                const address = socket.address();
                console.log(`server listening ${address.address}:${address.port}`);
            });

            socket.bind(PORT, function () {
                socket.setBroadcast(true);
                socket.setMulticastTTL(128);
                socket.addMembership(MULTICAST_ADDR);
            });
        },
        processMessage(operation, rinfo, data) {
            console.log(data);
            switch (operation) {
                case 'hello':
                   this.sendConfiguration(rinfo); 
                    break;
            
                default:
                    break;
            }
        },
        sendConfiguration(rinfo) {
            const transaction = {
                "operation": "configuration",
                "data": this.configuration
            };

            const message = new Buffer(JSON.stringify(transaction));
            socket.send(message, 0, message.length, rinfo.port, rinfo.address);
        }
    }
}