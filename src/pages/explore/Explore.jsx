import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import axios from "axios";

let filters = {};

const sortbyData = [
  {
    value: "popularity.desc",
    label: "Popularity Descending",
  },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  {
    value: "primary_release_date.desc",
    label: "Release Date Descending",
  },
  { value: "primary_release_date.asc", label: "Release Date Ascending" },
  { value: "original_title.asc", label: "Title (A-Z)" },
];

const Explore = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(null);
  const [genres, setGenres] = useState();
  const [genresLoading, setGenresLoading] = useState(false);
  const [sortby, setSortby] = useState(null);
  const { mediaType } = useParams();

  const getGenres = async () => {
    try {
      setGenresLoading(true);
      const response = await axios.get(`/genre/${mediaType}/list`);
      setGenres(response);
    } catch (err) {
      console.log(err);
    } finally {
      setGenresLoading(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/discover/${mediaType}`, { params: filters });
      console.log(response);
      setData(response);
      setPageNum((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDataNextPage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/discover/${mediaType}?page=${pageNum}`,
        { params: filters }
      );
      setPageNum((prev) => prev + 1);
      if (data?.results) {
        setData({
          ...data,
          // eslint-disable-next-line no-unsafe-optional-chaining
          results: [...data?.results, ...response.results],
        });
      } else {
        setData(response);
      }
      setPageNum((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filters = {};
    setData(null);
    setPageNum(1);
    setSortby(null);
    setGenre(null);
    getData();
    getGenres();
  }, [mediaType]);

  const onChange = (selectedItems, action) => {
    if (action.name === "sortby") {
      setSortby(selectedItems);
      if (action.action !== "clear") {
        filters.sort_by = selectedItems.value;
      } else {
        delete filters.sort_by;
      }
    }

    if (action.name === "genres") {
      setGenre(selectedItems);
      if (action.action !== "clear") {
        let genreId = selectedItems.map((g) => g.id);
        genreId = JSON.stringify(genreId).slice(1, -1);
        filters.with_genres = genreId;
      } else {
        delete filters.with_genres;
      }
    }

    setPageNum(1);
    getData();
  };

  return (
    <div className="explorePage">
      <ContentWrapper>
        <div className="pageHeader">
          <div className="pageTitle">
            {mediaType === "tv" ? "Explore TV Shows" : "Explore Movies"}
          </div>
          <div className="filters">
            <Select
              isMulti
              name="genres"
              value={genre}
              closeMenuOnSelect={false}
              options={!genresLoading && genres?.genres}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={onChange}
              placeholder="Select genres"
              className="react-select-container genresDD"
              classNamePrefix="react-select"
            />
            <Select
              name="sortby"
              value={sortby}
              options={sortbyData}
              onChange={onChange}
              isClearable={true}
              placeholder="Sort by"
              className="react-select-container sortbyDD"
              classNamePrefix="react-select"
            />
          </div>
        </div>
        {loading && <Spinner initial={true} />}
        {!loading && (
          <>
            {data?.results?.length > 0 ? (
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={getDataNextPage}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} mediaType={mediaType} />
                  );
                })}
              </InfiniteScroll>
            ) : (
              <span className="resultNotFound">Sorry, Results not found!</span>
            )}
          </>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Explore;
