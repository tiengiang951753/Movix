
import { useEffect, useState } from "react";
import Carousel from "../../../components/carousel/Carousel";
import axios from "axios";

const Similar = ({ mediaType, id }) => {
    const [data, setData]=useState()
    const [loading, setLoading]=useState(false)

    const getData = async()=>{
    try{
        setLoading(true)
        const response = await axios.get(`/${mediaType}/${id}/similar`)
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


    const title = mediaType === "tv" ? "Similar TV Shows" : "Similar Movies";

    return (
        <Carousel
            title={title}
            data={data?.results}
            loading={loading}
            endpoint={mediaType}
        />
    );
};

export default Similar;