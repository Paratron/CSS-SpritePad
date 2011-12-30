/**
 * Looks if a value can be found inside the array.
 * Returns the index of the item where the value was found.
 * @param value
 * @return integer|false
 */
Array.prototype.in_array = function(value){
    var len = this.length,
        i;
    for(i = 0;i < len;i+=1){
        if(this[i] === value) return i;
    }
    return false;
}

/**
 * Removes all entries with a specific value.
 * @param value
 */
Array.prototype.remove_value = function(value){
    var len = this.length,
        i;
    for(i = 0;i < len;i+=1){
        if(this[i] === value){
            this.splice(i,1);
            i-=1;
        }
    }
}