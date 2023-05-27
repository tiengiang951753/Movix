import { useEffect, useState } from 'react';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import SwitchTabs from '../../../components/switchTabs/SwitchTabs';
import Carousel from '../../../components/carousel/carousel';
import axios from 'axios';

const Trending = () => {
    const [endpoint, setEndpoint] = useState("day")
    // const { data, loading } = useFetch(`/trending/all/${endpoint}`)
    const [data, setData]=useState()
    const [loading,setLoading]=useState(false)
    const getData =async()=>{
        try{
            setLoading(true)
            const response = await axios.get(`/trending/all/${endpoint}`)
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
        setEndpoint(tab === "Day" ? "day" : "week")
    }
    return (
        <div className='carouselSection'>
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs
                    data={["Day", "Week"]}
                    onTabChange={onTabChange}
                />
            </ContentWrapper>
            <Carousel data={data?.results} loading={loading} />
        </div>
    )
}

export default Trending