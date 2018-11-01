export const postUrl = () => {
  // return 'https://strangerthingsintrocreator.firebaseio.com/openings.json';
  return 'https://strangerthingsic-a.firebaseio.com/openings.json';
};

export const getUrl = key => {
  let code = key;
  let id = key.charAt(0);
  if(id === "A"){
    code = key.substr(1);
    return "https://strangerthingsic-a.firebaseio.com/openings/-"+code + ".json";
  }
  else{
    return "https://strangerthingsintrocreator.firebaseio.com/openings/-"+code + ".json";
  }
};