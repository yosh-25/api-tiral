import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./elements/searchBar";

const SearchIconAndFunction = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    // 検索ワードをクエリパラメータに追加して次のページへ遷移
    if (searchTerm.trim()) {
    router.push(`/search/results/${searchTerm}`);
    console.log(searchTerm);
  }
  };

  return (
    <SearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onClick={handleSearch}
      label="動画を検索"
    />
  );
};

export default SearchIconAndFunction;
