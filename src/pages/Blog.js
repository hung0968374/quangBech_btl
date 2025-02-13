import React, { useEffect, useState } from "react";
import "./cssFolder/blog.css";
import * as API from "../api/index";
import Header from "../components/sharedComponents/Header";
import Footer from "../components/sharedComponents/footer";
import BlogSearchComponent from "../components/blog/BlogSearchComponent";
import { Link } from "react-router-dom";
import ScrollToTop from "../components/sharedComponents/ScrollToTop";
import MessengerChat from "../components/sharedComponents/MessengerChat";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [randomBlog, setRandomBlog] = useState();
  const [currentBlogPage, setCurrentBlogPage] = useState(1);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [notDisplayWatchingMoreBttn, setNotDisplayWatchingMoreBttn] =
    useState(false);
  ////////////handling timeStamp
  const now = new Date().getTime();
  const ramdomBlogPublishedTime = new Date(randomBlog?.createdAt).getTime();
  var randomBlogDelta = Math.abs(now - ramdomBlogPublishedTime) / 1000;
  const randomBlogDay = Math.floor(randomBlogDelta / 86400);
  randomBlogDelta -= randomBlogDay * 86400;
  useEffect(() => {
    const _fetchBlogs = async () => {
      setIsLoadingBlog(true);
      const response = await API.fetchBlogsByPagination(currentBlogPage);
      if (response.data.blogs.length === 0) {
        setNotDisplayWatchingMoreBttn(true);
      }
      setBlogs([...blogs, ...response.data.blogs]);
      setIsLoadingBlog(false);
    };
    _fetchBlogs();
  }, [currentBlogPage]);
  useEffect(() => {
    const _fetchRandomBlog = async () => {
      const response = await API.fetchRandomBlog();
      setRandomBlog(response.data.blog);
    };
    _fetchRandomBlog();

    ////// auto scroll screen
    window.scroll({ top: 0, left: 0, behavior: "auto" });

    ///////// setting page title
    document.title = "Blog";
  }, []);
  return (
    <>
      <ScrollToTop />
      <Header />
      <BlogSearchComponent />
      <div className="blog_container">
        <Link to={`/blog/${randomBlog?._id}`}>
          <img src={randomBlog?.blogMainImg} alt="" />
          <div className="article_content">
            <div className="article_timeStamp">
              {randomBlogDay && randomBlogDay > 0 ? randomBlogDay : "1"} ngày
              trước
            </div>
            <div className="article_title">{randomBlog?.blogTitle}</div>
            <div className="article_smallPartOfContent">
              {randomBlog?.blogBody[0]}
            </div>
          </div>
        </Link>
      </div>
      <div className="blog_blogItemContainer">
        {blogs.map((blog, index) => {
          const blogPublishingTime = new Date(blog?.createdAt).getTime();
          var randomBlogDelta = Math.abs(now - blogPublishingTime) / 1000;
          const blogInterval = Math.floor(randomBlogDelta / 86400);
          return (
            <Link
              to={`/blog/${blog._id}`}
              className="blog_blogItemWrapper"
              key={index}
            >
              <img src={blog.blogMainImg} alt="" />
              <div className="blog_blogItemContentWrapper">
                <div className="blog_blogItemTimeStamp">
                  {blogInterval > 0 ? blogInterval : "1"} ngày trước
                </div>
                <div className="blog_blogItemTitle">{blog.blogTitle}</div>
                <div className="blog_blogItemPartOfContent">
                  {blog.blogBody[0]}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {!notDisplayWatchingMoreBttn && (
        <div
          className="blog_watchMore"
          onClick={() => {
            setCurrentBlogPage((prev) => prev + 1);
          }}
        >
          {isLoadingBlog ? (
            <>
              <img src="images/loading.gif" />
            </>
          ) : (
            <>Xem thêm</>
          )}
        </div>
      )}
      <Footer />
      <MessengerChat />
    </>
  );
}

export default Blog;
