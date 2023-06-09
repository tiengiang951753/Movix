import "./style.scss";
import { useParams } from "react-router-dom";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import { useEffect, useState } from "react";
import axios from "axios";
import Recommendation from "./carousels/Recommendation";
import Similar from "./carousels/Similar";

const Details = () => {
  const { mediaType, id } = useParams();

  const [videos, setVideos] = useState();
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [credits, setCredits] = useState();
  const [loadingCredits, setLoadingCredits] = useState(false);

  const getCredits = async () => {
    try {
      setLoadingCredits(true);
      const response = await axios.get(`/${mediaType}/${id}/credits`);
      setCredits(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCredits(false);
    }
  };

  const getVideos = async () => {
    try {
      setLoadingVideos(true);
      const response = await axios.get(`/${mediaType}/${id}/videos`);
      setVideos(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    getVideos();
    getCredits();
  }, []);

  return (
    <div>
      <DetailsBanner video={videos?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={loadingCredits} />
      <VideosSection data={videos} loading={loadingVideos} />
      <Similar mediaType={mediaType} id={id}/>
      <Recommendation mediaType={mediaType} id={id}/>
    </div>
  );
};

export default Details;
