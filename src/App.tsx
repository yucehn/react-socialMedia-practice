import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Grid, Container, Image } from "semantic-ui-react";
import useFirebase from "./utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Header from "./Header";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import MyPost from "./pages/MyPost";
import MyCollections from "./pages/MyCollections";
import MySettings from "./pages/MySettings";

import Topics from "./components/Topics";
import MyMenu from "./components/MyMenu";

import background from "./assets/image/homeBg.jpg";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);
  useFirebase();

  return (
    <div className="bg-[#fbfcfe]">
      <div className="fixed bottom-0">
        <Image src={background}></Image>
      </div>
      <BrowserRouter>
        <Header user={user} />
        <Container className="pt-[74px]">
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <Routes>
                  <Route path="/posts/*" element={<Topics />} />
                  <Route path="/my/*" element={<MyMenu />} />
                  <Route path="/" element={<Topics />} />
                </Routes>
              </Grid.Column>
              <Grid.Column width={10}>
                <Routes>
                  <Route path="/posts" element={<Home />} />
                  <Route path="/posts/:postId" element={<Post />} />
                  <Route
                    path="/my"
                    element={
                      user === undefined ? null : user ? (
                        <Outlet />
                      ) : (
                        <Navigate to="/signIn" replace={true} />
                      )
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/my/posts" replace />}
                    />
                    <Route path="/my/posts" element={<MyPost user={user} />} />
                    <Route
                      path="/my/collections"
                      element={<MyCollections user={user} />}
                    />
                    <Route
                      path="/my/settings"
                      element={<MySettings user={user} />}
                    />
                  </Route>
                  <Route
                    path="/signIn"
                    element={
                      user === undefined ? null : user ? (
                        <Navigate to="/" replace={true} />
                      ) : (
                        <SignIn />
                      )
                    }
                  />
                  <Route
                    path="/new-post"
                    element={
                      user === undefined ? null : user ? (
                        <NewPost />
                      ) : (
                        <Navigate to="/signIn" replace={true} />
                      )
                    }
                  />
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Grid.Column>
              <Grid.Column width={3}></Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
