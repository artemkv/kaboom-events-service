const dotenv = require('dotenv');
dotenv.config();

const kafkaConnector = process.env.NODE_ENV === 'test' ? require('./kafkaconnectormock') : require('./kafkaconnector');
const getKafkaConnector = function getKafkaConnector() {
    return kafkaConnector;
}

exports.getKafkaConnector = getKafkaConnector;