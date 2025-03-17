import React, { useState, useEffect } from "react";
import { Input, Space } from "antd";
const { Search } = Input;

const SearchForm = (props) => {
  const [keyword, setKeyWord] = useState("");

  const handleOnChange = (e) => {
    const newKeyword = e.target.value;
    setKeyWord(newKeyword);
    props.setKeyword(newKeyword); // Cập nhật state ở component cha
  };

  const handleSearch = (value) => {
     props.onSearch(value); // Kích hoạt tìm kiếm
  };
  return (
    <>
      <Search
        placeholder={`Tìm kiếm theo ${props.title} `}
        enterButton
        allowClear
        value={keyword}
        onChange={(e) => handleOnChange(e)}
        onSearch={handleSearch} // Gọi handleSearch khi search
      />
    </>
  );
};

export default SearchForm;