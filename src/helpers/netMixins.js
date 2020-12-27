
//Udp configuration
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const MULTICAST_ADDR = "230.185.192.108";
const PORT = "41848";
import {
    mixinsRequest
} from "./requestMixins";

export const netMixins = {
    mixins: [mixinsRequest],
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
                this.setSocket(socket);
                console.log(`server listening ${address.address}:${address.port}`);
            });

            socket.bind(PORT, function () {
                socket.setBroadcast(true);
                socket.setMulticastTTL(128);
                socket.addMembership(MULTICAST_ADDR);
            });

            setInterval(this.ping, 60000);
        },
        ping() {
            this.sendPing(socket);
        },
        processMessage(operation, rinfo, data) {
            console.log('prosessing ', operation);
            switch (operation) {
                case 'hello':
                    this.sendConfiguration(rinfo);
                    break;
                case 'search_song':
                    this.searchSongs(rinfo, data);
                    break;
                case 'add_song':
                    this.AddSongToQueue(rinfo, data);
                    break;
                case 'login_user':
                    this.loginUser(rinfo, data);
                    break;
                case 'login_admin':
                    this.loginAdmin(rinfo, data);
                    break;
                case 'pong':
                    this.pong(rinfo.address);
                    break;
                case 'add_credits':
                    this.addCredits(rinfo, data);
                    break;
                case 'get_credits':
                    this.getCredits(rinfo, data);
                    break;
                default:
                    break;
            }
        }
    }
}