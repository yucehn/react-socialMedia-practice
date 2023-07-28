import { initializeApp } from "firebase/app";

// install firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const useFirebase = () => {
	initializeApp(firebaseConfig);
};

export default useFirebase;