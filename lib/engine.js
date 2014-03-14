module.exports = function (connector, dataResource) {
   connector.emit('start', dataResource);
};
