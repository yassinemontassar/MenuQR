// RandomStringGenerator.ts

const getRandom = (length: number): string => {
    const crypto = window.crypto 
    if (!crypto) {
      console.error('Crypto API not supported');
      return '';
    }
    
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomArray[i].toString(36).padStart(10, "0");
    }
    
    return result;
  };
  
  export default getRandom;
  