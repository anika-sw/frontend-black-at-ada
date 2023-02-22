// export const capitalizeWord = ([firstLetter, ...rest]) =>
//   [firstLetter.toUpperCase(), ...rest].join("");

export const setItemInLocalStorage = (keyName, value) => {
  window.localStorage.setItem(keyName, JSON.stringify(value));
};

export const getItemFromLocalStorage = (keyName) => {
  try {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value)
    }
    return null;
  } catch (err) {
    console.log(err);
  }
};

// var s1 = "ThisЭтотΨόυτÜimunəՕրինակPříkladדוגמאΠαράδειγμαÉlda";
// s2 = s1.toLowerCase();
// result="";
// for(i=0; i<s1.length; i++)
// {
//  if(s1[i]!==s2[i]) result = result +' ' +s1[i];
//  else result = result + s2[i];
// }
// result.split(' ');

export const convertToApiData = (data) => {
  let apiData = {};
  for (const [key, value] of Object.entries(data)) {
    const keyLower = key.toLowerCase();
    if (keyLower !== key) {
      let newApiKey = keyLower[0];
      for(let i = 1; i < keyLower.length; i++) {
        if ((keyLower[i] !== key[i])) {
          newApiKey = newApiKey + '_' + keyLower[i];
        } else {
          newApiKey = newApiKey + keyLower[i];
        }
      }
      apiData = {...apiData, [newApiKey]: value};
    } else {
      apiData = {...apiData, [key]: value};
    }
  }

  return apiData;
};  
