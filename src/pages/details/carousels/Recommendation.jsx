import { useEffect, useState } from "react";
import Carousel from "../../../components/carousel/Carousel";
import axios from "axios";

const Recommendation = ({ mediaType, id }) => {

    const [data, setData]=useState()
    const [loading, setLoading]=useState(false)

    const getData = async()=>{
    try{
        setLoading(true)
        const response = await axios.get(`/${mediaType}/${id}/recommendations`)
        setData(response)
    } catch (err){
        console.log(err)
    } finally{
        setLoading(false)
    }
    }
    useEffect(()=>{
        getData()
    },[])


    return (
        <Carousel
            title="Recommendations"
            data={data?.results}
            loading={loading}
            endpoint={mediaType}
        />
    );
};

export default Recommendation;