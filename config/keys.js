dbPassword = 'mongodb://anjan:indian@anjan-shard-00-00-01ifl.azure.mongodb.net:27017,anjan-shard-00-01-01ifl.azure.mongodb.net:27017,anjan-shard-00-02-01ifl.azure.mongodb.net:27017/SPRING?ssl=true&replicaSet=ANJAN-shard-0&authSource=admin&retryWrites=true&w=majority';

module.exports = {
    mongoURI: dbPassword
};
