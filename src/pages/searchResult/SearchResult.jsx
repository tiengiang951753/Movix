import "./style.scss";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { useState, useEffect } from "react";
// import noResults from "../../assets/no-results.png";
import MovieCard from "../../components/movieCard/MovieCard";
import axios from "axios";
import Spinner from "../../components/spinner/Spinner";
const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/search/multi?query=${query}&page=${pageNum}`
      );
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
        `/search/multi?query=${query}&page=${pageNum}`
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
    setPageNum(1)
    getData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  data?.total_results > 1 ? "result" : "results"
                } of "${query}"`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={getDataNextPage}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return <MovieCard key={index} data={item} fromSearch={true}/>;
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultsNotFound">Sorry, Results not found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
