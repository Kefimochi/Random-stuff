// To run and compile, please enter "Node index.js" in the terminal
const fs = require("fs");

function encode(num) {
  if (-8192 > num || 8191 < num) return "Input outside 14-bit range.";
  // Adds '8192' and coverts to binary
  let binary = (num + 8192).toString(2);

  // Adds character '0' on the 8th place for the shift to happen.
  let convertedNum = parseInt(binary.splice(binary.length - 7, 0), 2).toString(
    16
  );
  // Make it '0000' for the prettier notation
  if (convertedNum === "0") convertedNum = "0000";
  return convertedNum;
}

function decode(byte1, byte2) {
  // Joins two bytes and converts to binary
  let joined = byte1 + byte2;
  let binary = hexToBin(joined);

  // Takes out '0' on the 8th position in a binary number
  let convertedNum =
    binary.substring(0, binary.length - 8) +
    binary.substring(binary.length - 7, binary.length);

  // Converts back to decimal and substracts 8192
  return parseInt(convertedNum, 2) - 8192;
}

function hexToBin(src) {
  let returnString = "";

  let mapping = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111"
  };
  for (let i = 0; i < src.length; i++) {
    returnString += mapping[src[i]];
  }

  // Kills any 0's at the start of the string since they will not
  // play any role in conversion. Makes it cleaner.
  // W/o it => "0000101000000101", w/ it => "101000000101".
  while (returnString.charAt(0) === "0") {
    returnString = returnString.substr(1);
  }
  return returnString;
}

// Adds a character 'zero' on a desired index
String.prototype.splice = function(idx, rem) {
  return this.slice(0, idx) + 0 + this.slice(idx + Math.abs(rem));
};

// Test cases for encoding
console.log("Encoding 0 (should be 4000):", encode(0));
console.log("Encoding -8192 (should be 0000):", encode(-8192));
console.log("Encoding 2048 (should be 5000):", encode(2048));
console.log("Encoding -4096 (should be 2000):", encode(-4096));

// Test cases for decoding
console.log("Decoding 40 00 (should be 0):", decode("40", "00"));
console.log("Decoding 0A 05 (should be -6907):", decode("0A", "05"));
console.log("Decoding 55 00 (should be 2688):", decode("55", "00"));
console.log("Decoding 7F 7F (should be 8191):", decode("7F", "7F"));

let data =
  "*******************************" +
  "\nEncoding 6111:\t" +
  encode(6111) +
  "\nEncoding 340:\t" +
  encode(340) +
  "\nEncoding -2628:\t" +
  encode(-2628) +
  "\nEncoding -255:\t" +
  encode(-255) +
  "\nEncoding 7550:\t" +
  encode(7550) +
  "\n*******************************" +
  "\nDecoding 0A 0A:\t" +
  decode("0A", "0A") +
  "\nDecoding 00 29:\t" +
  decode("00", "29") +
  "\nDecoding 3F 0F:\t" +
  decode("3F", "0F") +
  "\nDecoding 5E 7F:\t" +
  decode("5E", "7F") +
  "\n*******************************";

fs.writeFile("ConvertedData.txt", data, err => {
  if (err) throw err;
});
