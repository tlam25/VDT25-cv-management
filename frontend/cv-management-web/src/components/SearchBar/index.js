import './SearchBar.css';

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, placeholder = "Tìm theo tên nhân viên..." }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
    <div className="search-bar-container">
        <FaSearch className="search-bar-icon"/>
        <input
            className="search-bar-input"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete="off"
        />
    </div>
    );
};

export default SearchBar;