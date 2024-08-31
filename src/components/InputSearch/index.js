import React from "react";
import { FaSearch } from "react-icons/fa";

export default function InputSearch({
    searchVal,
    handleSearch
}) {
  return (
    <div className="flex items-center justify-between bg-[#FFFFFF14] w-[95%] rounded-[8px] py-2.5 px-4 mt-8">
      <input
        id="search_input"
        type="text"
        name="search"
        onChange={handleSearch}
        value={searchVal}
        placeholder="Search Song/Artist ..."
        className="bg-transparent outline-none text-[18px] text-white/90"
      />
      <FaSearch color="#FFFFFF50" />
    </div>
  );
}
