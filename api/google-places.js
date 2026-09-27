export default async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  }

  const apiKey=process.env.GOOGLE_MAPS_API_KEY;
  if(!apiKey)return res.status(503).json({error:'GOOGLE_MAPS_API_KEY_NOT_CONFIGURED'});

  try{
    const {input,placeId}=req.body||{};

    if(placeId){
      const url='https://places.googleapis.com/v1/places/'+encodeURIComponent(placeId)+'?languageCode=es&regionCode=cl';
      const response=await fetch(url,{
        headers:{
          'X-Goog-Api-Key':apiKey,
          'X-Goog-FieldMask':'formattedAddress,location,addressComponents'
        }
      });
      const data=await response.json();
      if(!response.ok)return res.status(response.status).json({error:data?.error?.message||'PLACE_DETAILS_FAILED'});
      return res.status(200).json(data);
    }

    const value=String(input||'').trim();
    if(value.length<2)return res.status(200).json({suggestions:[]});

    const response=await fetch('https://places.googleapis.com/v1/places:autocomplete',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-Goog-Api-Key':apiKey,
        'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text'
      },
      body:JSON.stringify({
        input:value+', San Javier, Maule, Chile',
        includedRegionCodes:['cl'],
        languageCode:'es',
        regionCode:'cl',
        locationRestriction:{
          circle:{
            center:{latitude:-35.5952,longitude:-71.72924},
            radius:7000
          }
        }
      })
    });

    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:data?.error?.message||'AUTOCOMPLETE_FAILED'});

    const suggestions=(data.suggestions||[])
      .map(item=>item.placePrediction)
      .filter(Boolean)
      .map(p=>({
        placeId:p.placeId,
        text:p.text?.text||'',
        mainText:p.structuredFormat?.mainText?.text||p.text?.text||'',
        secondaryText:p.structuredFormat?.secondaryText?.text||''
      }))
      .filter(p=>{
        const text=(p.text+' '+p.secondaryText).toLowerCase();
        return text.includes('san javier');
      })
      .slice(0,6);

    return res.status(200).json({suggestions});
  }catch(error){
    return res.status(500).json({error:'GOOGLE_PLACES_PROXY_FAILED'});
  }
}
