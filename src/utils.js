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

export const convertToApi = (data) => {
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

export const convertFromApi = (data) => {
  let jsData = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.includes('_')) {
      const keyArr = key.split('_');
      let newJsKey = keyArr[0];
      for(let i = 1; i < keyArr.length; i++) {
        newJsKey = newJsKey + keyArr[i][0].toUpperCase() + keyArr[i].slice(1);
      }
      jsData = {...jsData, [newJsKey]: value};
    } else {
    jsData = {...jsData, [key]: value};
    }
  }

  return jsData;
};  