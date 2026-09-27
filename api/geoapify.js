export default async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  }

  const apiKey=process.env.GEOAPIFY_API_KEY;
  if(!apiKey)return res.status(503).json({error:'GEOAPIFY_API_KEY_NOT_CONFIGURED'});

  const SAN_JAVIER={lat:-35.5952,lon:-71.72924};
  const isSanJavier=result=>{
    const text=[result?.city,result?.municipality,result?.county,result?.state,result?.formatted,result?.address_line2]
      .filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return text.includes('san javier');
  };

  try{
    const {input,placeId,lat,lon}=req.body||{};

    if(lat!=null&&lon!=null){
      const url=new URL('https://api.geoapify.com/v1/geocode/reverse');
      url.searchParams.set('lat',String(lat));
      url.searchParams.set('lon',String(lon));
      url.searchParams.set('lang','es');
      url.searchParams.set('format','json');
      url.searchParams.set('apiKey',apiKey);
      const response=await fetch(url);
      const data=await response.json();
      if(!response.ok)return res.status(response.status).json({error:'REVERSE_GEOCODING_FAILED'});
      const result=data.results?.[0];
      if(!result)return res.status(404).json({error:'ADDRESS_NOT_FOUND'});
      return res.status(200).json({
        formatted:result.formatted,
        addressLine1:result.address_line1,
        addressLine2:result.address_line2,
        lat:result.lat,
        lon:result.lon,
        city:result.city,
        postcode:result.postcode
      });
    }

    if(placeId){
      const url=new URL('https://api.geoapify.com/v1/geocode/search');
      url.searchParams.set('text',String(placeId));
      url.searchParams.set('filter','circle:'+SAN_JAVIER.lon+','+SAN_JAVIER.lat+',12000');
      url.searchParams.set('bias','proximity:'+SAN_JAVIER.lon+','+SAN_JAVIER.lat);
      url.searchParams.set('lang','es');
      url.searchParams.set('limit','1');
      url.searchParams.set('format','json');
      url.searchParams.set('apiKey',apiKey);
      const response=await fetch(url);
      const data=await response.json();
      if(!response.ok)return res.status(response.status).json({error:'PLACE_DETAILS_FAILED'});
      const result=(data.results||[]).find(isSanJavier)||data.results?.[0];
      if(!result)return res.status(404).json({error:'ADDRESS_NOT_FOUND'});
      return res.status(200).json({
        formatted:result.formatted,
        addressLine1:result.address_line1,
        addressLine2:result.address_line2,
        lat:result.lat,
        lon:result.lon,
        city:result.city,
        postcode:result.postcode
      });
    }

    const value=String(input||'').trim();
    if(value.length<2)return res.status(200).json({suggestions:[]});

    const url=new URL('https://api.geoapify.com/v1/geocode/autocomplete');
    url.searchParams.set('text',value+', San Javier, Maule, Chile');
    url.searchParams.set('filter','circle:'+SAN_JAVIER.lon+','+SAN_JAVIER.lat+',12000');
    url.searchParams.set('bias','proximity:'+SAN_JAVIER.lon+','+SAN_JAVIER.lat);
    url.searchParams.set('lang','es');
    url.searchParams.set('limit','8');
    url.searchParams.set('format','json');
    url.searchParams.set('apiKey',apiKey);

    const response=await fetch(url);
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:'AUTOCOMPLETE_FAILED'});

    const suggestions=(data.results||[])
      .filter(isSanJavier)
      .map(r=>({
        placeId:r.formatted,
        formatted:r.formatted,
        addressLine1:r.address_line1||r.formatted,
        addressLine2:r.address_line2||'San Javier',
        lat:r.lat,
        lon:r.lon,
        housenumber:r.housenumber||'',
        street:r.street||'',
        resultType:r.result_type||'',
        confidence:r.rank?.confidence??null,
        matchType:r.rank?.match_type||''
      }))
      .filter((r,index,array)=>array.findIndex(x=>x.formatted===r.formatted)===index)
      .slice(0,6);

    return res.status(200).json({suggestions});
  }catch(error){
    return res.status(500).json({error:'GEOAPIFY_PROXY_FAILED'});
  }
}
