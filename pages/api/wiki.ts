export default async function handler(req:any, res:any) {
    const response = await fetch('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=175&titles=Therion');
    const data = await response.json();
    res.status(200).json(data);
  }