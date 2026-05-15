import { useState } from "react";
import { Menu, Search } from "semantic-ui-react";
import type { SearchProps, SearchResultData } from "semantic-ui-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import algolia from "./utils/algolia";
import type { User, AlgoliaPostHit, SearchResult } from "./types";

interface HeaderProps {
  user: User | null | undefined;
}

function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  function onSearchChange(_e: React.SyntheticEvent, { value }: SearchProps) {
    const val = value ?? "";
    setInputValue(val);
    algolia.search<AlgoliaPostHit>(val).then((result) => {
      const searchResult: SearchResult[] = result.hits.map((hit) => ({
        title: hit.title,
        description: hit.content,
        id: hit.objectID,
      }));
      setResults(searchResult);
    });
  }

  function onResultSelect(_e: React.SyntheticEvent, { result }: SearchResultData) {
    navigate(`/posts/${(result as SearchResult).id}`);
    setInputValue("");
    setResults([]);
  }

  function userSignOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("successful");
        // onAuthStateChanged in App.tsx will update user state
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  const location = useLocation();

  return (
    <div className="fixed top-0 z-[100] w-full">
      <Menu className="secondary !bg-[#e9e9e9]">
        <Menu.Item as={Link} to="/posts">
          <span className="text-lg font-bold">logo</span>
        </Menu.Item>
        <Menu.Item>
          <Search
            value={inputValue}
            onSearchChange={onSearchChange}
            results={results}
            noResultsMessage="搜尋不到相關文章"
            onResultSelect={onResultSelect}
          />
        </Menu.Item>
        <Menu.Menu position="right" className="!bg-[#e9e9e9]">
          {user ? (
            <>
              <Menu.Item
                as={Link}
                to="/new-post"
                active={location.pathname === "/new-post"}
              >
                發表文章
              </Menu.Item>
              <Menu.Item
                as={Link}
                to="/my/posts"
                active={location.pathname === "/my/posts"}
              >
                會員
              </Menu.Item>
              <Menu.Item onClick={userSignOut}>登出</Menu.Item>
            </>
          ) : (
            <Menu.Item as={Link} to="/signIn">
              註冊/登入
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default Header;
