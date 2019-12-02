function isStringInArray(str, arr){
    
    if (! Array.isArray(arr)){
        throw new Error('arr must be array type in isStringInArray');
    }

    if (arr.indexOf(str) > -1){
        return true;
    }else{
        return false;
    }
} 

module.exports = {
    isStringInArray: isStringInArray,
}