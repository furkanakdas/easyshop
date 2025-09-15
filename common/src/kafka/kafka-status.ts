



// export class KafkaStatus {

//     _isProducerConnected = false
//     _isConsumerConnected = false

//     onConnected?: () => Promise<void>;
//     onDisconnected?: () => Promise<void>;


//     get isProducerConnected() {
//         return this._isProducerConnected;
//     }

//     set isProducerConnected(isProducerConnected: boolean) {
//         const prevStatus = this.isKafkaFullyConnected();
//         this._isProducerConnected = isProducerConnected;

//         if (this.isKafkaFullyConnected()) {
//             if(!prevStatus)
//                 this.onConnected?.();
//         } else {
//             if(prevStatus)
//                 this.onDisconnected?.();
//         }
//     }


//     get isConsumerConnected() {
//         return this._isConsumerConnected;
//     }

//     set isConsumerConnected(isConsumerConnected: boolean) {
        
//         const prevStatus = this.isKafkaFullyConnected();
//         this._isConsumerConnected = isConsumerConnected;

//         if (this.isKafkaFullyConnected()) {
//             if(!prevStatus)
//                 this.onConnected?.();
//         } else {
//             if(prevStatus)
//                 this.onDisconnected?.();
//         }
//     }



//     constructor(listeners?:{onConnected?: () => Promise<void>, onDisconnected?: () => Promise<void>}) {
//         this.onConnected = listeners?.onConnected;
//         this.onDisconnected = listeners?.onDisconnected;
//     }





//     isKafkaFullyConnected() {
//         return this.isProducerConnected && this.isConsumerConnected
//     }
// }







