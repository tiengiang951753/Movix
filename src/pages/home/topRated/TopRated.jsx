import { useEffect, useState } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import Carousel from '../../../components/carousel/carousel';
import axios from 'axios';

const TopRated = () => {
    const [endpoint, setEndpoint] = useState("movie")
    // const { data, loading } = useFetch(`/${endpoint}/top_rated`)
    const [data, setData]=useState()
    const [loading,setLoading]=useState(false)
    const getData =async()=>{
        try{
            setLoading(true)
            const response = await axios.get(`/${endpoint}/top_rated`)
            setData(response)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[endpoint])
    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv")
    }
    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className="carouselTitle">Top Rated</span>
                <SwitchTabs
                    data={["Movies", "TV Shows"]}
                    onTabChange={onTabChange}
                />
            </ContentWrapper>
            <Carousel
                data={data?.results}
                loading={loading}
                endpoint={endpoint}
            />
        </div>
    )
}

export default TopRated