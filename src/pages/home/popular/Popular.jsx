import { useEffect, useState } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import Carousel from '../../../components/carousel/carousel';
import axios from 'axios';

const Popular = () => {
    const [endpoint, setEndpoint] = useState("movie")
    // const { data, loading } = useFetch(`/${endpoint}/popular`)
    const [data, setData]=useState()
    const [loading, setLoading]=useState(false)

    const getData = async()=>{
        try{
            setLoading(true)
            const response = await axios.get(`/${endpoint}/popular`)
            setData(response)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        getData()
    },[])

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv")
    }
    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className="carouselTitle">What's Popular</span>
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

export default Popular