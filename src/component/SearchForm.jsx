import React, { useState } from "react";
import { Input, Space } from "antd";
const { Search } = Input;

const SearchForm = (props) => {
  const [keyword, setKeyWord] = useState("");

  const handleOnChange = (keyword) => {
    setKeyWord(keyword);
  };

  const handleSearch = () => {
    console.log("Test");
  };
  return (
    <>
      <Search
        placeholder={`Tìm kiếm theo ${props.title} `}
        enterButton
        allowClear
        value={keyword}
        onChange={(e) => handleOnChange(e.target.value)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default SearchForm;
