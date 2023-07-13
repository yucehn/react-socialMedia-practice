import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCAvWrTAjGFbd9wQdRxsya36TSjiGmaY48",
  authDomain: "test-firsttime-react.firebaseapp.com",
  projectId: "test-firsttime-react",
  storageBucket: "test-firsttime-react.appspot.com",
  messagingSenderId: "391368370997",
  appId: "1:391368370997:web:774665f3d4f8d87aaf3a7c"
};

const useFirebase = () => {
	initializeApp(firebaseConfig);
};

export default useFirebase;