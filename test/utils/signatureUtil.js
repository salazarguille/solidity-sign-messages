var ethUtil = require('ethereumjs-util');

/*
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 * 
 */
module.exports = {
    splitSignature: (signature) => {
      const signatureData = ethUtil.fromRpcSig(signature);
      const v = ethUtil.bufferToInt(signatureData.v);
      const r = ethUtil.bufferToHex(signatureData.r); 
      const s = ethUtil.bufferToHex(signatureData.s);
      const splitSignature = {
        signatureData,
        v,
        r,
        s
      };
      return splitSignature;
    },
    bufferToHex: (message) => {
      const messageToSign = ethUtil.bufferToHex(new Buffer(message))
      const hashBuffer = ethUtil.toBuffer(message);
      const messageHash = ethUtil.hashPersonalMessage(hashBuffer);
      const messageToSend = ethUtil.bufferToHex(messageHash);
      return {
        messageToSign,
        hashBuffer,
        messageHash,
        messageToSend
      };
    }
};