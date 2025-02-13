import React, { useEffect, useRef, useState } from "react";
import * as styles from "./cssFolderOfSharedComponent/searchComponent.module.css";
import { BsSearch } from "react-icons/bs";
import * as API from "../../api/index";
import { useHistory } from "react-router";

export default function SearchComponent({ isPc = false }) {
  const displaySearchPoolRef = useRef(null);
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const [showSearchChoicesForUser, setShowSearchChoicesForUser] =
    useState(false);
  const [searchPool, setSearchPool] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  /////////////////function

  useEffect(() => {
    if (searchPool.length > 0) {
      let searchResult = [];
      searchPool.map(function (value, index) {
        var stringToCompare = value?.title
          ?.trim()
          .split(" ")
          .join("")
          .split("(")[0]
          .split("-")[0]
          .toLowerCase();
        const stringNeedComparing = searchInput
          ?.trim()
          .split(" ")
          .join("")
          .toLowerCase();
        if (stringToCompare?.includes(stringNeedComparing)) {
          searchResult.push(value);
        }
      });
      searchPool.map(function (value) {
        var stringToCompare = value?.title
          ?.trim()
          .split(" ")
          .join("")
          .split("(")[0]
          .split("-")[0]
          .toLowerCase();
        const stringNeedComparing = searchInput
          ?.trim()
          .split(" ")
          .join("")
          .toLowerCase();
        let count = 0;
        if (!stringToCompare?.includes(stringNeedComparing)) {
          for (var i = 0; i < stringNeedComparing.length; i++) {
            if (stringToCompare?.includes(stringNeedComparing[i])) {
              count++;
              stringToCompare = stringToCompare.replace(
                stringNeedComparing[i],
                ""
              );
            }
          }
          if (count === stringNeedComparing.length) {
            searchResult.push(value);
          }
        }
      });
      setSearchResult(searchResult);
    }
  }, [searchInput]);
  useEffect(() => {
    const _fetchAllItemsName = async () => {
      try {
        // const { data } = await API.getPcSearchItemPool();
        const { data } = isPc
          ? await API.getPcSearchItemPool()
          : await API.getSearchResultsPool();
        setSearchPool(data.searchResultsPool);
        setSearchResult(data.searchResultsPool);
      } catch (error) {
        console.log(error);
      }
    };
    _fetchAllItemsName();
  }, []);

  /////////handling click outside search area
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        displaySearchPoolRef.current &&
        !displaySearchPoolRef.current.contains(event.target)
      ) {
        setShowSearchChoicesForUser(false);
      } else {
        setShowSearchChoicesForUser(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displaySearchPoolRef]);
  /////////handling click outside search area

  return (
    <div className={styles.container}>
      <div className={styles.mainLogoArea}>
        <img src="/images/insta-icon.svg" alt="" />
        <span>COMPU</span>
        <span>TADORA</span>
      </div>
      <div className={styles.searchArea} ref={displaySearchPoolRef}>
        <span className={styles.search_icon}>
          <BsSearch size={30} color="#7e8080" />
        </span>
        <input
          type="text"
          className={styles.inputArea}
          placeholder={`${isPc ? "Tìm kiếm Pc" : "Tìm kiếm Laptop"}`}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        {showSearchChoicesForUser ? (
          <>
            <div
              className={`${styles.selectionSearch} ${
                searchResult.length > 5
                  ? styles.makeSearchResPoolScrollable
                  : null
              }`}
            >
              {searchResult.map((item, index) => {
                var searchInputAlt;
                if (searchInput) searchInputAlt = searchInput;
                var i = 0;
                return (
                  <div
                    className={styles.selectionItem}
                    key={index}
                    onClick={() => {
                      history.push(`/item?genre=${item.genre}&id=${item._id}`);
                      setSearchInput("");
                      setShowSearchChoicesForUser(false);
                    }}
                  >
                    <div className={styles.search_imgAndTitleArea}>
                      <div className={styles.searchImgArea}>
                        <img src={item.imgs[0]} alt="" />
                      </div>
                      <div className={styles.titleContainer}>
                        <div className={styles.searchTitleArea}>
                          {item.title
                            .split("(")[0]
                            .split("-")[0]
                            .split("")
                            .map((char) => {
                              if (
                                searchInputAlt?.toUpperCase()?.includes(char)
                              ) {
                                searchInputAlt = searchInputAlt.replace(
                                  char,
                                  ""
                                );
                                return <span>{char}</span>;
                              } else if (searchInputAlt?.includes(char)) {
                                searchInputAlt = searchInputAlt.replace(
                                  char,
                                  ""
                                );
                                return <span>{char}</span>;
                              } else return <>{char}</>;
                            })}
                        </div>
                      </div>
                    </div>
                    <div className={styles.searchPriceArea}>
                      {item.price.split("₫").join("").split("đ").join("")}₫
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
